import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "@/lib/axios";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const Login = () => {
  // Login State
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);
  const router = useRouter();
  const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  });
  type LoginFormValues = z.infer<typeof loginSchema>;
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
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
  return (
    <div className="mt-0 flex-1 flex flex-col justify-between p-6">
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

        <form
          id="signin-form"
          onSubmit={loginForm.handleSubmit(onLoginSubmit)}
          className="space-y-3"
        >
          <FieldGroup className="space-y-2">
            <Field>
              <FieldLabel htmlFor="login-username" className="text-xs">
                Username
              </FieldLabel>
              <Input
                id="login-username"
                placeholder="yourusername"
                className="h-9 text-sm"
                disabled={loginForm.formState.isSubmitting || !!loginSuccess}
                aria-invalid={!!loginForm.formState.errors.username}
                {...loginForm.register("username")}
              />
              {loginForm.formState.errors.username && (
                <FieldError className="text-[10px]">
                  {loginForm.formState.errors.username.message}
                </FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="login-password" className="text-xs">
                Password
              </FieldLabel>
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
                <FieldError className="text-[10px]">
                  {loginForm.formState.errors.password.message}
                </FieldError>
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
    </div>
  );
};

export default Login;
