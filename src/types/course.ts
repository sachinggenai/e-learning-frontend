/**
 * TypeScript interfaces matching the OpenAPI v2 schema
 * Aligned with backend API for the composable component-based platform
 * Updated: February 2026
 */

// ─── Legacy Template Types (backward compatibility) ───────────────
export type LegacyTemplateType =
  | "welcome"
  | "content-video"
  | "mcq"
  | "content-text"
  | "summary"
  | "content-image"
  | "interactive";

/** @deprecated Use LegacyTemplateType */
export type TemplateType = LegacyTemplateType;

/** @deprecated Use Component-based pages instead */
export interface LegacyTemplate {
  id: string;
  type?: LegacyTemplateType;
  templateType?: LegacyTemplateType;
  title: string;
  order: number;
  data: Record<string, any>;
}

/** @deprecated Use LegacyTemplate instead */
export type Template = LegacyTemplate;

// ─── Asset ────────────────────────────────────────────────────────
export interface Asset {
  id: string;
  name: string;
  url: string;
  type: "image" | "video" | "audio" | "document";
  size: number;
}

// ─── Audio ────────────────────────────────────────────────────────
export interface AudioItem {
  audioId?: string;
  audioUrl: string;
  triggerOn: "load" | "click" | "interaction";
  targetInteractionId?: string | null;
  autoplay: boolean;
  requiredForCompletion: boolean;
  duration?: number;
  label?: string | null;
  transcript?: string | null;
}

export interface AudioConfig {
  enabled: boolean;
  audioItems: AudioItem[];
}

export interface AudioAssetResponse {
  audioId: string;
  audioUrl: string;
  duration?: number | null;
  label?: string | null;
  transcript?: string | null;
  mimeType: string;
  fileSize: number;
  courseId?: string | null;
  createdAt: string;
}

// ─── Completion ───────────────────────────────────────────────────
export type CompletionType = "view" | "interact" | "audio" | "score" | "custom";

export interface CompletionCriteria {
  type: CompletionType;
  threshold?: number | null;
  requiredInteractions?: string[] | null;
  requiredAudioIds?: string[] | null;
}

export type PageCompletionStrategy = "all" | "any" | "percentage" | "custom";

export interface PageCompletionConfig {
  enabled: boolean;
  strategy: PageCompletionStrategy;
  requiredComponents?: string[] | null;
  completionThreshold?: number | null;
}

export interface ComponentCompletionStatus {
  componentId: string;
  completed: boolean;
  completionType: CompletionType;
  threshold?: number | null;
  audioProgress?: {
    listened: number;
    required: number;
  } | null;
}

export interface PageCompletionResponse {
  pageId: string;
  title: string;
  completed: boolean;
  strategy: PageCompletionStrategy;
  components: ComponentCompletionStatus[];
}

export type CourseCompletionStatus =
  | "not-started"
  | "in-progress"
  | "completed"
  | "passed"
  | "failed";

export interface CourseCompletionResponse {
  courseId: string;
  status: CourseCompletionStatus;
  overallProgress: number;
  pages: PageCompletionResponse[];
}

// ─── Component Styling ───────────────────────────────────────────
export interface ThemeOverrides {
  colors?: Record<string, string>;
  typography?: Record<string, any>;
  componentStyles?: Record<string, any>;
}

export interface ComponentStyling {
  themeOverrides?: ThemeOverrides;
  layoutPosition?: string | null;
}

// ─── Component ───────────────────────────────────────────────────
export interface Component {
  componentId: string;
  componentType: string;
  order: number;
  data: Record<string, any>;
  audioConfig?: AudioConfig;
  completionCriteria?: CompletionCriteria;
  styling?: ComponentStyling;
  createdAt?: string;
  updatedAt?: string;
}

export interface ComponentCreateRequest {
  componentType: string;
  data: Record<string, any>;
  audioConfig?: AudioConfig;
  completionCriteria?: CompletionCriteria;
  styling?: ComponentStyling;
}

export interface ComponentUpdateRequest {
  data?: Record<string, any>;
  audioConfig?: AudioConfig;
  completionCriteria?: CompletionCriteria;
  styling?: ComponentStyling;
}

