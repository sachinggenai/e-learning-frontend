/**
 * Component Registrations — Self-registration of all component types.
 *
 * Import this module once (in App.tsx) to populate the registry.
 * Each registration uses React.lazy() for code-splitting.
 *
 * Open/Closed Principle: Add new components by adding new register() calls.
 * The registry itself never changes.
 */

import React from 'react';
import { registry } from './index';
import { ComponentDefinition } from '../../types/registry';

// ─── Lazy Component Loaders ──────────────────────────────────────
// Content Presentation
const WelcomeEditor = React.lazy(() => import('../templates/content/Welcome').then(m => ({ default: m.WelcomeEditor })));
const WelcomePreview = React.lazy(() => import('../templates/content/Welcome').then(m => ({ default: m.WelcomePreview })));
const ContentTextEditor = React.lazy(() => import('../templates/content/ContentText').then(m => ({ default: m.ContentTextEditor })));
const ContentTextPreview = React.lazy(() => import('../templates/content/ContentText').then(m => ({ default: m.ContentTextPreview })));
const ContentImageEditor = React.lazy(() => import('../templates/content/ContentImage').then(m => ({ default: m.ContentImageEditor })));
const ContentImagePreview = React.lazy(() => import('../templates/content/ContentImage').then(m => ({ default: m.ContentImagePreview })));
const ContentVideoEditor = React.lazy(() => import('../templates/content/ContentVideo').then(m => ({ default: m.ContentVideoEditor })));
const ContentVideoPreview = React.lazy(() => import('../templates/content/ContentVideo').then(m => ({ default: m.ContentVideoPreview })));
const TabsEditor = React.lazy(() => import('../templates/content/Tabs').then(m => ({ default: m.TabsEditor })));
const TabsPreview = React.lazy(() => import('../templates/content/Tabs').then(m => ({ default: m.TabsPreview })));
const AccordionEditor = React.lazy(() => import('../templates/content/Accordion').then(m => ({ default: m.AccordionEditor })));
const AccordionPreview = React.lazy(() => import('../templates/content/Accordion').then(m => ({ default: m.AccordionPreview })));
const SummaryEditor = React.lazy(() => import('../templates/content/Summary').then(m => ({ default: m.SummaryEditor })));
const SummaryPreview = React.lazy(() => import('../templates/content/Summary').then(m => ({ default: m.SummaryPreview })));

// Assessment
const MCQEditor = React.lazy(() => import('../templates/assessment/MCQ').then(m => ({ default: m.MCQEditor })));
const MCQPreview = React.lazy(() => import('../templates/assessment/MCQ').then(m => ({ default: m.MCQPreview })));
const TrueFalseEditor = React.lazy(() => import('../templates/assessment/TrueFalse').then(m => ({ default: m.TrueFalseEditor })));
const TrueFalsePreview = React.lazy(() => import('../templates/assessment/TrueFalse').then(m => ({ default: m.TrueFalsePreview })));
const FillBlanksEditor = React.lazy(() => import('../templates/assessment/FillBlanks').then(m => ({ default: m.FillBlanksEditor })));
const FillBlanksPreview = React.lazy(() => import('../templates/assessment/FillBlanks').then(m => ({ default: m.FillBlanksPreview })));
const MatchingEditor = React.lazy(() => import('../templates/assessment/Matching').then(m => ({ default: m.MatchingEditor })));
const MatchingPreview = React.lazy(() => import('../templates/assessment/Matching').then(m => ({ default: m.MatchingPreview })));
const MultipleSelectEditor = React.lazy(() => import('../templates/assessment/MultipleSelect').then(m => ({ default: m.MultipleSelectEditor })));
const MultipleSelectPreview = React.lazy(() => import('../templates/assessment/MultipleSelect').then(m => ({ default: m.MultipleSelectPreview })));
const ScenarioQuestionEditor = React.lazy(() => import('../templates/assessment/ScenarioQuestion').then(m => ({ default: m.ScenarioQuestionEditor })));
const ScenarioQuestionPreview = React.lazy(() => import('../templates/assessment/ScenarioQuestion').then(m => ({ default: m.ScenarioQuestionPreview })));
const KnowledgeCheckEditor = React.lazy(() => import('../templates/assessment/KnowledgeCheck').then(m => ({ default: m.KnowledgeCheckEditor })));
const KnowledgeCheckPreview = React.lazy(() => import('../templates/assessment/KnowledgeCheck').then(m => ({ default: m.KnowledgeCheckPreview })));
const FinalAssessmentEditor = React.lazy(() => import('../templates/assessment/FinalAssessment').then(m => ({ default: m.FinalAssessmentEditor })));
const FinalAssessmentPreview = React.lazy(() => import('../templates/assessment/FinalAssessment').then(m => ({ default: m.FinalAssessmentPreview })));

