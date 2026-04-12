export interface ExportThemeTokens {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  surface?: string;
  text?: string;
  textSecondary?: string;
  border?: string;
  success?: string;
  warning?: string;
  error?: string;
  info?: string;
  fontFamily?: string;
  headingFont?: string;
  baseFontSize?: string;
}

export interface ExportStyleConfig {
  className?: string;
  variant?: string;
  layout?: string;
  align?: "left" | "center" | "right";
  spacing?: number;
  radius?: number;
  elevation?: number;
  colorOverrides?: Record<string, string>;
  typographyOverrides?: Record<string, string | number>;
  customProperties?: Record<string, string>;
}

export interface ExportAccessibilityConfig {
  ariaLabel?: string;
  ariaDescription?: string;
  keyboardNavigable?: boolean;
  role?: string;
}

export interface ExportInteractionConfig {
  completionMode?: "all" | "any" | "percentage" | "custom";
  required?: boolean;
  interactions?: Array<{ id: string; type: string }>;
}

export interface ExportAssetRef {
  id: string;
  path: string;
  mimeType?: string;
}

export interface ExportComponentPayload {
  componentId: string;
  componentType: string;
  pageId: string;
  title?: string;
  order?: number;
  data: Record<string, unknown>;
  styleConfig?: ExportStyleConfig;
  customCss?: string;
  accessibilityConfig?: ExportAccessibilityConfig;
  interactionConfig?: ExportInteractionConfig;
  assetRefs?: ExportAssetRef[];
}

export interface ExportPagePayload {
  pageId: string;
  title?: string;
  order: number;
  styleConfig?: ExportStyleConfig;
  customCss?: string;
  components: ExportComponentPayload[];
}

export interface ExportCoursePayload {
  courseId: string;
  title: string;
  language?: string;
  author?: string;
  version?: string;
  createdAt?: string;
  metadata?: Record<string, unknown>;
  themeTokens?: ExportThemeTokens;
  customCss?: string;
  pages: ExportPagePayload[];
}
