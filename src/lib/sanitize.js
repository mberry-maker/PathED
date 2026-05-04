// Small utilities used across the wizard. Each function does one thing.

// Strip HTML tags and control chars from a parent's free-text input, then cap
// at 200 characters. Used at the prompt boundary so the AI never sees an
// unbounded string and so a parent typing markup does not break our output.
export function sanitizeFreeText(input) {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);
}

// Pragmatic email check, mirrored on the server. Not RFC-strict on purpose:
// strict regexes reject many real addresses and we want to be inviting.
export function isPlausibleEmail(s) {
  return typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

// Shared <img onError> handler: hide the broken element rather than show a
// browser default missing-image glyph. Pure function so the same identity
// is reused across renders.
export function hideOnError(e) {
  e.target.style.display = "none";
}