// Interaction
const FlipCardsEditor = React.lazy(() => import('../templates/interaction/FlipCards').then(m => ({ default: m.FlipCardsEditor })));
const FlipCardsPreview = React.lazy(() => import('../templates/interaction/FlipCards').then(m => ({ default: m.FlipCardsPreview })));
const ClickRevealEditor = React.lazy(() => import('../templates/interaction/ClickReveal').then(m => ({ default: m.ClickRevealEditor })));
const ClickRevealPreview = React.lazy(() => import('../templates/interaction/ClickReveal').then(m => ({ default: m.ClickRevealPreview })));
const DragDropSortEditor = React.lazy(() => import('../templates/interaction/DragDropSort').then(m => ({ default: m.DragDropSortEditor })));
const DragDropSortPreview = React.lazy(() => import('../templates/interaction/DragDropSort').then(m => ({ default: m.DragDropSortPreview })));
const TimelineEditor = React.lazy(() => import('../templates/interaction/Timeline').then(m => ({ default: m.TimelineEditor })));
const TimelinePreview = React.lazy(() => import('../templates/interaction/Timeline').then(m => ({ default: m.TimelinePreview })));
const CarouselEditor = React.lazy(() => import('../templates/interaction/Carousel').then(m => ({ default: m.CarouselEditor })));
const CarouselPreview = React.lazy(() => import('../templates/interaction/Carousel').then(m => ({ default: m.CarouselPreview })));

// Process-Flow
const StepByStepEditor = React.lazy(() => import('../templates/process/StepByStep').then(m => ({ default: m.StepByStepEditor })));
const StepByStepPreview = React.lazy(() => import('../templates/process/StepByStep').then(m => ({ default: m.StepByStepPreview })));

// Comparison
const ComparisonTableEditor = React.lazy(() => import('../templates/comparison/ComparisonTable').then(m => ({ default: m.ComparisonTableEditor })));
const ComparisonTablePreview = React.lazy(() => import('../templates/comparison/ComparisonTable').then(m => ({ default: m.ComparisonTablePreview })));

// Microlearning
const FlashcardsEditor = React.lazy(() => import('../templates/microlearning/Flashcards').then(m => ({ default: m.FlashcardsEditor })));
const FlashcardsPreview = React.lazy(() => import('../templates/microlearning/Flashcards').then(m => ({ default: m.FlashcardsPreview })));

// Media-Rich
const ImageHotspotsEditor = React.lazy(() => import('../templates/media/ImageHotspots').then(m => ({ default: m.ImageHotspotsEditor })));
const ImageHotspotsPreview = React.lazy(() => import('../templates/media/ImageHotspots').then(m => ({ default: m.ImageHotspotsPreview })));
const VideoSlideEditor = React.lazy(() => import('../templates/media/VideoSlide').then(m => ({ default: m.VideoSlideEditor })));
const VideoSlidePreview = React.lazy(() => import('../templates/media/VideoSlide').then(m => ({ default: m.VideoSlidePreview })));
const InfographicEditor = React.lazy(() => import('../templates/media/Infographic').then(m => ({ default: m.InfographicEditor })));
const InfographicPreview = React.lazy(() => import('../templates/media/Infographic').then(m => ({ default: m.InfographicPreview })));

