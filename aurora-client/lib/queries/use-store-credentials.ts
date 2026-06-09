"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { api } from "@/lib/api";
import {
  storeCredentialSchema,
  type CreateStoreCredentialInput,
  type StoreCredential,
  type UpdateStoreCredentialInput,
} from "@/lib/schemas/store-credential";
import { useAuthStore } from "@/lib/stores/auth-store";
import { toast } from "@/lib/toast";

export const storeCredentialKeys = {
  all: ["store-credentials"] as const,
};

function parseCredentialResponse(data: unknown): StoreCredential | null {
  const payload = data as { data: unknown };
  return payload.data ? storeCredentialSchema.parse(payload.data) : null;
}

function stripEmptySecrets<T extends Record<string, unknown>>(payload: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== "" && value !== undefined),
  ) as Partial<T>;
}

export function useStoreCredentials() {
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const hasShownError = useRef(false);

  const query = useQuery({
    queryKey: storeCredentialKeys.all,
    enabled: isHydrated && Boolean(token),
    queryFn: async () => {
      const response = await api.get("/store-credentials");
      return parseCredentialResponse(response.data);
    },
  });

  useEffect(() => {
    if (query.error && !hasShownError.current) {
      hasShownError.current = true;
      toast.error(query.error, "Unable to load store credentials.");
    }

    if (!query.error) {
      hasShownError.current = false;
    }
  }, [query.error]);

  return query;
}

export function useCreateStoreCredentials() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateStoreCredentialInput) => {
      const body = stripEmptySecrets(payload);
      const response = await api.post("/store-credentials", body);
      return storeCredentialSchema.parse((response.data as { data: unknown }).data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(storeCredentialKeys.all, data);
      toast.success("Store credentials saved successfully.");
    },
    onError: (error) => {
      toast.error(error, "Unable to save store credentials.");
    },
  });
}

export function useUpdateStoreCredentials() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateStoreCredentialInput) => {
      const body = stripEmptySecrets(payload);
      const response = await api.put("/store-credentials", body);
      return storeCredentialSchema.parse((response.data as { data: unknown }).data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(storeCredentialKeys.all, data);
      toast.success("Store credentials updated successfully.");
    },
    onError: (error) => {
      toast.error(error, "Unable to update store credentials.");
    },
  });
}
