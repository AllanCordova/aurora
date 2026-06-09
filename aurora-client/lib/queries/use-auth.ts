"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  authResponseSchema,
  type LoginInput,
  type RegisterInput,
  userSchema,
} from "@/lib/schemas/auth";
import { useAuthStore } from "@/lib/stores/auth-store";
import { toast } from "@/lib/toast";

export const authKeys = {
  user: ["auth", "user"] as const,
};

export function useCurrentUser() {
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  return useQuery({
    queryKey: authKeys.user,
    enabled: isHydrated && Boolean(token),
    queryFn: async () => {
      const response = await api.get("/user");
      return userSchema.parse(response.data.data);
    },
    meta: {
      errorMessage: "Unable to load your profile.",
    },
  });
}

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: LoginInput) => {
      const response = await api.post("/login", payload);
      return authResponseSchema.parse(response.data);
    },
    onSuccess: (data) => {
      setSession(data.user, data.token);
      queryClient.setQueryData(authKeys.user, data.user);
      toast.success(`Welcome back, ${data.user.name}.`);
      router.replace("/settings");
    },
    onError: (error) => {
      toast.error(error, "Unable to sign in. Check your credentials.");
    },
  });
}

export function useRegister() {
  const setSession = useAuthStore((state) => state.setSession);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: RegisterInput) => {
      const response = await api.post("/register", payload);
      return authResponseSchema.parse(response.data);
    },
    onSuccess: (data) => {
      setSession(data.user, data.token);
      queryClient.setQueryData(authKeys.user, data.user);
      toast.success("Account created successfully.");
      router.replace("/settings");
    },
    onError: (error) => {
      toast.error(error, "Unable to create your account.");
    },
  });
}

export function useLogout() {
  const clearSession = useAuthStore((state) => state.clearSession);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await api.post("/logout");
    },
    onSuccess: () => {
      toast.info("You have been signed out.");
    },
    onError: () => {
      toast.info("Session ended locally.");
    },
    onSettled: () => {
      clearSession();
      queryClient.clear();
      router.replace("/login");
    },
  });
}
