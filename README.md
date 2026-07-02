# AI Product Ad Generator

A full-stack web app that turns a few product details into ready-to-use marketing creative. Enter your brand and product info, pick a tone and channel, and get a headline, ad copy, social caption, newsletter blurb, and a matching product image in seconds. Every generation is saved to a history you can revisit or delete.

Built as a portfolio project to demonstrate full-stack and AI product engineering: a typed React frontend, a typed Express API, a Prisma-backed database, and an OpenAI integration with a fully functional offline demo mode.

## Why this project

Small brands and solo founders need marketing creative fast, but writing ad copy and briefing an image for every channel is slow. This app collapses that workflow into one form: describe the product once, generate creative for Instagram, newsletters, or product photography, and keep a history of what worked.

## Features

- Landing page with a clear value proposition
- Generation form covering brand, product, target customer, tone, channel, and an optional product image URL
- AI-generated headline, ad copy, social caption, newsletter blurb, image prompt, and creative direction
- AI image generation, with a branded SVG preview fallback when no API key is configured
- Demo mode that works fully offline with deterministic mock copy, clearly labeled in the UI
- Generation history sidebar with select, delete, and clear all
- Copy-to-clipboard on every generated text block
- Loading and error states throughout
- Responsive two-column dashboard layout on desktop, stacked on mobile

## Tech stack

**Frontend:** React, TypeScript, Vite, plain CSS

**Backend:** Node.js, Express, TypeScript, Zod for input validation

**Database:** Prisma ORM, SQLite for local development, PostgreSQL-ready via `DATABASE_URL`

**AI:** OpenAI SDK, configurable text model (`AI_TEXT_MODEL`) and image model (`AI_IMAGE_MODEL`)

## Screenshots

Add screenshots of the landing page, generation form, and results panel here once you have run the app locally.

`docs/screenshot-landing.png`

`docs/screenshot-generate.png`

`docs/screenshot-history.png`

## Project structure

```
ai-product-ad-generator/
  client/          React + Vite frontend
  server/          Express + TypeScript backend
  prisma/          Prisma schema and migrations
  package.json     Root workspace scripts
  .env.example     Environment variable template
```

## How to run locally

### Prerequisites

- Node.js 18 or later
- npm

### 1. Install dependencies

```bash
npm install
```

This installs dependencies for the root, `client`, and `server` workspaces, and runs `prisma generate` automatically.

### 2. Configure environment variables

```bash
cp .env.example .env
```

By default `DATABASE_URL=file:./dev.db` uses SQLite, so no database setup is required. Leave `OPENAI_API_KEY` blank to run in demo mode, or add your key to enable real AI generation.

### 3. Run the database migration

```bash
npm run prisma:migrate
```

This creates the SQLite database file and the `Generation` table.

### 4. Start the app

```bash
npm run dev
```

This runs the Express API on `http://localhost:5000` and the Vite dev server on `http://localhost:5173` at the same time. Open `http://localhost:5173` in your browser.

## Environment variables

| Variable         | Description                                              | Default              |
| ---------------- | ---------------------------------------------------------- | --------------------- |
| `OPENAI_API_KEY` | Your OpenAI API key. Leave blank to run in demo mode.       | (empty)                |
| `AI_TEXT_MODEL`  | OpenAI text model used to generate ad copy.                 | `gpt-4o-mini`          |
| `AI_IMAGE_MODEL` | OpenAI image model used to generate the creative image.     | `gpt-image-1`          |
| `DATABASE_URL`   | Prisma database connection string.                           | `file:./dev.db`        |
| `PORT`           | Port the Express API listens on.                              | `5000`                 |
| `VITE_API_URL`   | API base URL used by the frontend (set in `client/.env` if different from default). | `http://localhost:5000` |

### Using PostgreSQL instead of SQLite

Set `DATABASE_URL` to a PostgreSQL connection string, change the `provider` in `prisma/schema.prisma` from `sqlite` to `postgresql`, then run `npm run prisma:migrate` again.

## Available scripts

Run from the project root:

| Command                  | Description                                    |
| ------------------------- | ------------------------------------------------ |
| `npm install`              | Install all workspace dependencies               |
| `npm run dev`               | Run client and server together for local development |
| `npm run server`            | Run only the backend                              |
| `npm run client`            | Run only the frontend                             |
| `npm run build`             | Build both client and server for production       |
| `npm run prisma:generate`   | Regenerate the Prisma client                       |
| `npm run prisma:migrate`    | Run Prisma migrations                              |
| `npm run lint`              | Lint the frontend                                  |

## API overview

- `GET /api/status` - returns whether the server is running in demo mode
- `POST /api/generate` - validates input and returns generated ad creative, saving it to history
- `GET /api/generations` - returns saved generation history
- `DELETE /api/generations/:id` - deletes a saved generation

## Demo mode

If `OPENAI_API_KEY` is not set (or an OpenAI call fails), the backend generates deterministic mock ad copy from the form inputs and renders a branded SVG creative preview instead of calling the OpenAI image API. The frontend shows a clearly labeled demo mode banner so it is always obvious when output is mocked versus AI-generated.

## License

MIT
