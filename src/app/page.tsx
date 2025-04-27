"use client";

import { useState } from "react";
import axios from "axios";

export default function RAGChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSources, setShowSources] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    setSources([]);
    setShowSources(false);

    try {
      const response = await axios.post("/api/query", { question });
      console.log(response);
      console.log(response.data);
      setAnswer(response.data.answer);
      setSources(response.data.sources || []);
    } catch (error) {
      setAnswer("Error retrieving answer. Please try again.");
      setSources([]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Market Message RAG Chatbot</h1>

      <textarea
        className="w-full max-w-2xl border p-2 rounded-md mb-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200"
        rows={4}
        placeholder="Enter your question about the Market Message Guides..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={handleAsk}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Asking..." : "Ask"}
      </button>

      {answer && (
        <div className="w-full max-w-2xl mt-6 p-4 border rounded-md bg-white shadow-md dark:bg-gray-800">
          <h2 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">
            Answer:
          </h2>
          <p className="text-gray-900 dark:text-gray-200 whitespace-pre-line">
            {answer}
          </p>

          {sources.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => setShowSources(!showSources)}
                className="text-blue-600 hover:underline focus:outline-none"
              >
                {showSources ? "Hide Sources" : "Show Sources"}
              </button>

              {showSources && (
                <ul className="mt-2 list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                  {sources.map((source, idx) => (
                    <li key={idx}>{source}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
