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
const LayeredContentEditor = React.lazy(() => import('../templates/content/LayeredContent').then(m => ({ default: m.LayeredContentEditor })));
const LayeredContentPreview = React.lazy(() => import('../templates/content/LayeredContent').then(m => ({ default: m.LayeredContentPreview })));
const TextWithMediaEditor = React.lazy(() => import('../templates/content/TextWithMedia').then(m => ({ default: m.TextWithMediaEditor })));
const TextWithMediaPreview = React.lazy(() => import('../templates/content/TextWithMedia').then(m => ({ default: m.TextWithMediaPreview })));

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
const CycleDiagramEditor = React.lazy(() => import('../templates/process/CycleDiagram').then(m => ({ default: m.CycleDiagramEditor })));
const CycleDiagramPreview = React.lazy(() => import('../templates/process/CycleDiagram').then(m => ({ default: m.CycleDiagramPreview })));
const FlowchartEditor = React.lazy(() => import('../templates/process/Flowchart').then(m => ({ default: m.FlowchartEditor })));
const FlowchartPreview = React.lazy(() => import('../templates/process/Flowchart').then(m => ({ default: m.FlowchartPreview })));
const ProcessMapEditor = React.lazy(() => import('../templates/process/ProcessMap').then(m => ({ default: m.ProcessMapEditor })));
const ProcessMapPreview = React.lazy(() => import('../templates/process/ProcessMap').then(m => ({ default: m.ProcessMapPreview })));
const DecisionTreeEditor = React.lazy(() => import('../templates/process/DecisionTree').then(m => ({ default: m.DecisionTreeEditor })));
const DecisionTreePreview = React.lazy(() => import('../templates/process/DecisionTree').then(m => ({ default: m.DecisionTreePreview })));

// Comparison
const ComparisonTableEditor = React.lazy(() => import('../templates/comparison/ComparisonTable').then(m => ({ default: m.ComparisonTableEditor })));
const ComparisonTablePreview = React.lazy(() => import('../templates/comparison/ComparisonTable').then(m => ({ default: m.ComparisonTablePreview })));
const ProsConsEditor = React.lazy(() => import('../templates/comparison/ProsCons').then(m => ({ default: m.ProsConsEditor })));
const ProsConsPreview = React.lazy(() => import('../templates/comparison/ProsCons').then(m => ({ default: m.ProsConsPreview })));
const BeforeAfterEditor = React.lazy(() => import('../templates/comparison/BeforeAfter').then(m => ({ default: m.BeforeAfterEditor })));
const BeforeAfterPreview = React.lazy(() => import('../templates/comparison/BeforeAfter').then(m => ({ default: m.BeforeAfterPreview })));
const MatrixGridEditor = React.lazy(() => import('../templates/comparison/MatrixGrid').then(m => ({ default: m.MatrixGridEditor })));
const MatrixGridPreview = React.lazy(() => import('../templates/comparison/MatrixGrid').then(m => ({ default: m.MatrixGridPreview })));

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
const ModuleOverviewEditor = React.lazy(() => import('../templates/navigation/ModuleOverview').then(m => ({ default: m.ModuleOverviewEditor })));
const ModuleOverviewPreview = React.lazy(() => import('../templates/navigation/ModuleOverview').then(m => ({ default: m.ModuleOverviewPreview })));
const LearningRoadmapEditor = React.lazy(() => import('../templates/navigation/LearningRoadmap').then(m => ({ default: m.LearningRoadmapEditor })));
const LearningRoadmapPreview = React.lazy(() => import('../templates/navigation/LearningRoadmap').then(m => ({ default: m.LearningRoadmapPreview })));
const SummaryTakeawaysEditor = React.lazy(() => import('../templates/navigation/SummaryTakeaways').then(m => ({ default: m.SummaryTakeawaysEditor })));
const SummaryTakeawaysPreview = React.lazy(() => import('../templates/navigation/SummaryTakeaways').then(m => ({ default: m.SummaryTakeawaysPreview })));
const ResourcesDownloadsEditor = React.lazy(() => import('../templates/navigation/ResourcesDownloads').then(m => ({ default: m.ResourcesDownloadsEditor })));
const ResourcesDownloadsPreview = React.lazy(() => import('../templates/navigation/ResourcesDownloads').then(m => ({ default: m.ResourcesDownloadsPreview })));

