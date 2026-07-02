# Deployment guide

Deploy the database to Neon, the backend to Render, and the frontend to Vercel. All three have a free tier.

## 1. Database: Neon

1. Go to [neon.tech](https://neon.tech) and sign up or log in.
2. Click **Create a project**. Pick any name and region.
3. On the project dashboard, copy the connection string shown (it looks like `postgresql://user:password@host/dbname?sslmode=require`).
4. Keep this connection string, you will paste it into Render as `DATABASE_URL` in step 2.

## 2. Backend: Render

1. Go to [render.com](https://render.com) and sign up or log in.
2. Click **New** > **Web Service**, then **Connect account** to link your GitHub if you have not already.
3. Select the `ai-product-ad-generator` repository.
4. Render should detect `render.yaml` in the repo root and offer to create the service from it (a "Blueprint" deploy). Accept it. If it does not detect the file automatically, create the web service manually and set:
   - **Build command:** `npm install && npx prisma generate && npx prisma migrate deploy && npm run build --workspace=server`
   - **Start command:** `npm run start --workspace=server`
5. When prompted for environment variables, set:
   - `DATABASE_URL` - paste the Neon connection string from step 1
   - `PORT` - `5000` (Render also sets its own `PORT` automatically, either works since the server reads `process.env.PORT`)
   - `CORS_ORIGIN` - leave blank for now, you will set this after deploying the frontend in step 3
   - `OPENAI_API_KEY` - optional, see the note below
6. Click **Create Web Service** and wait for the build and deploy to finish.
7. Once deployed, copy the service URL Render gives you (e.g. `https://ai-product-ad-generator-api.onrender.com`). You will need it in step 3.

## 3. Frontend: Vercel

1. Go to [vercel.com](https://vercel.com) and sign up or log in.
2. Click **Add New** > **Project**, then import the `ai-product-ad-generator` repository.
3. Vercel should detect `vercel.json` in the repo root and use it automatically for the build command and output directory. Leave the root directory as the repo root.
4. Add an environment variable:
   - `VITE_API_URL` - the Render service URL from step 2, e.g. `https://ai-product-ad-generator-api.onrender.com`
5. Click **Deploy** and wait for it to finish.
6. Copy the Vercel URL you are given (e.g. `https://ai-product-ad-generator.vercel.app`).

## 4. Connect the frontend and backend

1. Go back to your Render service settings and set `CORS_ORIGIN` to the exact Vercel URL from step 3 (e.g. `https://ai-product-ad-generator.vercel.app`).
2. Redeploy the Render service so the new environment variable takes effect.
3. Open your Vercel URL in a browser and confirm the app loads and generation works.

## Note on OPENAI_API_KEY

`OPENAI_API_KEY` is optional. If you leave it unset on Render, the backend runs in demo mode: it returns deterministic mock ad copy and a generated SVG preview instead of calling OpenAI, and the frontend shows a demo mode banner. Add a real key later to enable AI-generated text and images without any other changes.
