import { z } from "zod";

export const categoryMappingSchema = z.object({
  id: z.number(),
  bling_category_name: z.string().min(1).max(255),
  shopify_tag_or_collection: z.string().min(1).max(255),
  created_at: z.string(),
  updated_at: z.string(),
});

export const createCategoryMappingSchema = z.object({
  bling_category_name: z
    .string()
    .min(1, "Bling category is required.")
    .max(255, "Bling category is too long."),
  shopify_tag_or_collection: z
    .string()
    .min(1, "Shopify tag or collection is required.")
    .max(255, "Shopify tag or collection is too long."),
});

export const updateCategoryMappingSchema = z.object({
  bling_category_name: z
    .string()
    .min(1, "Bling category is required.")
    .max(255, "Bling category is too long.")
    .optional(),
  shopify_tag_or_collection: z
    .string()
    .min(1, "Shopify tag or collection is required.")
    .max(255, "Shopify tag or collection is too long.")
    .optional(),
});

export type CategoryMapping = z.infer<typeof categoryMappingSchema>;
export type CreateCategoryMappingInput = z.infer<typeof createCategoryMappingSchema>;
export type UpdateCategoryMappingInput = z.infer<typeof updateCategoryMappingSchema>;
