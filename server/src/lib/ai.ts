import OpenAI from "openai";
import type { GenerateRequest } from "./validation";
import { generateDemoCopy, generateDemoSvgDataUri } from "./demo";

const TEXT_MODEL = process.env.AI_TEXT_MODEL || "gpt-4o-mini";
const IMAGE_MODEL = process.env.AI_IMAGE_MODEL || "gpt-image-1";

export interface CreativeResult {
  headline: string;
  adCopy: string;
  socialCaption: string;
  newsletterBlurb: string;
  imagePrompt: string;
  creativeDirection: string;
  generatedImage: string | null;
  demoMode: boolean;
}

function getClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

// Asks the AI text model for structured JSON creative output
async function generateCreativeText(client: OpenAI, input: GenerateRequest) {
  const prompt = `You are a marketing creative director. Generate ad creative for the following product.

Brand: ${input.brandName}
Product: ${input.productName}
Description: ${input.productDescription}
Target customer: ${input.targetCustomer}
Tone: ${input.tone}
Channel: ${input.channel}

Respond with strict JSON matching this shape:
{
  "headline": string,
  "adCopy": string,
  "socialCaption": string,
  "newsletterBlurb": string,
  "imagePrompt": string,
  "creativeDirection": string
}`;

  const completion = await client.chat.completions.create({
    model: TEXT_MODEL,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("Empty response from AI text model");

  return JSON.parse(raw) as {
    headline: string;
    adCopy: string;
    socialCaption: string;
    newsletterBlurb: string;
    imagePrompt: string;
    creativeDirection: string;
  };
}

// Asks the AI image model to generate a creative image, returns a data URL
async function generateCreativeImage(client: OpenAI, imagePrompt: string): Promise<string | null> {
  try {
    const response = await client.images.generate({
      model: IMAGE_MODEL,
      prompt: imagePrompt,
      size: "1024x1024",
      n: 1,
    });
    const b64 = response.data?.[0]?.b64_json;
    if (!b64) return null;
    return `data:image/png;base64,${b64}`;
  } catch (error) {
    console.error("Image generation failed, continuing without generated image:", error);
    return null;
  }
}

// Produces full ad creative for a request, using OpenAI if configured, otherwise deterministic demo mode
export async function generateCreative(input: GenerateRequest): Promise<CreativeResult> {
  const client = getClient();

  if (!client) {
    const demoCopy = generateDemoCopy(input);
    return {
      ...demoCopy,
      generatedImage: generateDemoSvgDataUri(input),
      demoMode: true,
    };
  }

  try {
    const text = await generateCreativeText(client, input);
    const generatedImage = await generateCreativeImage(client, text.imagePrompt);

    return {
      headline: text.headline,
      adCopy: text.adCopy,
      socialCaption: text.socialCaption,
      newsletterBlurb: text.newsletterBlurb,
      imagePrompt: text.imagePrompt,
      creativeDirection: text.creativeDirection,
      generatedImage: generatedImage ?? generateDemoSvgDataUri(input),
      demoMode: false,
    };
  } catch (error) {
    console.error("OpenAI generation failed, falling back to demo mode:", error);
    const demoCopy = generateDemoCopy(input);
    return {
      ...demoCopy,
      generatedImage: generateDemoSvgDataUri(input),
      demoMode: true,
    };
  }
}
