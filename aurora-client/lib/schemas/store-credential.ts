import { z } from "zod";

const shopifyDomainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/;

export const createStoreCredentialSchema = z.object({
  bling_api_key: z.string().min(1, "Bling API key is required.").max(500),
  shopify_domain: z
    .string()
    .min(1, "Shopify domain is required.")
    .max(255)
    .regex(shopifyDomainRegex, "Use the format your-store.myshopify.com"),
  shopify_access_token: z.string().min(1, "Shopify access token is required.").max(500),
  shopify_api_secret: z.string().max(500).optional().or(z.literal("")),
});

export const updateStoreCredentialSchema = z.object({
  bling_api_key: z.string().max(500).optional().or(z.literal("")),
  shopify_domain: z
    .string()
    .min(1, "Shopify domain is required.")
    .max(255)
    .regex(shopifyDomainRegex, "Use the format your-store.myshopify.com")
    .optional(),
  shopify_access_token: z.string().max(500).optional().or(z.literal("")),
  shopify_api_secret: z.string().max(500).optional().or(z.literal("")),
});

export const storeCredentialSchema = z.object({
  id: z.number(),
  shopify_domain: z.string(),
  has_bling_api_key: z.boolean(),
  has_shopify_access_token: z.boolean(),
  has_shopify_api_secret: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type CreateStoreCredentialInput = z.infer<typeof createStoreCredentialSchema>;
export type UpdateStoreCredentialInput = z.infer<typeof updateStoreCredentialSchema>;
export type StoreCredential = z.infer<typeof storeCredentialSchema>;
