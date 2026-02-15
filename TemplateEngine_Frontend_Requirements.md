# Template Engine - Frontend Requirements Specification
**Version**: 2.0 | **Date**: February 2026 | **Status**: Draft

## 1. Executive Summary
This document specifies frontend architecture changes to implement the Template Engine. The Template Engine generates different types of templates (Accordion, Tabs, Image+Text, Audio+Text, etc.). Each template type is a **component** (e.g., Accordion Component, Tab Component). Users can insert components into pages, combine multiple components per page, attach per-interaction audio, track completion, compute scores, and apply course/page-level theming.

Key deliverables:
- **Component Registry** — extensible, category-based registration of 89+ component types
- **Composable Page Builder** — multi-component pages with drag-and-drop reordering
- **Theming Engine** — two-section system (Layout + Color) at course and page levels
- **Audio Integration** — per-interaction audio (e.g., each tab can have its own audio clips)
- **Completion Tracking** — page-level flag driven by component activity (audio listened, interactions performed)
- **Scoring UI** — quiz-type dependent scoring with weighted results

---

## 2. Current State Analysis
| Area | Current | Gap |
|------|---------|-----|
| Template Types | 7 hardcoded (`welcome`, `content-text`, `content-video`, `content-image`, `mcq`, `summary`, `interactive`) | No registry, not extensible, no categories |
| Page Composition | 1 template per page | Cannot combine components |
| Component Library | None (inline JSX in PageEditor switch) | No reusable design system |
| Theming | `settings.theme` stored as string enum (`default`/`dark`/`light`) | No CSS variables, no provider, no layout system, no color editor |
| Audio | Upload only via MediaUpload | No player, no per-interaction assignment, no completion tracking |
| Completion | Boolean `completed[]` array | No interaction tracking, no strategy modes |
| Scoring | None | No quiz scoring UI, no weighted scores |
| Types | `TemplateType` = 5 hardcoded values; `Page` has no `components[]` | Severely outdated, doesn't match API |

### 2.1 Implementation Status (As of February 2026)
- The current UI still uses legacy `templates[]` and switch-based rendering; multi-component pages are not yet implemented.
- Preview uses `CourseContext` while the editor uses Redux, resulting in duplicate state models.
- The API client only covers legacy endpoints; new pages/components/themes/scoring/completion APIs are not wired.

### 2.2 Data Migration and Ownership
- Backend accepts legacy `templates[]` and converts to `pages[].components[]`.
- Frontend must still perform a legacy-to-new transform for local state and editing until backend migration is complete.
- Source of truth: backend should own conversion logic; frontend transformation is temporary and should be removed after migration.

### 2.3 Error Handling and Fallbacks
- Unknown component types must render a safe fallback component with a warning banner.
- Network failures for registry/theme/scoring/completion should degrade gracefully with retry UI.
- Component registry fetch failures should fall back to cached definitions when available.

---

## 3. Component Registry Architecture

### 3.1 Registry Pattern
```
src/components/registry/
  ├── index.ts                 # Singleton registry instance + exports
  ├── ComponentRegistry.ts     # Registry class with CRUD methods
  └── types.ts                 # ComponentDefinition, CategoryDefinition interfaces
```

- **Self-registration**: each component file calls `registry.register(definition)` at import time
- **Category-based organization**: components grouped into categories; registry exposes `getByCategory(categoryId)`
- **Dynamic resolution**: `registry.getRenderer(typeId)` returns the React component for rendering
- **Lazy loading**: components loaded on-demand via `React.lazy()` to keep bundle small

### 3.2 ComponentDefinition Interface
```typescript
interface ComponentDefinition {
  typeId: string;                          // e.g. "accordion", "tabs", "mcq"
  category: ComponentCategory;             // enum value
  displayName: string;                     // "Accordion"
  description: string;                     // Short description for picker
  icon: string;                            // Icon name or URL
  thumbnail?: string;                      // Preview image URL
  tags: string[];                          // Searchable tags
  completionCapabilities: CompletionType[];// ['view','interact','audio','score']
  scoringEnabled: boolean;
  audioSupport: AudioSupportConfig;
  schema: JSONSchema;                      // Validates component data
  defaultData: Record<string, any>;        // Data when first added
  defaultCompletionType: CompletionType;
  maxScore?: number;
  scoringRules?: Record<string, any>;
  estimatedDuration?: number;              // minutes
  editorComponent: React.LazyExoticComponent<any>;
  previewComponent: React.LazyExoticComponent<any>;
}
```

### 3.3 Component Categories (17 categories, 89+ types)