// Scenario
const BranchingScenarioEditor = React.lazy(() => import('../templates/scenario/BranchingScenario').then(m => ({ default: m.BranchingScenarioEditor })));
const BranchingScenarioPreview = React.lazy(() => import('../templates/scenario/BranchingScenario').then(m => ({ default: m.BranchingScenarioPreview })));
const CaseStudyEditor = React.lazy(() => import('../templates/scenario/CaseStudy').then(m => ({ default: m.CaseStudyEditor })));
const CaseStudyPreview = React.lazy(() => import('../templates/scenario/CaseStudy').then(m => ({ default: m.CaseStudyPreview })));

// Navigation
const CourseMenuEditor = React.lazy(() => import('../templates/navigation/CourseMenu').then(m => ({ default: m.CourseMenuEditor })));
const CourseMenuPreview = React.lazy(() => import('../templates/navigation/CourseMenu').then(m => ({ default: m.CourseMenuPreview })));
const ResourcesDownloadsEditor = React.lazy(() => import('../templates/navigation/ResourcesDownloads').then(m => ({ default: m.ResourcesDownloadsEditor })));
const ResourcesDownloadsPreview = React.lazy(() => import('../templates/navigation/ResourcesDownloads').then(m => ({ default: m.ResourcesDownloadsPreview })));

// Gamification
const ProgressTrackerEditor = React.lazy(() => import('../templates/gamification/ProgressTracker').then(m => ({ default: m.ProgressTrackerEditor })));
const ProgressTrackerPreview = React.lazy(() => import('../templates/gamification/ProgressTracker').then(m => ({ default: m.ProgressTrackerPreview })));
const QuizGameEditor = React.lazy(() => import('../templates/gamification/QuizGame').then(m => ({ default: m.QuizGameEditor })));
const QuizGamePreview = React.lazy(() => import('../templates/gamification/QuizGame').then(m => ({ default: m.QuizGamePreview })));

// ─── Registration Helper ─────────────────────────────────────────
function r(def: ComponentDefinition) { registry.register(def); }

// ─── Content Presentation ────────────────────────────────────────
r({
  typeId: 'welcome',
  displayName: 'Welcome',
  description: 'Course welcome page with title, subtitle, and description',
  category: 'content-presentation',
  icon: 'hand-heart',
  tags: ['welcome', 'intro', 'landing'],
  completionCapabilities: ['view'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: 'Welcome to the Course', subtitle: '', description: '' },
  sortOrder: 0,
  editorComponent: WelcomeEditor,
  previewComponent: WelcomePreview,
});

r({
  typeId: 'content-text',
  displayName: 'Text Content',
  description: 'Rich text content with optional title',
  category: 'content-presentation',
  icon: 'file-text',
  tags: ['text', 'content', 'article'],
  completionCapabilities: ['view'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: '', body: '<p>Enter your content here...</p>' },
  sortOrder: 1,
  editorComponent: ContentTextEditor,
  previewComponent: ContentTextPreview,
});

r({
  typeId: 'content-image',
  displayName: 'Image Content',
  description: 'Image with caption and description',
  category: 'content-presentation',
  icon: 'image',
  tags: ['image', 'photo', 'picture'],
  completionCapabilities: ['view'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: '', imageUrl: '', altText: '', caption: '', body: '' },
  sortOrder: 2,
  editorComponent: ContentImageEditor,
  previewComponent: ContentImagePreview,
});

r({
  typeId: 'content-video',
  displayName: 'Video Content',
  description: 'Video player with optional description',
  category: 'content-presentation',
  icon: 'video',
  tags: ['video', 'media', 'play'],
  completionCapabilities: ['view', 'audio'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: '', videoUrl: '', body: '' },
  sortOrder: 3,
  editorComponent: ContentVideoEditor,
  previewComponent: ContentVideoPreview,
});

r({
  typeId: 'tabs',
  displayName: 'Tabs',
  description: 'Tabbed content panels with per-tab audio',
  category: 'content-presentation',
  icon: 'panel-top',
  tags: ['tabs', 'tabbed', 'panels'],
  completionCapabilities: ['view', 'interact', 'audio'],
  scoringEnabled: false,
  audioSupport: { perComponent: false, perInteraction: true, interactionLabel: 'per tab' },
  defaultData: {
    tabs: [
      {
        id: 'tab-1',
        title: 'Overview',
        body: '<p>This section introduces the topic and explains why it matters in day-to-day work.</p>',
      },
      {
        id: 'tab-2',
        title: 'Key Steps',
        body: '<p>Follow these core steps in sequence to complete the task accurately and consistently.</p>',
      },
      {
        id: 'tab-3',
        title: 'Best Practices',
        body: '<p>Use these practical tips to avoid common mistakes and improve quality.</p>',
      },
    ],
    defaultTabId: 'tab-1',
  },
  sortOrder: 4,
  editorComponent: TabsEditor,
  previewComponent: TabsPreview,
});

