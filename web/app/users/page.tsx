"use client";

import { useState } from "react";
import Link from "next/link";

export default function UsersPage() {
  const [userId, setUserId] = useState("1");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/users/${userId}`);
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      setUserData({ error: "Failed to fetch" });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <Link href="/" className="text-blue-500 hover:underline mb-8 font-medium">← Back to Home</Link>
      
      <h1 className="text-2xl font-bold">Path Parameter Example</h1>
      
      <div className="flex gap-3">
        <input 
          type="number" 
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 rounded-lg text-black dark:text-white"
          placeholder="User ID"
        />
        <button 
          onClick={fetchUser}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          Fetch User
        </button>
      </div>
      
      <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-md min-h-[160px] bg-slate-50 dark:bg-slate-900 overflow-auto">
        {loading ? (
          <p className="text-center text-slate-500 animate-pulse mt-4">Loading...</p>
        ) : userData ? (
          <pre className="font-mono text-sm text-green-600 dark:text-green-400">
            {JSON.stringify(userData, null, 2)}
          </pre>
        ) : (
          <p className="text-center text-slate-500 mt-4">Enter an ID and fetch to see the result</p>
        )}
      </div>
    </div>
  );
}