| # | Category ID | Display Name | Component Types |
|---|-------------|-------------|-----------------|
| 1 | `content-presentation` | Content Presentation | Tabs, Accordion, Click and Reveal, Timeline, Image Hotspots, Layered Content, Text with Media |
| 2 | `process-flow` | Process & Flow | Step-by-Step Process, Cycle Diagram, Flowchart, Process Map, Decision Tree |
| 3 | `interaction` | Interaction | Drag and Drop, Flip Cards, Slider, Carousel, Clickable Icons |
| 4 | `scenario` | Scenario-Based | Scenario, Branching Scenario, Role-Play Simulation, Case Study |
| 5 | `assessment` | Assessment | Multiple Choice (MCQ), Multiple Select, True/False, Fill in the Blanks, Matching, Scenario-Based Question, Knowledge Check, Final Assessment |
| 6 | `comparison` | Comparison & Analysis | Comparison Table, Pros and Cons, Before and After, Matrix/Grid |
| 7 | `media-rich` | Media-Rich | Video-Based Slide, Audio-Based Slide, Animated Explainer, Infographic |
| 8 | `microlearning` | Microlearning | Microlearning Cards, Flashcards, Quick Tips |
| 9 | `navigation` | Navigation & Structural | Course Menu, Learning Roadmap, Module Overview, Summary/Key Takeaways, Resources & Downloads |
| 10 | `gamification` | Gamification | Quiz Game, Points and Badges, Progress Tracker, Level-Based Learning |
| 11 | `compliance` | Compliance & Corporate | Policy Acknowledgement, Do's and Don'ts, Code of Conduct, Regulatory Scenario, Audit Checklist |
| 12 | `diagnostic` | Diagnostic & Adaptive | Pre-Assessment, Diagnostic Quiz, Skill Gap Analysis, Adaptive Learning Path, Recommendation Card |
| 13 | `practice` | Practice & Simulation | Guided Practice, Try-It Simulation, Software Simulation (Watch → Try → Do), Sandbox Practice, Error Identification |
| 14 | `feedback` | Feedback & Reflection | Reflective Question, Learner Journal, Self-Assessment, Confidence Rating, Action Planning |
| 15 | `social` | Social & Collaborative | Discussion Prompt, Peer Review, Poll/Vote, Team Challenge, Scenario Debate |
| 16 | `accessibility` | Accessibility & Support | Accessibility Tip Card, Keyboard Navigation Guide, Screen Reader Guide, Language Selector, Transcript/Caption Page |
| 17 | `analytics` | Analytics & Learning Insight | Learning Progress Summary, Performance Dashboard, Skill Mastery Report, Completion Certificate, Manager Review Page |

### 3.4 Complete Component Type Registry (89 new types + 6 legacy aliases)

#### Content Presentation (7)
| typeId | displayName | completionCapabilities | scoringEnabled | audioSupport |
|--------|-------------|----------------------|----------------|--------------|
| `tabs` | Tabs | view, interact, audio | No | perInteraction: true (per tab) |
| `accordion` | Accordion | view, interact, audio | No | perInteraction: true (per panel) |
| `click-reveal` | Click and Reveal | view, interact, audio | No | perInteraction: true (per reveal item) |
| `timeline` | Timeline | view, interact, audio | No | perInteraction: true (per event) |
| `image-hotspots` | Image Hotspots | view, interact, audio | No | perInteraction: true (per hotspot) |
| `layered-content` | Layered Content | view, interact | No | perComponent: true |
| `text-with-media` | Text with Media | view, audio | No | perComponent: true |

#### Process & Flow (5)
| typeId | displayName | completionCapabilities | scoringEnabled | audioSupport |
|--------|-------------|----------------------|----------------|--------------|
| `step-by-step` | Step-by-Step Process | view, interact, audio | No | perInteraction: true (per step) |
| `cycle-diagram` | Cycle Diagram | view, interact | No | perComponent: true |
| `flowchart` | Flowchart | view, interact | No | perComponent: true |
| `process-map` | Process Map | view, interact | No | perComponent: true |
| `decision-tree` | Decision Tree | view, interact | No | perInteraction: true (per node) |

#### Interaction (5)
| typeId | displayName | completionCapabilities | scoringEnabled | audioSupport |
|--------|-------------|----------------------|----------------|--------------|
| `drag-and-drop` | Drag and Drop | interact, score | Yes | perComponent: true |
| `flip-cards` | Flip Cards | view, interact, audio | No | perInteraction: true (per card) |
| `slider` | Slider | view, interact | No | perComponent: true |
| `carousel` | Carousel | view, interact, audio | No | perInteraction: true (per slide) |
| `clickable-icons` | Clickable Icons | view, interact, audio | No | perInteraction: true (per icon) |

