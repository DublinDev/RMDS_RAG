import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/community/vectorstores/mongodb_atlas";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Annotation, StateGraph } from "@langchain/langgraph";
import { Document } from "@langchain/core/documents";
import * as dotenv from "dotenv";

dotenv.config();

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: "Question is required." },
        { status: 400 }
      );
    }

    const MONGO_URI = process.env.MONGODB_ATLAS_URI!;
    const MONGO_DB_NAME = process.env.MONGODB_DATABASE;
    const MONGO_COLLECTION_NAME = "documents";
    const VECTOR_INDEX_NAME = "vector_index";

    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(MONGO_DB_NAME);
    const collection = db.collection(MONGO_COLLECTION_NAME);

    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
    });

    const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
      collection,
      indexName: VECTOR_INDEX_NAME,
    });

    const promptTemplate =
      ChatPromptTemplate.fromTemplate(`You are a helpful assistant. Use the context below to answer the question.
If the answer cannot be found in the context, respond with "I don't know."

Context:
{context}

Question: {question}
Answer:`);

    const InputStateAnnotation = Annotation.Root({
      question: Annotation<string>,
    });

    const StateAnnotation = Annotation.Root({
      question: Annotation<string>,
      context: Annotation<Document[]>,
      answer: Annotation<string>,
    });

    const llm = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0,
    });

    const retrieve = async (state: typeof InputStateAnnotation.State) => {
      const retrievedDocsWithScores =
        await vectorStore.similaritySearchWithScore(state.question, 4);
      const retrievedDocs = retrievedDocsWithScores.map(([doc]) => doc);
      return { context: retrievedDocs };
    };

    const generate = async (state: typeof StateAnnotation.State) => {
      const docsContent = (state.context || [])
        .map((doc) => doc.pageContent || "")
        .filter(Boolean)
        .join("\n");

      const sourcesList = (state.context || []).map((doc) => {
        const sourceFile = doc.metadata?.source_file || "unknown source";
        const messageCode =
          doc.metadata?.message_code ||
          doc.metadata?.section_number ||
          "unknown code";
        const messageName =
          doc.metadata?.message_name ||
          doc.metadata?.segment_name ||
          "unknown name";
        return `- ${sourceFile}: ${messageCode} ${messageName}`;
      });

      if (!docsContent.trim()) {
        return {
          answer: "I couldn't find anything relevant in the documents.",
          sources: [],
        };
      }

      const messages = await promptTemplate.invoke({
        question: state.question,
        context: docsContent,
      });

      const response = await llm.invoke(messages);

      return {
        answer: JSON.stringify({
          text: response.content,
          sources: sourcesList,
        }),
      };
    };

    const graph = new StateGraph(StateAnnotation)
      .addNode("retrieve", retrieve)
      .addNode("generate", generate)
      .addEdge("__start__", "retrieve")
      .addEdge("retrieve", "generate")
      .addEdge("generate", "__end__")
      .compile();

    const result = await graph.invoke({ question });
    const parsed = JSON.parse(result.answer);

    return NextResponse.json({
      answer: parsed.text,
      sources: parsed.sources || [],
    });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
