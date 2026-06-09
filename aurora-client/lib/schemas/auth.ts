import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Enter a valid email."),
  password: z.string().min(1, "Password is required."),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required.").max(255, "Name is too long."),
    email: z.string().min(1, "Email is required.").email("Enter a valid email.").max(255),
    password: z.string().min(8, "Password must be at least 8 characters."),
    password_confirmation: z.string().min(1, "Password confirmation is required."),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
  });

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const authResponseSchema = z.object({
  user: userSchema,
  token: z.string(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type User = z.infer<typeof userSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