#### Scenario-Based (4)
| typeId | displayName | completionCapabilities | scoringEnabled | audioSupport |
|--------|-------------|----------------------|----------------|--------------|
| `scenario` | Scenario | view, interact, audio | Yes | perInteraction: true (per choice) |
| `branching-scenario` | Branching Scenario | view, interact, audio, score | Yes | perInteraction: true (per branch) |
| `role-play-simulation` | Role-Play Simulation | interact, audio, score | Yes | perInteraction: true |
| `case-study` | Case Study | view, interact, audio | Yes | perComponent: true |

#### Assessment (8)
| typeId | displayName | completionCapabilities | scoringEnabled | audioSupport |
|--------|-------------|----------------------|----------------|--------------|
| `mcq` | Multiple Choice | interact, score | Yes | perComponent: true |
| `multiple-select` | Multiple Select | interact, score | Yes | perComponent: true |
| `true-false` | True / False | interact, score | Yes | perComponent: true |
| `fill-blanks` | Fill in the Blanks | interact, score | Yes | perComponent: true |
| `matching` | Matching | interact, score | Yes | perComponent: true |
| `scenario-question` | Scenario-Based Question | interact, score, audio | Yes | perComponent: true |
| `knowledge-check` | Knowledge Check | interact, score | Yes | perComponent: true |
| `final-assessment` | Final Assessment | interact, score | Yes | perComponent: true |

#### Comparison & Analysis (4)
| typeId | displayName | completionCapabilities | scoringEnabled | audioSupport |
|--------|-------------|----------------------|----------------|--------------|
| `comparison-table` | Comparison Table | view | No | perComponent: true |
| `pros-cons` | Pros and Cons | view | No | perComponent: true |
| `before-after` | Before and After | view, interact | No | perComponent: true |
| `matrix-grid` | Matrix / Grid | view | No | perComponent: true |

#### Media-Rich (4)
| typeId | displayName | completionCapabilities | scoringEnabled | audioSupport |
|--------|-------------|----------------------|----------------|--------------|
| `video-slide` | Video-Based Slide | view, audio | No | perComponent: true |
| `audio-slide` | Audio-Based Slide | audio | No | perComponent: true |
| `animated-explainer` | Animated Explainer | view | No | perComponent: true |
| `infographic` | Infographic | view | No | perComponent: true |

#### Microlearning (3)
| typeId | displayName | completionCapabilities | scoringEnabled | audioSupport |
|--------|-------------|----------------------|----------------|--------------|
| `microlearning-cards` | Microlearning Cards | view, interact | No | perInteraction: true (per card) |
| `flashcards` | Flashcards | view, interact | No | perInteraction: true (per card) |
| `quick-tips` | Quick Tips | view | No | perComponent: true |

#### Navigation & Structural (5)
| typeId | displayName | completionCapabilities | scoringEnabled | audioSupport |
|--------|-------------|----------------------|----------------|--------------|
| `course-menu` | Course Menu | view | No | No |
| `learning-roadmap` | Learning Roadmap | view | No | No |
| `module-overview` | Module Overview | view | No | perComponent: true |
| `summary-takeaways` | Summary / Key Takeaways | view | No | perComponent: true |
| `resources-downloads` | Resources & Downloads | view | No | No |

#### Gamification (4)
| typeId | displayName | completionCapabilities | scoringEnabled | audioSupport |
|--------|-------------|----------------------|----------------|--------------|
| `quiz-game` | Quiz Game | interact, score | Yes | perComponent: true |
| `points-badges` | Points and Badges | view, interact | No | No |
| `progress-tracker` | Progress Tracker | view | No | No |
| `level-learning` | Level-Based Learning | interact, score | Yes | perComponent: true |

#### Compliance & Corporate (5)
| typeId | displayName | completionCapabilities | scoringEnabled | audioSupport |
|--------|-------------|----------------------|----------------|--------------|
| `policy-acknowledgement` | Policy Acknowledgement | interact | No | perComponent: true |
| `dos-donts` | Do's and Don'ts | view, interact | No | perComponent: true |
| `code-of-conduct` | Code of Conduct | view, interact | No | perComponent: true |
| `regulatory-scenario` | Regulatory Scenario | interact, score | Yes | perComponent: true |
| `audit-checklist` | Audit Checklist | interact | No | perComponent: true |

