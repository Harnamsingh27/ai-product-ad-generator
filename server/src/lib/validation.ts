import { z } from "zod";

export const TONE_OPTIONS = ["playful", "premium", "bold", "minimalist"] as const;
export const CHANNEL_OPTIONS = [
  "instagram_ad",
  "newsletter",
  "product_photo",
  "social_post",
] as const;

export const generateRequestSchema = z.object({
  brandName: z.string().trim().min(1, "Brand name is required").max(100),
  productName: z.string().trim().min(1, "Product name is required").max(100),
  productDescription: z
    .string()
    .trim()
    .min(1, "Product description is required")
    .max(1000),
  targetCustomer: z.string().trim().min(1, "Target customer is required").max(200),
  tone: z.enum(TONE_OPTIONS),
  channel: z.enum(CHANNEL_OPTIONS),
  imageUrl: z
    .string()
    .trim()
    .url("Image URL must be a valid URL")
    .optional()
    .or(z.literal("")),
});

export type GenerateRequest = z.infer<typeof generateRequestSchema>;