r({
  typeId: 'accordion',
  displayName: 'Accordion',
  description: 'Expandable/collapsible panels with per-panel audio',
  category: 'content-presentation',
  icon: 'list-collapse',
  tags: ['accordion', 'expand', 'collapse'],
  completionCapabilities: ['view', 'interact', 'audio'],
  scoringEnabled: false,
  audioSupport: { perComponent: false, perInteraction: true, interactionLabel: 'per panel' },
  defaultData: {
    panels: [
      {
        id: 'panel-1',
        title: 'Safety Guidelines',
        body: '<p>Review the core safety protocols before starting work to reduce risk and ensure a secure environment.</p>',
      },
      {
        id: 'panel-2',
        title: 'Compliance Requirements',
        body: '<p>Follow all applicable policies and regulatory standards to maintain quality and audit readiness.</p>',
      },
      {
        id: 'panel-3',
        title: 'Emergency Procedures',
        body: '<p>Use the documented response steps to act quickly and effectively during incidents or unexpected events.</p>',
      },
    ],
    allowMultipleOpen: false,
  },
  sortOrder: 5,
  editorComponent: AccordionEditor,
  previewComponent: AccordionPreview,
});

r({
  typeId: 'summary',
  displayName: 'Summary',
  description: 'Key takeaways and summary points',
  category: 'content-presentation',
  icon: 'check-square',
  tags: ['summary', 'takeaways', 'recap'],
  completionCapabilities: ['view'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: 'Key Takeaways', keyPoints: [''] },
  sortOrder: 6,
  editorComponent: SummaryEditor,
  previewComponent: SummaryPreview,
});

// ─── Assessment ──────────────────────────────────────────────────
r({
  typeId: 'mcq',
  displayName: 'Multiple Choice',
  description: 'Single-answer multiple choice question with feedback',
  category: 'assessment',
  icon: 'circle-check',
  tags: ['quiz', 'mcq', 'question', 'assessment'],
  completionCapabilities: ['interact', 'score'],
  scoringEnabled: true,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: {
    question: '',
    options: [
      { id: 'opt-1', text: '', isCorrect: true },
      { id: 'opt-2', text: '', isCorrect: false },
    ],
    explanation: '',
    maxScore: 1,
  },
  sortOrder: 0,
  editorComponent: MCQEditor,
  previewComponent: MCQPreview,
});

r({
  typeId: 'true-false',
  displayName: 'True / False',
  description: 'True or false statement question',
  category: 'assessment',
  icon: 'toggle-left',
  tags: ['quiz', 'true', 'false', 'assessment'],
  completionCapabilities: ['interact', 'score'],
  scoringEnabled: true,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { question: '', correctAnswer: true, explanation: '', maxScore: 1 },
  sortOrder: 1,
  editorComponent: TrueFalseEditor,
  previewComponent: TrueFalsePreview,
});

r({
  typeId: 'fill-blanks',
  displayName: 'Fill in the Blanks',
  description: 'Complete sentences by filling in missing words',
  category: 'assessment',
  icon: 'text-cursor-input',
  tags: ['fill', 'blanks', 'complete', 'assessment'],
  completionCapabilities: ['interact', 'score'],
  scoringEnabled: true,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: '', templateText: '', blanks: [], maxScore: 1 },
  sortOrder: 2,
  editorComponent: FillBlanksEditor,
  previewComponent: FillBlanksPreview,
});

r({
  typeId: 'matching',
  displayName: 'Matching',
  description: 'Match items from two columns',
  category: 'assessment',
  icon: 'link',
  tags: ['match', 'pair', 'connect', 'assessment'],
  completionCapabilities: ['interact', 'score'],
  scoringEnabled: true,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: {
    title: '',
    pairs: [
      { id: 'pair-1', left: '', right: '' },
      { id: 'pair-2', left: '', right: '' },
    ],
  },
  sortOrder: 3,
  editorComponent: MatchingEditor,
  previewComponent: MatchingPreview,
});

