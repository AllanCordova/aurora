"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatedSwap } from "@/components/motion/AnimatedSwap";
import { FadeIn } from "@/components/motion/FadeIn";
import { ScaleIn } from "@/components/motion/ScaleIn";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorShow } from "@/components/ui/ErrorShow";
import { FormField } from "@/components/ui/FormField";
import { useLogin, useRegister } from "@/lib/queries/use-auth";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@/lib/schemas/auth";
import { cn } from "@/lib/utils/cn";

type AuthMode = "login" | "register";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const login = useLogin();
  const register = useRegister();

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const activeMutation = mode === "login" ? login : register;
  const activeError = activeMutation.error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <ScaleIn className="w-full max-w-md">
        <Card>
          <FadeIn className="mb-8 text-center" delay={0.05}>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-foreground">
              Aurora
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-foreground">
              Bling ↔ Shopify Middleware
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to manage your integration credentials.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mb-6 grid grid-cols-2 gap-2 rounded-app bg-surface-muted p-1">
              {(["login", "register"] as AuthMode[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMode(item)}
                  className={cn(
                    "rounded-app px-4 py-2 text-sm font-medium capitalize transition",
                    mode === item
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </FadeIn>

          <AnimatedSwap swapKey={mode}>
            {mode === "login" ? (
              <form
                className="space-y-4"
                onSubmit={loginForm.handleSubmit((values) => login.mutate(values))}
              >
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  error={loginForm.formState.errors.email}
                  registration={loginForm.register("email")}
                />
                <FormField
                  label="Password"
                  name="password"
                  type="password"
                  error={loginForm.formState.errors.password}
                  registration={loginForm.register("password")}
                />
                <ErrorShow error={activeError} />
                <Button type="submit" fullWidth disabled={login.isPending}>
                  {login.isPending ? "Please wait..." : "Sign In"}
                </Button>
              </form>
            ) : (
              <form
                className="space-y-4"
                onSubmit={registerForm.handleSubmit((values) => register.mutate(values))}
              >
                <FormField
                  label="Name"
                  name="name"
                  error={registerForm.formState.errors.name}
                  registration={registerForm.register("name")}
                />
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  error={registerForm.formState.errors.email}
                  registration={registerForm.register("email")}
                />
                <FormField
                  label="Password"
                  name="password"
                  type="password"
                  error={registerForm.formState.errors.password}
                  registration={registerForm.register("password")}
                />
                <FormField
                  label="Confirm Password"
                  name="password_confirmation"
                  type="password"
                  error={registerForm.formState.errors.password_confirmation}
                  registration={registerForm.register("password_confirmation")}
                />
                <ErrorShow error={activeError} />
                <Button type="submit" fullWidth disabled={register.isPending}>
                  {register.isPending ? "Please wait..." : "Create Account"}
                </Button>
              </form>
            )}
          </AnimatedSwap>

          <FadeIn delay={0.15}>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              API tokens are encrypted at rest and never returned to the browser.
            </p>
          </FadeIn>
        </Card>
      </ScaleIn>
    </div>
  );
}
