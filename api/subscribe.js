import { Redis } from "@upstash/redis";

// See api/generate.js for the why behind getRedis().
let _redis = null;
function getRedis() {
  if (_redis) return _redis;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  _redis = Redis.fromEnv();
  return _redis;
}

const RATE_LIMIT = 5;
const RATE_WINDOW = 3600;

const ALLOWED_ORIGINS = [
  "https://accommodatedpathways.com",
  "https://www.accommodatedpathways.com",
  "https://pathed.accommodatedpathways.com",
  "https://tool.accommodatedpathways.com",
];

// ─── TRUNCATION HELPER ───────────────────────────────────────────────────────
// If the results payload exceeds 50KB, build a compact version that still has
// the shape the email template expects: ctaHeadline, ctaBody, sections array.
// Each section keeps its title and a clipped body / item list.
function clip(value, n = 600) {
  if (typeof value !== "string") return value;
  return value.length > n ? value.slice(0, n - 1).trimEnd() + "..." : value;
}

function truncateResults(results) {
  if (!results || typeof results !== "object") return null;
  const sections = Array.isArray(results.sections) ? results.sections : [];
  const compactSections = sections.slice(0, 6).map((s) => {
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
    sections: compactSections,
  };
}

// ─── EMAIL BUILDER ────────────────────────────────────────────────────────────
function buildProfileEmail(results, branch, data) {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  const branchLabels = {
    exploring: "Exploring",
    watching: "Watching",
    inProcess: "In Process",
    implementing: "Implementing",
  };

  const sectionHTML = (results.sections || []).map((section, i) => {
    const num = String(i + 1).padStart(2, "0");

    let bodyHTML = "";

    if (section.type === "narrative") {
      bodyHTML = `<p style="font-size:16px;line-height:1.75;color:#27303f;margin:0;">${section.body}</p>`;
    }

    if (section.type === "headline_body") {
      bodyHTML = `
        <p style="font-size:18px;font-weight:600;color:#0a2540;margin:0 0 14px;">${section.headline}</p>
        <p style="font-size:14px;line-height:1.75;color:#27303f;margin:0 0 14px;">${section.body}</p>
        ${section.callout ? `<div style="padding:14px 18px;background:#e6f1f0;border-left:3px solid #127572;font-size:14px;line-height:1.7;color:#27303f;border-radius:0 4px 4px 0;">${section.callout}</div>` : ""}
      `;
    }

    if (section.type === "accommodations") {
      bodyHTML = (section.items || []).map(a => `
        <div style="padding:18px 20px;background:#fff;border:1px solid #e5e2dc;border-radius:5px;margin-bottom:14px;">
          <p style="font-size:16px;font-weight:700;color:#0a2540;margin:0 0 12px;">${a.name}${a.tag ? `<span style="margin-left:10px;font-size:10px;font-weight:600;background:${a.tag === "STRENGTHEN" ? "#fef3c7" : "#e6f1f0"};color:${a.tag === "STRENGTHEN" ? "#92400e" : "#127572"};padding:2px 7px;border-radius:2px;text-transform:uppercase;letter-spacing:0.08em;vertical-align:middle;">${a.tag}</span>` : ""}</p>
          <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#127572;font-weight:600;margin:0 0 3px;">Why it helps</p>
          <p style="font-size:13px;line-height:1.6;color:#27303f;margin:0 0 10px;">${a.whyItHelps}</p>
          <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#127572;font-weight:600;margin:0 0 3px;">How to ask for it</p>
          <p style="font-size:13px;line-height:1.6;color:#27303f;font-style:italic;margin:0 0 10px;">${a.howToAskFor}</p>
          <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#127572;font-weight:600;margin:0 0 3px;">How families strengthen it</p>
          <p style="font-size:13px;line-height:1.6;color:#27303f;margin:0;">${a.strengthenIt}</p>
        </div>
      `).join("");
    }

    if (section.type === "questions") {
      bodyHTML = (section.items || []).map((q, qi) => `
        <div style="display:flex;gap:14px;padding-bottom:12px;border-bottom:${qi < section.items.length - 1 ? "1px solid #e5e2dc" : "none"};margin-bottom:${qi < section.items.length - 1 ? "12px" : "0"};">
          <span style="font-size:18px;color:#127572;font-weight:600;flex-shrink:0;width:28px;">${String(qi + 1).padStart(2, "0")}</span>
          <p style="font-size:14px;line-height:1.6;color:#27303f;margin:0;">${q}</p>
        </div>
      `).join("");
    }

    if (section.type === "list_with_actions") {
      bodyHTML = (section.items || []).map(t => `
        <div style="padding-left:14px;border-left:2px solid #127572;margin-bottom:16px;">
          <p style="font-size:15px;font-weight:600;color:#0a2540;margin:0 0 5px;">${t.title}</p>
          <p style="font-size:13px;line-height:1.65;color:#27303f;margin:0;">${t.body}</p>
        </div>
      `).join("");
    }

    return `
      <div style="margin-bottom:36px;">
        <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:14px;">
          <span style="font-size:12px;color:#127572;font-weight:600;font-family:monospace;">${num}</span>
          <h3 style="font-size:20px;font-weight:700;color:#0a2540;margin:0;line-height:1.25;">${section.title}</h3>
        </div>
        ${bodyHTML}
      </div>
    `;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your PathED Profile</title>
</head>
<body style="margin:0;padding:0;background:#fafaf8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:680px;margin:0 auto;padding:24px 16px 48px;">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#0a2540 0%,#127572 100%);border-radius:8px;padding:32px;margin-bottom:24px;">
    <p style="font-size:11px;letter-spacing:0.2em;color:#4ba8a4;text-transform:uppercase;font-weight:600;margin:0 0 10px;">PathED Profile · ${branchLabels[branch] || "General"} Track</p>
    <h1 style="font-size:26px;font-weight:700;color:#fff;margin:0 0 6px;letter-spacing:-0.02em;">Generated ${today}</h1>
    <p style="font-size:12px;color:rgba(255,255,255,0.6);margin:0;font-family:monospace;letter-spacing:0.05em;">AccommodatED Pathways · Progress, Made Personal · contact@accommodatedpathways.com</p>
  </div>

  <!-- Safeguard -->
  <div style="background:#f5f0e3;border:1px solid #e5dfd2;border-radius:4px;padding:14px 18px;font-size:12px;line-height:1.65;color:#6b7588;margin-bottom:32px;">
    <strong style="color:#1a1f2e;font-weight:600;">A note before you read.</strong> PathED is an informational tool. It does not provide clinical assessments, diagnoses, or legal determinations. For your rights as a parent, review your district's Procedural Safeguards Notice. Texas families: <a href="https://tea.texas.gov" style="color:#127572;font-weight:500;">TEA.gov</a>. Outside Texas: <a href="https://sites.ed.gov/idea" style="color:#127572;font-weight:500;">IDEA federal guidelines</a>.
  </div>

  <!-- Profile Sections -->
  <div style="background:#fff;border:1px solid #e5e2dc;border-radius:8px;padding:28px;margin-bottom:24px;">
    ${sectionHTML}
  </div>

  <!-- CTA -->
  <div style="background:#0a2540;border-radius:8px;padding:32px;margin-bottom:24px;">
    <p style="font-size:11px;letter-spacing:0.2em;color:#4ba8a4;text-transform:uppercase;font-weight:600;margin:0 0 14px;font-family:monospace;">Your next step</p>
    <h2 style="font-size:22px;font-weight:700;color:#fff;margin:0 0 12px;line-height:1.25;">${results.ctaHeadline || "Let's take this further."}</h2>
    <p style="font-size:14px;line-height:1.65;color:rgba(255,255,255,0.9);margin:0 0 22px;">${results.ctaBody || ""}</p>
    <a href="https://www.accommodatedpathways.com/book-online" style="display:inline-block;background:#127572;color:#fff;padding:13px 26px;border-radius:4px;text-decoration:none;font-size:13px;font-weight:600;letter-spacing:0.02em;">Book a session →</a>
  </div>

  <!-- Footer -->
  <div style="text-align:center;padding-top:20px;border-top:1px solid #e5e2dc;">
    <p style="font-size:12px;color:#9099a8;margin:0 0 6px;">AccommodatED Pathways · DFW, Texas · Virtual services available nationally</p>
    <p style="font-size:12px;color:#9099a8;margin:0;"><a href="https://www.accommodatedpathways.com" style="color:#127572;">accommodatedpathways.com</a></p>
  </div>

</div>
</body>
</html>`;
}

function escapeHtml(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label, value) {
  const display = value == null || value === "" ? "(not answered)" : value;
  const isMuted = value == null || value === "";
  return `<tr>
    <td style="padding:10px 14px 10px 0;border-bottom:1px solid #e5e2dc;font-size:12px;color:#6b7588;width:160px;vertical-align:top;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;">${escapeHtml(label)}</td>
    <td style="padding:10px 0;border-bottom:1px solid #e5e2dc;font-size:13.5px;color:${isMuted ? "#9099a8" : "#0f1419"};font-weight:${isMuted ? 400 : 500};line-height:1.55;">${escapeHtml(display)}</td>
  </tr>`;
}

function buildReeseNotification(branch, data, email, profileHTML) {
  const branchLabels = {
    exploring: "Exploring · no plan yet, real concerns",
    watching: "Watching · things slipping, not in crisis",
    inProcess: "In Process · currently in evaluation",
    implementing: "Implementing · has 504 or IEP",
  };

  const struggleSummary = (() => {
    const map = data.struggleSpecifics || {};
    const lines = Object.entries(map)
      .filter(([, items]) => Array.isArray(items) && items.length)
      .map(([cat, items]) => `${cat}: ${items.join(", ")}`);
    return lines.join(" • ");
  })();

  const list = (arr) =>
    Array.isArray(arr) && arr.length ? arr.join(", ") : "";

  // Branch-aware fields, only show what was actually asked.
  const branchSpecificRows = [];
  if (branch === "watching") {
    branchSpecificRows.push(row("Teacher feedback", data.teacherFeedback));
    branchSpecificRows.push(row("Already tried", list(data.triedAlready)));
  }
  if (branch === "inProcess") {
    branchSpecificRows.push(row("Process stage", data.processStage));
    branchSpecificRows.push(row("Process concerns", list(data.processConcerns)));
  }
  if (branch === "implementing") {
    branchSpecificRows.push(row("Plan type", data.planType));
    branchSpecificRows.push(row("Plan in place for", data.planHistory));
    branchSpecificRows.push(row("Current accommodations", list(data.currentAccommodations)));
    branchSpecificRows.push(row("Plan effectiveness", data.accommodationsWorking));
    branchSpecificRows.push(row("School follows plan", data.schoolFollowsPlan));
    branchSpecificRows.push(row("Last review", data.lastReview));
    branchSpecificRows.push(row("New concerns", data.newConcerns));
  }

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>PathED Lead</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fafaf8;margin:0;padding:24px;color:#0f1419;">
<div style="max-width:680px;margin:0 auto;background:#fff;border:1px solid #e5e2dc;border-radius:10px;padding:32px;">

  <div style="background:linear-gradient(135deg,#0a2540 0%,#127572 130%);border-radius:8px;padding:22px 24px;margin-bottom:24px;">
    <p style="color:#4ba8a4;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;margin:0 0 6px;font-weight:700;">PathED Lead · Share Requested</p>
    <h2 style="color:#fff;font-size:22px;margin:0 0 4px;font-weight:700;letter-spacing:-0.01em;">${escapeHtml(email)}</h2>
    <p style="color:rgba(255,255,255,0.7);font-size:12.5px;margin:0;">${escapeHtml(branchLabels[branch] || branch)}</p>
  </div>

  <p style="font-size:13px;color:#6b7588;line-height:1.6;margin:0 0 20px;">
    The parent below opted to share their PathED profile with you. The full
    parent-facing email is embedded at the bottom of this message. Reply
    directly to <strong style="color:#0f1419;">${escapeHtml(email)}</strong>
    to follow up.
  </p>

  <h3 style="font-size:13px;font-weight:700;color:#0a2540;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.1em;">Their responses</h3>
  <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
    ${row("Email", email)}
    ${row("Track", branchLabels[branch] || branch)}
    ${row("Grade", data.grade)}
    ${row("What they need", data.feltNeed)}
    ${row("Familiarity", data.familiarity)}
    ${row("Diagnoses", list(data.diagnoses) + (data.diagnosisOther ? ` (other: ${data.diagnosisOther})` : ""))}
    ${row("Struggle areas", list(data.struggleCategories))}
    ${row("Specifics", struggleSummary)}
    ${row("Struggle note", data.struggleOther)}
    ${row("School stance", data.schoolStance)}
    ${row("Monitoring duration", data.monitoringDuration)}
    ${row("Documentation", data.documented)}
    ${row("History length", data.history)}
    ${row("Outside evaluation", data.privateEval)}
    ${row("School relationship", data.schoolRelationship)}
    ${branchSpecificRows.join("\n")}
  </table>

  <h3 style="font-size:13px;font-weight:700;color:#0a2540;margin:32px 0 12px;text-transform:uppercase;letter-spacing:0.1em;border-top:1px solid #e5e2dc;padding-top:24px;">The profile they received</h3>
  <p style="font-size:12px;color:#6b7588;line-height:1.6;margin:0 0 16px;font-style:italic;">
    A copy of the email sent to the parent is below. It is the same content
    they have, formatted for review.
  </p>
  <div style="border:1px solid #e5e2dc;border-radius:8px;padding:6px;background:#fafaf8;">
    ${profileHTML || '<p style="padding:18px;font-size:13px;color:#9099a8;margin:0;">The parent did not opt in to receive the email, so no copy is embedded here.</p>'}
  </div>

</div>
</body>
</html>`;
}

// ─── HTML to plain text helper used for the textContent fallback ─────────────
function htmlToText(html) {
  return String(html)
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ─── SEND VIA BREVO TRANSACTIONAL ─────────────────────────────────────────────
// Brevo (formerly Sendinblue) is the new transactional sender. Endpoint
// https://api.brevo.com/v3/smtp/email, header api-key: <BREVO_API_KEY>, with
// "sender" in place of "from" and "htmlContent" in place of "html".
async function sendEmail({ to, subject, html, fromName = "AccommodatED Pathways", replyTo }) {
  const token = process.env.BREVO_API_KEY;
  if (!token) {
    throw new Error("Missing BREVO_API_KEY");
  }

  const payload = {
    sender: { email: "contact@accommodatedpathways.com", name: fromName },
    to: [{ email: to, name: to.split("@")[0] }],
    subject,
    htmlContent: html,
    textContent: htmlToText(html),
  };
  if (replyTo) {
    payload.replyTo = { email: replyTo };
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "api-key": token,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    // Log the full body so the failure mode is visible in Vercel function logs.
    // Common cases: 401 (bad/missing key), 400 (validation error), 403
    // (sender domain not authenticated), 429 (rate limit).
    console.error(
      `Brevo ${res.status} sending to ${to}: ${errText.slice(0, 800)}`
    );
    const err = new Error(`Brevo ${res.status}`);
    err.status = res.status;
    err.body = errText;
    throw err;
  }

  // Brevo returns 201 Created with { messageId } on success.
  return { ok: true, status: res.status };
}

// ─── HANDLER ─────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  const origin = req.headers.origin;
  const isDev = process.env.NODE_ENV !== "production";
  const isAllowed = ALLOWED_ORIGINS.includes(origin) || isDev || (origin && origin.endsWith(".vercel.app"));
  if (isAllowed && origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!req.headers["content-type"]?.includes("application/json")) {
    return res.status(415).json({ error: "Content-Type must be application/json" });
  }

  // Rate limiting
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || "unknown";
  try {
    const redis = getRedis();
    if (redis) {
      const rateKey = `pathed:sub:${ip}`;
      const count = await redis.incr(rateKey);
      if (count === 1) await redis.expire(rateKey, RATE_WINDOW);
      if (count > RATE_LIMIT) {
        return res.status(429).json({ error: "Too many requests. Please try again later." });
      }
    }
  } catch (e) {
    console.error("Rate limit error:", e?.message);
  }

  // Validate
  const {
    email,
    emailOptIn,
    shareWithReese,
    branch,
    results,
    data: profileData,
    website, // honeypot, real users leave this empty
  } = req.body || {};

  // Honeypot, fail silently. Bots fill hidden fields, real users do not.
  if (typeof website === "string" && website.trim().length > 0) {
    console.warn("Honeypot tripped, dropping submission silently from", ip);
    return res.status(200).json({ success: true });
  }

  if (!email || typeof email !== "string" || !email.includes("@") || email.length > 254) {
    return res.status(400).json({ error: "Valid email required" });
  }

  const cleanEmail = email.toLowerCase().trim();

  // Cap the inbound results object at 50KB. If a bigger object arrives (corrupt
  // client, malicious payload, or model output that ballooned), build a compact
  // summary that still contains the structural pieces the email template needs.
  const RESULTS_LIMIT = 50 * 1024;
  let safeResults = results;
  try {
    const size = Buffer.byteLength(JSON.stringify(results || {}), "utf8");
    if (size > RESULTS_LIMIT) {
      console.warn(`Results payload ${size} bytes exceeded ${RESULTS_LIMIT}, sending truncated summary`);
      safeResults = truncateResults(results);
    }
  } catch (e) {
    console.error("Results size check failed:", e?.message);
    safeResults = null;
  }

  // ── ADD TO BREVO LISTS ─────────────────────────────────────────────────────
  // Brevo's contact endpoint upserts: pass updateEnabled: true and the same
  // email is updated rather than rejected as duplicate. listIds is an array
  // of integers so we parseInt the env-var values defensively.
  if (emailOptIn || shareWithReese) {
    const listIds = [];
    if (emailOptIn) {
      const id = parseInt(process.env.BREVO_LIST_ID, 10);
      if (!Number.isNaN(id)) listIds.push(id);
    }
    if (shareWithReese) {
      const id = parseInt(process.env.BREVO_SHARE_LIST_ID, 10);
      if (!Number.isNaN(id)) listIds.push(id);
    }

    try {
      const brevoRes = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          email: cleanEmail,
          updateEnabled: true,
          listIds,
          attributes: {
            PATHED_BRANCH:        branch                    || "",
            PATHED_FELT_NEED:     profileData?.feltNeed     || "",
            PATHED_GRADE:         profileData?.grade        || "",
            PATHED_SCHOOL_STANCE: profileData?.schoolStance || "",
            PATHED_SHARE_REESE:   shareWithReese ? "yes" : "no",
          },
        }),
      });
      if (!brevoRes.ok) {
        const err = await brevoRes.json().catch(() => ({}));
        console.error("Brevo contact error:", brevoRes.status, err);
      }
    } catch (e) {
      console.error("Brevo contact add failed:", e?.message);
    }
  }

  // Build the parent-facing profile HTML once. The same body is used for the
  // parent's email and embedded inside Reese's notification so she can review
  // exactly what the parent received.
  const profileHTML = safeResults
    ? buildProfileEmail(safeResults, branch, profileData || {})
    : null;

  // ── SEND PROFILE EMAIL TO PARENT ──────────────────────────────────────────
  let profileEmailStatus = "skipped";
  let profileEmailError = null;
  if (profileHTML && emailOptIn) {
    try {
      await sendEmail({
        to: cleanEmail,
        subject: "Your PathED Profile from AccommodatED Pathways",
        html: profileHTML,
      });
      profileEmailStatus = "sent";
    } catch (e) {
      profileEmailStatus = "failed";
      // Surface a short, non-leaky reason to the client. Full body is in logs.
      if (e?.status === 401) profileEmailError = "auth";
      else if (e?.status === 403) profileEmailError = "domain_unverified";
      else if (e?.status === 422) profileEmailError = "trial_recipient_blocked";
      else if (e?.status === 429) profileEmailError = "rate_limited";
      else profileEmailError = "send_failed";
      console.error("Profile email failed:", e?.message);
    }
  }

  // ── NOTIFY REESE ──────────────────────────────────────────────────────────
  // Always carry the profile HTML and the full responses, regardless of
  // whether the parent opted in to receive their own copy. Reply-To is set so
  // hitting reply in Gmail goes straight to the parent.
  let notifyStatus = "skipped";
  if (shareWithReese) {
    try {
      const notifyHTML = buildReeseNotification(
        branch,
        profileData || {},
        cleanEmail,
        profileHTML
      );
      await sendEmail({
        to: "contact@accommodatedpathways.com",
        subject: `PathED Lead · ${profileData?.grade || "Unknown grade"} · ${profileData?.feltNeed || ""}`,
        html: notifyHTML,
        replyTo: cleanEmail,
      });
      notifyStatus = "sent";
    } catch (e) {
      notifyStatus = "failed";
      console.error("Reese notification failed:", e?.message);
    }
  }

  return res.status(200).json({
    success: true,
    profileEmail: profileEmailStatus,
    profileEmailError,
    reeseNotification: notifyStatus,
  });
}
