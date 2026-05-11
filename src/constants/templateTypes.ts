// ─── Component Categories ─────────────────────────────────────────
export type ComponentCategory =
  | "content-presentation"
  | "process-flow"
  | "interaction"
  | "scenario"
  | "assessment"
  | "comparison"
  | "media-rich"
  | "microlearning"
  | "navigation"
  | "gamification"
  | "compliance"
  | "diagnostic"
  | "practice"
  | "feedback"
  | "social"
  | "accessibility"
  | "analytics";

export const COMPONENT_CATEGORIES: Record<
  ComponentCategory,
  { displayName: string; icon: string }
> = {
  "content-presentation": {
    displayName: "Content Presentation",
    icon: "layers",
  },
  "process-flow": { displayName: "Process & Flow", icon: "git-merge" },
  interaction: { displayName: "Interaction", icon: "hand-pointer" },
  scenario: { displayName: "Scenario-Based", icon: "route" },
  assessment: { displayName: "Assessment", icon: "clipboard-check" },
  comparison: { displayName: "Comparison & Analysis", icon: "columns" },
  "media-rich": { displayName: "Media-Rich", icon: "film" },
  microlearning: { displayName: "Microlearning", icon: "bolt" },
  navigation: { displayName: "Navigation & Structural", icon: "sitemap" },
  gamification: { displayName: "Gamification", icon: "trophy" },
  compliance: { displayName: "Compliance & Corporate", icon: "shield-check" },
  diagnostic: { displayName: "Diagnostic & Adaptive", icon: "stethoscope" },
  practice: { displayName: "Practice & Simulation", icon: "flask" },
  feedback: { displayName: "Feedback & Reflection", icon: "comment-dots" },
  social: { displayName: "Social & Collaborative", icon: "users" },
  accessibility: {
    displayName: "Accessibility & Support",
    icon: "universal-access",
  },
  analytics: { displayName: "Analytics & Learning Insight", icon: "chart-bar" },
};

// ─── All Component Type IDs ───────────────────────────────────────
export type ComponentTypeId =
  // Content Presentation
  | "tabs"
  | "accordion"
  | "click-reveal"
  | "timeline"
  | "image-hotspots"
  | "layered-content"
  | "text-with-media"
  // Process & Flow
  | "step-by-step"
  | "cycle-diagram"
  | "flowchart"
  | "process-map"
  | "decision-tree"
  // Interaction
  | "drag-and-drop"
  | "flip-cards"
  | "slider"
  | "carousel"
  | "clickable-icons"
  // Scenario-Based
  | "scenario"
  | "branching-scenario"
  | "role-play-simulation"
  | "case-study"
  // Assessment
  | "mcq"
  | "multiple-select"
  | "true-false"
  | "fill-blanks"
  | "matching"
  | "scenario-question"
  | "knowledge-check"
  | "final-assessment"
  // Comparison & Analysis
  | "comparison-table"
  | "pros-cons"
  | "before-after"
  | "matrix-grid"
  // Media-Rich
  | "video-slide"
  | "audio-slide"
  | "animated-explainer"
  | "infographic"
  // Microlearning
  | "microlearning-cards"
  | "flashcards"
  | "quick-tips"
  // Navigation & Structural
  | "course-menu"
  | "learning-roadmap"
  | "module-overview"
  | "summary-takeaways"
  | "resources-downloads"
  // Gamification
  | "quiz-game"
  | "points-badges"
  | "progress-tracker"
  | "level-learning"
  // Compliance & Corporate
  | "policy-acknowledgement"
  | "dos-donts"
  | "code-of-conduct"
  | "regulatory-scenario"
  | "audit-checklist"
  // Diagnostic & Adaptive
  | "pre-assessment"
  | "diagnostic-quiz"
  | "skill-gap-analysis"
  | "adaptive-learning-path"
  | "recommendation-card"
  // Practice & Simulation
  | "guided-practice"
  | "try-it-simulation"
  | "software-simulation"
  | "sandbox-practice"
  | "error-identification"
  // Feedback & Reflection
  | "reflective-question"
  | "learner-journal"
  | "self-assessment"
  | "confidence-rating"
  | "action-planning"
  // Social & Collaborative
  | "discussion-prompt"
  | "peer-review"
  | "poll-vote"
  | "team-challenge"
  | "scenario-debate"
  // Accessibility & Support
  | "accessibility-tip"
  | "keyboard-nav-guide"
  | "screen-reader-guide"
  | "language-selector"
  | "transcript-caption"
  // Analytics & Learning Insight
  | "progress-summary"
  | "performance-dashboard"
  | "skill-mastery-report"
  | "completion-certificate"
  | "manager-review"
  // Legacy types
  | "welcome"
  | "content-text"
  | "content-video"
  | "content-image"
  | "summary"
  | "interactive";

// ─── Category mapping for every component type ────────────────────
export const COMPONENT_TYPE_CATEGORY: Record<
  ComponentTypeId,
  ComponentCategory