r({
  typeId: 'multiple-select',
  displayName: 'Multiple Select',
  description: 'Select all correct answers from a list of options',
  category: 'assessment',
  icon: 'list-checks',
  tags: ['quiz', 'multi-select', 'checkbox', 'assessment'],
  completionCapabilities: ['interact', 'score'],
  scoringEnabled: true,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: {
    question: '',
    options: [
      { id: 'opt-1', text: '', isCorrect: true },
      { id: 'opt-2', text: '', isCorrect: false },
    ],
    partialCredit: true,
    maxScore: 1,
  },
  sortOrder: 4,
  editorComponent: MultipleSelectEditor,
  previewComponent: MultipleSelectPreview,
});

r({
  typeId: 'scenario-question',
  displayName: 'Scenario Question',
  description: 'Scenario-based question with context and weighted options',
  category: 'assessment',
  icon: 'book-open',
  tags: ['scenario', 'case-study', 'assessment'],
  completionCapabilities: ['interact', 'score'],
  scoringEnabled: true,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: {
    scenario: '',
    question: '',
    options: [
      { id: 'opt-1', text: '', points: 0, feedback: '' },
    ],
    maxScore: 1,
  },
  sortOrder: 5,
  editorComponent: ScenarioQuestionEditor,
  previewComponent: ScenarioQuestionPreview,
});

r({
  typeId: 'knowledge-check',
  displayName: 'Knowledge Check',
  description: 'Quick inline quiz with 1-3 questions',
  category: 'assessment',
  icon: 'brain',
  tags: ['quiz', 'check', 'inline', 'knowledge'],
  completionCapabilities: ['interact', 'score'],
  scoringEnabled: true,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: {
    title: 'Check Your Understanding',
    questions: [
      { id: 'q-1', question: '', options: [{ id: 'opt-1', text: '', isCorrect: true }], explanation: '' },
    ],
  },
  sortOrder: 6,
  editorComponent: KnowledgeCheckEditor,
  previewComponent: KnowledgeCheckPreview,
});

r({
  typeId: 'final-assessment',
  displayName: 'Final Assessment',
  description: 'Comprehensive end-of-course assessment with mixed question types',
  category: 'assessment',
  icon: 'award',
  tags: ['final', 'exam', 'assessment', 'comprehensive'],
  completionCapabilities: ['interact', 'score'],
  scoringEnabled: true,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: {
    title: 'Final Assessment',
    instructions: '',
    passingScore: 70,
    questions: [],
  },
  sortOrder: 7,
  editorComponent: FinalAssessmentEditor,
  previewComponent: FinalAssessmentPreview,
});

// ─── Interaction ─────────────────────────────────────────────────
r({
  typeId: 'flip-cards',
  displayName: 'Flip Cards',
  description: 'Grid of cards that flip to reveal content on click',
  category: 'interaction',
  icon: 'flip-horizontal',
  tags: ['flip', 'cards', 'reveal', 'interaction'],
  completionCapabilities: ['interact'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: '', cards: [], columns: 3 },
  sortOrder: 0,
  editorComponent: FlipCardsEditor,
  previewComponent: FlipCardsPreview,
});

r({
  typeId: 'click-reveal',
  displayName: 'Click & Reveal',
  description: 'Grid of items that reveal content when clicked',
  category: 'interaction',
  icon: 'mouse-pointer-click',
  tags: ['click', 'reveal', 'explore', 'interaction'],
  completionCapabilities: ['interact'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: '', items: [], columns: 3 },
  sortOrder: 1,
  editorComponent: ClickRevealEditor,
  previewComponent: ClickRevealPreview,
});

r({
  typeId: 'drag-drop-sort',
  displayName: 'Drag & Drop Sort',
  description: 'Arrange items in the correct order by dragging',
  category: 'interaction',
  icon: 'grip-vertical',
  tags: ['drag', 'drop', 'sort', 'order', 'interaction'],
  completionCapabilities: ['interact', 'score'],
  scoringEnabled: true,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: '', instructions: '', items: [] },
  sortOrder: 2,
  editorComponent: DragDropSortEditor,
  previewComponent: DragDropSortPreview,
});

