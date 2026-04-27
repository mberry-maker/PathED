import React, { useState, useEffect } from "react";

// ============ FONTS ============
const FontStyles = () => (
  <style>{`
    * { font-family: 'Geist', system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
    .mono { font-family: 'Geist Mono', 'Courier New', monospace; font-feature-settings: "ss01"; letter-spacing: -0.01em; }
    .num { font-family: 'Geist Mono', monospace; font-variant-numeric: tabular-nums; }
    .fade-in { animation: fadeIn 0.4s ease-out; }
    .slide-down { animation: slideDown 0.3s ease-out; }
    .stagger-1 { animation: fadeIn 0.5s ease-out 0.05s both; }
    .stagger-2 { animation: fadeIn 0.5s ease-out 0.1s both; }
    .stagger-3 { animation: fadeIn 0.5s ease-out 0.15s both; }
    .stagger-4 { animation: fadeIn 0.5s ease-out 0.2s both; }
    .stagger-5 { animation: fadeIn 0.5s ease-out 0.25s both; }
    .stagger-6 { animation: fadeIn 0.5s ease-out 0.3s both; }
    .stagger-7 { animation: fadeIn 0.5s ease-out 0.35s both; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideDown { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 600px; } }
    @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
    .pulse-1 { animation: pulse 1.4s ease-in-out infinite; }
    .pulse-2 { animation: pulse 1.4s ease-in-out 0.2s infinite; }
    .pulse-3 { animation: pulse 1.4s ease-in-out 0.4s infinite; }
    button, [role="button"] { transition: transform 0.18s cubic-bezier(.2,.7,.2,1), box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease, color 0.18s ease; }
    a { color: inherit; }
    .opt-btn:not(.is-sel):hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(10, 37, 64, 0.06); border-color: #127572 !important; }
    .opt-btn.is-sel { box-shadow: 0 8px 22px rgba(18, 117, 114, 0.22); transform: translateY(-1px); }
    .branch-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(10, 37, 64, 0.08); }
    .acc-card:hover { box-shadow: 0 6px 18px rgba(10, 37, 64, 0.07); }
    .tap { min-height: 48px; }
    .mobile-cta-bar { display: none; }
    .print-only { display: none; }
    @media print {
      @page { margin: 0.5in; }
      html, body { background: #fff !important; }
      .no-print, .topbar, .mobile-cta-bar, .email-capture, .footer-actions { display: none !important; }
      .print-only { display: block !important; }
      .container-wrap { padding: 0 !important; max-width: 100% !important; }
      .results-header {
        background: #fff !important;
        color: #0a2540 !important;
        border: 1.5px solid #0a2540 !important;
        border-radius: 8px !important;
        box-shadow: none !important;
        padding: 22px 26px !important;
        page-break-inside: avoid;
      }
      .results-header .gen-date { color: #0a2540 !important; }
      .results-header .mono { color: #127572 !important; }
      .cta-block {
        background: #fff !important;
        color: #0a2540 !important;
        border: 1.5px solid #0a2540 !important;
        border-radius: 8px !important;
        box-shadow: none !important;
        padding: 24px 26px !important;
      }
      .cta-block .cta-headline { color: #0a2540 !important; }
      .cta-block p { color: #27303f !important; opacity: 1 !important; }
      .cta-block .mono { color: #127572 !important; }
      .cta-block .book-this { background: #fff !important; color: #0a2540 !important; border: 1.5px solid #0a2540 !important; box-shadow: none !important; }
      .cta-block { color-adjust: exact; -webkit-print-color-adjust: exact; }
      h1, h2, h3 { page-break-after: avoid; }
      .acc-card, .first-section, .first-section + div { page-break-inside: avoid; }
      .acc-card { box-shadow: none !important; }
      a { color: #0a2540 !important; text-decoration: underline !important; }
      .stagger-1, .stagger-2, .stagger-3, .stagger-4, .stagger-5, .stagger-6, .stagger-7 { animation: none !important; }
    }
    @media (max-width: 600px) {
      .tb-sub { display: none !important; }
      .tb-progress { width: 56px !important; }
      .first-section h3 { font-size: 22px !important; }
      .cta-headline { font-size: 24px !important; }
      .results-header { padding: 28px 22px !important; }
      .results-header h1, .results-header .gen-date { font-size: 24px !important; }
      .cta-block { padding: 36px 24px !important; border-radius: 12px !important; }
      .cta-block .book-this { width: 100%; text-align: center; }
      .acc-card { padding: 22px 22px 22px 26px !important; }
      .branch-btn { padding: 20px 20px !important; }
      .container-wrap { padding: 28px 18px 140px !important; }
      .mobile-cta-bar.show {
        display: flex;
        position: fixed;
        left: 0; right: 0; bottom: 0;
        z-index: 50;
        padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
        background: rgba(10, 37, 64, 0.96);
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
        gap: 12px;
        align-items: center;
        border-top: 1px solid rgba(255,255,255,0.08);
      }
    }
  `}</style>
);

// ============ DESIGN TOKENS ============
const C = {
  navy: "#0a2540",
  navyDark: "#06182d",
  teal: "#127572",
  tealLight: "#1d918d",
  tealSoft: "#e6f1f0",
  bg: "#fafaf8",
  bgAlt: "#f3f1ec",
  surface: "#ffffff",
  ink: "#0f1419",
  text: "#27303f",
  muted: "#6b7588",
  mutedLight: "#9099a8",
  border: "#e5e2dc",
  borderStrong: "#cdc9bf",
  warning: "#92400e",
  warningSoft: "#fef3c7",
  success: "#166534",
  successSoft: "#dcfce7",
};

// ============ SHARED CONSTANTS ============
const GRADES = [
  "Pre-K or Kindergarten",
  "1st – 2nd grade",
  "3rd – 5th grade",
  "6th – 8th grade",
  "9th – 12th grade",
];

// Two-layer struggles taxonomy used by Branches A, C, D
const STRUGGLES_FULL = [
  {
    cat: "Academic performance",
    items: [
      "Grades have dropped recently",
      "Failing one or more classes",
      "Struggling but currently passing",
      "Inconsistent — does well sometimes, not others",
      "Falling behind grade-level standards",
    ],
  },
  {
    cat: "Reading",
    items: [
      "Decoding (sounding out words)",
      "Reading fluency / pace",
      "Reading comprehension",
      "Avoids reading aloud",
      "Can't keep up with assigned reading",
    ],
  },
  {
    cat: "Writing",
    items: [
      "Handwriting (legibility, fatigue)",
      "Getting ideas onto the page",
      "Organization of writing",
      "Grammar and spelling",
      "Length and stamina",
    ],
  },
  {
    cat: "Math",
    items: [
      "Calculations",
      "Word problems",
      "Multi-step problems",
      "Math facts / fluency",
      "Conceptual understanding",
    ],
  },
  {
    cat: "Tests and assessments",
    items: [
      "Doesn't finish in time",
      "Freezes or shuts down on tests",
      "Failing benchmarks",
      "Anxiety around state assessments",
      "Inconsistent on classroom quizzes",
    ],
  },
  {
    cat: "Attention and focus",
    items: [
      "Hard to start tasks",
      "Can't sustain attention",
      "Distracted in class",
      "Trouble with transitions",
      "Loses track during multi-step instructions",
    ],
  },
  {
    cat: "Behavior at school",
    items: [
      "Emotional outbursts",
      "Withdrawal or shutdowns",
      "Refusal to participate",
      "Conflicts with peers or staff",
    ],
  },
  {
    cat: "Social and emotional",
    items: [
      "Anxiety about going to school",
      "Difficulty with peer relationships",
      "School avoidance / refusal",
      "Low self-esteem about school",
    ],
  },
  {
    cat: "Executive function",
    items: [
      "Organization (papers, materials, time)",
      "Time management",
      "Following multi-step directions",
      "Self-monitoring / catching own mistakes",
      "Planning longer projects",
    ],
  },
];

// Lighter Branch B-specific struggles (Watching)
const STRUGGLES_LIGHT = [
  {
    cat: "Grades and academics",
    items: [
      "Grades have dipped recently",
      "Some subjects are noticeably harder",
      "Homework is taking much longer than it used to",
    ],
  },
  {
    cat: "Focus and motivation",
    items: [
      "Trouble starting or finishing work",
      "Easily distracted at home or school",
      "Getting frustrated and giving up",
    ],
  },
  {
    cat: "Organization",
    items: [
      "Lost or forgotten assignments",
      "Disorganized materials",
      "Missing deadlines",
    ],
  },
  {
    cat: "Confidence and emotion",
    items: [
      "Saying 'I'm dumb' or similar",
      "Anxiety around school or homework",
      "Withdrawing socially",
    ],
  },
];

const COMMON_ACCOMMODATIONS = [
  "Extended time on assignments and tests",
  "Preferential seating",
  "Reduced assignment length",
  "Read-aloud / text-to-speech for assessments",
  "Calculator allowed",
  "Multiplication chart allowed",
  "Scribe or speech-to-text",
  "Frequent breaks",
  "Frequent check-ins from teacher",
  "Chunked instructions",
  "Note-taking support / printed notes",
  "Advance notice of tests",
  "Alternative test format",
  "Separate setting for tests",
  "Assistive technology",
  "Visual supports / graphic organizers",
];

const DIAGNOSES = [
  "Dyslexia",
  "ADHD",
  "Dyscalculia",
  "Dysgraphia",
  "Autism Spectrum Disorder",
  "Auditory Processing Disorder",
  "Language Processing Disorder",
  "Anxiety",
  "Specific Learning Disability (general)",
  "Other (not listed)",
];

// ============ BRANCH CONFIGURATIONS ============
// Each branch has: id, label, subtitle, gateColor (visual cue), steps, feltNeeds
const BRANCHES = {
  exploring: {
    id: "exploring",
    label: "We're starting to notice something is off, but no formal plan or evaluation yet",
    short: "Exploring",
    subtitle: "Real concerns, no plan in place",
    feltNeeds: [
      "I don't know where to start",
      "I want to know if we should request an evaluation",
      "To understand what services my child might qualify for",
      "To know if this should be a 504 or an IEP",
      "Help because the school isn't taking this seriously",
      "All of the above honestly",
    ],
  },
  watching: {
    id: "watching",
    label: "Things are slipping but it's not a crisis — looking for guidance, not necessarily services",
    short: "Watching",
    subtitle: "Early signals, not in crisis",
    feltNeeds: [
      "Just trying to figure out what to do",
      "Looking for outside help or a tutor",
      "Wondering if this will get worse",
      "Want to know what to track at home",
      "Need to know when to push the school harder",
      "Honestly, I'm not sure what we need yet",
    ],
  },
  inProcess: {
    id: "inProcess",
    label: "We're in the evaluation process or working toward a 504 or IEP right now",
    short: "In Process",
    subtitle: "Mid-evaluation or plan development",
    feltNeeds: [
      "I want to know what to expect at the ARD",
      "I'm worried they'll say not eligible",
      "I think they didn't test for everything",
      "I need language for my next meeting",
      "I want a second opinion on what they're proposing",
      "I don't know what questions to ask",
    ],
  },
  implementing: {
    id: "implementing",
    label: "My child already has a 504 plan or IEP",
    short: "Implementing",
    subtitle: "Has a plan, navigating it",
    feltNeeds: [
      "I'm not sure if our current plan is working",
      "I want to strengthen what we have",
      "We need to add more accommodations",
      "The school isn't following the plan",
      "I think we need to escalate (e.g. 504 to IEP)",
      "I need help preparing for our next review",
    ],
  },
};

