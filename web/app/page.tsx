"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [message, setMessage] = useState<string>("Connecting to Python...");
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchHello = async () => {
    try {
      // Fetching directly from FastAPI python server
      const res = await fetch("http://localhost:8000/api/hello");
      if (!res.ok) throw new Error("Server connection failed");
      const data = await res.json();
      setMessage(data.message);
      setError(false);
    } catch (err) {
      console.error(err);
      setMessage("Failed to connect to FastAPI Backend!");
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    fetch("http://localhost:8000/api/hello")
      .then((res) => {
        if (!res.ok) throw new Error("Server connection failed");
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setMessage(data.message);
          setError(false);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error(err);
          setMessage("Failed to connect to FastAPI Backend!");
          setError(true);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white selection:bg-teal-500/30 overflow-hidden font-sans">
      {/* Ultra Premium Ambient Background Lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Animated grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-xl px-6 text-center space-y-8">
        {/* Decorative floating python icon ring */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className={`absolute inset-0 rounded-3xl border border-teal-500/30 ${isLoading ? "animate-spin" : "animate-pulse"}`} style={{ animationDuration: '3s' }} />
          <div className="absolute inset-1.5 rounded-2xl border border-emerald-500/20" />
          <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 ring-1 ring-emerald-400/50">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.25.75c-3.16 0-3.84.64-3.84 3.84v1.5h4.5v1.5h-6.75C5.02 7.59 4.25 8.36 4.25 11.52v4.5c0 3.16.77 3.93 3.91 3.93H9.5v-3.75c0-2.74.5-3.75 3.75-3.75h5.25V9.75c0-3.16-.68-3.84-3.84-3.84h-1.5v-1.5h3C19.32 4.41 20 3.64 20 .48v-1.5h-3.75v2.25c0 .83-.67 1.5-1.5 1.5h-1.5v-.75z" opacity="0.1"/>
              <path d="M11.929 2.07a1.14 1.14 0 0 0-.343.813c0 .813.66 1.474 1.473 1.474h2.947c.32 0 .58-.26.58-.58V1.169C16.586.524 16.06 0 15.416 0h-2.947c-.2 0-.414.027-.54.206V2.07zM12.071 21.93c0-.32.26-.58.58-.58h2.947c.813 0 1.473-.66 1.473-1.473v-.814c-.127-.18-.34-.206-.54-.206h-2.947c-.645 0-1.17.525-1.17 1.17v2.61c0 .32-.26.58-.58.58H9.468c-.645 0-1.17-.525-1.17-1.17v-2.61c0-.32.26-.58.58-.58h2.947c.645 0 1.17-.525 1.17-1.17v-.814h.076z" opacity="0.2" />
              <path d="M12 0c-2.857 0-3.75.186-4.52.52a4.877 4.877 0 0 0-2.96 2.96c-.334.77-.52 1.663-.52 4.52v2.25h4.5v1.5H2.25C.984 11.25 0 12.234 0 13.5v4.5C0 20.857.186 21.75.52 22.52a4.877 4.877 0 0 0 2.96 2.96c.77.334 1.663.52 4.52.52h3v-4.5H9v-1.5h6.75c1.266 0 2.25-.984 2.25-2.25V13.5c0-2.857-.186-3.75-.52-4.52a4.877 4.877 0 0 0-2.96-2.96C13.75 5.686 12.857 5.5 10 5.5H7v4.5h1.5v1.5H1.75" opacity="0.1"/>
              <path d="M14.132 1.36c0-.323-.262-.585-.585-.585h-2.925c-.64 0-1.16.52-1.16 1.16v2.925c0 .323.262.585.585.585h2.925c.807 0 1.462-.655 1.462-1.462V1.36zM9.743 22.64c0 .323.262.585.585.585h2.925c.64 0 1.16-.52 1.16-1.16V19.14c0-.323-.262-.585-.585-.585H9.743c-.807 0-1.462.655-1.462 1.462v2.623z"/>
              <path d="M16.067 8.55h-3.126v3.125h3.126c.676 0 1.224-.548 1.224-1.224V9.774c0-.676-.548-1.224-1.224-1.224zM7.933 15.45h3.126v-3.125H7.933c-.676 0-1.224.548-1.224 1.224v1.677c0 .676.548 1.224 1.224 1.224z"/>
              <path d="M15.938 8.438H8.062C7.089 8.438 6.3 9.227 6.3 10.2v3.6c0 .973.789 1.762 1.762 1.762h7.876c.973 0 1.762-.789 1.762-1.762v-3.6c0-.973-.789-1.762-1.762-1.762zm-5.288 2.7c0-.323.262-.585.585-.585s.585.262.585.585-.262.585-.585.585-.585-.262-.585-.585zm2.625 1.8c0-.323.262-.585.585-.585s.585.262.585.585-.262.585-.585.585-.585-.262-.585-.585z"/>
            </svg>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-sm font-bold tracking-widest text-emerald-400 uppercase">FastAPI + Next.js Connection</h1>
          <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500 tracking-tight">
            Cross-Origin API Bridge
          </h2>
        </div>

        {/* Interactive Data Container (Glassmorphism) */}
        <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shadow-2xl shadow-black/50 transition-all duration-500 hover:border-slate-700/80">
          {isLoading ? (
            <div className="space-y-3 flex flex-col items-center justify-center py-4">
              <div className="w-8 h-8 border-[3px] border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              <span className="text-xs text-slate-400 font-medium tracking-wider animate-pulse">QUERYING BACKEND...</span>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-6 bg-slate-950/60 border border-slate-800/50 rounded-2xl">
                <p className={`text-lg md:text-2xl font-bold font-mono tracking-tight transition-all duration-300 ${error ? "text-rose-400" : "text-emerald-400"}`}>
                  &ldquo;{message}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${error ? "bg-rose-500" : "bg-emerald-500"}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${error ? "bg-rose-500" : "bg-emerald-500"}`}></span>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  Endpoint: <code className="text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 font-mono">GET http://localhost:8000/api/hello</code>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            onClick={() => {
              setIsLoading(true);
              setError(false);
              fetchHello();
            }}
            disabled={isLoading}
            className="group relative inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold tracking-wider uppercase text-white bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-emerald-500/10 active:scale-95"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <svg className={`w-3.5 h-3.5 mr-2 text-emerald-400 ${isLoading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Re-Fetch Data
          </button>

          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold tracking-wider uppercase text-slate-400 hover:text-white transition-colors duration-300"
          >
            Open OpenAPI Docs
            <svg className="w-3 h-3 ml-1.5 opacity-50 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </main>
  );
}