// Feedback
const ReflectiveQuestionEditor = React.lazy(() => import('../templates/feedback/ReflectiveQuestion').then(m => ({ default: m.ReflectiveQuestionEditor })));
const ReflectiveQuestionPreview = React.lazy(() => import('../templates/feedback/ReflectiveQuestion').then(m => ({ default: m.ReflectiveQuestionPreview })));
const LearnerJournalEditor = React.lazy(() => import('../templates/feedback/LearnerJournal').then(m => ({ default: m.LearnerJournalEditor })));
const LearnerJournalPreview = React.lazy(() => import('../templates/feedback/LearnerJournal').then(m => ({ default: m.LearnerJournalPreview })));
const SelfAssessmentEditor = React.lazy(() => import('../templates/feedback/SelfAssessment').then(m => ({ default: m.SelfAssessmentEditor })));
const SelfAssessmentPreview = React.lazy(() => import('../templates/feedback/SelfAssessment').then(m => ({ default: m.SelfAssessmentPreview })));
const ConfidenceRatingEditor = React.lazy(() => import('../templates/feedback/ConfidenceRating').then(m => ({ default: m.ConfidenceRatingEditor })));
const ConfidenceRatingPreview = React.lazy(() => import('../templates/feedback/ConfidenceRating').then(m => ({ default: m.ConfidenceRatingPreview })));
const ActionPlanningEditor = React.lazy(() => import('../templates/feedback/ActionPlanning').then(m => ({ default: m.ActionPlanningEditor })));
const ActionPlanningPreview = React.lazy(() => import('../templates/feedback/ActionPlanning').then(m => ({ default: m.ActionPlanningPreview })));

// Diagnostic
const PreAssessmentEditor = React.lazy(() => import('../templates/diagnostic/PreAssessment').then(m => ({ default: m.PreAssessmentEditor })));
const PreAssessmentPreview = React.lazy(() => import('../templates/diagnostic/PreAssessment').then(m => ({ default: m.PreAssessmentPreview })));
const DiagnosticQuizEditor = React.lazy(() => import('../templates/diagnostic/DiagnosticQuiz').then(m => ({ default: m.DiagnosticQuizEditor })));
const DiagnosticQuizPreview = React.lazy(() => import('../templates/diagnostic/DiagnosticQuiz').then(m => ({ default: m.DiagnosticQuizPreview })));
const SkillGapAnalysisEditor = React.lazy(() => import('../templates/diagnostic/SkillGapAnalysis').then(m => ({ default: m.SkillGapAnalysisEditor })));
const SkillGapAnalysisPreview = React.lazy(() => import('../templates/diagnostic/SkillGapAnalysis').then(m => ({ default: m.SkillGapAnalysisPreview })));
const AdaptiveLearningPathEditor = React.lazy(() => import('../templates/diagnostic/AdaptiveLearningPath').then(m => ({ default: m.AdaptiveLearningPathEditor })));
const AdaptiveLearningPathPreview = React.lazy(() => import('../templates/diagnostic/AdaptiveLearningPath').then(m => ({ default: m.AdaptiveLearningPathPreview })));
const RecommendationCardEditor = React.lazy(() => import('../templates/diagnostic/RecommendationCard').then(m => ({ default: m.RecommendationCardEditor })));
const RecommendationCardPreview = React.lazy(() => import('../templates/diagnostic/RecommendationCard').then(m => ({ default: m.RecommendationCardPreview })));