#### Diagnostic & Adaptive (5)
| typeId | displayName | completionCapabilities | scoringEnabled | audioSupport |
|--------|-------------|----------------------|----------------|--------------|
| `pre-assessment` | Pre-Assessment | interact, score | Yes | perComponent: true |
| `diagnostic-quiz` | Diagnostic Quiz | interact, score | Yes | perComponent: true |
| `skill-gap-analysis` | Skill Gap Analysis | interact, score | Yes | perComponent: true |
| `adaptive-learning-path` | Adaptive Learning Path | view, interact | No | No |
| `recommendation-card` | Recommendation Card | view | No | No |

#### Practice & Simulation (5)
| typeId | displayName | completionCapabilities | scoringEnabled | audioSupport |
|--------|-------------|----------------------|----------------|--------------|
| `guided-practice` | Guided Practice | interact, audio | No | perInteraction: true (per step) |
| `try-it-simulation` | Try-It Simulation | interact | No | perComponent: true |
| `software-simulation` | Software Simulation (Watch → Try → Do) | interact, audio | No | perInteraction: true (per phase) |
| `sandbox-practice` | Sandbox Practice | interact | No | No |
| `error-identification` | Error Identification | interact, score | Yes | perComponent: true |

#### Feedback & Reflection (5)
| typeId | displayName | completionCapabilities | scoringEnabled | audioSupport |
|--------|-------------|----------------------|----------------|--------------|
| `reflective-question` | Reflective Question | interact | No | perComponent: true |
| `learner-journal` | Learner Journal | interact | No | No |
| `self-assessment` | Self-Assessment | interact, score | Yes | perComponent: true |
| `confidence-rating` | Confidence Rating | interact | No | perComponent: true |
| `action-planning` | Action Planning | interact | No | No |

#### Social & Collaborative (5)
| typeId | displayName | completionCapabilities | scoringEnabled | audioSupport |
|--------|-------------|----------------------|----------------|--------------|
| `discussion-prompt` | Discussion Prompt | interact | No | No |
| `peer-review` | Peer Review | interact | No | No |
| `poll-vote` | Poll / Vote | interact | No | No |
| `team-challenge` | Team Challenge | interact, score | Yes | No |
| `scenario-debate` | Scenario Debate | interact | No | perComponent: true |

#### Accessibility & Support (5)
| typeId | displayName | completionCapabilities | scoringEnabled | audioSupport |
|--------|-------------|----------------------|----------------|--------------|
| `accessibility-tip` | Accessibility Tip Card | view | No | perComponent: true |
| `keyboard-nav-guide` | Keyboard Navigation Guide | view | No | No |
| `screen-reader-guide` | Screen Reader Guide | view | No | perComponent: true |
| `language-selector` | Language Selector | view | No | No |
| `transcript-caption` | Transcript / Caption Page | view | No | No |

#### Analytics & Learning Insight (5)
| typeId | displayName | completionCapabilities | scoringEnabled | audioSupport |
|--------|-------------|----------------------|----------------|--------------|
| `progress-summary` | Learning Progress Summary | view | No | No |
| `performance-dashboard` | Performance Dashboard | view | No | No |
| `skill-mastery-report` | Skill Mastery Report | view | No | No |
| `completion-certificate` | Completion Certificate | view | No | No |
| `manager-review` | Manager Review Page | view | No | No |

### 3.5 MVP Component Data Schemas (Required)
For Phase 1-4 templates, frontend needs concrete data shapes in addition to JSON Schema from the registry. These are the minimum fields used by editor + preview components.

#### Tabs
```typescript
interface TabsData {
  tabs: Array<{ id: string; title: string; body: string }>;
  defaultTabId?: string;
}
```

#### Accordion
```typescript
interface AccordionData {
  panels: Array<{ id: string; title: string; body: string }>;
  allowMultipleOpen?: boolean;
}
```

#### MCQ
```typescript
interface MCQData {
  question: string;
  options: Array<{ id: string; text: string; isCorrect: boolean }>;
  explanation?: string;
}
```

Registry JSON Schema remains the source of truth; the above shapes are frontend contract defaults.

---

## 4. Page Composition System

### 4.1 Multi-Component Pages
Each page contains an ordered array of components:
```typescript
interface Page {
  pageId: string;           // UUID
  title: string;
  order: number;
  components: Component[];  // Ordered array of components
  pageCompletion: PageCompletionConfig;
  layout: PageLayout;
  theme: PageThemeConfig;
}
```

A page can combine any components — e.g., one page can have an Accordion **and** a Tabs component **and** an MCQ.

