/**
 * Template Adapter (Phase 2 placeholder)
 *
 * In Phase 2 this module will house pure mapping functions converting backend
 * template DTOs into frontend view models consumed by the UI & editor layer.
 *
 * For Phase 1 we only define Typescript interfaces so other code can begin
 * importing them without triggering circular dependency issues.
 */

// Backend DTO shape (derive from /courses/templates/available endpoint)
export interface TemplateDTO {
  id: string | number;
  templateId?: string; // some backend routes embed alias field
  type?: string; // legacy field in converted response
  title?: string; // legacy field in converted response
  name?: string; // raw backend field (preferred)
  description?: string;
  category?: string;
  order?: number;
  data?: {
    content?: any;
    description?: string;
    category?: string;
  };
  fields?: Array<{
    id: string;
    name: string;
    type: string;
    label?: string;
    required?: boolean;
    placeholder?: string;
  }>;
}

// Frontend view model that the UI will rely upon after adapter introduction
export interface TemplateVMField {
  id: string;
  name: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
}

export interface TemplateVM {
  id: string; // canonical id (string)
  templateId: string; // alias (same as id for now)
  type: string; // semantic type (content-text, mcq, ...)
  title: string; // display title
  description?: string;
  category?: string;
  order: number;
  fields: TemplateVMField[];
  defaults: Record<string, any>; // Initial content defaults for page creation
}

// Placeholder mapping functions (implemented Phase 2)
export function mapTemplateDtoToVm(dto: TemplateDTO): TemplateVM {
  // Defensive extraction
  const rawId = (dto.templateId || dto.id || "").toString();
  const name = dto.title || dto.name || "Untitled Template";
  const category = dto.category || dto.data?.category;

  // Derive semantic type (future: map explicit backend types)
  const categoryToType: Record<string, string> = {
    introduction: "content-text",
    lab: "content-text",
    assessment: "mcq",
  };
  const type = categoryToType[category || ""] || dto.type || "content-text";

  // Normalize fields list
  const fields: TemplateVMField[] = (dto.fields || []).map((f) => ({
    id: f.id || f.name,
    name: f.name,
    type: f.type,
    label: f.label || f.name,
    required: !!f.required,
    placeholder: f.placeholder,
  }));

  // Build defaults (pure rule-based; no side effects)
  const defaults: Record<string, any> = {};
  fields.forEach((f) => {
    switch (f.type) {
      case "text":
        defaults[f.name] = "";
        break;
      default:
        defaults[f.name] = "";
    }
  });
  if (type === "mcq") {
    defaults.question = defaults.question || "";
    defaults.options = defaults.options || ["", "", "", ""];
    defaults.correctAnswer = defaults.correctAnswer || "";
  } else if (type === "content-text") {
    if (!("content" in defaults)) defaults.content = "";
    if (!("title" in defaults)) defaults.title = name;
  }

  return {
    id: rawId,
    templateId: rawId,
    type,
    title: name,
    description: dto.description || dto.data?.description,
    category,
    order: typeof dto.order === "number" ? dto.order : 0,
    fields,
    defaults,
  };
}

export function mapTemplateList(dtoList: TemplateDTO[]): TemplateVM[] {
  return dtoList.map(mapTemplateDtoToVm);
}
