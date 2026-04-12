export function sanitizeText(value: unknown): string {
  const text = typeof value === "string" ? value : value == null ? "" : String(value);
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function toDomIdSegment(value: unknown): string {
  const base = typeof value === "string" ? value : value == null ? "" : String(value);
  const normalized = base.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
  return normalized.length > 0 ? normalized : "item";
}

/**
 * Export runtime assumes rich HTML fields were validated/sanitized upstream.
 * This helper only ensures a string return path for renderer composition.
 */
export function renderRichText(value: unknown): string {
  return typeof value === "string" ? value : "";
}