// ─── Page Layout ─────────────────────────────────────────────────
export type LayoutPreset =
  | "single-column"
  | "two-column"
  | "three-column"
  | "sidebar-left"
  | "sidebar-right"
  | "grid-2x2"
  | "hero-content"
  | "full-width";

export interface ComponentPlacement {
  componentId: string;
  gridArea: string;
  span?: number | null;
}

export interface CustomGrid {
  columns: number;
  rows: string;
  areas: string[][];
  gap: string;
}

export type LayoutSpacing = "compact" | "normal" | "spacious";

export interface PageLayout {
  preset?: LayoutPreset | null;
  customGrid?: CustomGrid;
  spacing: LayoutSpacing;
  componentPlacements?: ComponentPlacement[];
}

/** @deprecated Use PageLayout instead */
export type LayoutDefinition = PageLayout;

// ─── Page Theme ──────────────────────────────────────────────────
export interface PageThemeConfig {
  inheritCourse: boolean;
  overrides?: ThemeOverrides;
}

// ─── Page ────────────────────────────────────────────────────────
export interface Page {
  pageId: string;
  title: string;
  order: number;
  components: Component[];
  audioConfig?: AudioConfig;
  pageCompletion?: PageCompletionConfig;
  layout?: PageLayout;
  theme?: PageThemeConfig;
  createdAt?: string;
  updatedAt?: string;
}

export interface PageCreateRequest {
  title: string;
  components?: ComponentCreateRequest[];
  pageCompletion?: PageCompletionConfig;
  layout?: PageLayout;
  theme?: PageThemeConfig;
}

export interface PageUpdateRequest {
  title?: string;
  pageCompletion?: PageCompletionConfig;
  layout?: PageLayout;
  theme?: PageThemeConfig;
}

// ─── Theme ───────────────────────────────────────────────────────
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  accent: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  border: string;
}

export interface HeadingSizes {
  h1: number;
  h2: number;
  h3: number;
  h4: number;
}

export interface FontWeights {
  normal: number;
  medium: number;
  bold: number;
}

export interface ThemeTypography {
  fontFamily: string;
  headingFont?: string | null;
  baseFontSize: number;
  headingSizes: HeadingSizes;
  lineHeight: number;
  fontWeight: FontWeights;
}

export interface ButtonStyle {
  borderRadius: number;
  padding: string;
  fontWeight: number;
  textTransform: "none" | "uppercase" | "capitalize";
}

export interface CardStyle {
  borderRadius: number;
  shadow: string;
  borderWidth: number;
  padding: string;
}

export interface TabsStyle {
  style: "underline" | "pill" | "boxed";
  activeColor?: string | null;
  borderRadius?: number | null;
}

export interface AccordionStyle {
  style: "bordered" | "minimal" | "card";
  iconPosition: "left" | "right";
  spacing: number;
}

export interface InputStyle {
  borderRadius: number;
  borderColor: string;
  focusColor: string;
}

export interface ProgressBarStyle {
  height: number;
  borderRadius: number;
  fillColor?: string | null;
}

export interface ThemeComponentStyles {
  button?: ButtonStyle;
  card?: CardStyle;
  tabs?: TabsStyle;
  accordion?: AccordionStyle;
  input?: InputStyle;
  progressBar?: ProgressBarStyle;
}

