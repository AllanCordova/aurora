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
      router.replace("/settings");
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
      router.replace("/settings");
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
    onSettled: () => {
      clearSession();
      queryClient.clear();
      router.replace("/login");
    },
  });
}
