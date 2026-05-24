"use client";

import { useState } from "react";
import Link from "next/link";

export default function HelloPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchHello = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/hello");
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage("Error fetching data");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <Link href="/" className="text-blue-500 hover:underline mb-8 font-medium">← Back to Home</Link>
      
      <h1 className="text-2xl font-bold">Basic GET Request Example</h1>
      <button 
        onClick={fetchHello}
        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
      >
        Fetch Hello
      </button>
      
      <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-md min-h-[120px] flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        {loading ? (
          <p className="text-slate-500 animate-pulse">Loading...</p>
        ) : (
          <p className="font-mono text-lg">{message || "Click the button to fetch data"}</p>
        )}
      </div>
    </div>
  );
}
