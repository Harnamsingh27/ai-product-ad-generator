import type { GenerateRequest } from "./validation";

interface TonePalette {
  background: string;
  accent: string;
  text: string;
}

const TONE_PALETTES: Record<GenerateRequest["tone"], TonePalette> = {
  playful: { background: "#FFE8D6", accent: "#FF6B6B", text: "#2B2118" },
  premium: { background: "#1A1A1D", accent: "#D4AF37", text: "#F5F5F0" },
  bold: { background: "#111827", accent: "#F43F5E", text: "#FFFFFF" },
  minimalist: { background: "#FAFAFA", accent: "#111111", text: "#222222" },
};

const CHANNEL_LABELS: Record<GenerateRequest["channel"], string> = {
  instagram_ad: "Instagram Ad",
  newsletter: "Newsletter",
  product_photo: "Product Photo",
  social_post: "Social Post",
};

// Escapes text so it is safe to place inside SVG markup
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}...` : value;
}

// Builds a deterministic branded SVG preview used when no OpenAI API key is configured
export function generateDemoSvgDataUri(input: GenerateRequest): string {
  const palette = TONE_PALETTES[input.tone];
  const channelLabel = CHANNEL_LABELS[input.channel];
  const brand = escapeXml(truncate(input.brandName, 24));
  const product = escapeXml(truncate(input.productName, 30));
  const tagline = escapeXml(truncate(input.productDescription, 60));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
    <rect width="800" height="800" fill="${palette.background}" />
    <rect x="40" y="40" width="720" height="720" fill="none" stroke="${palette.accent}" stroke-width="3" />
    <text x="60" y="120" font-family="Arial, sans-serif" font-size="28" fill="${palette.accent}" font-weight="bold">${brand}</text>
    <text x="60" y="400" font-family="Arial, sans-serif" font-size="56" fill="${palette.text}" font-weight="bold">${product}</text>
    <text x="60" y="450" font-family="Arial, sans-serif" font-size="22" fill="${palette.text}">${tagline}</text>
    <rect x="60" y="700" width="220" height="48" rx="24" fill="${palette.accent}" />
    <text x="90" y="731" font-family="Arial, sans-serif" font-size="18" fill="${palette.background}" font-weight="bold">${channelLabel}</text>
    <text x="60" y="770" font-family="Arial, sans-serif" font-size="14" fill="${palette.text}" opacity="0.6">Demo mode preview - no AI image generated</text>
  </svg>`;

  const base64 = Buffer.from(svg, "utf-8").toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

interface DemoCreative {
  headline: string;
  adCopy: string;
  socialCaption: string;
  newsletterBlurb: string;
  imagePrompt: string;
  creativeDirection: string;
}

const TONE_ADJECTIVES: Record<GenerateRequest["tone"], string[]> = {
  playful: ["fun", "colorful", "delightful"],
  premium: ["refined", "elevated", "exquisite"],
  bold: ["fearless", "striking", "unapologetic"],
  minimalist: ["clean", "simple", "purposeful"],
};

// Generates deterministic mock ad copy so the app works fully without an OpenAI API key
export function generateDemoCopy(input: GenerateRequest): DemoCreative {
  const adjectives = TONE_ADJECTIVES[input.tone];
  const channelLabel = CHANNEL_LABELS[input.channel];

  const headline = `${input.productName}: ${adjectives[0]} made for ${input.targetCustomer}`;
  const adCopy = `Meet ${input.productName} by ${input.brandName}. ${input.productDescription} Designed to be ${adjectives[1]} and built for ${input.targetCustomer}, it is the ${adjectives[2]} choice for your next ${channelLabel.toLowerCase()}.`;
  const socialCaption = `${input.productName} has entered the chat. ${adjectives[0]} vibes only. #${input.brandName.replace(/\s+/g, "")} #${input.productName.replace(/\s+/g, "")}`;
  const newsletterBlurb = `Introducing ${input.productName} from ${input.brandName}. ${input.productDescription} Crafted for ${input.targetCustomer} who want something ${adjectives[1]}.`;
  const imagePrompt = `A ${input.tone} product photo of ${input.productName} by ${input.brandName}, styled for ${channelLabel}, appealing to ${input.targetCustomer}.`;
  const creativeDirection = `Use a ${input.tone} visual style with ${adjectives.join(", ")} tones. Emphasize ${input.productName} as the hero subject, keep messaging focused on ${input.targetCustomer}, and format for ${channelLabel}.`;

  return { headline, adCopy, socialCaption, newsletterBlurb, imagePrompt, creativeDirection };
}
