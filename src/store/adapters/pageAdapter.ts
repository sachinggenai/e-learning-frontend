/**
 * Page Adapter
 * Maps backend page DTO (from /courses/{id}/pages/from-template) to frontend Page model.
 */
import { Page } from "../slices/editorSlice";

export interface BackendPageDTO {
  id: string;
  course_id: string;
  title: string;
  type?: string; // semantic type (mcq, content-text, etc.)
  content: any;
  template_id?: string;
  page_order?: number;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export function mapBackendPageToPage(dto: BackendPageDTO): Page {
  return {
    id: dto.id,
    templateType: dto.type || "content-text",
    title: dto.title,
    content: dto.content || {},
    order: typeof dto.page_order === "number" ? dto.page_order : 0,
    isDraft: dto.is_published === false, // published -> not draft
    lastModified: dto.updated_at || dto.created_at || new Date().toISOString(),
  };
}

export function mapBackendPageList(list: BackendPageDTO[]): Page[] {
  return list.map(mapBackendPageToPage);
}