### 4.2 Drag-and-Drop Reordering
- Components within a page can be reordered via drag-and-drop
- Pages within a course can be reordered via drag-and-drop
- API: `POST /courses/{id}/pages/{id}/components/reorder` with `{ orderedIds: string[] }`
- Library: `@hello-pangea/dnd` (maintained fork of react-beautiful-dnd)

### 4.3 Dynamic Component Renderer
```tsx
// Replaces the current switch statement in PageEditor
function DynamicComponentRenderer({ component }: { component: Component }) {
  const definition = registry.get(component.componentType);
  if (!definition) return <UnknownComponent type={component.componentType} />;
  const Renderer = isEditing ? definition.editorComponent : definition.previewComponent;
  return (
    <CompletionWrapper component={component}>
      <AudioWrapper audioConfig={component.audioConfig}>
        <Suspense fallback={<ComponentSkeleton />}>
          <Renderer data={component.data} onChange={handleChange} />
        </Suspense>
      </AudioWrapper>
    </CompletionWrapper>
  );
}
```

### 4.4 Component Picker Modal
- Opens when user clicks "Add Component" button on a page
- **Layout**: Category tabs on the left, component grid on the right
- **Search**: Text search across displayName, description, tags (API: `/components/search?q=`)
- **Filtering**: By category (API: `/components/categories/{categoryId}`)
- **Preview**: Each card shows icon, displayName, description, thumbnail
- **Insert**: Clicking a card adds the component with `defaultData` to the page

---

## 5. Theming System

### 5.1 Two-Section Architecture
Theme has two independent sections:
1. **Layout System** — defines page structure (where components are placed)
2. **Color System** — defines visual styling (colors, typography, component styles)

### 5.2 Layout System (Section 1)
Controls where Tabs, Accordion, Image, Text etc. are placed on the page.

#### Layout Presets
| Preset | Description |
|--------|-------------|
| `single-column` | All components stacked vertically |
| `two-column` | Two equal columns |
| `three-column` | Three equal columns |
| `sidebar-left` | Narrow left sidebar + main content |
| `sidebar-right` | Main content + narrow right sidebar |
| `grid-2x2` | 2x2 grid of equal areas |
| `hero-content` | Large hero area + content below |
| `full-width` | Single full-width area |

#### Custom Grid
If presets don't fit, user can define:
```typescript
interface CustomGrid {
  columns: number;         // 1-4
  rows: string;            // CSS grid-template-rows e.g. "auto 1fr auto"
  areas: string[][];       // CSS grid-template-areas
  gap: string;             // CSS gap e.g. "16px"
}
```

#### Component Placement
Each component can be placed in a grid area:
```typescript
interface ComponentPlacement {
  componentId: string;
  gridArea: string;        // CSS grid area name
  span?: number;           // Column span for preset layouts
}
```

#### Layout Editor UI
- Preset selector: radio buttons with visual previews
- Custom grid builder: column/row count inputs, area name editor
- Component placement: drag components into grid areas
- Spacing control: compact / normal / spacious

### 5.3 Color System (Section 2)
User can change the color scheme for every element.

#### Color Tokens (12)
| Token | Description | Example |
|-------|-------------|---------|
| `primary` | Primary brand color | `#1976D2` |
| `secondary` | Secondary brand color | `#9C27B0` |
| `background` | Page background | `#FFFFFF` |
| `surface` | Card/panel backgrounds | `#F5F5F5` |
| `text` | Primary text color | `#212121` |
| `textSecondary` | Secondary text | `#757575` |
| `accent` | Highlights, links | `#FF5722` |
| `error` | Error states | `#F44336` |
| `success` | Success states | `#4CAF50` |
| `warning` | Warning states | `#FF9800` |
| `info` | Info states | `#2196F3` |
| `border` | Borders and dividers | `#E0E0E0` |

#### Typography
| Property | Description | Example |
|----------|-------------|---------|
| `fontFamily` | Body font family | `"Inter, sans-serif"` |
| `headingFont` | Heading font (optional) | `"Poppins, sans-serif"` |
| `baseFontSize` | Base font size (px) | `16` |
| `headingSizes.h1-h4` | Heading sizes (px) | `32, 28, 24, 20` |
| `lineHeight` | Line height multiplier | `1.6` |
| `fontWeight.normal/medium/bold` | Font weights | `400, 500, 700` |

#### Component Styles
Per-component-type visual settings:

| Component | Properties |
|-----------|-----------|
| **Button** | `borderRadius`, `padding`, `fontWeight`, `textTransform` (none/uppercase/capitalize) |
| **Card** | `borderRadius`, `shadow`, `borderWidth`, `padding` |
| **Tabs** | `style` (underline/pill/boxed), `activeColor`, `borderRadius` |
| **Accordion** | `style` (bordered/minimal/card), `iconPosition` (left/right), `spacing` |
| **Input** | `borderRadius`, `borderColor`, `focusColor` |
| **ProgressBar** | `height`, `borderRadius`, `fillColor` |

#### Theme Editor UI
- **Color picker**: For each of the 12 color tokens, show a color swatch + hex input
- **Typography panel**: Font family dropdown, size sliders, weight selectors
- **Component style panel**: Per-component-type visual settings with live preview
- **Preview pane**: Real-time preview of theme changes applied to sample components

### 5.4 Theme Inheritance
```
Preset Theme -> Course Theme (overrides) -> Page Theme (overrides)
```
- Course sets a `themeId` (selects a preset or custom theme)
- Course can apply `overrides` (partial theme)
- Each page has `inheritCourse: true/false`
- If `true`, page inherits course theme and can add its own `overrides`
- If `false`, page uses a completely independent theme

### 5.5 CSS Variable Injection
`ThemeProvider` converts the resolved theme into CSS custom properties:
```css
:root {
  --theme-primary: #1976D2;
  --theme-secondary: #9C27B0;
  --theme-background: #FFFFFF;
  --theme-text: #212121;
  --theme-font-family: "Inter, sans-serif";
  --theme-font-size-base: 16px;
  --theme-btn-radius: 8px;
  --theme-card-shadow: 0 2px 8px rgba(0,0,0,0.1);
  /* ... all tokens ... */
}
```

---

## 6. Audio Integration

### 6.1 Audio Per-Interaction Model
Each interactivity has an audio flag. For example:
- Clicking a **tab** -> audio plays for that tab
- Opening an **accordion panel** -> audio plays for that panel
- Clicking a **hotspot** -> audio plays for that hotspot
- Each tab/panel/hotspot can have **multiple audio items**

### 6.2 AudioConfig Schema
```typescript
interface AudioConfig {
  enabled: boolean;
  audioItems: AudioItem[];
}

interface AudioItem {
  audioId?: string;               // UUID, assigned by backend
  audioUrl: string;               // Media file URL
  triggerOn: 'load' | 'click' | 'interaction';
  targetInteractionId?: string;   // e.g. "tab-2", "accordion-panel-1", "hotspot-3"
  autoplay: boolean;
  requiredForCompletion: boolean;  // Must listen for page completion
  duration?: number;               // Seconds
  label?: string;                  // Display name
  transcript?: string;             // Accessibility transcript
}
```

### 6.3 Audio Player Component
- Play/pause button, seek bar, time display (current / total)
- 90% listen threshold for completion tracking
- Auto-advance to next audio if multiple per interaction
- Keyboard accessible (Space = play/pause, Arrow keys = seek)
- Displays label and transcript when available

### 6.4 Audio Config Panel (Editor Mode)
- Shown per component in the editor sidebar
- Toggle "Enable Audio" for the component
- Per interaction point list (e.g., "Tab 1", "Tab 2", "Tab 3")
- Each interaction point has:
  - "Add Audio" button -> opens media upload
  - List of attached audio items with drag-to-reorder
  - Per-item: autoplay toggle, required-for-completion toggle, label, transcript
- Upload triggers `POST /assets/audio`

### 6.5 Audio Completion Tracking
- `CompletionContext` tracks `audiosCompleted: string[]` per component
- When user listens to >= 90% of an audio item, it's marked complete
- `AudioPlayer` dispatches `audio-complete` interaction event
- `PageWrapper` checks if all `requiredForCompletion` audio items are in `audiosCompleted`

---

## 7. Completion Tracking System

### 7.1 Architecture
```
PageWrapper
  |-- monitors all child components' completion states
  |-- aggregates based on strategy (all / any / percentage / custom)
  |-- fires page completion event when criteria met

CompletionContext
  |-- tracks per-component completion
  |-- tracks interactions performed
  |-- tracks audio listened
  |-- exposes: isComponentComplete(id), isPageComplete(pageId), overallProgress
```

### 7.2 Page Completion Config
```typescript
interface PageCompletionConfig {
  enabled: boolean;           // Can be false to skip completion check
  strategy: 'all' | 'any' | 'percentage' | 'custom';
  requiredComponents?: string[];   // For strategy=custom
  completionThreshold?: number;    // For strategy=percentage (0-100)
}
```