// Analytics
const LearningProgressSummaryEditor = React.lazy(() => import('../templates/analytics/LearningProgressSummary').then(m => ({ default: m.LearningProgressSummaryEditor })));
const LearningProgressSummaryPreview = React.lazy(() => import('../templates/analytics/LearningProgressSummary').then(m => ({ default: m.LearningProgressSummaryPreview })));
const PerformanceDashboardEditor = React.lazy(() => import('../templates/analytics/PerformanceDashboard').then(m => ({ default: m.PerformanceDashboardEditor })));
const PerformanceDashboardPreview = React.lazy(() => import('../templates/analytics/PerformanceDashboard').then(m => ({ default: m.PerformanceDashboardPreview })));
const SkillMasteryReportEditor = React.lazy(() => import('../templates/analytics/SkillMasteryReport').then(m => ({ default: m.SkillMasteryReportEditor })));
const SkillMasteryReportPreview = React.lazy(() => import('../templates/analytics/SkillMasteryReport').then(m => ({ default: m.SkillMasteryReportPreview })));
const CompletionCertificateEditor = React.lazy(() => import('../templates/analytics/CompletionCertificate').then(m => ({ default: m.CompletionCertificateEditor })));
const CompletionCertificatePreview = React.lazy(() => import('../templates/analytics/CompletionCertificate').then(m => ({ default: m.CompletionCertificatePreview })));
const ManagerReviewPageEditor = React.lazy(() => import('../templates/analytics/ManagerReviewPage').then(m => ({ default: m.ManagerReviewPageEditor })));
const ManagerReviewPagePreview = React.lazy(() => import('../templates/analytics/ManagerReviewPage').then(m => ({ default: m.ManagerReviewPagePreview })));

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
  typeId: 'layered-content',
  displayName: 'Layered Content',
  description: 'Stacked content layers with toggle navigation',
  category: 'content-presentation',
  icon: 'layers',
  tags: ['layered', 'stacked', 'toggle'],
  completionCapabilities: ['view', 'interact'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: {
    title: 'Layered Concepts',
    layers: [
      { id: 'layer-1', label: 'Overview', content: 'Start with the key concept summary.' },
      { id: 'layer-2', label: 'Details', content: 'Dive deeper into process details and examples.' },
      { id: 'layer-3', label: 'Practice', content: 'Apply the concept with practical checkpoints.' },
    ],
    defaultLayerId: 'layer-1',
  },
  sortOrder: 7,
  editorComponent: LayeredContentEditor,
  previewComponent: LayeredContentPreview,
});

