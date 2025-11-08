/**
 * Comprehensive Type Definitions
 * Centralized types for the eLearning authoring tool
 */

// Base course structure that matches both frontend and backend expectations
export interface Course {
  id?: number;
  courseId: string;
  title: string;
  description?: string;
  author?: string;
  version?: string;
  status: "draft" | "published";
  pages: Page[];
  settings?: CourseSettings; // Add settings property
  createdAt?: string;
  updatedAt?: string;
}

// Course settings
export interface CourseSettings {
  theme?: "default" | "dark" | "light";
  autoplay?: boolean;
  duration?: number;
  navigation?: NavigationSettings;
}

// Navigation settings
export interface NavigationSettings {
  mode?: "linear" | "free" | "branching";
  allowBack?: boolean;
  requireCompletion?: boolean;
  allowSkip?: boolean;
  showProgress?: boolean;
  lockProgression?: boolean;
}

// Page structure
export interface Page {
  id: string;
  templateType: string; // Required to match Redux store expectations
  type?: string; // Legacy property (backward compatibility)
  title: string;
  content: Record<string, any>;
  order: number;
  isValid?: boolean;
  isDraft?: boolean;
  lastModified: string;
}

// Template structure
export interface Template {
  id: number;
  templateId: string;
  type: string;
  title: string;
  order: number;
  data: Record<string, any>;
}

// Validation types
export interface ValidationError {
  id: string;
  field: string;
  category: "schema" | "business" | "template" | "navigation";
  message: string;
  level: "error" | "warning" | "info";
  context?: {
    suggestion?: string;
    autoFixable?: boolean;
    currentLength?: number;
    maxLength?: number;
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

// API request/response types
export interface CourseExportRequest {
  courseData: Course;
  format: "scorm" | "json" | "html";
  includeAssets?: boolean;
}

export interface CourseExportResponse {
  success: boolean;
  downloadUrl?: string;
  message?: string;
  error?: string;
}

export interface CourseValidationResponse {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// Redux state types
export interface CourseState {
  currentCourse: Course | null;
  courses: Course[];
  templates: Template[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveStatus: "idle" | "saving" | "saved" | "error";
  lastSaved: string | null;
}

export interface EditorState {
  currentPage: Page | null;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
  validationErrors: string[];
}

// Component prop types
export interface HeaderProps {
  currentView: "editor" | "preview";
  onViewChange: (view: "editor" | "preview") => void;
  isBackendConnected: boolean;
}

export interface EditorProps {
  // Editor component doesn't need props as it uses Redux
}

// Template data types
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

// Template types union
export type TemplateType =
  | "welcome"
  | "content-text"
  | "content-video"
  | "mcq"
  | "summary";
export type TemplateData = WelcomeData | ContentData | MCQData | SummaryData;

// API service types
export interface ApiService {
  healthCheck(): Promise<any>;
  saveCourse(course: Course): Promise<any>;
  exportCourse(request: CourseExportRequest): Promise<CourseExportResponse>;
  validateCourse(course: Course): Promise<CourseValidationResponse>;
  fetchTemplates(): Promise<Template[]>;
  fetchCourses(): Promise<Course[]>;
  fetchCourse(id: string): Promise<Course>;
}

// Error boundary types
export interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  errorBoundaryStack?: string;
}

// Undo/Redo types
export interface UndoRedoState<T> {
  past: T[];
  present: T;
  future: T[];
}

// App state types
export interface AppState {
  isBackendConnected: boolean;
  currentView: "editor" | "preview";
  loading: boolean;
}

export default {};
