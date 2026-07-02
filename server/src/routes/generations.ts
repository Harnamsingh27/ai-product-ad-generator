import { Router } from "express";
import { prisma } from "../lib/prisma";

export const generationsRouter = Router();

generationsRouter.get("/generations", async (_req, res) => {
  try {
    const generations = await prisma.generation.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json({ generations });
  } catch (error) {
    console.error("Failed to fetch generations:", error);
    return res.status(500).json({ error: "Failed to fetch generation history" });
  }
});

generationsRouter.delete("/generations/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.generation.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    console.error("Failed to delete generation:", error);
    return res.status(404).json({ error: "Generation not found" });
  }
});