r({
  typeId: 'timeline',
  displayName: 'Timeline',
  description: 'Vertical timeline of events or milestones',
  category: 'interaction',
  icon: 'calendar-range',
  tags: ['timeline', 'history', 'chronology', 'interaction'],
  completionCapabilities: ['view', 'interact'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: '', events: [] },
  sortOrder: 3,
  editorComponent: TimelineEditor,
  previewComponent: TimelinePreview,
});

r({
  typeId: 'carousel',
  displayName: 'Carousel',
  description: 'Slide carousel for sequenced content',
  category: 'interaction',
  icon: 'gallery-horizontal',
  tags: ['carousel', 'slides', 'gallery', 'interaction'],
  completionCapabilities: ['view', 'interact'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: '', slides: [] },
  sortOrder: 4,
  editorComponent: CarouselEditor,
  previewComponent: CarouselPreview,
});

// ─── Process-Flow ────────────────────────────────────────────────
r({
  typeId: 'step-by-step',
  displayName: 'Step by Step',
  description: 'Numbered step-through guide with progress indicators',
  category: 'process-flow',
  icon: 'footprints',
  tags: ['steps', 'process', 'guide', 'how-to'],
  completionCapabilities: ['view', 'interact'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: '', steps: [] },
  sortOrder: 0,
  editorComponent: StepByStepEditor,
  previewComponent: StepByStepPreview,
});

// ─── Comparison ──────────────────────────────────────────────────
r({
  typeId: 'comparison-table',
  displayName: 'Comparison Table',
  description: 'Side-by-side comparison table with highlighting',
  category: 'comparison',
  icon: 'table-2',
  tags: ['comparison', 'table', 'versus', 'compare'],
  completionCapabilities: ['view'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: '', columns: [], rows: [] },
  sortOrder: 0,
  editorComponent: ComparisonTableEditor,
  previewComponent: ComparisonTablePreview,
});

// ─── Microlearning ───────────────────────────────────────────────
r({
  typeId: 'flashcards',
  displayName: 'Flashcards',
  description: 'Study flashcard deck with flip animation',
  category: 'microlearning',
  icon: 'layers',
  tags: ['flashcards', 'study', 'memorize', 'microlearning'],
  completionCapabilities: ['interact'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: '', cards: [] },
  sortOrder: 0,
  editorComponent: FlashcardsEditor,
  previewComponent: FlashcardsPreview,
});

// ─── Media-Rich ──────────────────────────────────────────────────
r({
  typeId: 'image-hotspots',
  displayName: 'Image Hotspots',
  description: 'Interactive image with clickable hotspot markers',
  category: 'media-rich',
  icon: 'map-pin',
  tags: ['hotspots', 'image', 'interactive', 'explore'],
  completionCapabilities: ['interact'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: '', imageUrl: '', hotspots: [] },
  sortOrder: 0,
  editorComponent: ImageHotspotsEditor,
  previewComponent: ImageHotspotsPreview,
});

r({
  typeId: 'video-slide',
  displayName: 'Video Slide',
  description: 'Video-based content slide with overlay text',
  category: 'media-rich',
  icon: 'clapperboard',
  tags: ['video', 'slide', 'media', 'presentation'],
  completionCapabilities: ['view', 'audio'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: '', videoUrl: '', watchThreshold: 0.9 },
  sortOrder: 1,
  editorComponent: VideoSlideEditor,
  previewComponent: VideoSlidePreview,
});

r({
  typeId: 'infographic',
  displayName: 'Infographic',
  description: 'Visual data presentation with sections and stats',
  category: 'media-rich',
  icon: 'bar-chart-3',
  tags: ['infographic', 'data', 'visual', 'stats'],
  completionCapabilities: ['view'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: '', sections: [], layout: 'grid' },
  sortOrder: 2,
  editorComponent: InfographicEditor,
  previewComponent: InfographicPreview,
});