// ============ CTA ROUTING ============
const CTA_MAP = {
  // Path Planning is the primary funnel; tutoring routes for watching branch only
  pathPlanning: {
    service: "Path Planning",
    price: "$29",
    duration: "30 minutes",
    url: "https://www.accommodatedpathways.com/service-page/path-planning",
  },
  meetingPrep: {
    service: "Meeting Prep & Coaching",
    price: "$125",
    duration: "60 minutes",
    url: "https://www.accommodatedpathways.com/book-online",
  },
  iepReview: {
    service: "IEP/504 Review & Recommendations",
    price: "$100",
    duration: "60 minutes",
    url: "https://www.accommodatedpathways.com/book-online",
  },
  advocateBundle: {
    service: "AdvocateED Bundle",
    price: "$200",
    duration: "Comprehensive",
    url: "https://www.accommodatedpathways.com/book-online",
  },
  tutoring: {
    service: "Tutoring",
    price: "$55–$65 / session",
    duration: "Recurring",
    url: "https://www.accommodatedpathways.com/book-online",
  },
};

const routeCTA = (branch, feltNeed) => {
  const map = {
    "I don't know where to start": ["pathPlanning", null],
    "I want to know if we should request an evaluation": ["pathPlanning", null],
    "To understand what services my child might qualify for": ["pathPlanning", null],
    "To know if this should be a 504 or an IEP": ["iepReview", "pathPlanning"],
    "Help because the school isn't taking this seriously": ["advocateBundle", "pathPlanning"],
    "All of the above honestly": ["pathPlanning", null],

    "Just trying to figure out what to do": ["pathPlanning", "tutoring"],
    "Looking for outside help or a tutor": ["tutoring", "pathPlanning"],
    "Wondering if this will get worse": ["pathPlanning", "tutoring"],
    "Want to know what to track at home": ["pathPlanning", "tutoring"],
    "Need to know when to push the school harder": ["pathPlanning", null],
    "Honestly, I'm not sure what we need yet": ["pathPlanning", "tutoring"],

    "I want to know what to expect at the ARD": ["meetingPrep", "pathPlanning"],
    "I'm worried they'll say not eligible": ["meetingPrep", "pathPlanning"],
    "I think they didn't test for everything": ["iepReview", "pathPlanning"],
    "I need language for my next meeting": ["meetingPrep", null],
    "I want a second opinion on what they're proposing": ["iepReview", "pathPlanning"],
    "I don't know what questions to ask": ["meetingPrep", "pathPlanning"],

    "I'm not sure if our current plan is working": ["iepReview", "pathPlanning"],
    "I want to strengthen what we have": ["iepReview", "meetingPrep"],
    "We need to add more accommodations": ["meetingPrep", "iepReview"],
    "The school isn't following the plan": ["advocateBundle", "iepReview"],
    "I think we need to escalate (e.g. 504 to IEP)": ["iepReview", "meetingPrep"],
    "I need help preparing for our next review": ["meetingPrep", "iepReview"],
  };
  const [primaryKey, mappedSecondaryKey] = map[feltNeed] || ["pathPlanning", null];
  // Path Planning is always the secondary when it is not already the primary.
  // No result should pair two high-ticket services without Path Planning
  // present somewhere, and a null secondary defaults to Path Planning.
  const secondaryKey =
    primaryKey === "pathPlanning" ? mappedSecondaryKey : "pathPlanning";
  return {
    primary: CTA_MAP[primaryKey],
    secondary: secondaryKey ? CTA_MAP[secondaryKey] : null,
  };
};

