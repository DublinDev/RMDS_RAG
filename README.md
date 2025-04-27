# Market Messages RAG Chatbot

A Retrieval-Augmented Generation (RAG) chatbot that allows users to query and explore documentation from the Irish Retail Market Design Service (RMDS), specifically the [Market Messages](https://rmdservice.com/market-design/market-messages) documentation.

It enables natural language questions with answers traced directly back to original technical PDFs.

---

## 🚀 Live Demo

👉 [rmds-rag.vercel.app](https://rmds-rag.vercel.app) *(replace this with your live Vercel URL!)*

---

## 🛠️ Tech Stack

- **Next.js 15 (App Router)** — Frontend and backend
- **LangChain + LangGraph** — RAG pipeline (retrieval and generation)
- **MongoDB Atlas Vector Search** — Vector database storage
- **OpenAI** — Embeddings (text-embedding-3-small) and LLMs
- **LangSmith** — Tracing and debugging pipeline flows
- **TailwindCSS** — Styling and responsive design
- **Vercel** — Hosting

---

## 📚 Features

- ✅ Chunked ingestion of complex PDFs with fallback logic
- ✅ Embedding content into MongoDB Atlas vector store
- ✅ Contextual retrieval based on semantic similarity
- ✅ Answer generation using OpenAI models
- ✅ Full observability with LangSmith tracing
- ✅ Clean UI with expandable "Show Sources" section
- ✅ Public deployment with Vercel

---

## ⚙️ How It Works

1. PDFs are parsed into structured text chunks
2. Chunks are embedded and stored in a vector index
3. At query time:
   - Relevant chunks are retrieved based on similarity
   - An augmented prompt is constructed
   - An OpenAI model generates the final answer
   - Sources are displayed for full transparency

---

## 📦 Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/DublinDev/RMDS_RAG.git
cd RMDS_RAG
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set environment variables

Create a `.env.local` file:

```env
MONGODB_ATLAS_URI=your-mongodb-atlas-uri
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=Market-RAG-Chatbot
LANGCHAIN_API_KEY=your-langsmith-api-key
```

### 4. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🚀

---

## 📚 Data Source

All content is sourced from:

👉 [RMDS Market Messages Documentation](https://rmdservice.com/market-design/market-messages)

*This project is independently developed and is not affiliated with RMDS.*

---

## 🧠 Future Improvements

- Smarter dynamic chunk sizing
- Streamed responses for faster UX
- Reranking retrieved documents with additional LLM steps
- Admin UI for managing ingestion pipelines

---

## ✨ Author

Made with focus and curiosity by [Sean Fitzgerald](https://www.linkedin.com/in/seanfitzgerald-dev/)  
GitHub: [@DublinDev](https://github.com/DublinDev)

---

# 📸 Screenshot (Optional)

```markdown
## 📸 Screenshot

![RMDS RAG Chatbot Screenshot](./screenshot.png)
```

(*Take and upload a screenshot of the deployed app here if you want!*)

---
