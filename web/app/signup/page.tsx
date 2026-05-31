"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, UserPlus, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

const signupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be 50 characters or less")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain alphanumeric characters and underscores"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setApiError(null);
    setSuccessMsg(null);
    try {
      const response = await api.post("/api/users/register", data);
      setSuccessMsg(response.data.message || "Account created successfully!");
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        setApiError(error.response.data.detail);
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-radial from-background via-muted/50 to-muted/80 dark:from-background dark:via-background dark:to-muted/30">
      {/* Floating Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md animate-fade-in duration-500">
        <Card className="border border-border/80 shadow-2xl backdrop-blur-md bg-card/90 dark:bg-card/75">
          <CardHeader className="space-y-1.5 pb-6">
            <div className="mx-auto bg-primary/10 text-primary w-12 h-12 rounded-2xl flex items-center justify-center mb-2 animate-bounce-subtle">
              <UserPlus className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-bold text-center tracking-tight">
              Create an account
            </CardTitle>
            <CardDescription className="text-center text-sm text-muted-foreground">
              Sign up today and experience the seamless fastapi-nextjs workspace.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Status alerts */}
            {successMsg && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm animate-pulse-once">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="font-medium">{successMsg}</p>
              </div>
            )}

            {apiError && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="font-medium">{apiError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    id="username"
                    placeholder="johndoe"
                    disabled={isSubmitting || !!successMsg}
                    aria-invalid={!!errors.username}
                    {...register("username")}
                  />
                  {errors.username ? (
                    <FieldError>{errors.username.message}</FieldError>
                  ) : (
                    <FieldDescription>Choose a unique handle.</FieldDescription>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email address</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    disabled={isSubmitting || !!successMsg}
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                  {errors.email && <FieldError>{errors.email.message}</FieldError>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    disabled={isSubmitting || !!successMsg}
                    aria-invalid={!!errors.password}
                    {...register("password")}
                  />
                  {errors.password ? (
                    <FieldError>{errors.password.message}</FieldError>
                  ) : (
                    <FieldDescription>At least 6 characters.</FieldDescription>
                  )}
                </Field>
              </FieldGroup>

              <Button
                type="submit"
                className="w-full mt-2 font-medium transition-all active:scale-[0.98] cursor-pointer"
                disabled={isSubmitting || !!successMsg}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Get Started <ArrowRight className="w-4 h-4 ml-1.5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col items-center justify-center border-t border-border/40 py-4 bg-muted/20 rounded-b-lg">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline underline-offset-4"
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