### 7.3 Component Completion Criteria
Each component has its own `CompletionCriteria`:
```typescript
interface CompletionCriteria {
  type: 'view' | 'interact' | 'audio' | 'score' | 'custom';
  threshold?: number;               // Score threshold for type=score
  requiredInteractions?: string[];   // Interaction IDs that must be performed
  requiredAudioIds?: string[];       // Audio IDs that must be listened to
}
```

Interaction event types must be extensible. Do not hardcode an enum in the frontend; treat `interactionType` as a string to support new component interactions without API changes.

### 7.4 PageWrapper Logic
```
1. On mount: subscribe to all child component completion changes
2. For each component on the page:
   a. Check CompletionCriteria.type:
      - 'view': marked complete when component enters viewport
      - 'interact': check if all requiredInteractions are in interactionsCompleted[]
      - 'audio': check if all requiredAudioIds are in audiosCompleted[]
      - 'score': check if component score >= threshold
      - 'custom': evaluate custom logic
3. Aggregate component completion based on page strategy:
   - 'all': all components must be complete
   - 'any': at least one component must be complete
   - 'percentage': (completedCount / totalCount * 100) >= completionThreshold
   - 'custom': only requiredComponents must be complete
4. When page completion criteria met:
   a. Fire POST /courses/{courseId}/pages/{pageId}/completion
   b. Update navigation controls (unlock next page)
   c. Show completion banner
```

### 7.5 Completion Indicators
- **Component level**: Green checkmark overlay on completed components
- **Page level**: Completion banner at bottom of page + checkmark in page list
- **Course level**: Progress bar showing `overallProgress` percentage

---

## 8. Scoring UI

### 8.1 Scoring Configuration
```typescript
interface ScoringConfig {
  config: {
    passingScore: number;           // 0-100, default 70
    maxAttempts?: number;           // null = unlimited
    attemptScoring: 'best' | 'last' | 'average';
    showCorrectAnswers: boolean;
    showScoreAfterQuestion: boolean;
    showScoreAfterPage: boolean;
    weightedScoring: boolean;
    allowPartialCredit: boolean;
  };
  componentScores: ComponentScoreConfig[];
  scormReporting: ScormReportingConfig;
}
```

### 8.2 Quiz Feedback Display
- **Immediate mode**: After each question submission, show correct/incorrect + explanation
- **On-submit mode**: After all questions answered, show results
- **End-of-quiz mode**: Only show results on final assessment page
- Visual indicators: green checkmark (correct), red X (incorrect), partial credit indicator
- Explanation text shown for incorrect answers

### 8.3 Course Score Summary
- Circular progress chart showing overall score percentage
- Pass/fail indicator with `passingScore` threshold
- Breakdown table: component name, score, max score, weight, weighted score
- Attempt information: attempt number, remaining attempts
- SCORM score reporting via `cmi.core.score.raw` / `cmi.score.raw`

### 8.4 Scoring by Component Type
| Component Type | Scoring Behavior |
|---------------|-----------------|
| MCQ | 1 correct answer, full points or 0 |
| Multiple Select | Partial credit: (correct selections - incorrect) / total correct |
| True/False | Full points or 0 |
| Fill in Blanks | Per-blank scoring, case-insensitive match |
| Matching | Per-pair scoring |
| Drag and Drop | Per-item correct placement |
| Scenario-Based | Per-choice scoring with branching weight |
| Knowledge Check | Non-graded feedback only (no score contribution) |

---

## 9. Redux State Updates

### 9.1 Editor Slice Changes
```typescript
// New actions needed:
addComponent(pageId, componentType, data)
removeComponent(pageId, componentId)
duplicateComponent(pageId, componentId)
reorderComponents(pageId, orderedIds)
updateComponentData(pageId, componentId, data)
setComponentAudioConfig(pageId, componentId, audioConfig)
setComponentCompletionCriteria(pageId, componentId, criteria)
setComponentStyling(pageId, componentId, styling)

// New state shape:
interface EditorState {
  currentPageId: string | null;
  currentComponentId: string | null;
  isEditing: boolean;
  isDirty: boolean;
  validationErrors: ValidationError[];
  componentPickerOpen: boolean;
  componentPickerCategory: string | null;
}
```

### 9.2 Course Slice Changes
```typescript
// Updated Course state shape:
interface CourseState {
  currentCourse: Course | null;   // Course with pages[].components[]
  courses: CourseListItem[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved: string | null;
}

// New actions:
setCourseTheme(themeId, overrides?)
setPageTheme(pageId, themeConfig)
setPageLayout(pageId, layout)
setPageCompletion(pageId, completionConfig)
setScoringConfig(scoringConfig)
```

