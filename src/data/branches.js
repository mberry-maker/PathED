// Static data shared across the wizard. Branch-specific question text and
// option lists live with the steps inside App.jsx, but anything the prompt
// builder, the Reese notification, or other modules also need lives here.

export const GRADES = [
  "Pre-K or Kindergarten",
  "1st – 2nd grade",
  "3rd – 5th grade",
  "6th – 8th grade",
  "9th – 12th grade",
];

// Full struggles taxonomy used by Exploring, In Process, and Implementing.
export const STRUGGLES_FULL = [
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

// Lighter taxonomy for the Watching branch.
export const STRUGGLES_LIGHT = [
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

export const COMMON_ACCOMMODATIONS = [
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

export const DIAGNOSES = [
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

// The four entry tracks. Each carries the picker copy, the short tag for the
// header pill, and the felt-need options for that track. Adding a track
// requires three things: an entry here, a step list in getSteps(), and at
// least one route per felt-need in src/data/cta.js.
export const BRANCHES = {
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
