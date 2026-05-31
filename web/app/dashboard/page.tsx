"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogOut, User, Users, Shield, Sparkles, Loader2, RefreshCw } from "lucide-react";

interface UserProfile {
  id: number;
  username: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = React.useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = React.useState<UserProfile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [logoutLoading, setLogoutLoading] = React.useState(false);

  const fetchUsers = React.useCallback(async () => {
    try {
      const res = await api.get("/api/users");
      setAllUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users list", err);
    }
  }, []);

  React.useEffect(() => {
    // Check if user is stored in localStorage (saved during successful login)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }

    // Load registered users from API using Axios
    fetchUsers().finally(() => setLoading(false));
  }, [fetchUsers]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await api.post("/api/users/logout");
      localStorage.removeItem("user");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
      // Fallback
      localStorage.removeItem("user");
      router.push("/login");
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-radial from-background to-muted/30">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading secure workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Premium Navbar */}
      <header className="border-b border-border/60 bg-background/85 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-bold tracking-tight text-lg">FastAPI Hub</span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={logoutLoading}
              className="gap-2 cursor-pointer transition-all active:scale-95"
            >
              {logoutLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main workspace dashboard */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border border-border/80 shadow-lg bg-card/90 dark:bg-card/75">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Profile Details
              </CardTitle>
              <CardDescription>
                Your authenticated session credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Username
                </span>
                <p className="font-medium text-lg text-foreground">
                  {currentUser?.username || "Guest User"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Email Address
                </span>
                <p className="font-medium text-foreground">
                  {currentUser?.email || "guest@example.com"}
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Session Active & Secured via HTTPOnly Cookie</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registered Users / API display Card */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border border-border/80 shadow-lg bg-card/90 dark:bg-card/75">
            <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" /> Active Users
                </CardTitle>
                <CardDescription>
                  Dynamically fetched via Axios from the FastAPI SQLite Database
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={fetchUsers}
                className="w-8 h-8 rounded-full"
                title="Refresh list"
              >
                <RefreshCw className="w-4 h-4 text-muted-foreground hover:text-foreground transition-all active:rotate-180" />
              </Button>
            </CardHeader>
            <CardContent>
              {allUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No other users registered.
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {allUsers.map((u) => (
                    <div
                      key={u.id}
                      className="py-3 flex items-center justify-between hover:bg-muted/10 px-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                          {u.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{u.username}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground font-semibold">
                        ID: {u.id}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
