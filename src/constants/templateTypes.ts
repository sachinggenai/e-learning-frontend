// Canonical template types and normalization utilities
// Maps legacy / variant type strings to canonical enum values

export type CanonicalTemplateType =
  | "welcome"
  | "content-text"
  | "content-video"
  | "mcq"
  | "summary"
  | "content-image"
  | "interactive";

const canonicalSet: Record<string, CanonicalTemplateType> = {
  welcome: "welcome",
  "content-text": "content-text",
  "content-video": "content-video",
  video: "content-video", // legacy
  text: "content-text",
  quiz: "mcq", // legacy
  mcq: "mcq",
  summary: "summary",
  "content-image": "content-image",
  image: "content-image",
  interactive: "interactive",
};

export function normalizeTemplateType(
  raw: string | undefined | null,
): CanonicalTemplateType {
  const key = (raw || "").toLowerCase().trim();
  return canonicalSet[key] || "content-text";
}

export const CANONICAL_TEMPLATE_TYPES: CanonicalTemplateType[] = [
  "welcome",
  "content-text",
  "content-video",
  "mcq",
  "summary",
  "content-image",
  "interactive",
];
