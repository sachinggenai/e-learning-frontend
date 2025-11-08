import { Template, TemplateType } from "../types/course";

/**
 * Utility functions for template type normalization and validation
 */

/**
 * Get the normalized template type from a template object
 * Handles both 'type' (static) and 'templateType' (runtime) properties
 */
export const getNormalizedTemplateType = (template: Template): TemplateType => {
  // Priority: templateType (runtime) > type (static)
  const rawType = template.templateType || template.type;

  if (!rawType) {
    console.warn("Template missing type information:", template);
    return "content-text"; // Safe default
  }

  // Normalize string types to TemplateType enum
  switch (rawType) {
    case "welcome":
    case "content-text":
    case "content-video":
    case "mcq":
    case "summary":
      return rawType as TemplateType;
    default:
      console.warn(
        `Unknown template type: ${rawType}, defaulting to content-text`,
      );
      return "content-text";
  }
};

/**
 * Set the normalized template type on a template object
 * Updates both properties for consistency
 */
export const setNormalizedTemplateType = (
  template: Template,
  type: TemplateType,
): Template => {
  return {
    ...template,
    type, // For static definitions
    templateType: type, // For runtime state
  };
};

/**
 * Check if a template has a valid type configuration
 */
export const isTemplateTypeValid = (template: Template): boolean => {
  const normalizedType = getNormalizedTemplateType(template);
  return (
    normalizedType !== "content-text" ||
    !!(template.type || template.templateType)
  );
};
