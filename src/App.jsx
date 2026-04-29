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
    button, [role="button"] { transition: all 0.15s ease; }
    a { color: inherit; }
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
  const route = map[feltNeed] || ["pathPlanning", null];
  return { primary: CTA_MAP[route[0]], secondary: route[1] ? CTA_MAP[route[1]] : null };
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
    schoolFollowsPlan: null,
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [shareWithReese, setShareWithReese] = useState(true);
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

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
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          emailOptIn,
          shareWithReese,
          branch,
          results,       // full AI-generated profile — used to build the HTML email
          data: {
            feltNeed:    data.feltNeed    || "",
            grade:       data.grade       || "",
            schoolStance: data.schoolStance || "",
          },
        }),
      });
    } catch (e) {
      console.error("Subscribe error:", e);
    }
    // Always show success regardless — don't block on API errors
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
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 96px" }}>
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
            onEmailSubmit={handleEmailSubmit}
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
          style={{ cursor: "pointer", display: "flex", alignItems: "baseline", gap: 10 }}
        >
          <span
            style={{
              fontSize: 19,
              fontWeight: 700,
              color: C.navy,
              letterSpacing: "-0.02em",
            }}
          >
            Path<span style={{ color: C.teal }}>ED</span>
          </span>
          <span
            className="mono"
            style={{
              fontSize: 10,
              color: C.muted,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            by AccommodatED
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
    <div className="fade-in" style={{ paddingTop: 32 }}>
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
          padding: "28px 28px 24px",
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          marginBottom: 24,
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 11,
            color: C.muted,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          Where are you right now?
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Object.values(BRANCHES).map((b) => (
            <button
              key={b.id}
              onClick={() => onPick(b.id)}
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                padding: "16px 18px",
                borderRadius: 4,
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 14,
                color: C.text,
                fontSize: 14,
                lineHeight: 1.5,
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
                className="num"
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: C.teal,
                  flexShrink: 0,
                  minWidth: 100,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  background: C.tealSoft,
                  padding: "3px 8px",
                  borderRadius: 3,
                  lineHeight: 1.5,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {b.short}
              </span>
              <span style={{ flex: 1, fontSize: 13 }}>{b.label}</span>
              <span style={{ color: C.mutedLight, fontSize: 16 }}>→</span>
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
          marginBottom: 14,
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
          lineHeight: 1.18,
          fontWeight: 600,
          color: C.navy,
          margin: "0 0 12px 0",
          letterSpacing: "-0.02em",
        }}
      >
        {step.question}
      </h2>
      {step.subtext && (
        <p style={{ fontSize: 14, color: C.muted, marginBottom: 28, lineHeight: 1.5 }}>
          {step.subtext}
        </p>
      )}

      <div style={{ marginTop: step.subtext ? 0 : 28 }}>
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
                marginTop: 24,
                paddingTop: 24,
                borderTop: `1px dashed ${C.borderStrong}`,
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  color: C.teal,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 600,
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ color: C.borderStrong }}>↳</span> Follow-up
              </div>
              <div style={{ fontSize: 16, fontWeight: 500, color: C.ink, marginBottom: 14 }}>
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
          marginTop: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            color: C.muted,
            border: "none",
            padding: "10px 0",
            fontSize: 13,
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!canAdvance}
          style={{
            background: canAdvance ? C.navy : C.bgAlt,
            color: canAdvance ? "#fff" : C.mutedLight,
            border: canAdvance ? "none" : `1px solid ${C.border}`,
            padding: "13px 28px",
            fontSize: 13,
            fontWeight: 600,
            borderRadius: 4,
            cursor: canAdvance ? "pointer" : "not-allowed",
            letterSpacing: "0.01em",
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
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {options.map((opt) => {
        const sel = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              background: sel ? C.navy : C.surface,
              color: sel ? "#fff" : C.text,
              border: `1px solid ${sel ? C.navy : C.border}`,
              padding: "13px 16px",
              fontSize: 14,
              lineHeight: 1.5,
              borderRadius: 4,
              textAlign: "left",
              cursor: "pointer",
              fontWeight: sel ? 500 : 400,
              fontFamily: "inherit",
            }}
            onMouseOver={(e) => {
              if (!sel) e.currentTarget.style.borderColor = C.teal;
            }}
            onMouseOut={(e) => {
              if (!sel) e.currentTarget.style.borderColor = C.border;
            }}
          >
            {opt}
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
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {options.map((opt) => {
        const sel = values.includes(opt);
        return (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            style={{
              background: sel ? C.tealSoft : C.surface,
              color: C.text,
              border: `1px solid ${sel ? C.teal : C.border}`,
              padding: "13px 16px",
              fontSize: 14,
              lineHeight: 1.5,
              borderRadius: 4,
              textAlign: "left",
              cursor: "pointer",
              fontWeight: sel ? 500 : 400,
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: "inherit",
            }}
          >
            <Check checked={sel} />
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
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {options.map((opt) => {
          const sel = values.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              style={{
                background: sel ? C.tealSoft : C.surface,
                color: C.text,
                border: `1px solid ${sel ? C.teal : C.border}`,
                padding: "13px 16px",
                fontSize: 14,
                lineHeight: 1.5,
                borderRadius: 4,
                textAlign: "left",
                cursor: "pointer",
                fontWeight: sel ? 500 : 400,
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontFamily: "inherit",
              }}
            >
              <Check checked={sel} />
              <span style={{ flex: 1 }}>{opt}</span>
            </button>
          );
        })}
      </div>
      {otherSel && (
        <div className="slide-down" style={{ marginTop: 12 }}>
          <input
            type="text"
            value={otherValue}
            onChange={(e) => onOtherChange(e.target.value)}
            placeholder="Type what's on your child's record..."
            style={{
              width: "100%",
              padding: "12px 14px",
              fontSize: 14,
              border: `1px solid ${C.borderStrong}`,
              borderRadius: 4,
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
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {taxonomy.map((c) => {
        const open = categories.includes(c.cat);
        const selectedCount = (specifics[c.cat] || []).length;
        return (
          <div
            key={c.cat}
            style={{
              border: `1px solid ${open ? C.teal : C.border}`,
              borderRadius: 4,
              overflow: "hidden",
              background: open ? C.tealSoft : C.surface,
            }}
          >
            <button
              onClick={() => toggleCat(c.cat)}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                padding: "14px 16px",
                fontSize: 14,
                fontWeight: open ? 600 : 500,
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: C.text,
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
                    padding: "2px 8px",
                    borderRadius: 10,
                    fontWeight: 600,
                  }}
                >
                  {selectedCount}
                </span>
              )}
              <span
                style={{
                  color: C.mutedLight,
                  fontSize: 14,
                  transform: open ? "rotate(90deg)" : "none",
                  transition: "transform 0.2s",
                }}
              >
                ›
              </span>
            </button>
            {open && (
              <div className="slide-down" style={{ padding: "0 12px 14px 40px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {c.items.map((item) => {
                    const sel = (specifics[c.cat] || []).includes(item);
                    return (
                      <label
                        key={item}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "8px 10px",
                          fontSize: 13,
                          color: C.text,
                          cursor: "pointer",
                          borderRadius: 3,
                          background: sel ? "rgba(255,255,255,0.6)" : "transparent",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={sel}
                          onChange={() => toggleSpec(c.cat, item)}
                          style={{
                            width: 14,
                            height: 14,
                            accentColor: C.teal,
                            cursor: "pointer",
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
          borderRadius: 4,
          background: otherSel ? C.tealSoft : C.surface,
        }}
      >
        <button
          onClick={() => toggleCat(otherCat)}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            padding: "14px 16px",
            fontSize: 14,
            fontWeight: otherSel ? 600 : 500,
            cursor: "pointer",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: C.text,
            fontFamily: "inherit",
          }}
        >
          <Check checked={otherSel} />
          <span style={{ flex: 1 }}>Other (not listed)</span>
        </button>
        {otherSel && (
          <div className="slide-down" style={{ padding: "0 16px 14px 16px" }}>
            <input
              type="text"
              value={otherValue}
              onChange={(e) => onOtherChange(e.target.value)}
              placeholder="Tell us what's on your mind..."
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: 13,
                border: `1px solid ${C.borderStrong}`,
                borderRadius: 4,
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

function Check({ checked }) {
  return (
    <div
      style={{
        width: 16,
        height: 16,
        borderRadius: 3,
        border: `1.5px solid ${checked ? C.teal : C.borderStrong}`,
        background: checked ? C.teal : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: 11,
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
  onEmailSubmit,
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
        className="stagger-1"
        style={{
          paddingBottom: 22,
          borderBottom: `1px solid ${C.border}`,
          marginBottom: 28,
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.14em",
            color: C.teal,
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 10,
          }}
        >
          PathED Profile · {BRANCHES[branch].short} Track
        </div>
        <div
          style={{
            fontSize: 26,
            color: C.navy,
            fontWeight: 700,
            lineHeight: 1.18,
            marginBottom: 6,
            letterSpacing: "-0.02em",
          }}
        >
          Generated {today}
        </div>
        <div className="mono" style={{ fontSize: 11, color: C.muted, letterSpacing: "0.05em" }}>
          Powered by AccommodatED Pathways · contact@accommodatedpathways.com
        </div>
      </div>

      {/* Safeguard */}
      <div
        className="stagger-2"
        style={{
          background: C.bgAlt,
          border: `1px solid ${C.border}`,
          borderRadius: 4,
          padding: "13px 16px",
          fontSize: 12,
          lineHeight: 1.65,
          color: C.muted,
          marginBottom: 32,
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
          className={`stagger-${Math.min(i + 3, 7)}`}
        >
          <SectionBody section={section} />
        </Section>
      ))}

      {/* Primary CTA */}
      <div
        className="stagger-7"
        style={{
          background: C.navy,
          color: "#fff",
          padding: "36px 30px",
          borderRadius: 6,
          marginBottom: 28,
          marginTop: 8,
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.14em",
            color: C.tealLight,
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 14,
          }}
        >
          Your next step
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            lineHeight: 1.22,
            marginBottom: 12,
            letterSpacing: "-0.02em",
          }}
        >
          {results.ctaHeadline || "Let's take this further."}
        </div>
        <p style={{ fontSize: 14.5, lineHeight: 1.65, marginBottom: 22, opacity: 0.92 }}>
          {results.ctaBody}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            paddingTop: 18,
            borderTop: `1px solid rgba(255,255,255,0.12)`,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 160 }}>
            <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 2 }}>
              {ctas.primary.service}
            </div>
            <div className="mono" style={{ fontSize: 12, opacity: 0.7, letterSpacing: "0.04em" }}>
              {ctas.primary.price} · {ctas.primary.duration}
            </div>
          </div>
          <a
            href={ctas.primary.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: C.teal,
              color: "#fff",
              padding: "13px 26px",
              borderRadius: 4,
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.02em",
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
          </div>
        )}
      </div>

      {/* Email capture */}
      <div
        className="stagger-7"
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          padding: "24px 26px",
          marginBottom: 22,
        }}
      >
        {!emailSubmitted ? (
          <>
            <div style={{ fontSize: 18, fontWeight: 600, color: C.navy, marginBottom: 6, letterSpacing: "-0.01em" }}>
              Want a copy of your profile?
            </div>
            <div style={{ fontSize: 14, color: C.text, lineHeight: 1.55, marginBottom: 16 }}>
              We'll email you your full PathED Profile so you can save it, share it, or bring it
              to your next meeting.
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                width: "100%",
                padding: "12px 14px",
                fontSize: 14,
                border: `1px solid ${C.borderStrong}`,
                borderRadius: 4,
                background: C.surface,
                color: C.text,
                outline: "none",
                marginBottom: 14,
                fontFamily: "inherit",
              }}
            />
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                fontSize: 13,
                color: C.text,
                lineHeight: 1.5,
                marginBottom: 10,
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
                gap: 10,
                fontSize: 13,
                color: C.muted,
                lineHeight: 1.5,
                marginBottom: 18,
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
                padding: "12px 24px",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 4,
                cursor: "pointer",
                width: "100%",
                letterSpacing: "0.01em",
              }}
            >
              Send my profile →
            </button>
          </>
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
        style={{
          display: "flex",
          gap: 18,
          paddingTop: 22,
          borderTop: `1px solid ${C.border}`,
          fontSize: 12,
          alignItems: "center",
        }}
      >
        <button
          onClick={() => window.print()}
          style={{
            background: "transparent",
            color: C.muted,
            border: "none",
            cursor: "pointer",
            fontSize: 12,
            padding: 0,
            fontFamily: "inherit",
          }}
        >
          🖨 Print or save as PDF
        </button>
        <span style={{ color: C.borderStrong }}>·</span>
        <button
          onClick={onReset}
          style={{
            background: "transparent",
            color: C.muted,
            border: "none",
            cursor: "pointer",
            fontSize: 12,
            padding: 0,
            fontFamily: "inherit",
          }}
        >
          Start over
        </button>
      </div>
    </div>
  );
}

function Section({ number, title, children, className }) {
  return (
    <div className={className} style={{ marginBottom: 36 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14 }}>
        <span
          className="num"
          style={{
            fontSize: 12,
            color: C.teal,
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          {number}
        </span>
        <h3
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: C.navy,
            margin: 0,
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h3>
      </div>
      <div>{children}</div>
    </div>
  );
}

function SectionBody({ section }) {
  // Render based on section.type
  if (section.type === "narrative") {
    return (
      <p style={{ fontSize: 15.5, lineHeight: 1.7, color: C.text, margin: 0 }}>
        {section.body}
      </p>
    );
  }
  if (section.type === "headline_body") {
    return (
      <>
        <div
          style={{
            fontSize: 17,
            lineHeight: 1.5,
            color: C.navy,
            fontWeight: 600,
            marginBottom: 12,
            letterSpacing: "-0.01em",
          }}
        >
          {section.headline}
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: C.text, marginBottom: 14 }}>
          {section.body}
        </p>
        {section.callout && (
          <div
            style={{
              padding: "13px 16px",
              background: C.tealSoft,
              borderLeft: `3px solid ${C.teal}`,
              fontSize: 13.5,
              lineHeight: 1.65,
              color: C.text,
              borderRadius: "0 4px 4px 0",
            }}
          >
            {section.callout}
          </div>
        )}
      </>
    );
  }
  if (section.type === "accommodations") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {section.items.map((a, i) => (
          <div
            key={i}
            style={{
              padding: "18px 20px",
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 5,
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: C.navy,
                marginBottom: 12,
                letterSpacing: "-0.01em",
              }}
            >
              {a.name}
              {a.tag && (
                <span
                  className="mono"
                  style={{
                    marginLeft: 10,
                    fontSize: 9.5,
                    fontWeight: 600,
                    background: a.tag === "STRENGTHEN" ? C.warningSoft : C.tealSoft,
                    color: a.tag === "STRENGTHEN" ? C.warning : C.teal,
                    padding: "2px 7px",
                    borderRadius: 2,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    verticalAlign: "middle",
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
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {section.items.map((q, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 14,
              paddingBottom: 12,
              borderBottom: i < section.items.length - 1 ? `1px solid ${C.border}` : "none",
            }}
          >
            <span
              className="num"
              style={{
                fontSize: 18,
                color: C.teal,
                fontWeight: 600,
                flexShrink: 0,
                width: 28,
                paddingTop: 2,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div style={{ fontSize: 14.5, lineHeight: 1.6, color: C.text }}>{q}</div>
          </div>
        ))}
      </div>
    );
  }
  if (section.type === "list_with_actions") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {section.items.map((t, i) => (
          <div key={i} style={{ paddingLeft: 14, borderLeft: `2px solid ${C.teal}` }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: C.navy,
                marginBottom: 5,
                letterSpacing: "-0.01em",
              }}
            >
              {t.title}
            </div>
            <div style={{ fontSize: 13.5, lineHeight: 1.65, color: C.text }}>{t.body}</div>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function AccDetail({ label, body, italic, last }) {
  return (
    <div style={{ marginBottom: last ? 0 : 10 }}>
      <div
        className="mono"
        style={{
          fontSize: 9.5,
          letterSpacing: "0.12em",
          color: C.teal,
          textTransform: "uppercase",
          fontWeight: 600,
          marginBottom: 3,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 13.5,
          lineHeight: 1.6,
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
function buildPrompt(branch, d) {
  const struggleSummary =
    Object.entries(d.struggleSpecifics || {})
      .map(([cat, items]) => `${cat}: ${items.join(", ")}`)
      .join(" | ") || "(none specified)";

  const profileText = `
GRADE: ${d.grade}
PLAN STATUS: ${branch}
${d.planType ? `PLAN TYPE: ${d.planType}` : ""}
${d.diagnoses?.length ? `DIAGNOSES: ${d.diagnoses.join(", ")}${d.diagnosisOther ? " (Other: " + d.diagnosisOther + ")" : ""}` : ""}
${d.struggleCategories?.length ? `STRUGGLES BY CATEGORY: ${struggleSummary}` : ""}
${d.struggleOther ? `STRUGGLE OTHER NOTE: ${d.struggleOther}` : ""}
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

6. {"title": "If they say 'not eligible' — what then.", "type": "list_with_actions", "items": [2 items: appeal rights, IEE at public expense, written disagreement on the FIE. Calm and factual. This section ONLY if the parent flagged eligibility worry; if they didn't, replace with 'Things to keep in mind' general items.]}
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
