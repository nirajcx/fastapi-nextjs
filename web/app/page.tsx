import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Shield, Sparkles, ArrowRight, Code2, Heart } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between bg-radial from-background via-muted/40 to-muted/80 dark:from-background dark:via-background dark:to-muted/30">
      {/* Navbar */}
      <header className="w-full border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-bold tracking-tight text-lg">FastAPI Hub</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero section */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center py-12 md:py-24 space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary tracking-wide animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          Ready to authenticate
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-2xl leading-none">
          Secure Fullstack <br />
          <span className="bg-gradient-to-r from-violet-500 via-primary to-emerald-500 bg-clip-text text-transparent">
            FastAPI & Next.js
          </span>
        </h1>

        <p className="text-muted-foreground text-base sm:text-xl max-w-xl leading-relaxed">
          Experience clean architecture using React Hook Form, Zod schema validations, dark/light mode context, Shadcn components, and Axios API bindings.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-sm pt-4">
          <Link href="/login" className="w-full">
            <Button size="lg" className="w-full cursor-pointer gap-2 font-medium shadow-lg hover:shadow-primary/20 active:scale-95 transition-all">
              Sign In to App <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/signup" className="w-full">
            <Button size="lg" variant="outline" className="w-full cursor-pointer gap-2 font-medium active:scale-95 transition-all">
              Create Account
            </Button>
          </Link>
        </div>

        {/* Feature showcase grids */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 w-full text-left">
          <div className="p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-sm space-y-2 hover:border-primary/30 transition-colors">
            <div className="p-2 w-fit bg-violet-500/10 text-violet-500 rounded-lg">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Client Valdation</h3>
            <p className="text-xs text-muted-foreground leading-normal">
              Full input checks using Zod and React Hook Form, matching FastAPI schema logic.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-sm space-y-2 hover:border-primary/30 transition-colors">
            <div className="p-2 w-fit bg-amber-500/10 text-amber-500 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Sleek Dark Mode</h3>
            <p className="text-xs text-muted-foreground leading-normal">
              Flawless theme toggles with smooth, animated custom Sun and Moon micro-icons.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-sm space-y-2 hover:border-primary/30 transition-colors">
            <div className="p-2 w-fit bg-emerald-500/10 text-emerald-500 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Secure HTTPOnly</h3>
            <p className="text-xs text-muted-foreground leading-normal">
              Axios binding built with credentials enabled, securely sending cookies over endpoints.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/40 py-6 text-center text-xs text-muted-foreground bg-muted/10">
        <div className="flex items-center justify-center gap-1.5 font-medium">
          Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> on FastAPI + Next.js
        </div>
      </footer>
    </div>
  );
}