export interface Theme {
  themeId: string;
  name: string;
  isPreset: boolean;
  colors: ThemeColors;
  typography: ThemeTypography;
  componentStyles?: ThemeComponentStyles;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResolvedThemeResponse {
  resolved: {
    colors: ThemeColors;
    typography: ThemeTypography;
    componentStyles?: ThemeComponentStyles;
  };
  inheritedFrom: "preset" | "course" | "page";
  overrides?: ThemeOverrides;
  courseThemeId?: string | null;
  courseThemeName?: string | null;
}

// ─── Navigation ──────────────────────────────────────────────────
export interface NavigationSettings {
  allowSkip: boolean;
  showProgress: boolean;
  linearProgression?: boolean;
  /** @deprecated Use linearProgression instead */
  lockProgression?: boolean;
}

// ─── Course Settings ─────────────────────────────────────────────
export interface CourseSettings {
  themeId?: string | null;
  autoplay: boolean;
  duration?: number | null;
}

// ─── Scoring ─────────────────────────────────────────────────────
export interface ComponentScoreConfig {
  componentId: string;
  componentType?: string;
  weight?: number;
  maxPoints: number;
}

export interface ScormObjective {
  objectiveId: string;
  componentIds: string[];
  description: string;
  passingScore: number;
}

export interface ScormReportingConfig {
  enabled: boolean;
  version: "1.2" | "2004";
  reportScore: boolean;
  reportCompletion: boolean;
  reportInteractions: boolean;
  objectives?: ScormObjective[];
}

export interface ScoringConfig {
  config?: {
    passingScore: number;
    maxAttempts?: number | null;
    attemptScoring: "best" | "last" | "average";
    showCorrectAnswers: boolean;
    showScoreAfterQuestion: boolean;
    showScoreAfterPage: boolean;
    weightedScoring: boolean;
    allowPartialCredit: boolean;
  };
  componentScores?: ComponentScoreConfig[];
  scormReporting?: ScormReportingConfig;
}

// ─── Course ──────────────────────────────────────────────────────
export type CourseStatus = "draft" | "published" | "archived";

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
  // Legacy support
  templates?: LegacyTemplate[];
  assets?: Asset[];
}

export interface CourseCreateRequest {
  courseId: string;
  title: string;
  author: string;
  language?: string;
  description?: string | null;
  version?: string;
  pages?: PageCreateRequest[];
  templates?: any[];
  navigation?: NavigationSettings;
  settings?: CourseSettings;
  scoring?: ScoringConfig;
}

export interface CourseUpdateRequest {
  title?: string;
  author?: string;
  language?: string;
  description?: string | null;
  version?: string;
  navigation?: NavigationSettings;
  settings?: CourseSettings;
  scoring?: ScoringConfig;
  status?: CourseStatus;
}