---

## 10. Transform Layer Updates

### 10.1 Legacy -> New Format
```typescript
// Input: { templates: [{ type: 'mcq', data: {...} }] }
// Output: { pages: [{ components: [{ componentType: 'mcq', data: {...} }] }] }
function transformLegacyToNew(course: LegacyCourse): Course {
  return {
    ...course,
    pages: course.templates.map((t, i) => ({
      pageId: generateUUID(),
      title: t.title || `Page ${i + 1}`,
      order: i,
      components: [{
        componentId: generateUUID(),
        componentType: normalizeTemplateType(t.type),
        order: 0,
        data: t.data,
        audioConfig: { enabled: false, audioItems: [] },
        completionCriteria: { type: 'view' },
      }],
      pageCompletion: { enabled: true, strategy: 'all' },
      layout: { preset: 'single-column', spacing: 'normal' },
      theme: { inheritCourse: true },
    })),
  };
}
```

### 10.2 New -> Backend API
Transform frontend state to match `CourseCreateRequest` / `CourseUpdateRequest` schemas.

### 10.3 Backend -> Frontend
Transform `CourseResponse` to frontend Redux state, resolving themes and populating registry references.

---

## 11. API Client

### 11.1 Service Layer
Generate TypeScript API client from the OpenAPI v2 spec. Services needed:

| Service | Endpoints |
|---------|-----------|
| `CourseService` | CRUD courses, validate |
| `PageService` | CRUD pages, reorder |
| `ComponentService` | CRUD components, reorder |
| `RegistryService` | List types, categories, search |
| `ThemeService` | CRUD themes, get/set course/page theme |
| `ScoringService` | Get/set config, validate, calculate |
| `CompletionService` | Get course/page completion, record events |
| `AudioService` | Upload, get/update metadata, list narration |
| `ExportService` | Export SCORM, validate, get status |
| `MediaService` | Upload, serve, list files |

---

## 12. Implementation Phases

### Phase 1: Foundation & Registry (Weeks 1-4)
- Component Registry class + types
- Migrate 7 existing templates to registry pattern
- ThemeContext + CSS variable injection
- Component Picker modal
- Updated TypeScript types matching OpenAPI

### Phase 2: Composition & Layout (Weeks 5-8)
- Multi-component page structure
- Drag-and-drop reordering
- Layout system (8 presets + custom grid)
- Component placement UI

### Phase 3: Audio & Completion (Weeks 9-12)
- Audio player component
- Audio config panel with per-interaction assignment
- CompletionContext + CompletionService
- PageWrapper with completion aggregation

### Phase 4: Scoring & Assessment (Weeks 13-16)
- ScoringService + scoring utilities
- Quiz feedback components (immediate/on-submit/end)
- Course score summary with SCORM reporting
- Assessment templates: MCQ, Multiple Select, True/False, Fill Blanks, Matching

### Phase 5: Full Template Library (Weeks 17-24) — Extended to 8 weeks
- **Week 17**: Content Presentation (7 types) + Process & Flow (5 types) = 12 types
- **Week 18**: Interaction (5 types) + Scenario-Based (4 types) = 9 types
- **Week 19**: Comparison (4 types) + Media-Rich (4 types) + Microlearning (3 types) = 11 types
- **Week 20**: Navigation (5 types) + Gamification (4 types) + Compliance (5 types) = 14 types
- **Week 21**: Diagnostic & Adaptive (5 types) + Practice & Simulation (5 types) = 10 types
- **Week 22**: Feedback & Reflection (5 types) + Social & Collaborative (5 types) = 10 types
- **Week 23**: Accessibility & Support (5 types) + Analytics & Learning Insight (5 types) = 10 types
- **Week 24**: System polish, performance optimization, accessibility audit, full test coverage

**Total Timeline**: 24 weeks (5 phases)

---

## 13. Accessibility Requirements
- All components must be WCAG 2.1 AA compliant
- Keyboard navigation for all interactive components
- ARIA labels and roles on all interactive elements
- Screen reader announcements for state changes
- Focus management for modals and dynamic content
- Color contrast ratios >= 4.5:1 for text, >= 3:1 for UI components
- Audio player must have captions/transcript support
- Dedicated Accessibility & Support template category

---

## 14. Performance Requirements
- Component lazy loading via `React.lazy()` + code splitting
- Page load time < 3s for pages with up to 10 components
- Component switch time < 100ms
- Theme changes applied in < 50ms (CSS variable swap)
- Bundle size budget: base < 200KB, each component < 20KB
- Virtual scrolling for component picker with 89+ types
