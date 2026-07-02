import type { GenerateResponse, Generation, GenerationFormValues } from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(body.error || "Request failed");
  }
  return response.json() as Promise<T>;
}

export async function fetchStatus(): Promise<{ demoMode: boolean }> {
  const response = await fetch(`${API_URL}/api/status`);
  return handleResponse(response);
}

export async function generateAd(values: GenerationFormValues): Promise<GenerateResponse> {
  const response = await fetch(`${API_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  return handleResponse(response);
}

export async function fetchGenerations(): Promise<{ generations: Generation[] }> {
  const response = await fetch(`${API_URL}/api/generations`);
  return handleResponse(response);
}

export async function deleteGeneration(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/generations/${id}`, {
    method: "DELETE",
  });
  if (!response.ok && response.status !== 204) {
    const body = await response.json().catch(() => ({ error: "Failed to delete generation" }));
    throw new Error(body.error || "Failed to delete generation");
  }
}
