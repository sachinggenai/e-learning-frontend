# Design Plan: Diagnostic Templates

## Overview

The Diagnostic category evaluates learner baseline knowledge, identifies skill gaps, and suggests personalized learning routes. These templates are intended for early-stage intake and mid-course recalibration.

- Category: `diagnostic`
- Templates: 5
- Primary intent: baseline assessment and adaptive direction
- Completion capability: `interact`
- Scoring: enabled (with optional weighted scoring)

---

## Template 1: Pre-Assessment

### Purpose
Capture learner baseline understanding before instruction begins.

### Preview UX
- Introduction/instructions
- Question blocks (MCQ/true-false/short answer)
- Optional timer and progress indicator
- Submit + summary state

### Editor UX
- Assessment title and instructions
- Question CRUD with type selector
- Answer key configuration
- Timer toggle and pass threshold

### Functional Requirements
- Support mixed question types
- Auto-score objective question types
- Optional manual review flags for short answers
- Persist attempt metadata

### Data Contract
```ts
interface DiagnosticQuestion {
  id: string;
  type: 'mcq' | 'true-false' | 'short';
  prompt: string;
  options?: string[];
  correctAnswer?: string | boolean;
  weight?: number;
}

interface PreAssessmentData {
  title: string;
  instructions?: string;
  questions: DiagnosticQuestion[];
  passThreshold?: number; // 0-100
  timed?: boolean;
  durationMins?: number;
}
```

### Interaction Events
- `pre_assessment_started`
- `question_answered`
- `pre_assessment_submitted`

---

## Template 2: Diagnostic Quiz

### Purpose
Run targeted diagnostics by topic/domain and output categorized proficiency.

### Preview UX
- Topic-based question flow
- Per-topic progress
- Final report by topic score

### Editor UX
- Topic group setup
- Question bank mapping to topics
- Difficulty controls
- Result band definitions

### Functional Requirements
- Group questions by topic tags
- Calculate score per topic and overall
- Map score to proficiency labels
- Retry mode optional

### Data Contract
```ts
interface TopicQuestion extends DiagnosticQuestion {
  topic: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface DiagnosticQuizData {
  title: string;
  topics: string[];
  questions: TopicQuestion[];
  proficiencyBands?: Array<{ label: string; min: number; max: number }>;
  allowRetry?: boolean;
}
```

### Interaction Events
- `topic_quiz_started`
- `topic_completed`
- `diagnostic_quiz_finished`

---

## Template 3: Skill Gap Analysis

### Purpose
Compare required competency levels vs current learner performance to reveal gaps.

### Preview UX
- Skill rows with current vs target values
- Gap magnitude badges
- Priority ranking

### Editor UX
- Skills CRUD
- Target level configuration
- Gap severity thresholds
- Sort/priority options

### Functional Requirements
- Compute `gap = target - current`
- Highlight high-priority gaps
- Suggest remediation link per skill
- Export-ready summary

### Data Contract
```ts
interface SkillGapItem {
  id: string;
  skill: string;
  currentLevel: number; // 0-100
  targetLevel: number; // 0-100
  remediationLink?: string;
}

interface SkillGapAnalysisData {
  title: string;
  items: SkillGapItem[];
  highGapThreshold?: number;
  showRecommendations?: boolean;
}
```

### Interaction Events
- `gap_item_viewed`
- `remediation_opened`

---

## Template 4: Adaptive Learning Path

### Purpose
Render a recommended sequence of learning units based on diagnostic outcomes.

### Preview UX
- Path nodes/cards in sequence
- Required vs optional modules
- Estimated time per node
- Locked/unlocked states

### Editor UX
- Path node CRUD
- Rule mapping from score bands to path branches
- Node prerequisites
- Completion behavior toggle

### Functional Requirements
- Resolve branch by diagnostic profile
- Enforce prerequisites
- Display current step and next best step
- Track path progression

### Data Contract
```ts
interface PathNode {
  id: string;
  title: string;
  moduleId?: string;
  required: boolean;
  estimatedMins?: number;
  prerequisites?: string[];
}

interface AdaptiveLearningPathData {
  title: string;
  nodes: PathNode[];
  branchRules?: Array<{ condition: string; includeNodeIds: string[] }>;
  currentNodeId?: string;
}
```

### Interaction Events
- `path_node_opened`
- `path_progressed`

---

## Template 5: Recommendation Card

### Purpose
Present concise, actionable recommendations based on learner diagnostic profile.

### Preview UX
- Recommendation headline
- Reasoning snippet
- Priority tag
- CTA button (start module/view resource)

### Editor UX
- Card content fields
- Priority and category settings
- Rule binding to diagnostics
- CTA target configuration

### Functional Requirements
- Conditional rendering by learner profile
- Priority sorting
- CTA click tracking
- Optional expiration validity

### Data Contract
```ts
interface RecommendationItem {
  id: string;
  title: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
  ctaLabel?: string;
  ctaTarget?: string;
  condition?: string;
}

interface RecommendationCardData {
  title: string;
  recommendations: RecommendationItem[];
  maxVisible?: number;
}
```

### Interaction Events
- `recommendation_viewed`
- `recommendation_cta_clicked`

---

## Shared Design Guidance

### Theme Tokens
- `--theme-primary`
- `--theme-success`
- `--theme-warning`
- `--theme-error`
- `--theme-info`
- `--theme-text`
- `--theme-surface`
- `--theme-border`

### BEM Pattern
- `.tpl-{template}`
- `.tpl-{template}__{element}`
- `.tpl-{template}__{element}--{modifier}`

### Accessibility
- Keyboard complete for all interactions
- Clear focus states for answers/options/buttons
- Error and validation messaging with aria attributes
- Do not rely on color alone for score/gap feedback

### Responsive
- Desktop: multi-column summaries
- Tablet: 2-column diagnostics
- Mobile: single-column flow, sticky submit/next controls

---

## Suggested Registration Metadata

- `pre-assessment` (icon: `clipboard-pen`)
- `diagnostic-quiz` (icon: `file-question`)
- `skill-gap-analysis` (icon: `chart-column-increasing`)
- `adaptive-learning-path` (icon: `route`)
- `recommendation-card` (icon: `sparkles`)
