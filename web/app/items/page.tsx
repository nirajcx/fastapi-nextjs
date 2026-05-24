"use client";

import { useState } from "react";
import Link from "next/link";

export default function ItemsPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const createItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          price: parseFloat(price) || 0,
          description: "A sample item created from Next.js",
        }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setResponse({ error: "Failed to create item" });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <Link href="/" className="text-blue-500 hover:underline mb-4 font-medium">← Back to Home</Link>
      
      <h1 className="text-2xl font-bold">POST Request Example</h1>
      
      <form onSubmit={createItem} className="flex flex-col gap-4 w-full max-w-md p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Item Name</label>
          <input 
            type="text" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 rounded-lg text-black dark:text-white"
            placeholder="e.g. Laptop"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Price ($)</label>
          <input 
            type="number" 
            required
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 rounded-lg text-black dark:text-white"
            placeholder="e.g. 999.99"
          />
        </div>
        <button 
          type="submit"
          className="mt-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          disabled={loading}
        >
          {loading ? "Sending..." : "Create Item"}
        </button>
      </form>
      
      <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-md min-h-[160px] bg-slate-50 dark:bg-slate-900 overflow-auto">
        {response ? (
          <pre className="font-mono text-sm text-green-600 dark:text-green-400">
            {JSON.stringify(response, null, 2)}
          </pre>
        ) : (
          <p className="text-center text-slate-500 mt-4">Submit the form to see the API response</p>
        )}
      </div>
    </div>
  );
}
