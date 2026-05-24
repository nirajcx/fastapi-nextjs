import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex gap-5 flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">FastAPI + Next.js Learning Hub</h1>
      <p className="text-gray-500 mb-8">Select an example to explore:</p>
      
      <div className="flex flex-col gap-4 w-full max-w-md">
        <Link href="/hello" className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition">
          <h2 className="text-xl font-semibold">1. Hello World (GET)</h2>
          <p className="text-sm text-gray-500 mt-1">Basic GET request to fetch a simple message from the backend.</p>
        </Link>
        
        <Link href="/users" className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition">
          <h2 className="text-xl font-semibold">2. User Profile (GET + Params)</h2>
          <p className="text-sm text-gray-500 mt-1">Fetching data using dynamic path parameters in the URL.</p>
        </Link>
        
        <Link href="/items" className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition">
          <h2 className="text-xl font-semibold">3. Create Item (POST)</h2>
          <p className="text-sm text-gray-500 mt-1">Sending JSON data from a form to the FastAPI backend.</p>
        </Link>
      </div>
    </div>
  );
}
