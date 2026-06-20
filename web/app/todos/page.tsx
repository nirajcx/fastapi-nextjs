"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  Circle,
  Check,
  X,
  Loader2,
  ListTodo,
  LogOut,
} from "lucide-react";

interface TodoItem {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export default function TodoPage() {
  const router = useRouter();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const loadTodos = useCallback(async () => {
    try {
      let res;
      if (searchQuery.trim() !== "") {
        res = await api.get(`/api/gettodo/search?search=${encodeURIComponent(searchQuery)}`);
      } else if (filter === "completed") {
        res = await api.get("/api/gettodo?completed=true");
      } else if (filter === "active") {
        res = await api.get("/api/gettodo?completed=false");
      } else {
        res = await api.get("/api/gettodos");
      }
      setTodos(res.data.todos || []);
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  }, [filter, searchQuery, router]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreateLoading(true);
    try {
      await api.post("/api/addtodo", {
        title: newTitle.trim(),
        description: newDescription.trim(),
        completed: false,
      });
      setNewTitle("");
      setNewDescription("");
      await loadTodos();
    } catch (err) {
      console.error(err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleToggleComplete = async (todo: TodoItem) => {
    setActionLoading(todo.id);
    try {
      await api.patch(`/api/edittodo/${todo.id}`, {
        completed: !todo.completed,
      });
      await loadTodos();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const startEdit = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  };

  const handleSaveEdit = async (id: number) => {
    if (!editTitle.trim()) return;
    setActionLoading(id);
    try {
      await api.patch(`/api/edittodo/${id}`, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });
      setEditingId(null);
      await loadTodos();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (!confirm("Are you sure you want to delete this todo?")) return;
    setActionLoading(id);
    try {
      await api.delete(`/api/deletetodo/${id}`);
      await loadTodos();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await api.post("/api/users/logout");
      localStorage.removeItem("user");
      router.push("/");
    } catch (err) {
      console.error(err);
      localStorage.removeItem("user");
      router.push("/");
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading && todos.length === 0) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-radial from-background to-muted/30">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading your todos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground transition-colors duration-300">
      <header className="border-b border-border/60 bg-background/85 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <ListTodo className="w-5 h-5" />
            </div>
            <span className="font-bold tracking-tight text-lg">Task Manager</span>
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

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="border border-border/80 shadow-lg bg-card/90 dark:bg-card/75 sticky top-24">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                Create Task
              </CardTitle>
              <CardDescription>
                Add a new task to your personal board
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTodo} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Read Next.js Docs"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="e.g. Focus on Server Components"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="bg-background"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full gap-2 cursor-pointer transition-all active:scale-[0.98]"
                  disabled={createLoading}
                >
                  {createLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Add Task
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border/80 shadow-sm">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>

            <div className="flex bg-muted p-1 rounded-lg w-full sm:w-auto">
              {(["all", "active", "completed"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setFilter(tab);
                    setSearchQuery("");
                  }}
                  className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${
                    filter === tab
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {todos.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-xl bg-muted/10">
              <ListTodo className="w-12 h-12 text-muted-foreground/60 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground">No tasks found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjustment filters, search queries, or add a new task.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {todos.map((todo) => {
                const isEditing = editingId === todo.id;
                const isItemLoading = actionLoading === todo.id;

                return (
                  <div
                    key={todo.id}
                    className={`border border-border/80 p-4 rounded-xl shadow-sm bg-card hover:border-border transition-all duration-200 flex items-start gap-4 ${
                      todo.completed ? "opacity-75" : ""
                    }`}
                  >
                    <button
                      onClick={() => handleToggleComplete(todo)}
                      disabled={isItemLoading}
                      className="mt-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-100 dark:fill-emerald-950/30" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="space-y-3">
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="bg-background font-semibold"
                            placeholder="Title"
                          />
                          <Input
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="bg-background text-sm text-muted-foreground"
                            placeholder="Description"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSaveEdit(todo.id)}
                              disabled={isItemLoading}
                              className="gap-1"
                            >
                              <Check className="w-3.5 h-3.5" /> Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingId(null)}
                              disabled={isItemLoading}
                              className="gap-1"
                            >
                              <X className="w-3.5 h-3.5" /> Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h4
                            className={`font-semibold text-lg leading-snug break-words ${
                              todo.completed ? "line-through text-muted-foreground" : "text-foreground"
                            }`}
                          >
                            {todo.title}
                          </h4>
                          {todo.description && (
                            <p
                              className={`text-sm text-muted-foreground mt-1 break-words ${
                                todo.completed ? "line-through" : ""
                              }`}
                            >
                              {todo.description}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => startEdit(todo)}
                          disabled={isItemLoading}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteTodo(todo.id)}
                          disabled={isItemLoading}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          {isItemLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
