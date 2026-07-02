import { useState } from "react";
import type { Channel, GenerationFormValues, Tone } from "../types";

const TONE_OPTIONS: { value: Tone; label: string }[] = [
  { value: "playful", label: "Playful" },
  { value: "premium", label: "Premium" },
  { value: "bold", label: "Bold" },
  { value: "minimalist", label: "Minimalist" },
];

const CHANNEL_OPTIONS: { value: Channel; label: string }[] = [
  { value: "instagram_ad", label: "Instagram Ad" },
  { value: "newsletter", label: "Newsletter" },
  { value: "product_photo", label: "Product Photo" },
  { value: "social_post", label: "Social Post" },
];

const EMPTY_FORM: GenerationFormValues = {
  brandName: "",
  productName: "",
  productDescription: "",
  targetCustomer: "",
  tone: "playful",
  channel: "instagram_ad",
  imageUrl: "",
};

interface GenerationFormProps {
  onSubmit: (values: GenerationFormValues) => void;
  isLoading: boolean;
}

export default function GenerationForm({ onSubmit, isLoading }: GenerationFormProps) {
  const [values, setValues] = useState<GenerationFormValues>(EMPTY_FORM);

  function updateField<K extends keyof GenerationFormValues>(field: K, value: GenerationFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <form className="card generation-form" onSubmit={handleSubmit}>
      <h2>Create your ad</h2>

      <label className="field">
        <span>Brand name</span>
        <input
          type="text"
          value={values.brandName}
          onChange={(e) => updateField("brandName", e.target.value)}
          placeholder="e.g. Northwind Coffee"
          required
        />
      </label>

      <label className="field">
        <span>Product name</span>
        <input
          type="text"
          value={values.productName}
          onChange={(e) => updateField("productName", e.target.value)}
          placeholder="e.g. Cold Brew Concentrate"
          required
        />
      </label>

      <label className="field">
        <span>Product description</span>
        <textarea
          value={values.productDescription}
          onChange={(e) => updateField("productDescription", e.target.value)}
          placeholder="Describe what makes this product great"
          rows={3}
          required
        />
      </label>

      <label className="field">
        <span>Target customer</span>
        <input
          type="text"
          value={values.targetCustomer}
          onChange={(e) => updateField("targetCustomer", e.target.value)}
          placeholder="e.g. busy professionals who love coffee"
          required
        />
      </label>

      <div className="field-row">
        <label className="field">
          <span>Tone</span>
          <select value={values.tone} onChange={(e) => updateField("tone", e.target.value as Tone)}>
            {TONE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Channel</span>
          <select value={values.channel} onChange={(e) => updateField("channel", e.target.value as Channel)}>
            {CHANNEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field">
        <span>Product image URL (optional)</span>
        <input
          type="url"
          value={values.imageUrl}
          onChange={(e) => updateField("imageUrl", e.target.value)}
          placeholder="https://example.com/product.jpg"
        />
      </label>

      <button type="submit" className="primary-button" disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate ad creative"}
      </button>
    </form>
  );
}
