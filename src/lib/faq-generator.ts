import crypto from "node:crypto";
import type { FaqSuggestion } from "@/lib/types";

const QUESTION_REGEX = /[^\n\r?!]{8,}[?!]/g;

function normalizeQuestion(question: string): string {
  return question
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s¿?]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildFaqSuggestions(rawContent: string): FaqSuggestion[] {
  const text = rawContent.slice(0, 300_000);
  const matches = text.match(QUESTION_REGEX) ?? [];

  const tally = new Map<
    string,
    { raw: string; count: number }
  >();

  for (const candidate of matches) {
    const cleaned = candidate.trim();
    if (cleaned.length < 10) {
      continue;
    }

    const normalized = normalizeQuestion(cleaned);
    if (!normalized) {
      continue;
    }

    const existing = tally.get(normalized);
    if (existing) {
      existing.count += 1;
      continue;
    }

    const question = cleaned.endsWith("?") || cleaned.endsWith("!")
      ? cleaned.replace(/!+$/g, "?")
      : `${cleaned}?`;

    tally.set(normalized, { raw: question, count: 1 });
  }

  return [...tally.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
    .map((entry) => ({
      id: crypto.randomUUID(),
      question: entry.raw,
      answer:
        "Respuesta sugerida: revisar esta consulta recurrente y definir un guion oficial para el agente.",
      count: entry.count,
      status: "pendiente",
    }));
}
