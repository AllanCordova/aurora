"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { api } from "@/lib/api";
import {
  categoryMappingSchema,
  type CategoryMapping,
  type CreateCategoryMappingInput,
  type UpdateCategoryMappingInput,
} from "@/lib/schemas/category-mapping";
import { useAuthStore } from "@/lib/stores/auth-store";
import { toast } from "@/lib/toast";

export const categoryMappingKeys = {
  all: ["category-mappings"] as const,
};

function parseCategoryMappings(data: unknown): CategoryMapping[] {
  const payload = data as { data: unknown[] };
  return payload.data.map((item) => categoryMappingSchema.parse(item));
}

function parseCategoryMapping(data: unknown): CategoryMapping {
  const payload = data as { data: unknown };
  return categoryMappingSchema.parse(payload.data);
}

export function useCategoryMappings() {
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const hasShownError = useRef(false);

  const query = useQuery({
    queryKey: categoryMappingKeys.all,
    enabled: isHydrated && Boolean(token),
    queryFn: async () => {
      const response = await api.get("/category-mappings");
      return parseCategoryMappings(response.data);
    },
  });

  useEffect(() => {
    if (query.error && !hasShownError.current) {
      hasShownError.current = true;
      toast.error(query.error, "Unable to load category mappings.");
    }

    if (!query.error) {
      hasShownError.current = false;
    }
  }, [query.error]);

  return query;
}

export function useCreateCategoryMapping() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCategoryMappingInput) => {
      const response = await api.post("/category-mappings", payload);
      return parseCategoryMapping(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryMappingKeys.all });
      toast.success("Category mapping created successfully.");
    },
    onError: (error) => {
      toast.error(error, "Unable to create category mapping.");
    },
  });
}

export function useUpdateCategoryMapping() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateCategoryMappingInput;
    }) => {
      const response = await api.put(`/category-mappings/${id}`, payload);
      return parseCategoryMapping(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryMappingKeys.all });
      toast.success("Category mapping updated successfully.");
    },
    onError: (error) => {
      toast.error(error, "Unable to update category mapping.");
    },
  });
}

export function useDeleteCategoryMapping() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/category-mappings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryMappingKeys.all });
      toast.success("Category mapping deleted successfully.");
    },
    onError: (error) => {
      toast.error(error, "Unable to delete category mapping.");
    },
  });
}