// ─── Scenario ────────────────────────────────────────────────────
r({
  typeId: 'branching-scenario',
  displayName: 'Branching Scenario',
  description: 'Multi-path decision tree scenario with scoring',
  category: 'scenario',
  icon: 'git-branch',
  tags: ['branching', 'scenario', 'decision', 'tree'],
  completionCapabilities: ['interact', 'score'],
  scoringEnabled: true,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: '', nodes: [], showScore: true },
  sortOrder: 0,
  editorComponent: BranchingScenarioEditor,
  previewComponent: BranchingScenarioPreview,
});

r({
  typeId: 'case-study',
  displayName: 'Case Study',
  description: 'Extended scenario with analysis prompts and reflection',
  category: 'scenario',
  icon: 'briefcase',
  tags: ['case-study', 'analysis', 'scenario', 'reflection'],
  completionCapabilities: ['interact'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: '', context: '', prompts: [] },
  sortOrder: 1,
  editorComponent: CaseStudyEditor,
  previewComponent: CaseStudyPreview,
});

// ─── Navigation ──────────────────────────────────────────────────
r({
  typeId: 'course-menu',
  displayName: 'Course Menu',
  description: 'Navigation menu showing course structure',
  category: 'navigation',
  icon: 'menu',
  tags: ['menu', 'navigation', 'course', 'toc'],
  completionCapabilities: [],
  scoringEnabled: false,
  audioSupport: { perComponent: false, perInteraction: false },
  defaultData: { title: 'Course Menu', items: [] },
  sortOrder: 0,
  editorComponent: CourseMenuEditor,
  previewComponent: CourseMenuPreview,
});

r({
  typeId: 'resources-downloads',
  displayName: 'Resources & Downloads',
  description: 'Downloadable resources and supplementary links',
  category: 'navigation',
  icon: 'download',
  tags: ['resources', 'downloads', 'files', 'links'],
  completionCapabilities: [],
  scoringEnabled: false,
  audioSupport: { perComponent: false, perInteraction: false },
  defaultData: { title: 'Resources & Downloads', resources: [] },
  sortOrder: 1,
  editorComponent: ResourcesDownloadsEditor,
  previewComponent: ResourcesDownloadsPreview,
});

// ─── Gamification ────────────────────────────────────────────────
r({
  typeId: 'progress-tracker',
  displayName: 'Progress Tracker',
  description: 'Visual course progress tracker with milestones',
  category: 'gamification',
  icon: 'trophy',
  tags: ['progress', 'tracker', 'milestones', 'gamification'],
  completionCapabilities: [],
  scoringEnabled: false,
  audioSupport: { perComponent: false, perInteraction: false },
  defaultData: { title: 'Your Progress', totalPages: 10, completedPages: 0, milestones: [] },
  sortOrder: 0,
  editorComponent: ProgressTrackerEditor,
  previewComponent: ProgressTrackerPreview,
});

r({
  typeId: 'quiz-game',
  displayName: 'Quiz Game',
  description: 'Gamified quiz with timer, lives, and score',
  category: 'gamification',
  icon: 'gamepad-2',
  tags: ['quiz', 'game', 'gamification', 'timer', 'lives'],
  completionCapabilities: ['interact', 'score'],
  scoringEnabled: true,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { questions: [], maxLives: 3, timeLimit: 0 },
  sortOrder: 1,
  editorComponent: QuizGameEditor,
  previewComponent: QuizGamePreview,
});

// ─── Legacy Aliases ──────────────────────────────────────────────
// Map old template type names to new component types for backward compat
export const LEGACY_TYPE_MAP: Record<string, string> = {
  'content_text': 'content-text',
  'content_video': 'content-video',
  'content_image': 'content-image',
  'interactive': 'tabs', // Legacy "interactive" maps to tabs
  'text-with-media': 'content-text',
};

/**
 * Resolve a component type ID, applying legacy aliases.
 */
export function resolveComponentType(typeId: string): string {
  return LEGACY_TYPE_MAP[typeId] || typeId;
}

// Export registry size for debugging
if (process.env.NODE_ENV === 'development') {
  console.info(`[ComponentRegistry] ${registry.size} component types registered across ${registry.getCategories().length} categories`);
}