export interface CourseListItem {
  courseId: string;
  title: string;
  author: string;
  status: CourseStatus;
  pageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseListResponse {
  items: CourseListItem[];
  total: number;
  page: number;
  limit: number;
}

// ─── Component Type Registry ─────────────────────────────────────
export interface AudioSupportConfig {
  perComponent: boolean;
  perInteraction: boolean;
  interactionPoints?: string[] | null;
}

export interface ComponentTypeSummary {
  typeId: string;
  category: string;
  displayName: string;
  description: string;
  icon: string;
  thumbnail?: string | null;
  completionCapabilities: CompletionType[];
  scoringEnabled: boolean;
  audioSupport: AudioSupportConfig;
  tags: string[];
  estimatedDuration?: number | null;
}

export interface ComponentTypeDetail extends ComponentTypeSummary {
  schema: Record<string, any>;
  defaultData: Record<string, any>;
  defaultCompletionType: CompletionType;
  maxScore?: number | null;
  scoringRules?: Record<string, any> | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ComponentTypeListResponse {
  items: ComponentTypeSummary[];
  total: number;
  page: number;
  limit: number;
}

export interface CategorySummary {
  categoryId: string;
  displayName: string;
  description: string;
  icon: string;
  componentCount: number;
  sortOrder: number;
}

export interface CategoryListResponse {
  categories: CategorySummary[];
}

// ─── Interaction Events ──────────────────────────────────────────
export type KnownInteractionType =
  | "view"
  | "click"
  | "submit"
  | "audio-play"
  | "audio-complete"
  | "drag-drop"
  | "select"
  | "input"
  | "navigation";

// Open string contract: FE can send new types without backend enum updates.
export type InteractionType = KnownInteractionType | (string & {});

export interface InteractionData {
  interactionId?: string | null;
  value?: any;
  score?: number | null;
  maxScore?: number | null;
  isCorrect?: boolean | null;
  duration?: number | null;
}

export interface InteractionEvent {
  pageId: string;
  componentId: string;
  interactionType: InteractionType;
  learnerId?: string | null;
  data?: InteractionData;
  completed?: boolean;
}

export interface PageCompletionComponentState {
  componentId: string;
  completed: boolean;
  interactionsCompleted?: string[] | null;
  audiosCompleted?: string[] | null;
  score?: number | null;
}

export interface PageCompletionEventRequest {
  componentStates: PageCompletionComponentState[];
}

// ─── Score Calculation ───────────────────────────────────────────
export interface QuestionResponse {
  questionId: string;
  selectedOptionIds: string[];
}

export interface ComponentAnswer {
  componentId: string;
  componentType: string;
  responses: QuestionResponse[];
}

export interface ScoreCalculateRequest {
  answers: ComponentAnswer[];
  attemptNumber?: number;
}

export interface QuestionResult {
  questionId: string;
  correct: boolean;
  score: number;
  maxScore: number;
  partialCredit: boolean;
}

export interface ComponentResult {
  componentId: string;
  componentType: string;
  score: number;
  maxScore: number;
  weight: number;
  weightedScore: number;
  questionResults: QuestionResult[];
}

export interface ScoreCalculateResponse {
  totalScore: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  passingScore: number;
  componentResults: ComponentResult[];
  attemptNumber: number;
  remainingAttempts?: number | null;
}

// ─── Validation ──────────────────────────────────────────────────
export interface ValidationError {
  field: string;
  message: string;
}

export interface CourseValidationResponse {
  valid: boolean;
  errors: ValidationError[];
}

// ─── Export ──────────────────────────────────────────────────────
export interface ExportRequest {
  courseData: Course | string;
  format?: "scorm_1_2" | "scorm_2004";
  includeAssets?: boolean;
  /** Only used for the actual backend API call (internal) */
  course?: string;
}

export interface ExportResponse {
  success: boolean;
  downloadUrl?: string;
  error?: string;
  fileName?: string;
}

export interface ScormExportOptions {
  format: "scorm_1_2" | "scorm_2004";
  includeMedia: boolean;
}

export interface ExportStatusResponse {
  exportId: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  downloadUrl?: string | null;
  error?: string | null;
}

// ─── Media ───────────────────────────────────────────────────────
export interface MediaUploadResponse {
  fileId: string;
  filePath: string;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  category: "image" | "video" | "audio" | "document";
}

// ─── Reorder ─────────────────────────────────────────────────────
export interface ReorderRequest {
  orderedIds: Array<string | number>;
}

// ─── Legacy data types (kept for backward compat) ────────────────
export interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MCQData {
  question: string;
  options: MCQOption[];
}

export interface ContentData {
  title: string;
  /** @deprecated use `content` — kept for backward compatibility with legacy slides */
  body?: string;
  /** Canonical HTML content field — matches backend data.content field */
  content?: string;
  videoUrl?: string;
  imageUrl?: string;
}

export interface WelcomeData {
  title: string;
  subtitle: string;
  description: string;
}

export interface SummaryData {
  title: string;
  keyPoints: string[];
}

// ─── Enhanced Template Types (custom templates) ──────────────────
export type FieldType =
  | "text"
  | "textarea"
  | "rich-text"
  | "select"
  | "multiselect"
  | "media"
  | "number"
  | "boolean"
  | "date"
  | "email"
  | "url";

export interface FieldDefinition {
  id: string;
  name: string;
  type: FieldType;
  label: string;
  required: boolean;
  order: number;
  placeholder?: string;
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
}

export interface EnhancedTemplate {
  id: string;
  templateId: string;
  name: string;
  type: string;
  category: string;
  courseId?: string;
  fields: FieldDefinition[];
  layout: PageLayout;
  styling?: ComponentStyling;
  metadata?: {
    description?: string;
    author?: string;
    version?: string;
    tags?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
}

// ─── UI State types ──────────────────────────────────────────────
export interface EditorState {
  currentPageId: string | null;
  currentComponentId: string | null;
  isEditing: boolean;
  isDirty: boolean;
  validationErrors: ValidationError[];
  componentPickerOpen: boolean;
  componentPickerCategory: string | null;
  /** @deprecated Legacy field */
  currentTemplate?: number;
  /** @deprecated Legacy field — use isEditing */
  isPreviewMode?: boolean;
}

export interface PlayerState {
  currentPageIndex?: number;
  completionStatus?: Record<string, boolean>;
  scores?: Record<string, number>;
  timeSpent: number;
  /** @deprecated Legacy field — use currentPageIndex */
  currentSlide?: number;
  /** @deprecated Legacy field — use completionStatus */
  completed?: boolean[];
}
