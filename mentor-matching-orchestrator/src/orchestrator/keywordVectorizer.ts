import type { MentorProfile, MenteeProfile } from "../types/index.js";

const VOCAB_CAP = 512;
const MIN_TOKEN_LEN = 2;

/**
 * Build vocabulary from skills, desired_skills, and tokenized goalsText/bioText.
 * Same vocab is used for all vectors so cosine similarity is meaningful.
 */
export function buildVocabulary(
  mentors: MentorProfile[],
  mentees: MenteeProfile[]
): string[] {
  const terms = new Set<string>();

  for (const m of mentors) {
    for (const s of m.skills) {
      const t = s.toLowerCase().trim();
      if (t) terms.add(t);
    }
    if (m.bioText) {
      for (const t of tokenize(m.bioText)) terms.add(t);
    }
  }

  for (const m of mentees) {
    for (const s of m.desiredSkills) {
      const t = s.toLowerCase().trim();
      if (t) terms.add(t);
    }
    if (m.goalsText) {
      for (const t of tokenize(m.goalsText)) terms.add(t);
    }
  }

  const sorted = Array.from(terms).sort();
  const vocab = sorted.slice(0, VOCAB_CAP);
  if (vocab.length === 0) return ["_"];
  return vocab;
}

/**
 * Convert text to a vector of fixed length (vocab.length).
 * Binary: 1 if term appears (case-insensitive), else 0. Then L2-normalize.
 * Empty text returns zero vector.
 */
export function textToVector(text: string | null, vocab: string[]): number[] {
  const raw = new Array(vocab.length).fill(0);
  const t = (text ?? "").trim().toLowerCase();
  if (!t) return raw;

  for (let i = 0; i < vocab.length; i++) {
    if (t.includes(vocab[i])) raw[i] = 1;
  }

  const norm = Math.sqrt(raw.reduce((s, x) => s + x * x, 0));
  if (norm === 0) return raw;
  return raw.map((x) => x / norm);
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((s) => s.length >= MIN_TOKEN_LEN);
}
