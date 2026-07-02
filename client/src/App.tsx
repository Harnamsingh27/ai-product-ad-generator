import { useEffect, useState } from "react";
import GenerationForm from "./components/GenerationForm";
import ResultsPanel from "./components/ResultsPanel";
import HistorySidebar from "./components/HistorySidebar";
import DemoBanner from "./components/DemoBanner";
import { deleteGeneration, fetchGenerations, fetchStatus, generateAd } from "./api";
import type { Generation, GenerationFormValues } from "./types";

export default function App() {
  const [demoMode, setDemoMode] = useState(false);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [activeGeneration, setActiveGeneration] = useState<Generation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus()
      .then((status) => setDemoMode(status.demoMode))
      .catch(() => setDemoMode(false));

    fetchGenerations()
      .then((data) => setGenerations(data.generations))
      .catch(() => {
        // History failing to load is non-fatal, the form still works
      });
  }, []);

  async function handleGenerate(values: GenerationFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateAd(values);
      setActiveGeneration(result.generation);
      setDemoMode(result.demoMode);
      setGenerations((prev) => [result.generation, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate ad creative");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteGeneration(id);
      setGenerations((prev) => prev.filter((g) => g.id !== id));
      if (activeGeneration?.id === id) {
        setActiveGeneration(null);
      }
    } catch {
      // Deletion failures are non-critical, the item simply remains in the list
    }
  }

  async function handleClearAll() {
    await Promise.all(generations.map((g) => deleteGeneration(g.id).catch(() => undefined)));
    setGenerations([]);
    setActiveGeneration(null);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Product Ad Generator</h1>
        <p>
          Turn a few product details into ready-to-use marketing creative: headlines, ad copy,
          social captions, and a matching image, generated in seconds.
        </p>
      </header>

      {demoMode && <DemoBanner />}

      <main className="app-layout">
        <div className="app-column">
          <GenerationForm onSubmit={handleGenerate} isLoading={isLoading} />
        </div>

        <div className="app-column">
          <ResultsPanel generation={activeGeneration} isLoading={isLoading} error={error} />
        </div>

        <div className="app-column">
          <HistorySidebar
            generations={generations}
            selectedId={activeGeneration?.id ?? null}
            onSelect={setActiveGeneration}
            onDelete={handleDelete}
            onClearAll={handleClearAll}
          />
        </div>
      </main>
    </div>
  );
}
