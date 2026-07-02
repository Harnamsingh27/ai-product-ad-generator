import { Router } from "express";
import { prisma } from "../lib/prisma";
import { generateRequestSchema } from "../lib/validation";
import { generateCreative } from "../lib/ai";

export const generateRouter = Router();

generateRouter.post("/generate", async (req, res) => {
  const parsed = generateRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid request",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const input = parsed.data;

  try {
    const creative = await generateCreative(input);

    const generation = await prisma.generation.create({
      data: {
        brandName: input.brandName,
        productName: input.productName,
        productDescription: input.productDescription,
        targetCustomer: input.targetCustomer,
        tone: input.tone,
        channel: input.channel,
        imageUrl: input.imageUrl || null,
        headline: creative.headline,
        adCopy: creative.adCopy,
        socialCaption: creative.socialCaption,
        newsletterBlurb: creative.newsletterBlurb,
        imagePrompt: creative.imagePrompt,
        creativeDirection: creative.creativeDirection,
        generatedImage: creative.generatedImage,
      },
    });

    return res.status(201).json({ generation, demoMode: creative.demoMode });
  } catch (error) {
    console.error("Failed to generate ad creative:", error);
    return res.status(500).json({ error: "Failed to generate ad creative" });
  }
});
