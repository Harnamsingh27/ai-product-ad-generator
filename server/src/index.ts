import path from "path";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { generateRouter } from "./routes/generate";
import { generationsRouter } from "./routes/generations";

// Load environment variables from the root .env file (shared by server and Prisma)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
// Increased limit to accommodate base64-encoded generated images
app.use(express.json({ limit: "10mb" }));

app.get("/api/status", (_req, res) => {
  res.json({ demoMode: !process.env.OPENAI_API_KEY });
});

app.use("/api", generateRouter);
app.use("/api", generationsRouter);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  if (!process.env.OPENAI_API_KEY) {
    console.log("OPENAI_API_KEY not set - running in demo mode");
  }
});
