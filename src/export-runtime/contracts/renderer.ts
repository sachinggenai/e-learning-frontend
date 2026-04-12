import { ExportComponentPayload, ExportCoursePayload, ExportPagePayload } from "./payload";

export interface ExportRendererContext {
  course: ExportCoursePayload;
  page: ExportPagePayload;
  sanitizeText: (value: unknown) => string;
  renderRichText: (html: unknown) => string;
}

export interface ExportRenderer {
  type: string;
  render: (component: ExportComponentPayload, context: ExportRendererContext) => string;
}
