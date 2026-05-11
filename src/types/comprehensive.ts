/**
 * Comprehensive Type Definitions
 * Centralized types for the eLearning authoring tool
 * Aligned with OpenAPI v2 schema — composable component-based architecture
 * Updated: February 2026
 */

import type {
  Component,
  ComponentCreateRequest,
  Page,
  PageLayout,
  PageThemeConfig,
  PageCompletionConfig,
  AudioConfig,
  CompletionCriteria,
  ComponentStyling,
  ThemeOverrides,
  NavigationSettings,
  CourseSettings,
  ScoringConfig,
  CourseStatus,
  ValidationError as CourseValidationError,
  CourseListItem,
  ThemeColors,
  ThemeTypography,
  ThemeComponentStyles,
  ComponentTypeSummary,
  CategorySummary,
  ResolvedThemeResponse,
  ScoreCalculateResponse,
  CourseCompletionResponse,
  InteractionEvent,
  InteractionType,
  MediaUploadResponse,
  ExportStatusResponse,
} from "./course";

// Re-export all course types for convenience
export type {
  Component,
  ComponentCreateRequest,
  Page,
  PageLayout,
  PageThemeConfig,
  PageCompletionConfig,
  AudioConfig,
  CompletionCriteria,
  ComponentStyling,
  ThemeOverrides,
  NavigationSettings,
  CourseSettings,
  ScoringConfig,
  CourseStatus,
  ThemeColors,
  ThemeTypography,
  ThemeComponentStyles,
  ComponentTypeSummary,
  CategorySummary,
  ResolvedThemeResponse,
  ScoreCalculateResponse,
  CourseCompletionResponse,
  InteractionEvent,
  InteractionType,
  MediaUploadResponse,
  ExportStatusResponse,
};

// ─── Course ──────────────────────────────────────────────────────
export interface Course {
  courseId: string;
  title: string;
  author: string;
  language: string;
  description?: string | null;
  version: string;
  status: CourseStatus;
  pages: Page[];
  navigation?: NavigationSettings;
  settings?: CourseSettings;
  scoring?: ScoringConfig | null;
  createdAt?: string;
  updatedAt?: string;
  // Legacy backward compat
  templates?: any[];
  assets?: any[];
}