> = {
  // Content Presentation
  tabs: "content-presentation",
  accordion: "content-presentation",
  "click-reveal": "content-presentation",
  timeline: "content-presentation",
  "image-hotspots": "content-presentation",
  "layered-content": "content-presentation",
  "text-with-media": "content-presentation",
  // Process & Flow
  "step-by-step": "process-flow",
  "cycle-diagram": "process-flow",
  flowchart: "process-flow",
  "process-map": "process-flow",
  "decision-tree": "process-flow",
  // Interaction
  "drag-and-drop": "interaction",
  "flip-cards": "interaction",
  slider: "interaction",
  carousel: "interaction",
  "clickable-icons": "interaction",
  // Scenario-Based
  scenario: "scenario",
  "branching-scenario": "scenario",
  "role-play-simulation": "scenario",
  "case-study": "scenario",
  // Assessment
  mcq: "assessment",
  "multiple-select": "assessment",
  "true-false": "assessment",
  "fill-blanks": "assessment",
  matching: "assessment",
  "scenario-question": "assessment",
  "knowledge-check": "assessment",
  "final-assessment": "assessment",
  // Comparison & Analysis
  "comparison-table": "comparison",
  "pros-cons": "comparison",
  "before-after": "comparison",
  "matrix-grid": "comparison",
  // Media-Rich
  "video-slide": "media-rich",
  "audio-slide": "media-rich",
  "animated-explainer": "media-rich",
  infographic: "media-rich",
  // Microlearning
  "microlearning-cards": "microlearning",
  flashcards: "microlearning",
  "quick-tips": "microlearning",
  // Navigation & Structural
  "course-menu": "navigation",
  "learning-roadmap": "navigation",
  "module-overview": "navigation",
  "summary-takeaways": "navigation",
  "resources-downloads": "navigation",
  // Gamification
  "quiz-game": "gamification",
  "points-badges": "gamification",
  "progress-tracker": "gamification",
  "level-learning": "gamification",
  // Compliance & Corporate
  "policy-acknowledgement": "compliance",
  "dos-donts": "compliance",
  "code-of-conduct": "compliance",
  "regulatory-scenario": "compliance",
  "audit-checklist": "compliance",
  // Diagnostic & Adaptive
  "pre-assessment": "diagnostic",
  "diagnostic-quiz": "diagnostic",
  "skill-gap-analysis": "diagnostic",
  "adaptive-learning-path": "diagnostic",
  "recommendation-card": "diagnostic",
  // Practice & Simulation
  "guided-practice": "practice",
  "try-it-simulation": "practice",
  "software-simulation": "practice",
  "sandbox-practice": "practice",
  "error-identification": "practice",
  // Feedback & Reflection
  "reflective-question": "feedback",
  "learner-journal": "feedback",
  "self-assessment": "feedback",
  "confidence-rating": "feedback",
  "action-planning": "feedback",
  // Social & Collaborative
  "discussion-prompt": "social",
  "peer-review": "social",
  "poll-vote": "social",
  "team-challenge": "social",
  "scenario-debate": "social",
  // Accessibility & Support
  "accessibility-tip": "accessibility",
  "keyboard-nav-guide": "accessibility",
  "screen-reader-guide": "accessibility",
  "language-selector": "accessibility",
  "transcript-caption": "accessibility",
  // Analytics & Learning Insight
  "progress-summary": "analytics",
  "performance-dashboard": "analytics",
  "skill-mastery-report": "analytics",
  "completion-certificate": "analytics",
  "manager-review": "analytics",
  // Legacy types mapped to nearest category
  welcome: "content-presentation",
  "content-text": "content-presentation",
  "content-video": "media-rich",
  "content-image": "media-rich",
  summary: "navigation",
  interactive: "interaction",
};

// ─── All component type IDs as an array ───────────────────────────
export const ALL_COMPONENT_TYPE_IDS: ComponentTypeId[] = Object.keys(
  COMPONENT_TYPE_CATEGORY,
) as ComponentTypeId[];

// ─── Legacy compatibility ─────────────────────────────────────────
export type CanonicalTemplateType = ComponentTypeId;

const legacyAliases: Record<string, ComponentTypeId> = {
  video: "content-video",
  text: "content-text",
  quiz: "mcq",
  image: "content-image",
  // Assessment aliases — canonical runtime types per backend contract
  "multi-select": "multiple-select",
  "fill-blanks": "fill-blanks", // kept as-is; normalizeComponentType maps to fill-in-blank
  "fill-blank": "fill-blanks", // legacy single-blank shorthand
};

/**
 * Normalize a raw template/component type string to a canonical ComponentTypeId.
 * Handles legacy aliases, category names, and case-insensitive lookup.
 */
export function normalizeTemplateType(
  raw: string | undefined | null,
): ComponentTypeId {
  const key = (raw || "").toLowerCase().trim();
  // Check legacy aliases first
  if (key in legacyAliases) return legacyAliases[key];
  // Check if it's a valid component type ID
  if (key in COMPONENT_TYPE_CATEGORY) return key as ComponentTypeId;
  // Check if it's a category name directly and map to a representative type
  const categoryMap: Record<string, ComponentTypeId> = {
    "content-presentation": "tabs",
    "process-flow": "step-by-step",
    interaction: "drag-and-drop",
    scenario: "scenario",
    assessment: "mcq",
    comparison: "comparison-table",
    "media-rich": "video-slide",
    microlearning: "microlearning-cards",
    navigation: "course-menu",
    gamification: "quiz-game",
    compliance: "policy-acknowledgement",
    diagnostic: "pre-assessment",
    practice: "guided-practice",
    feedback: "reflective-question",
    social: "discussion-prompt",
    accessibility: "accessibility-tip",
    analytics: "progress-summary",
  };
  if (key in categoryMap) return categoryMap[key as ComponentCategory];
  // Default fallback
  return "content-text";
}

/** @deprecated Use ALL_COMPONENT_TYPE_IDS instead */
export const CANONICAL_TEMPLATE_TYPES: CanonicalTemplateType[] = [
  "welcome",
  "content-text",
  "content-video",
  "mcq",
  "summary",
  "content-image",
  "interactive",
];
