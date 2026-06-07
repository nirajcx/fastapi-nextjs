"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { api } from "@/lib/axios";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ListTodo,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Heart,
  ShieldCheck,
  Zap,
} from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be 50 characters or less")
    .regex(/^[a-zA-Z0-9_]+$/, "Alphanumeric and underscores only"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<string>("signin");
  
  // Login State
  const [loginError, setLoginError] = React.useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = React.useState<string | null>(null);

  // Signup State
  const [signupError, setSignupError] = React.useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = React.useState<string | null>(null);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setLoginError(null);
    setLoginSuccess(null);
    try {
      const response = await api.post("/api/users/login", data);
      setLoginSuccess(response.data.message || "Logged in successfully!");
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        setLoginError(error.response.data.detail);
      } else {
        setLoginError("Invalid credentials or server connection error.");
      }
    }
  };

  const onSignupSubmit = async (data: SignupFormValues) => {
    setSignupError(null);
    setSignupSuccess(null);
    try {
      const response = await api.post("/api/users/register", data);
      setSignupSuccess(response.data.message || "Account created successfully!");
      setTimeout(() => {
        setActiveTab("signin");
        loginForm.setValue("username", data.username);
        setSignupSuccess(null);
      }, 1500);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        setSignupError(error.response.data.detail);
      } else {
        setSignupError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="relative h-screen overflow-hidden flex flex-col justify-between bg-radial from-background via-muted/40 to-muted/80 dark:from-background dark:via-background dark:to-muted/30">
      
      {/* Background visual glowing elements */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[250px] h-[250px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <header className="w-full border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-40 h-16 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-md shadow-primary/20">
              <ListTodo className="w-5 h-5" />
            </div>
            <span className="font-bold tracking-tight text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Hero */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-4 flex items-center min-h-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full max-h-full">
          
          {/* Left Column: Premium App Showcase */}
          <div className="lg:col-span-7 flex flex-col space-y-4 text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-semibold text-primary w-fit shadow-xs">
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen Productivity
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Manage Tasks with <br />
              <span className="bg-gradient-to-r from-primary via-indigo-500 to-violet-600 bg-clip-text text-transparent">
                Absolute Simplicity
              </span>
            </h1>
            
            <p className="text-muted-foreground text-sm md:text-base max-w-lg">
              A high-performance workspace combining FastAPI speed and Next.js reactivity. Organize, track, and complete your projects with style.
            </p>

            {/* Showcase Mockup Image Frame */}
            <div className="relative mt-2 group max-w-xl">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-indigo-500 opacity-20 blur-lg group-hover:opacity-35 transition duration-500" />
              
              <div className="relative border border-border/80 rounded-2xl overflow-hidden shadow-2xl bg-muted/30 backdrop-blur-xs">
                {/* Mock Browser Header */}
                <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border/60 bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-rose-500/80" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                  <div className="ml-4 text-[10px] font-mono text-muted-foreground bg-muted/80 px-3 py-0.5 rounded-md border border-border/30 select-none">
                    localhost:3000/dashboard
                  </div>
                </div>

                <div className="relative h-[200px] md:h-[260px] w-full select-none overflow-hidden bg-zinc-950">
                  <Image
                    src="/dashboard-mockup.png"
                    alt="TaskFlow Dashboard Mockup"
                    fill
                    sizes="(max-w-768px) 100vw, 800px"
                    priority
                    className="object-cover object-top transition duration-500 group-hover:scale-[1.01]"
                  />
                </div>
              </div>

              {/* Floating interactive-style stats badge */}
              <div className="absolute -bottom-4 -right-2 md:right-4 bg-card/95 dark:bg-card/90 border border-border/80 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2.5 animate-bounce-subtle max-w-[170px]">
                <div className="bg-emerald-500/10 text-emerald-500 p-1.5 rounded-lg">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Security</p>
                  <p className="text-[11px] font-bold text-foreground">JWT Secured</p>
                </div>
              </div>

              <div className="absolute -top-4 -left-2 bg-card/95 dark:bg-card/90 border border-border/80 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2.5 animate-bounce-subtle delay-300 max-w-[170px]">
                <div className="bg-primary/10 text-primary p-1.5 rounded-lg">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Speed</p>
                  <p className="text-[11px] font-bold text-foreground">FastAPI Driven</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Unified Authentication Tabs */}
          <div className="lg:col-span-5 flex justify-center animate-fade-in delay-200">
            <Card className="w-full max-w-md h-[460px] flex flex-col justify-between border border-border/80 shadow-2xl backdrop-blur-md bg-card/90 dark:bg-card/75 overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
                <div className="border-b border-border/40 p-1 bg-muted/20">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin" className="cursor-pointer text-xs py-1.5">Sign In</TabsTrigger>
                    <TabsTrigger value="signup" className="cursor-pointer text-xs py-1.5">Sign Up</TabsTrigger>
                  </TabsList>
                </div>

                {/* Sign In Content */}
                <TabsContent value="signin" className="mt-0 flex-1 flex flex-col justify-between p-6">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-bold tracking-tight">
                        Welcome back
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Sign in to your account to manage your workspace.
                      </CardDescription>
                    </div>

                    {loginSuccess && (
                      <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs animate-pulse-once">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                        <p className="font-medium">{loginSuccess}</p>
                      </div>
                    )}
                    {loginError && (
                      <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs animate-shake">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p className="font-medium">{loginError}</p>
                      </div>
                    )}

                    <form id="signin-form" onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-3">
                      <FieldGroup className="space-y-2">
                        <Field>
                          <FieldLabel htmlFor="login-username" className="text-xs">Username</FieldLabel>
                          <Input
                            id="login-username"
                            placeholder="yourusername"
                            className="h-9 text-sm"
                            disabled={loginForm.formState.isSubmitting || !!loginSuccess}
                            aria-invalid={!!loginForm.formState.errors.username}
                            {...loginForm.register("username")}
                          />
                          {loginForm.formState.errors.username && (
                            <FieldError className="text-[10px]">{loginForm.formState.errors.username.message}</FieldError>
                          )}
                        </Field>

                        <Field>
                          <FieldLabel htmlFor="login-password" className="text-xs">Password</FieldLabel>
                          <Input
                            id="login-password"
                            type="password"
                            placeholder="••••••••"
                            className="h-9 text-sm"
                            disabled={loginForm.formState.isSubmitting || !!loginSuccess}
                            aria-invalid={!!loginForm.formState.errors.password}
                            {...loginForm.register("password")}
                          />
                          {loginForm.formState.errors.password && (
                            <FieldError className="text-[10px]">{loginForm.formState.errors.password.message}</FieldError>
                          )}
                        </Field>
                      </FieldGroup>
                    </form>
                  </div>

                  <Button
                    type="submit"
                    form="signin-form"
                    className="w-full h-9 text-xs font-medium transition-all active:scale-[0.98] cursor-pointer mt-4"
                    disabled={loginForm.formState.isSubmitting || !!loginSuccess}
                  >
                    {loginForm.formState.isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        Sign In <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </>
                    )}
                  </Button>
                </TabsContent>

                {/* Sign Up Content */}
                <TabsContent value="signup" className="mt-0 flex-1 flex flex-col justify-between p-6">
                  <div className="space-y-3">
                    <div className="space-y-0.5">
                      <CardTitle className="text-lg font-bold tracking-tight">
                        Create an account
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Get started immediately and build your workspace.
                      </CardDescription>
                    </div>

                    {signupSuccess && (
                      <div className="flex items-center gap-2.5 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs animate-pulse-once">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                        <p className="font-medium">{signupSuccess}</p>
                      </div>
                    )}
                    {signupError && (
                      <div className="flex items-center gap-2.5 p-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs animate-shake">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p className="font-medium">{signupError}</p>
                      </div>
                    )}

                    <form id="signup-form" onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-2.5">
                      <FieldGroup className="space-y-1.5">
                        <Field>
                          <FieldLabel htmlFor="signup-username" className="text-xs">Username</FieldLabel>
                          <Input
                            id="signup-username"
                            placeholder="johndoe"
                            className="h-8.5 text-xs"
                            disabled={signupForm.formState.isSubmitting || !!signupSuccess}
                            aria-invalid={!!signupForm.formState.errors.username}
                            {...signupForm.register("username")}
                          />
                          {signupForm.formState.errors.username && (
                            <FieldError className="text-[10px]">{signupForm.formState.errors.username.message}</FieldError>
                          )}
                        </Field>

                        <Field>
                          <FieldLabel htmlFor="signup-email" className="text-xs">Email address</FieldLabel>
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="john@example.com"
                            className="h-8.5 text-xs"
                            disabled={signupForm.formState.isSubmitting || !!signupSuccess}
                            aria-invalid={!!signupForm.formState.errors.email}
                            {...signupForm.register("email")}
                          />
                          {signupForm.formState.errors.email && (
                            <FieldError className="text-[10px]">{signupForm.formState.errors.email.message}</FieldError>
                          )}
                        </Field>

                        <Field>
                          <FieldLabel htmlFor="signup-password" className="text-xs">Password</FieldLabel>
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="••••••••"
                            className="h-8.5 text-xs"
                            disabled={signupForm.formState.isSubmitting || !!signupSuccess}
                            aria-invalid={!!signupForm.formState.errors.password}
                            {...signupForm.register("password")}
                          />
                          {signupForm.formState.errors.password && (
                            <FieldError className="text-[10px]">{signupForm.formState.errors.password.message}</FieldError>
                          )}
                        </Field>
                      </FieldGroup>
                    </form>
                  </div>

                  <Button
                    type="submit"
                    form="signup-form"
                    className="w-full h-9 text-xs font-medium transition-all active:scale-[0.98] cursor-pointer mt-3"
                    disabled={signupForm.formState.isSubmitting || !!signupSuccess}
                  >
                    {signupForm.formState.isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Get Started <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </>
                    )}
                  </Button>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/40 py-3 text-center text-[10px] text-muted-foreground bg-muted/10 h-10 flex-shrink-0 flex items-center justify-center">
        <div className="flex items-center justify-center gap-1.5 font-medium">
          Built with{" "}
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> on
          FastAPI + Next.js
        </div>
      </footer>
    </div>
  );
}
