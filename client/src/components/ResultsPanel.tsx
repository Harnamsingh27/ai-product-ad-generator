import type { Generation } from "../types";
import CopyButton from "./CopyButton";

interface ResultsPanelProps {
  generation: Generation | null;
  isLoading: boolean;
  error: string | null;
}

export default function ResultsPanel({ generation, isLoading, error }: ResultsPanelProps) {
  if (isLoading) {
    return (
      <div className="card results-panel">
        <div className="loading-state">Generating your ad creative...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card results-panel">
        <div className="error-state">{error}</div>
      </div>
    );
  }

  if (!generation) {
    return (
      <div className="card results-panel">
        <div className="empty-state">
          Fill out the form and generate your first ad creative to see results here.
        </div>
      </div>
    );
  }

  return (
    <div className="card results-panel">
      <h2>Generated creative</h2>

      {generation.generatedImage && (
        <img className="generated-image" src={generation.generatedImage} alt={generation.productName} />
      )}

      <div className="result-block">
        <div className="result-block-header">
          <h3>Headline</h3>
          <CopyButton text={generation.headline} />
        </div>
        <p>{generation.headline}</p>
      </div>

      <div className="result-block">
        <div className="result-block-header">
          <h3>Ad copy</h3>
          <CopyButton text={generation.adCopy} />
        </div>
        <p>{generation.adCopy}</p>
      </div>

      <div className="result-block">
        <div className="result-block-header">
          <h3>Social caption</h3>
          <CopyButton text={generation.socialCaption} />
        </div>
        <p>{generation.socialCaption}</p>
      </div>

      <div className="result-block">
        <div className="result-block-header">
          <h3>Newsletter blurb</h3>
          <CopyButton text={generation.newsletterBlurb} />
        </div>
        <p>{generation.newsletterBlurb}</p>
      </div>

      <div className="result-block">
        <div className="result-block-header">
          <h3>Image prompt</h3>
          <CopyButton text={generation.imagePrompt} />
        </div>
        <p>{generation.imagePrompt}</p>
      </div>

      <div className="result-block">
        <div className="result-block-header">
          <h3>Creative direction</h3>
          <CopyButton text={generation.creativeDirection} />
        </div>
        <p>{generation.creativeDirection}</p>
      </div>
    </div>
  );
}