// ============ MAIN COMPONENT ============
export default function PathED() {
  const [screen, setScreen] = useState("landing");
  const [branch, setBranch] = useState(null);
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    grade: null,
    planStatus: null,
    planType: null, // "504" or "IEP" for Branch D
    diagnoses: [],
    diagnosisOther: "",
    struggleCategories: [],
    struggleSpecifics: {}, // { category: [items] }
    struggleOther: "",
    schoolStance: null,
    monitoringDuration: null,
    documented: null,
    history: null,
    privateEval: null,
    schoolRelationship: null,
    familiarity: null,
    feltNeed: null,
    // Branch B-specific
    teacherFeedback: null,
    triedAlready: [],
    // Branch C-specific
    processStage: null,
    processConcerns: [],
    // Branch D-specific
    currentAccommodations: [],
    accommodationsWorking: null,
    newConcerns: null,
    lastReview: null,
    planHistory: null,
    schoolFollowsPlan: null,
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [shareWithReese, setShareWithReese] = useState(true);
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailDelivery, setEmailDelivery] = useState(null); // "sent" | "failed" | null
  const [hp, setHp] = useState("");

  const update = (patch) => setData((d) => ({ ...d, ...patch }));

  const startBranch = (branchId) => {
    setBranch(branchId);
    setStep(0);
    update({ planStatus: branchId });
    setScreen("wizard");
  };

  const reset = () => {
    setScreen("landing");
    setBranch(null);
    setStep(0);
    setResults(null);
    setError(null);
    setEmail("");
    setEmailSubmitted(false);
    setShareWithReese(true);
    setEmailOptIn(true);
    setData({
      grade: null,
      planStatus: null,
      planType: null,
      diagnoses: [],
      diagnosisOther: "",
      struggleCategories: [],
      struggleSpecifics: {},
      struggleOther: "",
      schoolStance: null,
      monitoringDuration: null,
      documented: null,
      history: null,
      privateEval: null,
      schoolRelationship: null,
      familiarity: null,
      feltNeed: null,
      teacherFeedback: null,
      triedAlready: [],
      processStage: null,
      processConcerns: [],
      currentAccommodations: [],
      accommodationsWorking: null,
      newConcerns: null,
      lastReview: null,
      planHistory: null,
      schoolFollowsPlan: null,
    });
  };

  // ============ STEP DEFINITIONS PER BRANCH ============
  const getSteps = () => {
    const grade = {
      key: "grade",
      title: "The basics",
      question: "What grade is your child in?",
      type: "single",
      field: "grade",
      options: GRADES,
    };

    const struggles = {
      key: "struggles",
      title: "What you're seeing",
      question: "Where is your child struggling? Open any category to see specifics.",
      subtext: "Choose all that apply across categories.",
      type: "cascade",
      taxonomy: STRUGGLES_FULL,
    };

    const strugglesLight = {
      key: "struggles",
      title: "What you're seeing",
      question: "What's slipping? Open any category to see specifics.",
      subtext: "Choose all that apply.",
      type: "cascade",
      taxonomy: STRUGGLES_LIGHT,
    };

    const schoolStance = {
      key: "schoolStance",
      title: "School position",
      question: "What is the school currently saying or doing about your concerns?",
      type: "single",
      field: "schoolStance",
      options: [
        "They say everything is fine",
        "They're monitoring the situation",
        "They recommended outside tutoring",
        "They suggested we evaluate / they're starting to evaluate",
        "We've had disagreements about what my child needs",
        "We've tried to get services and been told no",
      ],
      followUp: (val, d) =>
        val === "They're monitoring the situation"
          ? {
              key: "monitoringDuration",
              question: "How long have they been monitoring?",
              type: "single",
              field: "monitoringDuration",
              options: [
                "Less than a grading period (under 6 weeks)",
                "About one grading period",
                "Two or more grading periods",
                "A full school year or more",
                "I'm not sure exactly",
              ],
            }
          : null,
    };

    const documented = {
      key: "documented",
      title: "Documentation",
      question: "Has the school put anything in writing about what they're doing?",
      type: "single",
      field: "documented",
      options: [
        "Yes, we have a written plan or document",
        "They mentioned it verbally, nothing written down",
        "I'm not sure",
        "No, it's been informal conversation only",
      ],
    };

    const history = {
      key: "history",
      title: "History",
      question: "How long have you been concerned about your child's struggles?",
      type: "single",
      field: "history",
      options: [
        "Less than a year",
        "1 to 2 years",
        "Since early elementary",
        "Since they started school",
        "I've always wondered, just started looking now",
      ],
    };

    // Lighter version for the Watching branch. Same field as schoolStance so
    // buildPrompt and the Reese notification continue to work uniformly.
    const schoolStanceLight = {
      key: "schoolStanceLight",
      title: "School position",
      question: "What is the school currently saying?",
      type: "single",
      field: "schoolStance",
      options: [
        "Everything looks fine to them",
        "They're keeping an eye on it",
        "They suggested outside tutoring",
        "We haven't really talked to them about it yet",
      ],
    };

    // Plan tenure for the Implementing branch.
    const planHistory = {
      key: "planHistory",
      title: "Plan history",
      question: "How long has this plan been in place?",
      type: "single",
      field: "planHistory",
      options: [
        "Less than a school year",
        "About a school year",
        "1 to 2 school years",
        "More than 2 school years",
        "I'm not sure exactly",
      ],
    };

    const privateEval = {
      key: "privateEval",
      title: "Outside evaluations",
      question: "Has your child had a private evaluation outside of school?",
      type: "single",
      field: "privateEval",
      options: [
        "Yes, and we shared it with the school",
        "Yes, but the school hasn't acted on it",
        "No, but we're considering it",
        "No, and we can't afford one right now",
        "We didn't know that was an option",
      ],
    };

    const schoolRelationship = {
      key: "schoolRelationship",
      title: "Communication with the school",
      question: "How would you describe communication with your child's school?",
      type: "single",
      field: "schoolRelationship",
      options: [
        "Good, they're responsive when we reach out",
        "Okay, but I have to push to be heard",
        "I feel like I'm not being taken seriously",
        "We've had real disagreements about my child's needs",
        "We're considering a formal complaint or due process",
      ],
    };

    const familiarity = {
      key: "familiarity",
      title: "Your background",
      question: "How familiar are you with the IEP and 504 process?",
      type: "single",
      field: "familiarity",
      options: [
        "Completely new to this",
        "I know the basics but still learning",
        "Pretty familiar — we've been through this before",
        "Very familiar, looking for specific guidance",
      ],
    };

    const feltNeed = {
      key: "feltNeed",
      title: "What you need",
      question: "What do YOU feel you need most right now?",
      type: "single",
      field: "feltNeed",
      options: BRANCHES[branch]?.feltNeeds || [],
    };

    // Branch-specific steps
    const planType = {
      key: "planType",
      title: "Plan type",
      question: "Which kind of plan does your child have?",
      type: "single",
      field: "planType",
      options: [
        "504 plan",
        "IEP",
        "Both at different times (started with 504, now IEP)",
        "I'm honestly not sure which one we have",
      ],
    };

    const diagnosesStep = {
      key: "diagnoses",
      title: "Diagnoses on record",
      question: "What diagnoses or eligibility categories does your child have? (if any)",
      subtext: "Select any that apply, or skip if none.",
      type: "multiPlus",
      field: "diagnoses",
      otherField: "diagnosisOther",
      options: DIAGNOSES,
      optional: true,
    };

    const currentAccs = {
      key: "currentAccommodations",
      title: "Current accommodations",
      question: "Which of these are currently in your child's plan?",
      subtext: "Select any that apply. We'll use this to tell you what to strengthen.",
      type: "multi",
      field: "currentAccommodations",
      options: COMMON_ACCOMMODATIONS,
    };

    const accsWorking = {
      key: "accommodationsWorking",
      title: "How it's going",
      question: "Overall, how well is the current plan working?",
      type: "single",
      field: "accommodationsWorking",
      options: [
        "It's making a noticeable difference",
        "Some improvement, but gaps remain",
        "Hard to tell — implementation is inconsistent",
        "It's not working well",
        "The school says it's working but I don't see it at home",
      ],
    };

    const followsPlan = {
      key: "schoolFollowsPlan",
      title: "Implementation",
      question: "Are teachers actually following the plan, as far as you can tell?",
      type: "single",
      field: "schoolFollowsPlan",
      options: [
        "Yes, consistently",
        "Some teachers do, others don't",
        "Rarely — we have to remind them",
        "I honestly don't know how to verify it",
      ],
    };

    const newConcerns = {
      key: "newConcerns",
      title: "New concerns",
      question: "Have new struggles come up that aren't addressed in the current plan?",
      type: "single",
      field: "newConcerns",
      options: [
        "Yes, and we haven't formally raised them yet",
        "Yes, we've raised them but no action yet",
        "Some, but I'm not sure if they need a plan change",
        "No, the current concerns are the same ones the plan addresses",
      ],
    };

    const lastReview = {
      key: "lastReview",
      title: "Last review",
      question: "When was the plan last reviewed?",
      type: "single",
      field: "lastReview",
      options: [
        "Within the last 3 months",
        "This school year",
        "Last school year",
        "Over a year ago",
        "I don't know",
      ],
    };

    // Branch B specific
    const teacherFeedback = {
      key: "teacherFeedback",
      title: "From the teacher",
      question: "Has a teacher mentioned anything specific?",
      type: "single",
      field: "teacherFeedback",
      options: [
        "Yes, they raised concerns directly",
        "Yes, but it was offhand or vague",
        "We've heard 'they're doing fine' but I don't agree",
        "Not really, this is mostly something I'm noticing",
      ],
    };

    const triedAlready = {
      key: "triedAlready",
      title: "What you've tried",
      question: "What have you already tried at home or outside of school?",
      subtext: "Choose any that apply.",
      type: "multi",
      field: "triedAlready",
      options: [
        "More structured homework time",
        "Reward systems or incentives",
        "Extra reading or practice at home",
        "Talking to the teacher",
        "Online programs or apps",
        "A private tutor",
        "A learning specialist or therapist",
        "Nothing yet, this is where we're starting",
      ],
    };

    // Branch C specific
    const processStage = {
      key: "processStage",
      title: "Where you are in the process",
      question: "Where are you in the evaluation or plan development process?",
      type: "single",
      field: "processStage",
      options: [
        "We've requested an evaluation but haven't heard back",
        "School agreed to evaluate, hasn't started yet",
        "Evaluation is in progress",
        "Evaluation is done, awaiting an ARD or 504 meeting",
        "ARD or 504 meeting is scheduled",
        "They've proposed a plan and we're reviewing it",
      ],
    };

    const processConcerns = {
      key: "processConcerns",
      title: "Concerns about the process",
      question: "What's worrying you about the process so far?",
      subtext: "Choose any that apply.",
      type: "multi",
      field: "processConcerns",
      options: [
        "I'm worried they'll say not eligible",
        "I don't think they're testing for everything",
        "The process is taking too long",
        "I don't understand what's being proposed",
        "I'm not sure what questions to ask",
        "I've been told no in the past for similar requests",
        "Nothing specific, just want to be prepared",
      ],
    };

    // ============ ASSEMBLE BY BRANCH ============
    if (branch === "exploring") {
      return [
        grade,
        struggles,
        schoolStance,
        documented,
        history,
        privateEval,
        schoolRelationship,
        familiarity,
        feltNeed,
      ];
    }
    if (branch === "watching") {
      return [
        grade,
        strugglesLight,
        teacherFeedback,
        triedAlready,
        schoolStanceLight,
        schoolRelationship,
        feltNeed,
      ];
    }
    if (branch === "inProcess") {
      return [
        grade,
        processStage,
        struggles,
        diagnosesStep,
        processConcerns,
        schoolRelationship,
        familiarity,
        feltNeed,
      ];
    }
    if (branch === "implementing") {
      return [
        grade,
        planType,
        planHistory,
        diagnosesStep,
        currentAccs,
        accsWorking,
        followsPlan,
        newConcerns,
        lastReview,
        schoolRelationship,
        feltNeed,
      ];
    }
    return [];
  };

  const steps = branch ? getSteps() : [];
  const currentStep = steps[step];

  const canAdvance = () => {
    if (!currentStep) return false;
    if (currentStep.optional) return true;
    if (currentStep.type === "single") {
      const v = data[currentStep.field];
      if (!v) return false;
      // Check follow-up requirement
      if (currentStep.followUp) {
        const fu = currentStep.followUp(v, data);
        if (fu && !data[fu.field]) return false;
      }
      return true;
    }
    if (currentStep.type === "multi" || currentStep.type === "multiPlus") {
      return (data[currentStep.field] || []).length > 0;
    }
    if (currentStep.type === "cascade") {
      return data.struggleCategories.length > 0;
    }
    return false;
  };

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      await generate();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setScreen("landing");
      setBranch(null);
    }
  };

  // ============ AI GENERATION ============
  const generate = async () => {
    setScreen("loading");
    setError(null);

    const prompt = buildPrompt(branch, data);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`API ${res.status}: ${t.slice(0, 200)}`);
      }
      const json = await res.json();
      if (json.error) throw new Error(json.error.message);
      const text = json.content?.[0]?.text;
      if (!text) throw new Error("Empty response from API.");
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start < 0 || end < 0) throw new Error("Could not parse JSON.");
      const parsed = JSON.parse(text.slice(start, end + 1));
      setResults(parsed);
      setScreen("results");
    } catch (e) {
      setError(e.message);
      setScreen("error");
    }
  };

  const handleEmailSubmit = async () => {
    if (!email || !email.includes("@")) return;
    let delivery = null;
    try {
      const r = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          emailOptIn,
          shareWithReese,
          branch,
          // Full AI-generated profile, used to build the HTML email. Capped
          // client-side at 50KB so we never ship an oversized payload. The
          // server runs the same cap as a defense-in-depth.
          results: truncateForUpload(results),
          website: hp,   // honeypot, real users leave this empty
          // Full sanitized wizard data so the Reese notification can show
          // every answer the parent gave, not a summary.
          data: {
            grade: data.grade || "",
            planType: data.planType || "",
            diagnoses: Array.isArray(data.diagnoses) ? data.diagnoses : [],
            diagnosisOther: data.diagnosisOther || "",
            struggleCategories: Array.isArray(data.struggleCategories) ? data.struggleCategories : [],
            struggleSpecifics: data.struggleSpecifics || {},
            struggleOther: data.struggleOther || "",
            schoolStance: data.schoolStance || "",
            monitoringDuration: data.monitoringDuration || "",
            documented: data.documented || "",
            history: data.history || "",
            privateEval: data.privateEval || "",
            schoolRelationship: data.schoolRelationship || "",
            familiarity: data.familiarity || "",
            feltNeed: data.feltNeed || "",
            teacherFeedback: data.teacherFeedback || "",
            triedAlready: Array.isArray(data.triedAlready) ? data.triedAlready : [],
            processStage: data.processStage || "",
            processConcerns: Array.isArray(data.processConcerns) ? data.processConcerns : [],
            currentAccommodations: Array.isArray(data.currentAccommodations) ? data.currentAccommodations : [],
            accommodationsWorking: data.accommodationsWorking || "",
            newConcerns: data.newConcerns || "",
            lastReview: data.lastReview || "",
            planHistory: data.planHistory || "",
            schoolFollowsPlan: data.schoolFollowsPlan || "",
          },
        }),
      });
      const body = await r.json().catch(() => ({}));
      // The subscriber is always added when the request succeeds. We only flag
      // delivery as failed if the parent opted in to the email and the send
      // step itself returned a non-success status.
      if (emailOptIn) {
        if (body.profileEmail === "sent") delivery = "sent";
        else if (body.profileEmail === "failed") delivery = "failed";
      }
    } catch (e) {
      console.error("Subscribe error:", e);
      delivery = emailOptIn ? "failed" : null;
    }
    setEmailDelivery(delivery);
    setEmailSubmitted(true);
  };

  const ctas = results && data.feltNeed ? routeCTA(branch, data.feltNeed) : null;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      <FontStyles />
      <TopBar
        screen={screen}
        step={step}
        totalSteps={steps.length}
        onLogo={reset}
        branch={branch}
      />
      <div className="container-wrap" style={{ maxWidth: 760, margin: "0 auto", padding: "44px 28px 120px" }}>
        {screen === "landing" && <Landing onPick={startBranch} />}
        {screen === "wizard" && currentStep && (
          <WizardStep
            step={currentStep}
            data={data}
            update={update}
            onNext={handleNext}
            onBack={handleBack}
            canAdvance={canAdvance()}
            isLast={step === steps.length - 1}
            stepNumber={step + 1}
            totalSteps={steps.length}
          />
        )}
        {screen === "loading" && <Loading />}
        {screen === "error" && <ErrorScreen error={error} onRetry={generate} onRestart={reset} />}
        {screen === "results" && results && ctas && (
          <Results
            results={results}
            ctas={ctas}
            branch={branch}
            data={data}
            email={email}
            setEmail={setEmail}
            shareWithReese={shareWithReese}
            setShareWithReese={setShareWithReese}
            emailOptIn={emailOptIn}
            setEmailOptIn={setEmailOptIn}
            emailSubmitted={emailSubmitted}
            emailDelivery={emailDelivery}
            onEmailSubmit={handleEmailSubmit}
            hp={hp}
            setHp={setHp}
            onReset={reset}
          />
        )}
      </div>
    </div>
  );
}

