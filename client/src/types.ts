export type Tone = "playful" | "premium" | "bold" | "minimalist";
export type Channel = "instagram_ad" | "newsletter" | "product_photo" | "social_post";

export interface GenerationFormValues {
  brandName: string;
  productName: string;
  productDescription: string;
  targetCustomer: string;
  tone: Tone;
  channel: Channel;
  imageUrl: string;
}

export interface Generation {
  id: string;
  brandName: string;
  productName: string;
  productDescription: string;
  targetCustomer: string;
  tone: string;
  channel: string;
  imageUrl: string | null;
  headline: string;
  adCopy: string;
  socialCaption: string;
  newsletterBlurb: string;
  imagePrompt: string;
  creativeDirection: string;
  generatedImage: string | null;
  createdAt: string;
}

export interface GenerateResponse {
  generation: Generation;
  demoMode: boolean;
}