// ─── Validation ──────────────────────────────────────────────────
export interface ValidationError {
  id: string;
  field: string;
  category: "schema" | "business" | "template" | "navigation" | "component";
  message: string;
  level: "error" | "warning" | "info";
  context?: {
    suggestion?: string;
    autoFixable?: boolean;
    currentLength?: number;
    maxLength?: number;
    componentId?: string;
    pageId?: string;
    [key: string]: any;
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  timestamp: string;
}

// Validator interface for Strategy Pattern
export interface Validator {
  validate(course: Course): Promise<ValidationResult>;
  validateField(
    course: Course,
    fieldPath: string,
    value: any,
  ): Promise<ValidationResult>;
  supportsField(fieldPath: string): boolean;
}

// ─── API Request/Response Types ──────────────────────────────────
export interface CourseExportRequest {
  courseData: Course;
  format: "scorm_1_2" | "scorm_2004" | "json" | "html";
  includeAssets?: boolean;
}

export interface CourseExportResponse {
  success: boolean;
  downloadUrl?: string;
  exportId?: string;
  message?: string;
  error?: string;
}

export interface CourseValidationResponse {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// ─── Redux State Types ──────────────────────────────────────────
export interface CourseState {
  currentCourse: Course | null;
  courses: CourseListItem[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveStatus: "idle" | "saving" | "saved" | "error";
  lastSaved: string | null;
}

export interface EditorState {
  currentPageId: string | null;
  currentComponentId: string | null;
  isEditing: boolean;
  isDirty: boolean;
  validationErrors: ValidationError[];
  componentPickerOpen: boolean;
  componentPickerCategory: string | null;
}

export interface CompletionState {
  componentStates: Record<string, boolean>; // componentId -> completed
  interactionsCompleted: Record<string, string[]>; // componentId -> interactionId[]
  audiosCompleted: Record<string, string[]>; // componentId -> audioId[]
  pageCompleted: Record<string, boolean>; // pageId -> completed
  overallProgress: number; // 0-100
}

export interface ScoringState {
  lastResult: ScoreCalculateResponse | null;
  attemptCount: number;
  isCalculating: boolean;
}

export interface ThemeState {
  resolvedTheme: ResolvedThemeResponse | null;
  availableThemes: any[];
  isLoading: boolean;
}

// ─── Component Prop Types ────────────────────────────────────────
export interface HeaderProps {
  currentView: "editor" | "preview";
  onViewChange: (view: "editor" | "preview") => void;
  isBackendConnected: boolean;
  onOpenTemplateEditor?: () => void;
}

export interface EditorProps {
  showCustomTemplateEditor?: boolean;
  onCloseTemplateEditor?: () => void;
}

export interface EditorV2Props {
  showCustomTemplateEditor?: boolean;
  onCloseTemplateEditor?: () => void;
}

export interface DynamicComponentRendererProps {
  component: Component;
  isEditing: boolean;
  onDataChange: (componentId: string, data: Record<string, any>) => void;
  onAudioConfigChange?: (componentId: string, audioConfig: AudioConfig) => void;
  onCompletionChange?: (componentId: string, completed: boolean) => void;
}

export interface ComponentPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (componentType: string) => void;
  initialCategory?: string;
}

export interface AudioPlayerProps {
  audioConfig: AudioConfig;
  onAudioComplete?: (audioId: string) => void;
  onInteraction?: (event: InteractionEvent) => void;
  compact?: boolean;
}

export interface PageWrapperProps {
  page: Page;
  children: React.ReactNode;
  onPageComplete?: (pageId: string) => void;
}

export interface CompletionIndicatorProps {
  completed: boolean;
  size?: "small" | "medium" | "large";
}

export interface QuizFeedbackProps {
  result: ScoreCalculateResponse;
  showCorrectAnswers: boolean;
  feedbackMode: "immediate" | "on-submit" | "end-of-quiz";
}

export interface ScoreSummaryProps {
  result: ScoreCalculateResponse;
  passingScore: number;
}

// ─── Template Data Types (legacy compat) ─────────────────────────
export interface WelcomeData {
  title: string;
  subtitle: string;
  description: string;
}

export interface ContentData {
  title: string;
  body: string;
  videoUrl?: string;
}

export interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MCQData {
  question: string;
  options: MCQOption[];
}

export interface SummaryData {
  title: string;
  keyPoints: string[];
}

// ─── Template Types Union (legacy) ───────────────────────────────
export type TemplateType =
  | "welcome"
  | "content-text"
  | "content-video"
  | "content-image"
  | "mcq"
  | "summary"
  | "interactive";

export type TemplateData = WelcomeData | ContentData | MCQData | SummaryData;

// ─── API Service Interface ──────────────────────────────────────
export interface ApiService {
  healthCheck(): Promise<any>;
  // Courses
  listCourses(page?: number, limit?: number): Promise<any>;
  getCourse(id: string): Promise<Course>;
  createCourse(course: any): Promise<Course>;
  updateCourse(id: string, updates: any): Promise<Course>;
  deleteCourse(id: string): Promise<void>;
  validateCourse(course: any): Promise<CourseValidationResponse>;
  // Pages
  listPages(courseId: string): Promise<Page[]>;
  createPage(courseId: string, page: any): Promise<Page>;
  updatePage(courseId: string, pageId: string, updates: any): Promise<Page>;
  deletePage(courseId: string, pageId: string): Promise<void>;
  reorderPages(courseId: string, orderedIds: string[]): Promise<void>;
  // Components
  addComponent(
    courseId: string,
    pageId: string,
    component: ComponentCreateRequest,
  ): Promise<Component>;
  updateComponent(
    courseId: string,
    pageId: string,
    componentId: string,
    updates: any,
  ): Promise<Component>;
  deleteComponent(
    courseId: string,
    pageId: string,
    componentId: string,
  ): Promise<void>;
  reorderComponents(
    courseId: string,
    pageId: string,
    orderedIds: string[],
  ): Promise<void>;
  // Registry
  listComponentTypes(category?: string): Promise<ComponentTypeSummary[]>;
  getComponentType(typeId: string): Promise<any>;
  listCategories(): Promise<CategorySummary[]>;
  searchComponentTypes(query: string): Promise<ComponentTypeSummary[]>;
  // Themes
  listThemes(): Promise<any[]>;
  getCourseTheme(courseId: string): Promise<ResolvedThemeResponse>;
  setCourseTheme(
    courseId: string,
    themeId: string,
    overrides?: ThemeOverrides,
  ): Promise<ResolvedThemeResponse>;
  // Scoring
  getScoringConfig(courseId: string): Promise<ScoringConfig>;
  updateScoringConfig(
    courseId: string,
    config: ScoringConfig,
  ): Promise<ScoringConfig>;
  calculateScore(
    courseId: string,
    answers: any,
  ): Promise<ScoreCalculateResponse>;
  // Completion
  getCourseCompletion(courseId: string): Promise<CourseCompletionResponse>;
  recordPageCompletion(
    courseId: string,
    pageId: string,
    states: any,
  ): Promise<any>;
  recordInteraction(courseId: string, event: InteractionEvent): Promise<any>;
  // Audio
  uploadAudio(file: File): Promise<any>;
  getCourseNarration(courseId: string): Promise<any>;
  // Export
  exportCourse(courseData: string): Promise<any>;
  getExportStatus(exportId: string): Promise<ExportStatusResponse>;
  // Media
  uploadMedia(file: File): Promise<MediaUploadResponse>;
}

// ─── Error Boundary Types ────────────────────────────────────────
export interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  errorBoundaryStack?: string;
}

// ─── Undo/Redo Types ─────────────────────────────────────────────
export interface UndoRedoState<T> {
  past: T[];
  present: T;
  future: T[];
}

// ─── App State Types ─────────────────────────────────────────────
export interface AppState {
  isBackendConnected: boolean;
  currentView: "editor" | "preview";
  loading: boolean;
}

export default {};
