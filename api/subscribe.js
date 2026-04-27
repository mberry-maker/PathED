import { kv } from "@vercel/kv";

const RATE_LIMIT = 5;
const RATE_WINDOW = 3600;

const ALLOWED_ORIGINS = [
  "https://accommodatedpathways.com",
  "https://www.accommodatedpathways.com",
  "https://pathed.accommodatedpathways.com",
  "https://tool.accommodatedpathways.com",
];

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
    <p style="font-size:12px;color:rgba(255,255,255,0.6);margin:0;font-family:monospace;letter-spacing:0.05em;">AccommodatED Pathways · contact@accommodatedpathways.com</p>
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

function buildReeseNotification(branch, data, email) {
  const branchLabels = {
    exploring: "Exploring — no plan yet, real concerns",
    watching: "Watching — things slipping, not in crisis",
    inProcess: "In Process — currently in evaluation",
    implementing: "Implementing — has 504 or IEP",
  };
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>PathED Lead</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fafaf8;margin:0;padding:24px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e5e2dc;border-radius:8px;padding:28px;">
  <div style="background:#0a2540;border-radius:6px;padding:18px 20px;margin-bottom:20px;">
    <p style="color:#4ba8a4;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 4px;font-weight:600;">PathED Lead — Share Requested</p>
    <h2 style="color:#fff;font-size:20px;margin:0;">New profile ready to review</h2>
  </div>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px 0;border-bottom:1px solid #e5e2dc;font-size:13px;color:#6b7588;width:140px;">Email</td><td style="padding:10px 0;border-bottom:1px solid #e5e2dc;font-size:13px;color:#0f1419;font-weight:500;">${email}</td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #e5e2dc;font-size:13px;color:#6b7588;">Track</td><td style="padding:10px 0;border-bottom:1px solid #e5e2dc;font-size:13px;color:#0f1419;">${branchLabels[branch] || branch}</td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #e5e2dc;font-size:13px;color:#6b7588;">Grade</td><td style="padding:10px 0;border-bottom:1px solid #e5e2dc;font-size:13px;color:#0f1419;">${data.grade || "—"}</td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #e5e2dc;font-size:13px;color:#6b7588;">School stance</td><td style="padding:10px 0;border-bottom:1px solid #e5e2dc;font-size:13px;color:#0f1419;">${data.schoolStance || "—"}</td></tr>
    <tr><td style="padding:10px 0;font-size:13px;color:#6b7588;">What they need</td><td style="padding:10px 0;font-size:13px;color:#0f1419;">${data.feltNeed || "—"}</td></tr>
  </table>
  <div style="margin-top:20px;">
    <a href="https://www.accommodatedpathways.com/book-online" style="display:inline-block;background:#127572;color:#fff;padding:12px 22px;border-radius:4px;text-decoration:none;font-size:13px;font-weight:600;">View in MailerLite →</a>
  </div>
</div>
</body>
</html>`;
}

// ─── SEND VIA BREVO TRANSACTIONAL ─────────────────────────────────────────────
// Brevo (formerly Sendinblue) endpoint. Header is api-key (not Bearer), the
// payload uses "sender" instead of "from" and "htmlContent" instead of "html".
async function sendEmail({ to, subject, html, fromName = "AccommodatED Pathways" }) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { email: "contact@accommodatedpathways.com", name: fromName },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`Brevo send failed: ${res.status} ${err.slice(0, 400)}`);
  }
  return res.json().catch(() => ({}));
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
    const rateKey = `pathed:sub:${ip}`;
    const count = await kv.incr(rateKey);
    if (count === 1) await kv.expire(rateKey, RATE_WINDOW);
    if (count > RATE_LIMIT) {
      return res.status(429).json({ error: "Too many requests. Please try again later." });
    }
  } catch (e) {
    console.error("Rate limit error:", e?.message);
  }

  // Validate
  const { email, emailOptIn, shareWithReese, branch, results, data: profileData } = req.body || {};

  if (!email || typeof email !== "string" || !email.includes("@") || email.length > 254) {
    return res.status(400).json({ error: "Valid email required" });
  }

  const cleanEmail = email.toLowerCase().trim();

  // ── ADD TO BREVO LISTS ─────────────────────────────────────────────────────
  // updateEnabled: true upserts the contact. listIds is an array of integers
  // so parseInt the env vars defensively. Attribute keys are uppercase per
  // Brevo convention.
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

  // ── SEND PROFILE EMAIL TO PARENT ──────────────────────────────────────────
  if (results && emailOptIn) {
    try {
      const profileHTML = buildProfileEmail(results, branch, profileData || {});
      await sendEmail({
        to: cleanEmail,
        subject: "Your PathED Profile — AccommodatED Pathways",
        html: profileHTML,
      });
    } catch (e) {
      // Log but don't fail — subscriber is already added
      console.error("Profile email failed:", e?.message);
    }
  }

  // ── NOTIFY REESE ──────────────────────────────────────────────────────────
  if (shareWithReese) {
    try {
      const notifyHTML = buildReeseNotification(branch, profileData || {}, cleanEmail);
      await sendEmail({
        to: "contact@accommodatedpathways.com",
        subject: `PathED Lead — ${profileData?.grade || "Unknown grade"} · ${profileData?.feltNeed || ""}`,
        html: notifyHTML,
      });
    } catch (e) {
      console.error("Reese notification failed:", e?.message);
    }
  }

  return res.status(200).json({ success: true });
}