// ============ TOP BAR ============
function TopBar({ screen, step, totalSteps, onLogo, branch }) {
  return (
    <div
      className="topbar"
      style={{
        borderBottom: `1px solid ${C.border}`,
        padding: "14px 24px",
        background: C.bg,
        position: "sticky",
        top: 0,
        zIndex: 10,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div
          onClick={onLogo}
          role="button"
          aria-label="PathED by AccommodatED. Return to start."
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
        >
          <img
            src="/logo_no_writing.svg"
            alt=""
            style={{ height: 28, width: "auto" }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: C.navy,
              letterSpacing: "-0.02em",
            }}
          >
            Path<span style={{ color: C.teal }}>ED</span> by AccommodatED
          </span>
        </div>
        {screen === "wizard" && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {branch && (
              <span
                className="mono"
                style={{
                  fontSize: 10,
                  color: C.teal,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 600,
                  padding: "3px 8px",
                  background: C.tealSoft,
                  borderRadius: 3,
                }}
              >
                {BRANCHES[branch].short}
              </span>
            )}
            <span className="num" style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>
              {String(step + 1).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}
            </span>
            <div
              className="tb-progress"
              style={{
                width: 90,
                height: 2,
                background: C.borderStrong,
                borderRadius: 0,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${((step + 1) / totalSteps) * 100}%`,
                  height: "100%",
                  background: C.teal,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ LANDING ============
function Landing({ onPick }) {
  return (
    <div className="fade-in" style={{ paddingTop: 16 }}>
      <img
        src="/logo_no_writing.svg"
        alt="AccommodatED Pathways"
        style={{ height: 72, width: "auto", display: "block", marginBottom: 24 }}
        onError={(e) => { e.target.style.display = 'none'; }}
      />
      <div
        className="mono"
        style={{
          fontSize: 11,
          color: C.teal,
          textTransform: "uppercase",
          letterSpacing: "0.16em",
          fontWeight: 600,
          marginBottom: 20,
        }}
      >
        Special Education Navigation Tool · Texas-First, Useful Nationally
      </div>
      <h1
        style={{
          fontSize: "clamp(28px, 5vw, 44px)",
          lineHeight: 1.1,
          fontWeight: 700,
          color: C.navy,
          margin: "0 0 20px 0",
          letterSpacing: "-0.02em",
        }}
      >
        Find out what your child needs,{" "}
        <span style={{ color: C.teal }}>and what to ask for.</span>
      </h1>
      <p style={{ fontSize: 16, lineHeight: 1.6, color: C.text, marginBottom: 14, maxWidth: 580 }}>
        Most parents leave a school meeting more confused than when they walked in. PathED gives
        you a personalized read on your child's situation in about five minutes — the same kind of
        guidance you'd get sitting across from an educational consultant.
      </p>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: C.muted, marginBottom: 36, maxWidth: 580 }}>
        Free, no payment required. A document you can save, share with your spouse, or bring to
        your next meeting.
      </p>

      <div
        style={{
          padding: "32px 32px 28px",
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          marginBottom: 32,
          boxShadow: "0 1px 3px rgba(10, 37, 64, 0.04)",
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 11,
            color: C.muted,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            fontWeight: 600,
            marginBottom: 22,
          }}
        >
          Where are you right now?
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Object.values(BRANCHES).map((b) => (
            <button
              key={b.id}
              className="branch-btn"
              onClick={() => onPick(b.id)}
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                padding: "22px 24px",
                borderRadius: 10,
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 22,
                color: C.text,
                fontSize: 14.5,
                lineHeight: 1.55,
                flexWrap: "wrap",
                boxShadow: "0 1px 2px rgba(10, 37, 64, 0.03)",
                fontFamily: "inherit",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = C.teal;
                e.currentTarget.style.background = C.tealSoft;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.background = C.surface;
              }}
            >
              <span
                className="mono"
                style={{
                  display: "inline-block",
                  flexShrink: 0,
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "#fff",
                  background: C.teal,
                  padding: "7px 14px",
                  borderRadius: 999,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  lineHeight: 1.2,
                  boxShadow: "0 2px 6px rgba(18, 117, 114, 0.2)",
                }}
              >
                {b.short}
              </span>
              <span
                style={{
                  flex: 1,
                  minWidth: 220,
                  color: C.text,
                  paddingRight: 8,
                }}
              >
                {b.label}
              </span>
              <span style={{ color: C.mutedLight, fontSize: 18, flexShrink: 0, fontWeight: 300 }}>
                →
              </span>
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          padding: "16px 18px",
          background: C.bgAlt,
          borderRadius: 4,
          fontSize: 12,
          lineHeight: 1.65,
          color: C.muted,
          marginBottom: 24,
          border: `1px solid ${C.border}`,
        }}
      >
        <strong style={{ color: C.text, fontWeight: 600 }}>Important:</strong> PathED is an
        informational tool. It does not provide clinical assessments, diagnoses, or legal
        determinations. For a formal evaluation, work with a qualified professional. For your
        rights as a parent, review your district's Procedural Safeguards Notice. Texas families
        can find the full document at{" "}
        <a
          href="https://tea.texas.gov"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: C.teal, fontWeight: 500 }}
        >
          TEA.gov
        </a>
        . Outside Texas, check your state department of education or{" "}
        <a
          href="https://sites.ed.gov/idea"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: C.teal, fontWeight: 500 }}
        >
          IDEA federal guidelines
        </a>
        .
      </div>

      <div
        style={{
          display: "flex",
          gap: 32,
          fontSize: 12,
          color: C.muted,
          flexWrap: "wrap",
          marginTop: 16,
        }}
      >
        <Stat label="5 min" desc="From start to your full profile" />
        <Stat label="Free" desc="No payment, no card" />
        <Stat label="Yours to keep" desc="Save, print, or email it home" />
      </div>
    </div>
  );
}

function Stat({ label, desc }) {
  return (
    <div>
      <div className="num" style={{ fontWeight: 600, color: C.ink, marginBottom: 2, fontSize: 14 }}>
        {label}
      </div>
      <div style={{ fontSize: 12, color: C.muted }}>{desc}</div>
    </div>
  );
}

// ============ WIZARD STEP ============
function WizardStep({
  step,
  data,
  update,
  onNext,
  onBack,
  canAdvance,
  isLast,
  stepNumber,
  totalSteps,
}) {
  return (
    <div className="fade-in" key={step.key}>
      <div
        className="mono"
        style={{
          fontSize: 11,
          letterSpacing: "0.14em",
          color: C.teal,
          textTransform: "uppercase",
          fontWeight: 600,
          marginBottom: 18,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span className="num">
          {String(stepNumber).padStart(2, "0")}
        </span>
        <span style={{ color: C.borderStrong }}>·</span>
        <span>{step.title}</span>
      </div>
      <h2
        style={{
          fontSize: 28,
          lineHeight: 1.2,
          fontWeight: 600,
          color: C.navy,
          margin: "0 0 16px 0",
          letterSpacing: "-0.02em",
        }}
      >
        {step.question}
      </h2>
      {step.subtext && (
        <p style={{ fontSize: 14.5, color: C.muted, marginBottom: 0, lineHeight: 1.6 }}>
          {step.subtext}
        </p>
      )}

      <div style={{ marginTop: 36 }}>
        {step.type === "single" && (
          <SingleSelect
            options={step.options}
            value={data[step.field]}
            onChange={(v) => update({ [step.field]: v })}
          />
        )}
        {step.type === "single" && step.followUp && data[step.field] && (() => {
          const fu = step.followUp(data[step.field], data);
          if (!fu) return null;
          return (
            <div
              className="slide-down"
              style={{
                marginTop: 32,
                paddingTop: 28,
                borderTop: `1px dashed ${C.borderStrong}`,
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  color: C.teal,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  fontWeight: 600,
                  marginBottom: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ color: C.borderStrong }}>↳</span> Follow-up
              </div>
              <div style={{ fontSize: 17, fontWeight: 500, color: C.ink, marginBottom: 22, lineHeight: 1.4 }}>
                {fu.question}
              </div>
              <SingleSelect
                options={fu.options}
                value={data[fu.field]}
                onChange={(v) => update({ [fu.field]: v })}
              />
            </div>
          );
        })()}
        {step.type === "multi" && (
          <MultiSelect
            options={step.options}
            values={data[step.field] || []}
            onChange={(arr) => update({ [step.field]: arr })}
          />
        )}
        {step.type === "multiPlus" && (
          <MultiSelectWithOther
            options={step.options}
            values={data[step.field] || []}
            otherValue={data[step.otherField] || ""}
            onChange={(arr) => update({ [step.field]: arr })}
            onOtherChange={(v) => update({ [step.otherField]: v })}
          />
        )}
        {step.type === "cascade" && (
          <CascadeSelect
            taxonomy={step.taxonomy}
            categories={data.struggleCategories}
            specifics={data.struggleSpecifics}
            otherValue={data.struggleOther}
            onCategoriesChange={(arr) => update({ struggleCategories: arr })}
            onSpecificsChange={(obj) => update({ struggleSpecifics: obj })}
            onOtherChange={(v) => update({ struggleOther: v })}
          />
        )}
      </div>

      <div
        style={{
          marginTop: 56,
          paddingTop: 24,
          borderTop: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <button
          onClick={onBack}
          className="tap"
          style={{
            background: "transparent",
            color: C.muted,
            border: "none",
            padding: "12px 14px 12px 0",
            fontSize: 14,
            cursor: "pointer",
            fontWeight: 500,
            fontFamily: "inherit",
          }}
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!canAdvance}
          className="tap"
          style={{
            background: canAdvance ? C.navy : C.bgAlt,
            color: canAdvance ? "#fff" : C.mutedLight,
            border: canAdvance ? "none" : `1px solid ${C.border}`,
            padding: "15px 32px",
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 8,
            cursor: canAdvance ? "pointer" : "not-allowed",
            letterSpacing: "0.01em",
            fontFamily: "inherit",
            boxShadow: canAdvance ? "0 8px 22px rgba(10, 37, 64, 0.18)" : "none",
          }}
        >
          {isLast ? "Generate my profile →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}

// ============ INPUT COMPONENTS ============
function SingleSelect({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {options.map((opt) => {
        const sel = value === opt;
        return (
          <button
            key={opt}
            className={`opt-btn ${sel ? "is-sel" : ""}`}
            onClick={() => onChange(opt)}
            style={{
              background: sel ? C.teal : C.surface,
              color: sel ? "#fff" : C.text,
              border: `1px solid ${sel ? C.teal : C.border}`,
              padding: "16px 20px",
              fontSize: 14.5,
              lineHeight: 1.5,
              borderRadius: 8,
              textAlign: "left",
              cursor: "pointer",
              fontWeight: sel ? 600 : 400,
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                border: `1.5px solid ${sel ? "#fff" : C.borderStrong}`,
                background: sel ? "#fff" : "transparent",
                position: "relative",
                flexShrink: 0,
              }}
            >
              {sel && (
                <span
                  style={{
                    position: "absolute",
                    inset: 3,
                    borderRadius: "50%",
                    background: C.teal,
                  }}
                />
              )}
            </span>
            <span style={{ flex: 1 }}>{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

function MultiSelect({ options, values, onChange }) {
  const toggle = (opt) =>
    onChange(values.includes(opt) ? values.filter((v) => v !== opt) : [...values, opt]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {options.map((opt) => {
        const sel = values.includes(opt);
        return (
          <button
            key={opt}
            className={`opt-btn ${sel ? "is-sel" : ""}`}
            onClick={() => toggle(opt)}
            style={{
              background: sel ? C.teal : C.surface,
              color: sel ? "#fff" : C.text,
              border: `1px solid ${sel ? C.teal : C.border}`,
              padding: "16px 20px",
              fontSize: 14.5,
              lineHeight: 1.5,
              borderRadius: 8,
              textAlign: "left",
              cursor: "pointer",
              fontWeight: sel ? 600 : 400,
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: "inherit",
            }}
          >
            <Check checked={sel} onLight={sel} />
            <span style={{ flex: 1 }}>{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

function MultiSelectWithOther({ options, values, otherValue, onChange, onOtherChange }) {
  const toggle = (opt) =>
    onChange(values.includes(opt) ? values.filter((v) => v !== opt) : [...values, opt]);
  const otherSel = values.includes("Other (not listed)");
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {options.map((opt) => {
          const sel = values.includes(opt);
          return (
            <button
              key={opt}
              className={`opt-btn ${sel ? "is-sel" : ""}`}
              onClick={() => toggle(opt)}
              style={{
                background: sel ? C.teal : C.surface,
                color: sel ? "#fff" : C.text,
                border: `1px solid ${sel ? C.teal : C.border}`,
                padding: "16px 20px",
                fontSize: 14.5,
                lineHeight: 1.5,
                borderRadius: 8,
                textAlign: "left",
                cursor: "pointer",
                fontWeight: sel ? 600 : 400,
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontFamily: "inherit",
              }}
            >
              <Check checked={sel} onLight={sel} />
              <span style={{ flex: 1 }}>{opt}</span>
            </button>
          );
        })}
      </div>
      {otherSel && (
        <div className="slide-down" style={{ marginTop: 14 }}>
          <input
            type="text"
            value={otherValue}
            onChange={(e) => onOtherChange(e.target.value)}
            placeholder="Type what's on your child's record..."
            style={{
              width: "100%",
              padding: "14px 16px",
              fontSize: 14,
              border: `1px solid ${C.borderStrong}`,
              borderRadius: 6,
              background: C.surface,
              color: C.text,
              outline: "none",
              fontFamily: "inherit",
            }}
          />
        </div>
      )}
    </>
  );
}

function CascadeSelect({
  taxonomy,
  categories,
  specifics,
  otherValue,
  onCategoriesChange,
  onSpecificsChange,
  onOtherChange,
}) {
  const toggleCat = (cat) => {
    if (categories.includes(cat)) {
      onCategoriesChange(categories.filter((c) => c !== cat));
      const newSpec = { ...specifics };
      delete newSpec[cat];
      onSpecificsChange(newSpec);
    } else {
      onCategoriesChange([...categories, cat]);
    }
  };
  const toggleSpec = (cat, item) => {
    const current = specifics[cat] || [];
    const next = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];
    onSpecificsChange({ ...specifics, [cat]: next });
  };
  const otherCat = "Other (not listed)";
  const otherSel = categories.includes(otherCat);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {taxonomy.map((c) => {
        const open = categories.includes(c.cat);
        const selectedCount = (specifics[c.cat] || []).length;
        return (
          <div
            key={c.cat}
            style={{
              border: `1px solid ${open ? C.teal : C.border}`,
              borderRadius: 8,
              overflow: "hidden",
              background: open ? C.tealSoft : C.surface,
              boxShadow: open ? "0 4px 14px rgba(18, 117, 114, 0.10)" : "none",
            }}
          >
            <button
              onClick={() => toggleCat(c.cat)}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                padding: "16px 20px",
                fontSize: 14.5,
                fontWeight: open ? 600 : 500,
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 14,
                color: open ? C.navy : C.text,
                fontFamily: "inherit",
              }}
            >
              <Check checked={open} />
              <span style={{ flex: 1 }}>{c.cat}</span>
              {selectedCount > 0 && (
                <span
                  className="mono num"
                  style={{
                    fontSize: 11,
                    background: C.teal,
                    color: "#fff",
                    padding: "3px 10px",
                    borderRadius: 999,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                  }}
                >
                  {selectedCount}
                </span>
              )}
              <span
                style={{
                  color: open ? C.teal : C.mutedLight,
                  fontSize: 16,
                  transform: open ? "rotate(90deg)" : "none",
                  transition: "transform 0.2s",
                }}
              >
                ›
              </span>
            </button>
            {open && (
              <div
                className="slide-down"
                style={{
                  padding: "4px 16px 18px 52px",
                  borderTop: `1px solid rgba(18, 117, 114, 0.18)`,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {c.items.map((item) => {
                    const sel = (specifics[c.cat] || []).includes(item);
                    return (
                      <label
                        key={item}
                        className="tap"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "12px 12px",
                          fontSize: 14,
                          color: sel ? C.navy : C.text,
                          fontWeight: sel ? 500 : 400,
                          cursor: "pointer",
                          borderRadius: 6,
                          background: sel ? "rgba(255,255,255,0.7)" : "transparent",
                          transition: "background 0.15s ease",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={sel}
                          onChange={() => toggleSpec(c.cat, item)}
                          style={{
                            width: 16,
                            height: 16,
                            accentColor: C.teal,
                            cursor: "pointer",
                            margin: 0,
                          }}
                        />
                        {item}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div
        style={{
          border: `1px solid ${otherSel ? C.teal : C.border}`,
          borderRadius: 8,
          background: otherSel ? C.tealSoft : C.surface,
          boxShadow: otherSel ? "0 4px 14px rgba(18, 117, 114, 0.10)" : "none",
        }}
      >
        <button
          onClick={() => toggleCat(otherCat)}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            padding: "16px 20px",
            fontSize: 14.5,
            fontWeight: otherSel ? 600 : 500,
            cursor: "pointer",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: otherSel ? C.navy : C.text,
            fontFamily: "inherit",
          }}
        >
          <Check checked={otherSel} />
          <span style={{ flex: 1 }}>Other (not listed)</span>
        </button>
        {otherSel && (
          <div
            className="slide-down"
            style={{
              padding: "4px 18px 18px 18px",
              borderTop: `1px solid rgba(18, 117, 114, 0.18)`,
            }}
          >
            <input
              type="text"
              value={otherValue}
              onChange={(e) => onOtherChange(e.target.value)}
              placeholder="Tell us what's on your mind..."
              style={{
                width: "100%",
                padding: "12px 14px",
                fontSize: 14,
                border: `1px solid ${C.borderStrong}`,
                borderRadius: 6,
                background: C.surface,
                color: C.text,
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Check({ checked, onLight }) {
  // onLight = checkbox sits on a teal-filled background; flip the colors so
  // the box reads as white-on-teal with a teal tick.
  const borderColor = checked ? (onLight ? "#fff" : C.teal) : C.borderStrong;
  const bg = checked ? (onLight ? "#fff" : C.teal) : "transparent";
  const tickColor = onLight ? C.teal : "#fff";
  return (
    <div
      style={{
        width: 18,
        height: 18,
        borderRadius: 4,
        border: `1.5px solid ${borderColor}`,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: tickColor,
        fontSize: 12,
        fontWeight: 800,
        flexShrink: 0,
        transition: "all 0.15s",
      }}
    >
      {checked && "✓"}
    </div>
  );
}

// ============ LOADING ============
function Loading() {
  const [phase, setPhase] = useState(0);
  const phases = [
    "Reading what you shared.",
    "Building your child's profile.",
    "Pulling the right guidance.",
    "Calibrating to your situation.",
    "Finalizing your PathED Profile.",
  ];
  useEffect(() => {
    const t = setInterval(() => setPhase((p) => Math.min(p + 1, phases.length - 1)), 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="fade-in" style={{ paddingTop: 80, textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 28 }}>
        <Dot delay="" />
        <Dot delay="2" />
        <Dot delay="3" />
      </div>
      <div
        style={{
          fontSize: 19,
          color: C.navy,
          fontWeight: 600,
          marginBottom: 8,
          minHeight: 32,
          letterSpacing: "-0.01em",
        }}
      >
        {phases[phase]}
      </div>
      <div
        className="mono"
        style={{
          fontSize: 11,
          color: C.muted,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
        }}
      >
        ~30 seconds
      </div>
    </div>
  );
}

function Dot({ delay }) {
  return (
    <div
      className={`pulse-${delay || "1"}`}
      style={{ width: 7, height: 7, borderRadius: "50%", background: C.teal }}
    />
  );
}

// ============ ERROR ============
function ErrorScreen({ error, onRetry, onRestart }) {
  return (
    <div className="fade-in" style={{ paddingTop: 60 }}>
      <div
        className="mono"
        style={{
          fontSize: 11,
          letterSpacing: "0.14em",
          color: C.warning,
          textTransform: "uppercase",
          fontWeight: 600,
          marginBottom: 12,
        }}
      >
        Something didn't load
      </div>
      <h2
        style={{
          fontSize: 24,
          color: C.navy,
          fontWeight: 700,
          marginBottom: 14,
          letterSpacing: "-0.02em",
        }}
      >
        We couldn't generate your profile this time.
      </h2>
      <p style={{ fontSize: 14, color: C.muted, marginBottom: 20, lineHeight: 1.6 }}>
        Sometimes the connection times out. Your answers are saved.
      </p>
      <div
        className="mono"
        style={{
          fontSize: 11,
          color: C.muted,
          background: C.warningSoft,
          padding: 12,
          borderRadius: 4,
          marginBottom: 24,
          border: `1px solid #fde68a`,
        }}
      >
        {error}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onRetry}
          style={{
            background: C.navy,
            color: "#fff",
            border: "none",
            padding: "12px 22px",
            fontSize: 13,
            fontWeight: 600,
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        <button
          onClick={onRestart}
          style={{
            background: "transparent",
            color: C.muted,
            border: `1px solid ${C.borderStrong}`,
            padding: "12px 22px",
            fontSize: 13,
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Start over
        </button>
      </div>
    </div>
  );
}

// ============ RESULTS ============
function Results({
  results,
  ctas,
  branch,
  data,
  email,
  setEmail,
  shareWithReese,
  setShareWithReese,
  emailOptIn,
  setEmailOptIn,
  emailSubmitted,
  emailDelivery,
  onEmailSubmit,
  hp,
  setHp,
  onReset,
}) {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const sections = results.sections || [];

  return (
    <div className="fade-in" style={{ paddingTop: 8 }}>
      {/* Header */}
      <div
        className="stagger-1 results-header"
        style={{
          background: `linear-gradient(135deg, ${C.navy} 0%, ${C.teal} 130%)`,
          color: "#fff",
          padding: "36px 32px",
          borderRadius: 12,
          marginBottom: 32,
          boxShadow: "0 12px 32px rgba(10, 37, 64, 0.18)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.18em",
            color: "rgba(75, 168, 164, 1)",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          PathED Profile · {BRANCHES[branch].short} Track
        </div>
        <div
          className="gen-date"
          style={{
            fontSize: 30,
            color: "#fff",
            fontWeight: 700,
            lineHeight: 1.15,
            marginBottom: 8,
            letterSpacing: "-0.02em",
          }}
        >
          Generated {today}
        </div>
        <div
          className="mono"
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.06em",
          }}
        >
          AccommodatED Pathways · Progress, Made Personal · contact@accommodatedpathways.com
        </div>
      </div>

      {/* Safeguard */}
      <div
        className="stagger-2"
        style={{
          background: C.bgAlt,
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          padding: "16px 20px",
          fontSize: 12.5,
          lineHeight: 1.7,
          color: C.muted,
          marginBottom: 48,
        }}
      >
        <strong style={{ color: C.text, fontWeight: 600 }}>A note before you read.</strong> PathED
        is an informational tool. It does not provide clinical assessments, diagnoses, or legal
        determinations. For your rights, review your district's Procedural Safeguards Notice.
        Texas families:{" "}
        <a href="https://tea.texas.gov" target="_blank" rel="noopener noreferrer" style={{ color: C.teal, fontWeight: 500 }}>
          TEA.gov
        </a>
        . Outside Texas:{" "}
        <a href="https://sites.ed.gov/idea" target="_blank" rel="noopener noreferrer" style={{ color: C.teal, fontWeight: 500 }}>
          IDEA federal guidelines
        </a>
        .
      </div>

      {/* Sections (branch-specific, AI-generated) */}
      {sections.map((section, i) => (
        <Section
          key={i}
          number={String(i + 1).padStart(2, "0")}
          title={section.title}
          isFirst={i === 0}
          className={`stagger-${Math.min(i + 3, 7)}`}
        >
          <SectionBody section={section} />
        </Section>
      ))}

      {/* Primary CTA */}
      <div
        className="stagger-7 cta-block"
        style={{
          background: `linear-gradient(150deg, ${C.navy} 0%, ${C.navyDark} 100%)`,
          color: "#fff",
          padding: "48px 40px",
          borderRadius: 14,
          marginBottom: 32,
          marginTop: 24,
          boxShadow: "0 18px 48px rgba(10, 37, 64, 0.22)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.teal}33, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.18em",
            color: C.tealLight,
            textTransform: "uppercase",
            fontWeight: 700,
            marginBottom: 18,
            position: "relative",
          }}
        >
          Your next step
        </div>
        <div
          className="cta-headline"
          style={{
            fontSize: 30,
            fontWeight: 700,
            lineHeight: 1.18,
            marginBottom: 16,
            letterSpacing: "-0.02em",
            position: "relative",
          }}
        >
          {results.ctaHeadline || "Let's take this further."}
        </div>
        <p
          style={{
            fontSize: 15.5,
            lineHeight: 1.7,
            marginBottom: 32,
            opacity: 0.88,
            maxWidth: 560,
            position: "relative",
          }}
        >
          {results.ctaBody}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            paddingTop: 26,
            borderTop: `1px solid rgba(255,255,255,0.14)`,
            flexWrap: "wrap",
            position: "relative",
          }}
        >
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
              {ctas.primary.service}
            </div>
            <div className="mono" style={{ fontSize: 12.5, opacity: 0.7, letterSpacing: "0.05em" }}>
              {ctas.primary.price} · {ctas.primary.duration}
            </div>
          </div>
          <a
            href={ctas.primary.url}
            target="_blank"
            rel="noopener noreferrer"
            className="book-this tap"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: C.teal,
              color: "#fff",
              padding: "16px 30px",
              borderRadius: 8,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.02em",
              boxShadow: "0 8px 22px rgba(18, 117, 114, 0.4)",
              whiteSpace: "nowrap",
            }}
          >
            Book this →
          </a>
        </div>
        {ctas.secondary && (
          <div
            style={{
              marginTop: 18,
              paddingTop: 16,
              borderTop: `1px solid rgba(255,255,255,0.08)`,
              fontSize: 13,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.55,
            }}
          >
            {ctas.secondary.service === "Path Planning" ? (
              <span style={{ opacity: 0.85 }}>
                Not sure where to start?{" "}
                <a
                  href={ctas.secondary.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: C.tealLight,
                    fontWeight: 500,
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                  }}
                >
                  Path Planning ($29 · 30 min)
                </a>{" "}
                is a good first step.
              </span>
            ) : (
              <>
                <span style={{ opacity: 0.7 }}>Also worth considering: </span>
                <a
                  href={ctas.secondary.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: C.tealLight,
                    fontWeight: 500,
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                  }}
                >
                  {ctas.secondary.service} ({ctas.secondary.price})
                </a>
              </>
            )}
          </div>
        )}
      </div>

      {/* Email capture */}
      <div
        className="stagger-7 email-capture"
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: "32px 32px",
          marginBottom: 28,
          boxShadow: "0 1px 2px rgba(10, 37, 64, 0.04)",
        }}
      >
        {!emailSubmitted ? (
          <>
            <div style={{ fontSize: 20, fontWeight: 600, color: C.navy, marginBottom: 8, letterSpacing: "-0.01em" }}>
              Want a copy of your profile?
            </div>
            <div style={{ fontSize: 14.5, color: C.text, lineHeight: 1.6, marginBottom: 22 }}>
              We'll email you your full PathED Profile so you can save it, share it, or bring it
              to your next meeting.
            </div>
            {/* Honeypot, real users leave this empty. Hidden visually but */}
            {/* labeled for accessibility tools so we never confuse a real user. */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-10000px",
                top: "auto",
                width: 1,
                height: 1,
                overflow: "hidden",
              }}
            >
              <label htmlFor="pathed-website-field">Website</label>
              <input
                id="pathed-website-field"
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
              />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                width: "100%",
                padding: "14px 16px",
                fontSize: 14.5,
                border: `1px solid ${C.borderStrong}`,
                borderRadius: 8,
                background: C.surface,
                color: C.text,
                outline: "none",
                marginBottom: 20,
                fontFamily: "inherit",
              }}
            />
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                fontSize: 13.5,
                color: C.text,
                lineHeight: 1.55,
                marginBottom: 14,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={shareWithReese}
                onChange={(e) => setShareWithReese(e.target.checked)}
                style={{ marginTop: 3, accentColor: C.teal, cursor: "pointer" }}
              />
              <span>
                <strong style={{ fontWeight: 600 }}>Send a copy to Reese</strong> so she can review
                your profile before any conversation we have. Recommended if you're considering
                booking.
              </span>
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                fontSize: 13.5,
                color: C.muted,
                lineHeight: 1.55,
                marginBottom: 24,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={emailOptIn}
                onChange={(e) => setEmailOptIn(e.target.checked)}
                style={{ marginTop: 3, accentColor: C.teal, cursor: "pointer" }}
              />
              <span>
                Send me occasional tips and resources from AccommodatED Pathways.
              </span>
            </label>
            <button
              onClick={onEmailSubmit}
              style={{
                background: C.teal,
                color: "#fff",
                border: "none",
                padding: "14px 24px",
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 8,
                cursor: "pointer",
                width: "100%",
                letterSpacing: "0.01em",
                fontFamily: "inherit",
                boxShadow: "0 6px 18px rgba(18, 117, 114, 0.25)",
              }}
            >
              Send my profile →
            </button>
          </>
        ) : emailDelivery === "failed" ? (
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: C.warning, marginBottom: 6 }}>
              We couldn't email it just now.
            </div>
            <div style={{ fontSize: 14, color: C.text, lineHeight: 1.6 }}>
              You're on the AccommodatED Pathways list, but the profile email
              didn't go through. Use the Print or save as PDF button below to keep
              a copy now. Reese will follow up at{" "}
              <strong>{email}</strong> with the full profile shortly.
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: C.success, marginBottom: 6 }}>
              ✓ On its way.
            </div>
            <div style={{ fontSize: 14, color: C.text, lineHeight: 1.55 }}>
              Check your inbox in a few minutes. If you don't see it, peek in your spam folder.
              {shareWithReese &&
                " Reese will review your profile before any conversation we have together."}
            </div>
          </div>
        )}
      </div>

      <div
        className="footer-actions"
        style={{
          display: "flex",
          gap: 8,
          paddingTop: 22,
          borderTop: `1px solid ${C.border}`,
          fontSize: 13,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => window.print()}
          className="tap"
          style={{
            background: "transparent",
            color: C.muted,
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            padding: "12px 14px",
            fontFamily: "inherit",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          🖨 Print or save as PDF
        </button>
        <button
          onClick={onReset}
          className="tap"
          style={{
            background: "transparent",
            color: C.muted,
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            padding: "12px 14px",
            fontFamily: "inherit",
          }}
        >
          Start over
        </button>
      </div>

      {/* Mobile-only sticky CTA. Hidden via CSS at >600px. */}
      <a
        href={ctas.primary.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mobile-cta-bar show"
        style={{
          color: "#fff",
          textDecoration: "none",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        <span style={{ flex: 1, lineHeight: 1.3 }}>
          <span style={{ display: "block", fontSize: 11, color: C.tealLight, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 2 }}>
            Your next step
          </span>
          {ctas.primary.service} · {ctas.primary.price}
        </span>
        <span
          style={{
            background: C.teal,
            color: "#fff",
            padding: "12px 18px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: "nowrap",
            minHeight: 48,
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          Book →
        </span>
      </a>
    </div>
  );
}

function Section({ number, title, children, className, isFirst }) {
  const discSize = isFirst ? 40 : 32;
  const numSize = isFirst ? 13 : 11;
  const titleSize = isFirst ? 26 : 20;
  return (
    <div
      className={`${className || ""} ${isFirst ? "first-section" : ""}`.trim()}
      style={{ marginBottom: isFirst ? 64 : 52 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: isFirst ? 22 : 20,
        }}
      >
        <span
          className="num"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: discSize,
            height: discSize,
            borderRadius: "50%",
            background: C.teal,
            color: "#fff",
            fontSize: numSize,
            fontWeight: 700,
            letterSpacing: "0.04em",
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(18, 117, 114, 0.25)",
          }}
        >
          {number}
        </span>
        <h3
          style={{
            fontSize: titleSize,
            fontWeight: 700,
            color: C.navy,
            margin: 0,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            flex: 1,
          }}
        >
          {title}
        </h3>
        <span
          style={{
            flex: 1,
            height: 1,
            background: `linear-gradient(to right, ${C.border}, transparent)`,
            minWidth: 24,
          }}
        />
      </div>
      <div style={isFirst ? { fontSize: 16 } : undefined}>{children}</div>
    </div>
  );
}

function SectionBody({ section }) {
  // Render based on section.type
  if (section.type === "narrative") {
    return (
      <p
        style={{
          fontSize: 15.5,
          lineHeight: 1.75,
          color: C.text,
          margin: 0,
        }}
      >
        {section.body}
      </p>
    );
  }
  if (section.type === "headline_body") {
    const isReadSection = /504|iep|eligib|plan/i.test(section.title || "");
    return (
      <>
        <div
          style={{
            fontSize: 17,
            lineHeight: 1.45,
            color: C.navy,
            fontWeight: 600,
            marginBottom: 12,
            letterSpacing: "-0.01em",
          }}
        >
          {section.headline}
        </div>
        <p style={{ fontSize: 14.5, lineHeight: 1.75, color: C.text, marginBottom: section.callout ? 16 : 0 }}>
          {section.body}
        </p>
        {section.callout && (
          <div
            style={{
              position: "relative",
              padding: "14px 18px 14px 20px",
              background: C.tealSoft,
              borderLeft: `4px solid ${C.teal}`,
              fontSize: 13.5,
              lineHeight: 1.7,
              color: C.text,
              borderRadius: "0 6px 6px 0",
            }}
          >
            <span
              className="mono"
              style={{
                display: "block",
                fontSize: 9.5,
                fontWeight: 700,
                color: C.teal,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                marginBottom: 5,
              }}
            >
              Worth knowing
            </span>
            {section.callout}
          </div>
        )}
        {isReadSection && (
          <p
            style={{
              marginTop: 12,
              marginBottom: 0,
              fontSize: 12,
              lineHeight: 1.6,
              color: C.mutedLight,
              fontStyle: "italic",
            }}
          >
            This reflects the pattern you described, not a formal eligibility determination.
          </p>
        )}
      </>
    );
  }
  if (section.type === "accommodations") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {section.items.map((a, i) => (
          <div
            key={i}
            className="acc-card"
            style={{
              position: "relative",
              padding: "26px 28px 26px 32px",
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(10, 37, 64, 0.05)",
              overflow: "hidden",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                width: 5,
                background: a.tag === "STRENGTHEN" ? C.warning : C.teal,
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 18,
              }}
            >
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: C.navy,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
                }}
              >
                {a.name}
              </span>
              {a.tag && (
                <span
                  className="mono"
                  style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    background: a.tag === "STRENGTHEN" ? C.warningSoft : C.tealSoft,
                    color: a.tag === "STRENGTHEN" ? C.warning : C.teal,
                    padding: "3px 9px",
                    borderRadius: 999,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    lineHeight: 1.4,
                  }}
                >
                  {a.tag === "STRENGTHEN" ? "Strengthen" : "Add"}
                </span>
              )}
            </div>
            <AccDetail label="Why it helps" body={a.whyItHelps} />
            <AccDetail label="How to ask for it" body={a.howToAskFor} italic />
            <AccDetail label="How families strengthen it" body={a.strengthenIt} last />
          </div>
        ))}
      </div>
    );
  }
  if (section.type === "questions") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          padding: "26px 28px",
          background: C.bgAlt,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          boxShadow: "0 1px 2px rgba(10, 37, 64, 0.03)",
        }}
      >
        {section.items.map((q, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
              paddingBottom: i < section.items.length - 1 ? 16 : 0,
              borderBottom:
                i < section.items.length - 1 ? `1px dashed ${C.borderStrong}` : "none",
            }}
          >
            <span
              className="num"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: C.surface,
                border: `1.5px solid ${C.teal}`,
                color: C.teal,
                fontSize: 11.5,
                fontWeight: 700,
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div
              style={{
                fontSize: 15,
                lineHeight: 1.6,
                color: C.text,
                paddingTop: 5,
                flex: 1,
              }}
            >
              {q}
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (section.type === "list_with_actions") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {section.items.map((t, i) => (
          <div
            key={i}
            style={{
              padding: "20px 24px",
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderLeft: `4px solid ${C.teal}`,
              borderRadius: "0 10px 10px 0",
              boxShadow: "0 1px 2px rgba(10, 37, 64, 0.04)",
            }}
          >
            <div
              style={{
                fontSize: 15.5,
                fontWeight: 600,
                color: C.navy,
                marginBottom: 8,
                letterSpacing: "-0.01em",
                lineHeight: 1.35,
              }}
            >
              {t.title}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: C.text }}>{t.body}</div>
          </div>
        ))}
      </div>
    );
  }
  // Unknown section type. Show whatever readable text the section carries
  // (body, headline, or a stringified item list) so a future schema change
  // does not produce a blank section on the user's screen.
  const fallbackText =
    section.body ||
    section.headline ||
    (Array.isArray(section.items)
      ? section.items
          .map((it) => (typeof it === "string" ? it : it?.title || it?.name || ""))
          .filter(Boolean)
          .join(" · ")
      : "");
  if (!fallbackText) return null;
  return (
    <p style={{ fontSize: 15, lineHeight: 1.7, color: C.text, margin: 0 }}>
      {fallbackText}
    </p>
  );
}

