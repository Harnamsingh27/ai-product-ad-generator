import { useState } from "react";

interface CopyButtonProps {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can fail in some browser contexts, fail silently
    }
  }

  return (
    <button type="button" className="copy-button" onClick={handleCopy}>
      {copied ? "Copied" : label}
    </button>
  );
}
