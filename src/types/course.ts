/**
 * TypeScript interfaces matching the JSON Schema for type-safe development
 * Generated from shared/schema/course.json for consistency between FE/BE
 */

export type TemplateType =
  | "welcome"
  | "content-video"
  | "mcq"
  | "content-text"
  | "summary";

export interface Asset {
  id: string;
  name: string;
  url: string;
  type: "image" | "video" | "audio" | "document";
  size: number;
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

export interface ContentData {
  title: string;
  body: string;
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

// Enhanced Template Types for Custom Templates
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

export interface LayoutDefinition {
  type: "single-column" | "two-column" | "grid";
  columns?: number;
  spacing?: "compact" | "normal" | "spacious";
}

export interface StylingDefinition {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  fontFamily?: string;
  customCSS?: string;
}

export interface EnhancedTemplate {
  id: string;
  templateId: string;
  name: string;
  type: string;
  category: string;
  courseId?: string;
  fields: FieldDefinition[];
  layout: LayoutDefinition;
  styling?: StylingDefinition;
  metadata?: {
    description?: string;
    author?: string;
    version?: string;
    tags?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Template {
  id: string;
  type?: TemplateType; // Optional: from static template definitions
  templateType?: TemplateType; // Optional: from runtime/API state
  title: string;
  order: number;
  data: WelcomeData | ContentData | MCQData | SummaryData;
}

export interface NavigationSettings {
  allowSkip: boolean;
  showProgress: boolean;
  lockProgression: boolean;
}

export interface CourseSettings {
  theme: "default" | "dark" | "light";
  autoplay: boolean;
  duration?: number;
}

export interface Course {
  courseId: string;
  title: string;
  description: string;
  author: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  templates: Template[];
  assets: Asset[];
  navigation: NavigationSettings;
  language?: string; // frontend may omit, transform will default to 'en'
  settings: CourseSettings; // Made mandatory to align with backend model
}

// API Response types
export interface ValidationError {
  field: string;
  message: string;
}

export interface CourseValidationResponse {
  valid: boolean;
  errors: ValidationError[];
}

export interface ExportRequest {
  courseData: Course | string; // Allow pre-transformed string data
  format: string;
  includeAssets: boolean;
}

export interface ExportResponse {
  success: boolean;
  downloadUrl?: string;
  filename?: string;
  error?: string;
}

// UI State types
export interface EditorState {
  currentTemplate: number;
  isPreviewMode: boolean;
  isDirty: boolean;
  validationErrors: ValidationError[];
}

export interface PlayerState {
  currentSlide: number;
  completed: boolean[];
  score?: number;
  timeSpent: number;
}
