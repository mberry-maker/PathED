// Cap an AI-generated results object at 50KB before posting to the
// subscribe API. The server runs the same cap as a defensive layer; this
// runs first so an oversized payload never goes over the wire.
//
// The shape of the truncated output matches the email-template input:
// { ctaHeadline, ctaBody, sections: [...] }, with each long string clipped
// and each item array capped to a sensible count.

const SIZE_LIMIT = 50_000;

const clip = (v, n) =>
  typeof v === "string" && v.length > n ? v.slice(0, n - 1).trimEnd() + "..." : v;

export function truncateForUpload(results) {
  if (!results || typeof results !== "object") return results;
  const size = typeof Blob !== "undefined"
    ? new Blob([JSON.stringify(results)]).size
    : JSON.stringify(results).length;
  if (size <= SIZE_LIMIT) return results;

  const sections = Array.isArray(results.sections) ? results.sections : [];
  const compact = sections.slice(0, 6).map((s) => {
    const out = { title: clip(s.title, 120), type: s.type };
    if (s.type === "narrative") out.body = clip(s.body, 600);
    if (s.type === "headline_body") {
      out.headline = clip(s.headline, 200);
      out.body = clip(s.body, 600);
      if (s.callout) out.callout = clip(s.callout, 400);
    }
    if (s.type === "accommodations") {
      out.items = (s.items || []).slice(0, 5).map((a) => ({
        name: clip(a.name, 120),
        tag: a.tag,
        whyItHelps: clip(a.whyItHelps, 240),
        howToAskFor: clip(a.howToAskFor, 240),
        strengthenIt: clip(a.strengthenIt, 240),
      }));
    }
    if (s.type === "questions") {
      out.items = (s.items || []).slice(0, 5).map((q) => clip(q, 240));
    }
    if (s.type === "list_with_actions") {
      out.items = (s.items || []).slice(0, 4).map((t) => ({
        title: clip(t.title, 120),
        body: clip(t.body, 320),
      }));
    }
    return out;
  });

  return {
    ctaHeadline: clip(results.ctaHeadline, 160),
    ctaBody: clip(results.ctaBody, 480),
    sections: compact,
  };
}