function AccDetail({ label, body, italic, last }) {
  return (
    <div style={{ marginBottom: last ? 0 : 14 }}>
      <div
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: "0.14em",
          color: C.teal,
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: 5,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 14,
          lineHeight: 1.65,
          color: C.text,
          fontStyle: italic ? "italic" : "normal",
        }}
      >
        {body}
      </div>
    </div>
  );
}

// ============ PROMPT BUILDER ============
// Trim a results object before posting to /api/subscribe. The server has its
// own 50KB ceiling, but we run the same check here so we never even attempt
// to ship a payload that the function would refuse. Returns an object with
// the same email-template shape (ctaHeadline, ctaBody, sections), with each
// long string clipped and arrays capped.
function truncateForUpload(results) {
  if (!results || typeof results !== "object") return results;
  const size = (typeof Blob !== "undefined")
    ? new Blob([JSON.stringify(results)]).size
    : JSON.stringify(results).length;
  if (size <= 50000) return results;

  const clip = (v, n = 600) =>
    typeof v === "string" && v.length > n ? v.slice(0, n - 1).trimEnd() + "..." : v;

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

function sanitizeFreeText(input) {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);
}

function buildPrompt(branch, d) {
  const cleanStruggleOther = sanitizeFreeText(d.struggleOther);
  const cleanDiagnosisOther = sanitizeFreeText(d.diagnosisOther);

  const struggleSummary =
    Object.entries(d.struggleSpecifics || {})
      .map(([cat, items]) => `${cat}: ${items.join(", ")}`)
      .join(" | ") || "(none specified)";

  const profileText = `
GRADE: ${d.grade}
PLAN STATUS: ${branch}
${d.planType ? `PLAN TYPE: ${d.planType}` : ""}
${d.diagnoses?.length ? `DIAGNOSES: ${d.diagnoses.join(", ")}${cleanDiagnosisOther ? " (Other: " + cleanDiagnosisOther + ")" : ""}` : ""}
${d.struggleCategories?.length ? `STRUGGLES BY CATEGORY: ${struggleSummary}` : ""}
${cleanStruggleOther ? `STRUGGLE OTHER NOTE: ${cleanStruggleOther}` : ""}
${d.schoolStance ? `SCHOOL STANCE: ${d.schoolStance}` : ""}
${d.monitoringDuration ? `MONITORING DURATION: ${d.monitoringDuration}` : ""}
${d.documented ? `DOCUMENTATION: ${d.documented}` : ""}
${d.history ? `HISTORY: ${d.history}` : ""}
${d.privateEval ? `PRIVATE EVAL: ${d.privateEval}` : ""}
${d.schoolRelationship ? `SCHOOL RELATIONSHIP: ${d.schoolRelationship}` : ""}
${d.familiarity ? `FAMILIARITY: ${d.familiarity}` : ""}
${d.teacherFeedback ? `TEACHER FEEDBACK: ${d.teacherFeedback}` : ""}
${d.triedAlready?.length ? `ALREADY TRIED: ${d.triedAlready.join(", ")}` : ""}
${d.processStage ? `PROCESS STAGE: ${d.processStage}` : ""}
${d.processConcerns?.length ? `PROCESS CONCERNS: ${d.processConcerns.join(", ")}` : ""}
${d.currentAccommodations?.length ? `CURRENT ACCOMMODATIONS: ${d.currentAccommodations.join(", ")}` : ""}
${d.accommodationsWorking ? `PLAN EFFECTIVENESS: ${d.accommodationsWorking}` : ""}
${d.schoolFollowsPlan ? `IMPLEMENTATION: ${d.schoolFollowsPlan}` : ""}
${d.newConcerns ? `NEW CONCERNS: ${d.newConcerns}` : ""}
${d.lastReview ? `LAST REVIEW: ${d.lastReview}` : ""}
${d.planHistory ? `PLAN IN PLACE FOR: ${d.planHistory}` : ""}
WHAT PARENT NEEDS MOST: ${d.feltNeed}
`.trim();

  const voiceRules = `
VOICE RULES (NON-NEGOTIABLE):
- Do NOT use em dashes anywhere. Use periods, commas, parentheses, or two sentences.
- Do NOT use the rhetorical pattern "this isn't X, it's Y" or any variation.
- Do NOT use phrases like "the simple truth is", "here's the thing", "let me be clear", "more than just".
- Vary sentence lengths. Plain consultant language, not AI summary voice.
- Write like Reese Berry, an Educational Consultant in DFW, Texas, would write to a parent. Warm, informed, direct, parent-centered.
- NEVER use the word "advocate" or "advocacy" referring to the consultant or the tool. (The verb "advocating" referring to the parent's action is acceptable.)
- Texas-first procedural references (TEA, 60 school day evaluation timeline, Procedural Safeguards Notice, ARD, HB 1886 only if dyslexia is present). Where Texas-specific, briefly note non-Texas families should check their state department of education or IDEA federal guidelines.

CLINICAL GUARDRAIL (NON-NEGOTIABLE):
- You do NOT diagnose. You do NOT determine eligibility. You observe patterns and orient toward processes.
- Use language like "the pattern you described", "this is something schools are trained to look at closely", "warrants a formal conversation".
- NEVER use phrases like "your child has", "this confirms", "your child meets eligibility for".
- Acknowledge uncertainty. Normalize "not sure yet" as a valid place to be.
- Cite Procedural Safeguards Notice as the parent's source for documented rights.
`;

  // ─── CONDITIONAL RULES (additive, all may fire on the same profile) ───────
  const conditionalRules = [];

  // Rule 1: long monitoring duration without action.
  const longMonitoring = [
    "Two or more grading periods",
    "A full school year or more",
  ].includes(d.monitoringDuration);
  if (longMonitoring) {
    conditionalRules.push(
      'RULE FIRED [MONITORING_DELAY]: The school has been "monitoring" for two or more grading periods without action. The output MUST include explicit language about the parent\'s right to request a formal evaluation in writing, and that in Texas a written request starts a 60 school day timeline to complete the Full Individual Evaluation. Add a brief one-line note that non-Texas families should check IDEA federal guidelines and their state department of education for their state\'s timeline. Place this language inside the most relevant existing section (the 504/IEP read callout for Exploring, the When to escalate section for Watching, the What to expect next callout for In Process, or the implementation review section for Implementing). Do not invent a new section.'
    );
  }

  // Rule 2: outside evaluation that the school has not acted on.
  const unactedPrivateEval =
    d.privateEval === "Yes, but the school hasn't acted on it" ||
    d.privateEval === "Yes, but the school hasn't seen it or acted on it";
  if (unactedPrivateEval) {
    if (branch === "implementing") {
      conditionalRules.push(
        "RULE FIRED [OUTSIDE_EVAL_IMPLEMENTING]: The family has an outside evaluation the school has not acted on. The output MUST explicitly state that schools are required to consider outside evaluations. Frame this as incorporating the outside evaluation into the existing plan review at the next ARD or 504 review. Reference Texas guidance that the team must consider the evaluation, even if it does not have to adopt every recommendation. Place this inside the Reading your current plan callout or the If implementation is the real issue list."
      );
    } else {
      conditionalRules.push(
        "RULE FIRED [OUTSIDE_EVAL_PRE_PLAN]: The family has an outside evaluation the school has not acted on. The output MUST explicitly state that schools are required to consider outside evaluations as part of the upcoming or requested evaluation, and that the parent can ask in writing for the report to be entered into the record. Place this inside the most relevant callout (504/IEP read for Exploring, When to escalate or What this might be telling you for Watching, What to expect next or What to push for in the evaluation for In Process)."
      );
    }
  }

  // Rule 3: dismissive school dynamic on a parent who is not yet inside a plan.
  const dismissedRelationship = [
    "I feel like I'm not being taken seriously",
    "We've had real disagreements about my child's needs",
  ].includes(d.schoolRelationship);
  const passiveStance = [
    "They say everything is fine",
    "They're monitoring the situation",
  ].includes(d.schoolStance);
  if (
    dismissedRelationship &&
    passiveStance &&
    branch !== "implementing"
  ) {
    conditionalRules.push(
      "RULE FIRED [DISMISSED_PARENT_RIGHTS_QUESTION]: The parent feels dismissed and the school is treating the situation as fine or monitoring only. The questions section MUST include at least one rights-based question that names a written request for a formal evaluation, written documentation of the school's response, or the Procedural Safeguards Notice. Phrase the question in calm consultant voice, not adversarial."
    );
  }

  // Rule 4: dyslexia disclosed.
  const hasDyslexia = (d.diagnoses || []).includes("Dyslexia");
  if (hasDyslexia) {
    conditionalRules.push(
      "RULE FIRED [DYSLEXIA_HB1886]: Dyslexia is on the diagnoses list. The output MUST reference Texas HB 1886 and the TEA Dyslexia Handbook in the most relevant callout or list_with_actions section. Add a brief one-line note that families outside Texas should check their state department of education for that state's dyslexia screening law. Do not assume the family has the handbook. Refer to it by name so they can search for it."
    );
  }

  const conditionalBlock = conditionalRules.length
    ? `\nCONDITIONAL RULES (these MUST be honored, they are additive and can all fire on the same profile):\n- ${conditionalRules.join("\n- ")}\n`
    : "";

  // Branch-specific output structure instructions
  const branchInstructions = {
    exploring: `
This parent is in the EXPLORING track: real concerns, no formal plan or evaluation yet. Output sections (in order):

1. {"title": "What we're seeing.", "type": "narrative", "body": "2-3 sentence narrative reflection of what the parent is seeing. Pattern observation only. Reference history length and impact. Make them feel understood. NO clinical conclusions."}

2. {"title": "504 or IEP: here's our read.", "type": "headline_body", "headline": "One clear sentence pointing toward the right path (e.g., 'Based on what you shared, an IEP path is worth exploring formally'). Use exploratory language, NEVER declarative.", "body": "2-3 sentences explaining why based on this profile.", "callout": "1-2 sentences on the school situation. If documentation is informal/verbal: mention written evaluation requests start a 60 school day timeline in Texas. If outside evaluation not acted on: note schools must consider it. If monitoring 2+ grading periods without action: surface that delay flag."}

3. {"title": "Accommodations to ask for.", "type": "accommodations", "items": [5-7 accommodations with this exact shape: {"name": "Specific name", "whyItHelps": "1-2 sentences tied to THIS profile, not generic", "howToAskFor": "Exact sentence in parent's voice, in quotes", "strengthenIt": "Coach the concept of specificity. Frame as 'one way families strengthen this is...' or 'consider asking for...'. Do NOT prescribe specific numbers/quantities. Give examples that the parent can adapt."}]}

4. {"title": "Questions to bring to your next meeting.", "type": "questions", "items": [3-5 questions calibrated to school stance and relationship]}

5. {"title": "Things to keep in mind.", "type": "list_with_actions", "items": [2-3 items with shape: {"title": "Brief title", "body": "2-4 sentences pairing the situation with a concrete action. Reference Texas process where relevant. Mention written follow-up emails as a documentation strategy where appropriate. Where tools help, suggest 'a written communication tool families use to open dialogue with the school' (without naming a specific form by name).""}]}
`,

    watching: `
This parent is in the WATCHING track: things are slipping but no formal services yet, looking for guidance not necessarily an IEP/504. Output sections (in order):

1. {"title": "What we're seeing.", "type": "narrative", "body": "2-3 sentence reflection. Pattern observation. Acknowledge that early-stage concerns are valid and don't require crisis to address. NO clinical conclusions."}

2. {"title": "What this might be telling you.", "type": "headline_body", "headline": "One sentence framing what these patterns often signal at this stage (e.g., 'The patterns you described often signal a skill gap that responds well to targeted support').", "body": "2-3 sentences explaining what the pattern tends to mean and why early action matters. Do NOT push 504/IEP unless truly warranted. Frame as 'right-sizing the support before things escalate'.", "callout": "1-2 sentences acknowledging that for some children, this is short-term and resolves with the right support. For others, it's an early signal of something larger. Watching closely is appropriate."}

3. {"title": "What works at this stage.", "type": "list_with_actions", "items": [3-4 items with {"title", "body"}: targeted tutoring as primary recommendation, structured home routines, teacher communication, progress monitoring at home. Frame tutoring as VALUABLE for this profile. Mention that AccommodatED Pathways offers tutoring tailored to learning needs as part of the action.]}

4. {"title": "When to escalate.", "type": "list_with_actions", "items": [2-3 items: signals that suggest moving from 'watching' to 'requesting evaluation'. Frame as concrete observable triggers like 'if grades continue to drop after 6 weeks of consistent tutoring' or 'if a teacher raises concerns at the next conference'.]}

5. {"title": "Questions to ask the teacher.", "type": "questions", "items": [3-4 questions for the parent to bring to a teacher conference or email. Focus on observation, data, and what the school is seeing.]}

6. {"title": "What to track at home.", "type": "list_with_actions", "items": [2-3 specific things to watch and document. Frames documentation as a tool for clarity, not paranoia.]}
`,

    inProcess: `
This parent is in the IN PROCESS track: actively in the evaluation pipeline or plan development. Output sections (in order):

1. {"title": "Where you are right now.", "type": "narrative", "body": "2-3 sentences orienting them in the process. Acknowledge what stage they're at (use processStage data) and what typically comes next. Reduce anxiety by naming the path."}

2. {"title": "What to expect next.", "type": "headline_body", "headline": "One sentence setting expectations for the next concrete milestone.", "body": "2-3 sentences walking through what happens next, who's involved, and rough timeline. Texas-specific (60 school day timeline, ARD vs ARDC, eligibility determination).", "callout": "If they expressed worry about being denied: a calming, factual line about appeal rights and IEE rights. If they think testing was insufficient: mention they can request additional assessments before signing."}

3. {"title": "What to push for in the evaluation or ARD.", "type": "list_with_actions", "items": [3-4 specific asks calibrated to processStage and processConcerns. E.g., 'Request that the FIE include cognitive, achievement, processing, and behavioral domains' or 'Ask for specific data showing how each accommodation will be measured'.]}

4. {"title": "Watch-outs in the FIE report or proposed plan.", "type": "list_with_actions", "items": [2-3 specific things to look for when reviewing the FIE or proposed plan. Things that often get glossed over.]}

5. {"title": "Questions to bring to your meeting.", "type": "questions", "items": [3-5 questions calibrated to processStage and concerns]}

6. {"title": "If they say not eligible, what then.", "type": "list_with_actions", "items": [2 items: appeal rights, IEE at public expense, written disagreement on the FIE. Calm and factual. This section ONLY if the parent flagged eligibility worry; if they didn't, replace with 'Things to keep in mind' general items.]}
`,

    implementing: `
This parent is in the IMPLEMENTING track: child has a 504 or IEP. Output focus is REVIEW, STRENGTHEN, ESCALATE — NEVER suggest evaluation since one has already been done. Output sections (in order):

1. {"title": "What we're seeing in your situation.", "type": "narrative", "body": "2-3 sentences reflecting the parent's experience with the current plan. Reference plan type (504/IEP), effectiveness, implementation status. Acknowledge if implementation is the issue vs. the plan content itself."}

2. {"title": "Reading your current plan.", "type": "headline_body", "headline": "One sentence assessing how their plan stacks up given the profile. E.g., 'Your current plan covers the basics but has gaps for this profile' or 'The plan looks adequate on paper, but implementation is where it's breaking down'.", "body": "2-3 sentences identifying what's working, what's missing, and whether the issue is plan content or implementation. If they have a 504 but profile suggests IEP-level needs, raise the escalation question carefully (NOT diagnostic, just procedural).", "callout": "If implementation is the issue: mention requesting a 504 or ARD review meeting. If plan content is the issue: mention adding accommodations doesn't require a full re-evaluation."}

3. {"title": "Strengthen what you have, add what's missing.", "type": "accommodations", "items": [Mix of 5-7 items. For accommodations they ALREADY HAVE (in currentAccommodations data): tag them with 'STRENGTHEN' and focus 'strengthenIt' on making the existing language more specific. For accommodations the profile NEEDS but they DON'T HAVE: tag with 'ADD' and frame 'whyItHelps' as why this is missing for their profile. Use this exact shape with optional 'tag' field: {"name", "tag": "STRENGTHEN" or "ADD", "whyItHelps", "howToAskFor", "strengthenIt"}]}

4. {"title": "If implementation is the real issue.", "type": "list_with_actions", "items": [2-3 actions: documenting follow-up emails after every classroom conversation, requesting an implementation review, asking each teacher to describe how they're implementing each accommodation. Concrete and tactical.]}

5. {"title": "Questions for your next review meeting.", "type": "questions", "items": [3-5 questions calibrated to plan type, effectiveness, and felt need]}

6. {"title": "Things to keep in mind.", "type": "list_with_actions", "items": [2-3 items: IEE rights if they disagree with the school's read of their child, written PWN (Prior Written Notice) requests when changes are denied, the right to request a review meeting at any time without waiting for the annual.]}
`,
  };

  return `You are PathED, an informational tool from AccommodatED Pathways. A Texas family-focused special education navigation tool with national applicability.

PARENT PROFILE:
${profileText}

${voiceRules}

OUTPUT REQUIREMENTS for this ${branch.toUpperCase()} track:
${branchInstructions[branch]}
${conditionalBlock}
ALSO INCLUDE in the JSON:
- "ctaHeadline": One short sentence (under 12 words) that frames the next step based on their feltNeed.
- "ctaBody": 2-3 sentences body explaining what the recommended service does for them specifically. Match the routing logic: feltNeed maps to specific service. Do NOT mention price in this body. Reference the parent's specific situation.

Return ONLY raw JSON in this shape:
{
  "ctaHeadline": "...",
  "ctaBody": "...",
  "sections": [
    { "title": "...", "type": "narrative", "body": "..." },
    { "title": "...", "type": "headline_body", "headline": "...", "body": "...", "callout": "..." },
    ...etc per branch instructions...
  ]
}

Start with { and end with }. No markdown, no preamble.`;
}