r({
  typeId: 'text-with-media',
  displayName: 'Text with Media',
  description: 'Rich text block with optional image or video',
  category: 'content-presentation',
  icon: 'file-text',
  tags: ['text', 'media', 'content'],
  completionCapabilities: ['view', 'audio'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: {
    title: 'Text with Media',
    body: '<p>Use this layout to pair explanatory text with supporting media.</p>',
    mediaUrl: '',
    mediaType: 'none',
    mediaPosition: 'right',
  },
  sortOrder: 8,
  editorComponent: TextWithMediaEditor,
  previewComponent: TextWithMediaPreview,
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
  defaultData: {
    title: 'Explore Key Concepts',
    instructions: 'Click each item to reveal more information.',
    items: [
      {
        id: '1',
        label: 'What is a Variable?',
        content: 'A variable is a named container that stores data in a program. The data can change during program execution, which is why it\'s called a "variable." Variables help us organize and manipulate information efficiently.'
      },
      {
        id: '2',
        label: 'Why Use Functions?',
        content: 'Functions organize code into reusable blocks that perform specific tasks. They make programs easier to read, maintain, and test. Instead of repeating the same code multiple times, we can write it once in a function and call it whenever needed.'
      },
      {
        id: '3',
        label: 'What is a Loop?',
        content: 'Loops repeat actions until a condition is met. They help automate repetitive tasks and reduce code duplication. Common loop types include for loops (repeat a fixed number of times) and while loops (repeat until a condition becomes false).'
      }
    ],
    columns: 3
  },
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
  defaultData: {
    title: 'Arrange in Correct Order',
    instructions: 'Drag the items to put them in the correct sequence',
    items: [
      { id: 'item-1', text: 'Analyze the requirements', correctOrder: 0 },
      { id: 'item-2', text: 'Design the solution', correctOrder: 1 },
      { id: 'item-3', text: 'Implement the code', correctOrder: 2 },
      { id: 'item-4', text: 'Test and validate', correctOrder: 3 },
      { id: 'item-5', text: 'Deploy to production', correctOrder: 4 },
    ],
  },
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
  defaultData: {
    title: 'Project Milestones',
    events: [
      {
        id: 'evt-1',
        date: 'Jan 2026',
        title: 'Discovery',
        description: 'Requirements gathering and initial solution planning.',
      },
      {
        id: 'evt-2',
        date: 'Feb 2026',
        title: 'Design',
        description: 'UI and interaction design finalized and reviewed.',
      },
      {
        id: 'evt-3',
        date: 'Mar 2026',
        title: 'Launch',
        description: 'Product released to learners with onboarding support.',
      },
    ],
  },
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

r({
  typeId: 'cycle-diagram',
  displayName: 'Cycle Diagram',
  description: 'Circular process diagram showing repeating stages',
  category: 'process-flow',
  icon: 'refresh-cw',
  tags: ['cycle', 'circular', 'loop', 'process'],
  completionCapabilities: ['view'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: '', stages: [] },
  sortOrder: 1,
  editorComponent: CycleDiagramEditor,
  previewComponent: CycleDiagramPreview,
});

r({
  typeId: 'flowchart',
  displayName: 'Flowchart',
  description: 'Visual flowchart diagram with different node types and connections',
  category: 'process-flow',
  icon: 'share-2',
  tags: ['flowchart', 'diagram', 'flow', 'process'],
  completionCapabilities: ['view'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: '', nodes: [], connections: [] },
  sortOrder: 2,
  editorComponent: FlowchartEditor,
  previewComponent: FlowchartPreview,
});

r({
  typeId: 'process-map',
  displayName: 'Process Map',
  description: 'Swimlane-based process diagram showing parallel workflows',
  category: 'process-flow',
  icon: 'trello',
  tags: ['process', 'map', 'swimlane', 'workflow'],
  completionCapabilities: ['view'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: '', lanes: [], connections: [] },
  sortOrder: 3,
  editorComponent: ProcessMapEditor,
  previewComponent: ProcessMapPreview,
});

r({
  typeId: 'decision-tree',
  displayName: 'Decision Tree',
  description: 'Interactive branching decision tree with configurable outcomes',
  category: 'process-flow',
  icon: 'git-branch',
  tags: ['decision', 'tree', 'branch', 'choice'],
  completionCapabilities: ['view'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: '', rootNode: { id: 'root', question: '', options: [] } },
  sortOrder: 4,
  editorComponent: DecisionTreeEditor,
  previewComponent: DecisionTreePreview,
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

r({
  typeId: 'pros-cons',
  displayName: 'Pros and Cons',
  description: 'Two-column comparison of advantages and disadvantages',
  category: 'comparison',
  icon: 'columns',
  tags: ['comparison', 'pros', 'cons', 'advantages', 'disadvantages', 'decision'],
  completionCapabilities: ['view'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: '', topic: '', pros: [], cons: [] },
  sortOrder: 1,
  editorComponent: ProsConsEditor,
  previewComponent: ProsConsPreview,
});

r({
  typeId: 'before-after',
  displayName: 'Before and After',
  description: 'Side-by-side comparison showing change or improvement',
  category: 'comparison',
  icon: 'arrow-right-left',
  tags: ['comparison', 'before', 'after', 'change', 'improvement', 'transformation'],
  completionCapabilities: ['view'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: '', beforeLabel: 'Before', afterLabel: 'After', beforeContent: '', afterContent: '' },
  sortOrder: 2,
  editorComponent: BeforeAfterEditor,
  previewComponent: BeforeAfterPreview,
});

r({
  typeId: 'matrix-grid',
  displayName: 'Matrix / Grid',
  description: 'Flexible grid with row and column headers',
  category: 'comparison',
  icon: 'grid-3x3',
  tags: ['comparison', 'matrix', 'grid', 'table', 'data'],
  completionCapabilities: ['view'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: '', rowHeaders: [], columnHeaders: [], cells: [] },
  sortOrder: 3,
  editorComponent: MatrixGridEditor,
  previewComponent: MatrixGridPreview,
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
  defaultData: {
    title: 'Explore the Workstation',
    instructions: 'Click each hotspot to reveal details.',
    imageUrl: '',
    hotspots: [
      { id: 'hs-1', label: 'Control Panel', content: 'Main controls for operations and monitoring.', x: 22, y: 28 },
      { id: 'hs-2', label: 'Safety Guard', content: 'Protective cover to prevent accidental contact.', x: 66, y: 40 },
      { id: 'hs-3', label: 'Emergency Stop', content: 'Use this immediately to halt the machine in emergencies.', x: 40, y: 72 },
    ],
  },
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
  typeId: 'module-overview',
  displayName: 'Module Overview',
  description: 'Overview page with module metadata and objectives',
  category: 'navigation',
  icon: 'book-open',
  tags: ['module', 'overview', 'objectives', 'intro'],
  completionCapabilities: ['view'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: {
    title: 'Module Overview',
    description: 'This module covers essential concepts and practical applications.',
    estimatedDuration: 30,
    difficultyLevel: 'beginner',
    objectives: [
      { id: 'obj-1', text: 'Understand the fundamental concepts' },
      { id: 'obj-2', text: 'Apply concepts to practical scenarios' },
    ],
    showStartButton: false,
  },
  sortOrder: 1,
  editorComponent: ModuleOverviewEditor,
  previewComponent: ModuleOverviewPreview,
});

r({
  typeId: 'learning-roadmap',
  displayName: 'Learning Roadmap',
  description: 'Visual learning path with milestone progression',
  category: 'navigation',
  icon: 'map',
  tags: ['roadmap', 'path', 'milestones', 'progression'],
  completionCapabilities: ['view'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: {
    title: 'Learning Roadmap',
    description: 'Track your progress through the course',
    milestones: [
      {
        id: 'ms-1',
        title: 'Getting Started',
        description: 'Introduction to the course',
        status: 'completed',
        pageId: 'page-1',
        estimatedDuration: 15,
      },
      {
        id: 'ms-2',
        title: 'Core Concepts',
        description: 'Learn the fundamentals',
        status: 'current',
        pageId: 'page-2',
        estimatedDuration: 30,
      },
      {
        id: 'ms-3',
        title: 'Advanced Topics',
        description: 'Deep dive into advanced subjects',
        status: 'locked',
        pageId: 'page-3',
        estimatedDuration: 45,
      },
    ],
    showConnectors: true,
    layout: 'vertical',
  },
  sortOrder: 2,
  editorComponent: LearningRoadmapEditor,
  previewComponent: LearningRoadmapPreview,
});

r({
  typeId: 'summary-takeaways',
  displayName: 'Summary & Takeaways',
  description: 'Recap key learnings with actionable takeaways',
  category: 'navigation',
  icon: 'check-square',
  tags: ['summary', 'takeaways', 'recap', 'review', 'closure'],
  completionCapabilities: ['view'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: {
    title: 'Key Takeaways',
    introText: 'Here are the most important points from this module:',
    keyPoints: [
      {
        id: 'kp-1',
        text: 'Understanding the fundamentals is crucial for success',
        icon: 'CheckCircle',
        emphasis: 'high',
      },
      {
        id: 'kp-2',
        text: 'Practice regularly to reinforce your learning',
        icon: 'CheckCircle',
        emphasis: 'normal',
      },
      {
        id: 'kp-3',
        text: 'Apply concepts to real-world scenarios whenever possible',
        icon: 'CheckCircle',
        emphasis: 'normal',
      },
    ],
    closingRemarks: 'Congratulations on completing this module! You have gained valuable insights and skills.',
    nextSteps: 'Continue to the next module to explore advanced topics and build on what you have learned.',
    showNextStepsSection: true,
    displayStyle: 'cards',
    showCompleteButton: true,
    showContinueButton: true,
    continueButtonText: 'Continue to Next Module',
  },
  sortOrder: 3,
  editorComponent: SummaryTakeawaysEditor,
  previewComponent: SummaryTakeawaysPreview,
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
  sortOrder: 4,
  editorComponent: ResourcesDownloadsEditor,
  previewComponent: ResourcesDownloadsPreview,
});

// ─── Feedback ───────────────────────────────────────────────────
r({
  typeId: 'reflective-question',
  displayName: 'Reflective Question',
  description: 'Open-ended reflective question for critical thinking',
  category: 'feedback',
  icon: 'help-circle',
  tags: ['reflective', 'question', 'think', 'journal'],
  completionCapabilities: ['interact'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: {
    title: 'Reflective Question',
    question: 'What did you learn from this module?',
    promptText: 'Take a moment to write your thoughts below.',
    allowMultipleResponses: false,
  },
  sortOrder: 0,
  editorComponent: ReflectiveQuestionEditor,
  previewComponent: ReflectiveQuestionPreview,
});

r({
  typeId: 'learner-journal',
  displayName: 'Learner Journal',
  description: 'Personal learning diary with dated entries',
  category: 'feedback',
  icon: 'book',
  tags: ['journal', 'diary', 'notes', 'personal'],
  completionCapabilities: ['interact'],
  scoringEnabled: false,
  audioSupport: { perComponent: false, perInteraction: false },
  defaultData: {
    title: 'My Learning Journal',
    prompts: ['What surprised me today?', 'How can I apply this?'],
    maxEntries: 10,
  },
  sortOrder: 1,
  editorComponent: LearnerJournalEditor,
  previewComponent: LearnerJournalPreview,
});

r({
  typeId: 'self-assessment',
  displayName: 'Self-Assessment',
  description: 'Self-evaluation rubric for skill rating',
  category: 'feedback',
  icon: 'user-check',
  tags: ['self', 'assessment', 'rating', 'evaluate'],
  completionCapabilities: ['interact', 'score'],
  scoringEnabled: true,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: {
    title: 'Self-Assessment',
    criteria: [{ id: 'crit-1', name: 'Communication', description: '', scale: 5 }],
  },
  sortOrder: 2,
  editorComponent: SelfAssessmentEditor,
  previewComponent: SelfAssessmentPreview,
});

r({
  typeId: 'confidence-rating',
  displayName: 'Confidence Rating',
  description: 'Rate your confidence level on covered topics',
  category: 'feedback',
  icon: 'thermometer',
  tags: ['confidence', 'rating', 'self-report'],
  completionCapabilities: ['interact'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: {
    title: 'Confidence Rating',
    topics: [{ id: 'topic-1', name: 'Topic 1', description: '' }],
    scale: { min: 1, max: 5, labels: ['Not confident', 'Very confident'] },
  },
  sortOrder: 3,
  editorComponent: ConfidenceRatingEditor,
  previewComponent: ConfidenceRatingPreview,
});

r({
  typeId: 'action-planning',
  displayName: 'Action Planning',
  description: 'Create an actionable plan with goals and deadlines',
  category: 'feedback',
  icon: 'calendar',
  tags: ['action', 'plan', 'goals', 'commitment'],
  completionCapabilities: ['interact'],
  scoringEnabled: false,
  audioSupport: { perComponent: false, perInteraction: false },
  defaultData: {
    title: 'My Action Plan',
    goals: [{ id: 'goal-1', description: '', deadline: '', actions: [''] }],
  },
  sortOrder: 4,
  editorComponent: ActionPlanningEditor,
  previewComponent: ActionPlanningPreview,
});

// ─── Gamification ────────────────────────────────────────────────
// ─── Diagnostic ──────────────────────────────────────────────────
r({
  typeId: 'pre-assessment',
  displayName: 'Pre-Assessment',
  description: 'Diagnostic test taken before course to gauge baseline knowledge',
  category: 'diagnostic',
  icon: 'clipboard',
  tags: ['pre-test', 'diagnostic', 'baseline', 'assessment'],
  completionCapabilities: ['interact', 'score'],
  scoringEnabled: true,
  audioSupport: { perComponent: false, perInteraction: false },
  defaultData: {
    title: 'Pre-Assessment',
    instructions: 'Answer the following questions to the best of your ability.',
    passThreshold: 70,
    timed: false,
    questions: [
      {
        id: 'q-1',
        type: 'mcq',
        prompt: 'Which of the following best describes a variable?',
        options: ['A fixed value', 'A named storage location', 'A function call', 'A loop'],
        correctAnswer: 'A named storage location',
        weight: 1,
      },
    ],
  },
  sortOrder: 0,
  editorComponent: PreAssessmentEditor,
  previewComponent: PreAssessmentPreview,
});

r({
  typeId: 'diagnostic-quiz',
  displayName: 'Diagnostic Quiz',
  description: 'Short quiz to identify knowledge gaps by topic',
  category: 'diagnostic',
  icon: 'search',
  tags: ['diagnostic', 'quiz', 'gap', 'identify'],
  completionCapabilities: ['interact', 'score'],
  scoringEnabled: true,
  audioSupport: { perComponent: false, perInteraction: false },
  defaultData: {
    title: 'Diagnostic Quiz',
    topics: ['Fundamentals', 'Application'],
    questions: [
      {
        id: 'dq-1',
        type: 'mcq',
        topic: 'Fundamentals',
        prompt: 'What does HTML stand for?',
        options: ['HyperText Markup Language', 'High-Tech Modern Language', 'HyperText Modern Links'],
        correctAnswer: 'HyperText Markup Language',
        difficulty: 'easy',
      },
    ],
    proficiencyBands: [
      { label: 'Beginner', min: 0, max: 49 },
      { label: 'Intermediate', min: 50, max: 79 },
      { label: 'Advanced', min: 80, max: 100 },
    ],
    allowRetry: false,
  },
  sortOrder: 1,
  editorComponent: DiagnosticQuizEditor,
  previewComponent: DiagnosticQuizPreview,
});

r({
  typeId: 'skill-gap-analysis',
  displayName: 'Skill Gap Analysis',
  description: 'Visual skill assessment with current vs target gap identification',
  category: 'diagnostic',
  icon: 'target',
  tags: ['skills', 'gap', 'analysis', 'competency'],
  completionCapabilities: ['interact'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: {
    title: 'Skill Gap Analysis',
    highGapThreshold: 30,
    showRecommendations: true,
    items: [
      { id: 'sg-1', skill: 'Communication', currentLevel: 45, targetLevel: 80, remediationLink: '' },
      { id: 'sg-2', skill: 'Problem Solving', currentLevel: 70, targetLevel: 85, remediationLink: '' },
    ],
  },
  sortOrder: 2,
  editorComponent: SkillGapAnalysisEditor,
  previewComponent: SkillGapAnalysisPreview,
});

r({
  typeId: 'adaptive-learning-path',
  displayName: 'Adaptive Learning Path',
  description: 'Dynamic content path that adapts to learner diagnostic performance',
  category: 'diagnostic',
  icon: 'route',
  tags: ['adaptive', 'path', 'learning', 'route'],
  completionCapabilities: ['interact'],
  scoringEnabled: false,
  audioSupport: { perComponent: false, perInteraction: false },
  defaultData: {
    title: 'Your Learning Path',
    currentNodeId: 'alp-2',
    nodes: [
      { id: 'alp-1', title: 'Foundation Module', required: true, estimatedMins: 15 },
      { id: 'alp-2', title: 'Core Skills', required: true, estimatedMins: 30 },
      { id: 'alp-3', title: 'Advanced Practice', required: false, estimatedMins: 45 },
    ],
  },
  sortOrder: 3,
  editorComponent: AdaptiveLearningPathEditor,
  previewComponent: AdaptiveLearningPathPreview,
});

r({
  typeId: 'recommendation-card',
  displayName: 'Recommendation Card',
  description: 'Personalized content recommendations based on learner diagnostic profile',
  category: 'diagnostic',
  icon: 'sparkles',
  tags: ['recommendation', 'personalized', 'adaptive', 'suggestion'],
  completionCapabilities: ['interact'],
  scoringEnabled: false,
  audioSupport: { perComponent: false, perInteraction: false },
  defaultData: {
    title: 'Recommended for You',
    maxVisible: 3,
    recommendations: [
      {
        id: 'rc-1',
        title: 'Complete Module 2',
        reason: 'Your diagnostic shows a gap in core concepts covered in Module 2.',
        priority: 'high',
        ctaLabel: 'Start Module 2',
        ctaTarget: '',
      },
      {
        id: 'rc-2',
        title: 'Practice Quiz: Fundamentals',
        reason: 'Score an extra 20% by reviewing the fundamentals.',
        priority: 'medium',
        ctaLabel: 'Take Quiz',
        ctaTarget: '',
      },
    ],
  },
  sortOrder: 4,
  editorComponent: RecommendationCardEditor,
  previewComponent: RecommendationCardPreview,
});

// ─── Analytics ───────────────────────────────────────────────────
r({
  typeId: 'progress-summary',
  displayName: 'Learning Progress Summary',
  description: 'Concise overview of learner progress with milestones and completion stats',
  category: 'analytics',
  icon: 'chart-no-axes-column',
  tags: ['progress', 'summary', 'analytics', 'milestones'],
  completionCapabilities: ['view'],
  scoringEnabled: false,
  audioSupport: { perComponent: false, perInteraction: false },
  defaultData: {
    title: 'Learning Progress Summary',
    totalUnits: 12,
    completedUnits: 5,
    milestones: [
      { id: 'ms-1', label: 'Kickoff', threshold: 10, reached: true },
      { id: 'ms-2', label: 'Midpoint', threshold: 50, reached: false },
      { id: 'ms-3', label: 'Final Review', threshold: 90, reached: false },
    ],
    estimatedTimeRemainingMins: 45,
  },
  sortOrder: 0,
  editorComponent: LearningProgressSummaryEditor,
  previewComponent: LearningProgressSummaryPreview,
});

r({
  typeId: 'performance-dashboard',
  displayName: 'Performance Dashboard',
  description: 'Dashboard of KPI cards, trends, and performance snapshots',
  category: 'analytics',
  icon: 'layout-dashboard',
  tags: ['performance', 'kpi', 'dashboard', 'metrics'],
  completionCapabilities: ['view'],
  scoringEnabled: false,
  audioSupport: { perComponent: false, perInteraction: false },
  defaultData: {
    title: 'Performance Dashboard',
    kpis: [
      { id: 'kpi-1', label: 'Avg Score', value: 82, unit: '%', trendPct: 4, target: 85 },
      { id: 'kpi-2', label: 'Attempts', value: 3, trendPct: -1 },
      { id: 'kpi-3', label: 'Time on Task', value: 126, unit: 'm', trendPct: 2 },
    ],
    chartSeries: [{ name: 'Score', points: [62, 71, 78, 82] }],
    chartLabels: ['W1', 'W2', 'W3', 'W4'],
    chartType: 'line',
  },
  sortOrder: 1,
  editorComponent: PerformanceDashboardEditor,
  previewComponent: PerformanceDashboardPreview,
});

r({
  typeId: 'skill-mastery-report',
  displayName: 'Skill Mastery Report',
  description: 'Competency report with mastery bands and low-score gap highlights',
  category: 'analytics',
  icon: 'target',
  tags: ['skills', 'mastery', 'competency', 'gaps'],
  completionCapabilities: ['view'],
  scoringEnabled: false,
  audioSupport: { perComponent: false, perInteraction: false },
  defaultData: {
    title: 'Skill Mastery Report',
    lowThreshold: 50,
    highThreshold: 80,
    displayMode: 'list',
    items: [
      { id: 'skill-1', skill: 'Communication', score: 84, evidenceCount: 5 },
      { id: 'skill-2', skill: 'Critical Thinking', score: 67, evidenceCount: 3 },
      { id: 'skill-3', skill: 'Documentation', score: 44, evidenceCount: 2 },
    ],
  },
  sortOrder: 2,
  editorComponent: SkillMasteryReportEditor,
  previewComponent: SkillMasteryReportPreview,
});

r({
  typeId: 'completion-certificate',
  displayName: 'Completion Certificate',
  description: 'Printable completion certificate with learner, course, and signatory details',
  category: 'analytics',
  icon: 'award',
  tags: ['certificate', 'completion', 'credential', 'award'],
  completionCapabilities: ['view'],
  scoringEnabled: false,
  audioSupport: { perComponent: false, perInteraction: false },
  defaultData: {
    title: 'Certificate of Completion',
    learnerName: 'Learner Name',
    courseName: 'Course Name',
    completionDate: '2026-03-10',
    certificateId: 'CERT-2026-0001',
    issuerName: 'Learning Academy',
    signatoryName: 'Program Director',
    signatoryTitle: 'Director, Learning & Development',
    badgeUrl: '',
  },
  sortOrder: 3,
  editorComponent: CompletionCertificateEditor,
  previewComponent: CompletionCertificatePreview,
});

r({
  typeId: 'manager-review',
  displayName: 'Manager Review Page',
  description: 'Team-level learner review with statuses, risk signals, and quick actions',
  category: 'analytics',
  icon: 'users',
  tags: ['manager', 'review', 'team', 'status'],
  completionCapabilities: ['view'],
  scoringEnabled: false,
  audioSupport: { perComponent: false, perInteraction: false },
  defaultData: {
    title: 'Manager Review Page',
    riskThresholdPct: 60,
    showActions: true,
    rows: [
      {
        learnerId: 'learner-1',
        learnerName: 'Alex Parker',
        progressPct: 92,
        averageScore: 88,
        status: 'on-track',
        lastActiveAt: '2026-03-08',
      },
      {
        learnerId: 'learner-2',
        learnerName: 'Sam Rivera',
        progressPct: 48,
        averageScore: 54,
        status: 'at-risk',
        lastActiveAt: '2026-03-06',
      },
    ],
  },
  sortOrder: 4,
  editorComponent: ManagerReviewPageEditor,
  previewComponent: ManagerReviewPagePreview,
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
  'text_with_media': 'text-with-media',
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
