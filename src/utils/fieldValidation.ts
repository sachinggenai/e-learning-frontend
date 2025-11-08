import {
  ContentData,
  MCQData,
  SummaryData,
  Template,
  TemplateType,
  WelcomeData,
} from "../types/course";

export interface FieldIssue {
  field: string;
  message: string;
  severity: "error" | "warning";
}

// Constraints (mirror backend Pydantic/business rules)
const TITLE_MAX = 100;
const COURSE_TITLE_MAX = 200;
const DESC_MAX = 500;

export function validateCourseField(field: string, value: any): FieldIssue[] {
  const issues: FieldIssue[] = [];
  switch (field) {
    case "title":
      if (!value || !String(value).trim())
        issues.push({ field, message: "Title is required", severity: "error" });
      else if (String(value).length > COURSE_TITLE_MAX)
        issues.push({
          field,
          message: `Title > ${COURSE_TITLE_MAX} chars`,
          severity: "error",
        });
      break;
    case "author":
      if (!value || !String(value).trim())
        issues.push({
          field,
          message: "Author is required",
          severity: "error",
        });
      else if (String(value).length > 100)
        issues.push({
          field,
          message: "Author > 100 chars",
          severity: "error",
        });
      break;
    case "description":
      if (value && String(value).length > DESC_MAX)
        issues.push({
          field,
          message: `Description > ${DESC_MAX} chars`,
          severity: "error",
        });
      break;
    case "version":
      if (value && !/^\d+\.\d+\.\d+$/.test(String(value)))
        issues.push({
          field,
          message: "Version must be semver (x.y.z)",
          severity: "error",
        });
      break;
    case "language":
      if (!value)
        issues.push({
          field,
          message: "Language is required",
          severity: "error",
        });
      break;
  }
  return issues;
}

export function validateTemplate(template: Template): FieldIssue[] {
  const issues: FieldIssue[] = [];
  if (!template.title || !template.title.trim()) {
    issues.push({
      field: `templates[${template.order}].title`,
      message: "Template title required",
      severity: "error",
    });
  } else if (template.title.length > TITLE_MAX) {
    issues.push({
      field: `templates[${template.order}].title`,
      message: `Title > ${TITLE_MAX} chars`,
      severity: "error",
    });
  }

  // Handle both 'type' (from Template interface) and 'templateType' (from runtime state)
  const templateType = ((template as any).templateType ||
    template.type) as TemplateType;

  switch (templateType) {
    case "welcome": {
      const data = template.data as WelcomeData;
      if (!data.description || !data.description.trim()) {
        issues.push({
          field: `templates[${template.order}].data.description`,
          message: "Description required",
          severity: "error",
        });
      }
      break;
    }
    case "content-text":
    case "content-video": {
      const data = template.data as ContentData;
      if (!data.body || !data.body.trim()) {
        issues.push({
          field: `templates[${template.order}].data.body`,
          message: "Body required",
          severity: "error",
        });
      }
      if (templateType === "content-video" && data.videoUrl) {
        if (!/^https?:\/\//.test(data.videoUrl)) {
          issues.push({
            field: `templates[${template.order}].data.videoUrl`,
            message: "Video URL must start with http/https",
            severity: "error",
          });
        }
      }
      break;
    }
    case "mcq": {
      const data = template.data as MCQData;
      if (!data.question || !data.question.trim()) {
        issues.push({
          field: `templates[${template.order}].data.question`,
          message: "Question required",
          severity: "error",
        });
      }
      if (!Array.isArray(data.options) || data.options.length < 2) {
        issues.push({
          field: `templates[${template.order}].data.options`,
          message: "At least 2 options",
          severity: "error",
        });
      } else {
        let correctCount = 0;
        data.options.forEach((opt, idx) => {
          if (!opt.text || !opt.text.trim()) {
            issues.push({
              field: `templates[${template.order}].data.options[${idx}].text`,
              message: "Option text required",
              severity: "error",
            });
          }
          if (opt.isCorrect) correctCount++;
        });
        if (correctCount !== 1) {
          issues.push({
            field: `templates[${template.order}].data.options`,
            message: "Exactly one correct option required",
            severity: "error",
          });
        }
      }
      break;
    }
    case "summary": {
      const data = template.data as SummaryData;
      if (!data.title || !data.title.trim()) {
        issues.push({
          field: `templates[${template.order}].data.title`,
          message: "Summary title required",
          severity: "error",
        });
      }
      break;
    }
  }
  return issues;
}

export function validateAllTemplates(templates: Template[]): FieldIssue[] {
  return templates.flatMap((t) => validateTemplate(t));
}
