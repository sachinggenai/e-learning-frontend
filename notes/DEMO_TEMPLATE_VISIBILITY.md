# Demo Template Visibility Reference

**Created:** 2026-05-07  
**Branch:** Democourse  
**Purpose:** Documents which templates are visible vs. hidden in the "Add Page from Template" dialog for the current demo build.

---

## How It Works

Templates are hidden using CSS only — no registry, Redux state, or render-engine changes.  
Every template remains fully registered and functional; only the picker card is visually suppressed.

**Mechanism:**
1. `TemplateSelector.tsx` — each `.template-card` div has a `data-template-type="{typeId}"` attribute added.
2. `TemplateSelector.css` — the *DEMO MODE* block at the end uses attribute selectors to `display: none !important` the hidden cards.

**To restore all templates:** Delete (or comment out) the `DEMO MODE` block at the bottom of `src/components/TemplateSelector.css`.

---

## ⚠️ Important Notes

1. **Search box caveat:** The search filter runs in JavaScript before CSS rendering. If a user types a term that matches only hidden templates, the grid will appear empty (cards exist in DOM but are invisible). This is acceptable for demo purposes.
2. **Not yet implemented:** "Clickable Icons" and "Slider" were requested but do **not** have a matching `typeId` in the Component Registry. They must be built before they can appear.
3. This is a **demo-only restriction** — easily reversed by removing the CSS block.

---

## ✅ Visible Templates (19 of 21 requested — 2 not yet built)

| # | Display Name | typeId | Category |
|---|---|---|---|
| 1 | Text Content | `content-text` | content-presentation |
| 2 | Tabs | `tabs` | content-presentation |
| 3 | Accordion | `accordion` | content-presentation |
| 4 | Click & Reveal | `click-reveal` | interaction |
| 5 | Text with Media | `text-with-media` | content-presentation |
| 6 | Image Hotspots | `image-hotspots` | media-rich |
| 7 | ~~Clickable Icons~~ | **NOT BUILT** | — |
| 8 | Flip Cards | `flip-cards` | interaction |
| 9 | ~~Slider~~ | **NOT BUILT** | — |
| 10 | Carousel | `carousel` | interaction |
| 11 | Drag & Drop Sort | `drag-drop-sort` | interaction |
| 12 | Multiple Choice | `mcq` | assessment |
| 13 | Multiple Select | `multiple-select` | assessment |
| 14 | True / False | `true-false` | assessment |
| 15 | Fill in the Blanks | `fill-blanks` | assessment |
| 16 | Matching | `matching` | assessment |
| 17 | Knowledge Check | `knowledge-check` | assessment |
| 18 | Final Assessment | `final-assessment` | assessment |
| 19 | Course Menu | `course-menu` | navigation |
| 20 | Summary & Takeaways | `summary-takeaways` | navigation |
| 21 | Completion Certificate | `completion-certificate` | analytics |

---

## 🚫 Hidden Templates (62 — CSS display:none, fully functional)

| typeId | Display Name | Category |
|---|---|---|
| `welcome` | Welcome | content-presentation |
| `content-image` | Image Content | content-presentation |
| `content-video` | Video Content | content-presentation |
| `layered-content` | Layered Content | content-presentation |
| `summary` | Summary | content-presentation |
| `scenario-question` | Scenario Question | assessment |
| `timeline` | Timeline | interaction |
| `step-by-step` | Step by Step | process-flow |
| `cycle-diagram` | Cycle Diagram | process-flow |
| `flowchart` | Flowchart | process-flow |
| `process-map` | Process Map | process-flow |
| `decision-tree` | Decision Tree | process-flow |
| `comparison-table` | Comparison Table | comparison |
| `pros-cons` | Pros & Cons | comparison |
| `before-after` | Before & After | comparison |
| `matrix-grid` | Matrix Grid | comparison |
| `microlearning-cards` | Microlearning Cards | microlearning |
| `flashcards` | Flashcards | microlearning |
| `quick-tips` | Quick Tips | microlearning |
| `video-slide` | Video Slide | media-rich |
| `infographic` | Infographic | media-rich |
| `branching-scenario` | Branching Scenario | scenario |
| `case-study` | Case Study | scenario |
| `module-overview` | Module Overview | navigation |
| `learning-roadmap` | Learning Roadmap | navigation |
| `resources-downloads` | Resources & Downloads | navigation |
| `reflective-question` | Reflective Question | feedback |
| `learner-journal` | Learner Journal | feedback |
| `self-assessment` | Self Assessment | feedback |
| `confidence-rating` | Confidence Rating | feedback |
| `action-planning` | Action Planning | feedback |
| `pre-assessment` | Pre-Assessment | diagnostic |
| `diagnostic-quiz` | Diagnostic Quiz | diagnostic |
| `skill-gap-analysis` | Skill Gap Analysis | diagnostic |
| `adaptive-learning-path` | Adaptive Learning Path | diagnostic |
| `recommendation-card` | Recommendation Card | diagnostic |
| `progress-summary` | Progress Summary | analytics |
| `performance-dashboard` | Performance Dashboard | analytics |
| `skill-mastery-report` | Skill Mastery Report | analytics |
| `manager-review` | Manager Review Page | analytics |
| `policy-acknowledgement` | Policy Acknowledgement | compliance |
| `dos-donts` | Dos & Don'ts | compliance |
| `code-of-conduct` | Code of Conduct | compliance |
| `regulatory-scenario` | Regulatory Scenario | compliance |
| `audit-checklist` | Audit Checklist | compliance |
| `progress-tracker` | Progress Tracker | gamification |
| `points-badges` | Points & Badges | gamification |
| `quiz-game` | Quiz Game | gamification |
| `level-learning` | Level Learning | gamification |
| `accessibility-tip-card` | Accessibility Tip Card | accessibility |
| `keyboard-navigation-guide` | Keyboard Navigation Guide | accessibility |
| `screen-reader-guide` | Screen Reader Guide | accessibility |
| `language-selector` | Language Selector | accessibility |
| `transcript-caption-page` | Transcript/Caption Page | accessibility |
| `discussion-prompt` | Discussion Prompt | social |
| `peer-review` | Peer Review | social |
| `poll-vote` | Poll & Vote | social |
| `team-challenge` | Team Challenge | social |
| `scenario-debate` | Scenario Debate | social |
| `guided-practice` | Guided Practice | practice |
| `try-it-simulation` | Try It Simulation | practice |
| `software-simulation` | Software Simulation | practice |
| `sandbox-practice` | Sandbox Practice | practice |
| `error-identification` | Error Identification | practice |

---

## 🔮 Future Work

| Item | Action Needed |
|---|---|
| **Clickable Icons** | Design + implement new component, register with `typeId: 'clickable-icons'` |
| **Slider** | Design + implement new component, register with `typeId: 'slider'` (or confirm if `carousel` covers this use case) |
| **Restore all templates** | Remove the `DEMO MODE` block from `src/components/TemplateSelector.css` |

---

## Files Changed for Demo Mode

| File | Change |
|---|---|
| `src/components/TemplateSelector.tsx` | Added `data-template-type` attribute to `.template-card` div |
| `src/components/TemplateSelector.css` | Added `DEMO MODE` CSS block at end of file |
