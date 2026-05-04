// CTA routing: maps the parent's felt-need to a primary recommendation, and
// a secondary recommendation that is always Path Planning unless Path Planning
// is itself the primary. The result is that every parent leaves with a clear
// next step plus a low-friction $29 entry point.
import { BRANCHES } from "./branches.js";

export const CTA_MAP = {
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

// Felt-need to [primary, mapped-secondary] tuple. The second element is what
// the route would be if Path Planning were not forced into the secondary
// slot. It only matters when the primary is Path Planning itself, since
// routeCTA() rewrites every other secondary to Path Planning.
const ROUTE_MAP = {
  // Exploring
  "I don't know where to start": ["pathPlanning", null],
  "I want to know if we should request an evaluation": ["pathPlanning", null],
  "To understand what services my child might qualify for": ["pathPlanning", null],
  "To know if this should be a 504 or an IEP": ["iepReview", "pathPlanning"],
  "Help because the school isn't taking this seriously": ["advocateBundle", "pathPlanning"],
  "All of the above honestly": ["pathPlanning", null],

  // Watching
  "Just trying to figure out what to do": ["pathPlanning", "tutoring"],
  "Looking for outside help or a tutor": ["tutoring", "pathPlanning"],
  "Wondering if this will get worse": ["pathPlanning", "tutoring"],
  "Want to know what to track at home": ["pathPlanning", "tutoring"],
  "Need to know when to push the school harder": ["pathPlanning", null],
  "Honestly, I'm not sure what we need yet": ["pathPlanning", "tutoring"],

  // In Process
  "I want to know what to expect at the ARD": ["meetingPrep", "pathPlanning"],
  "I'm worried they'll say not eligible": ["meetingPrep", "pathPlanning"],
  "I think they didn't test for everything": ["iepReview", "pathPlanning"],
  "I need language for my next meeting": ["meetingPrep", null],
  "I want a second opinion on what they're proposing": ["iepReview", "pathPlanning"],
  "I don't know what questions to ask": ["meetingPrep", "pathPlanning"],

  // Implementing
  "I'm not sure if our current plan is working": ["iepReview", "pathPlanning"],
  "I want to strengthen what we have": ["iepReview", "meetingPrep"],
  "We need to add more accommodations": ["meetingPrep", "iepReview"],
  "The school isn't following the plan": ["advocateBundle", "iepReview"],
  "I think we need to escalate (e.g. 504 to IEP)": ["iepReview", "meetingPrep"],
  "I need help preparing for our next review": ["meetingPrep", "iepReview"],
};

export function routeCTA(branch, feltNeed) {
  const [primaryKey, mappedSecondaryKey] = ROUTE_MAP[feltNeed] || ["pathPlanning", null];
  // Path Planning is always the secondary when it is not the primary. This
  // guarantees the $29 entry point appears on every result, and that no
  // result pairs two high-ticket services without Path Planning between them.
  const secondaryKey =
    primaryKey === "pathPlanning" ? mappedSecondaryKey : "pathPlanning";
  return {
    primary: CTA_MAP[primaryKey],
    secondary: secondaryKey ? CTA_MAP[secondaryKey] : null,
  };
}

// Invariant: every felt-need on every branch must resolve to a primary CTA.
// Runs once at module load. A missing entry trips here at import time
// instead of silently falling back to Path Planning at request time.
for (const b of Object.values(BRANCHES)) {
  for (const fn of b.feltNeeds) {
    if (!routeCTA(b.id, fn).primary) {
      throw new Error(`routeCTA: missing primary for "${fn}" (branch ${b.id})`);
    }
  }
}
