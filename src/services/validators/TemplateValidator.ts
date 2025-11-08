import {
  Course,
  ValidationError,
  ValidationResult,
  Validator,
} from "../../types/comprehensive";

export class TemplateValidator implements Validator {
  async validate(course: Course): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    course.pages?.forEach((page, index) => {
      // Fix: Normalize template type (handles both `type` and `templateType`)
      const templateType = this.normalizeTemplateType(page);

      // Validate template type exists
      if (!templateType) {
        errors.push({
          id: "",
          field: `pages[${index}].templateType`,
          category: "schema",
          message: `Page ${index + 1} missing template type`,
          level: "error",
        });
        return;
      }

      // Validate template-specific rules
      switch (templateType) {
        case "mcq":
          errors.push(...this.validateMCQ(page, index));
          break;
        case "content-text":
          errors.push(...this.validateContentText(page, index));
          break;
        case "welcome":
          errors.push(...this.validateWelcome(page, index));
          break;
        // Add other template types as needed
        default:
          errors.push({
            id: "",
            field: `pages[${index}].templateType`,
            category: "business",
            message: `Unknown template type: ${templateType}`,
            level: "warning",
          });
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      timestamp: new Date().toISOString(),
    };
  }

  async validateField(
    course: Course,
    fieldPath: string,
    value: any
  ): Promise<ValidationResult> {
    // Real-time field validation for templates
    return { valid: true, errors: [], timestamp: new Date().toISOString() };
  }

  supportsField(fieldPath: string): boolean {
    return fieldPath.startsWith("pages[");
  }

  /**
   * CRITICAL FIX: Normalize template type property
   * Handles inconsistency between `type` (TypeScript interface) and `templateType` (runtime state)
   */
  private normalizeTemplateType(page: any): string | undefined {
    // Check runtime property first (from Redux state)
    if (page.templateType) {
      return page.templateType;
    }
    // Fallback to TypeScript interface property
    if (page.type) {
      return page.type;
    }
    return undefined;
  }

  private validateMCQ(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const mcqData = page.content as any;

    if (!mcqData.question || typeof mcqData.question !== "string") {
      errors.push({
        id: "",
        field: `pages[${index}].content.question`,
        category: "business",
        message: `MCQ page ${index + 1} must have a question`,
        level: "error",
      });
    }

    if (!Array.isArray(mcqData.options) || mcqData.options.length < 2) {
      errors.push({
        id: "",
        field: `pages[${index}].content.options`,
        category: "business",
        message: `MCQ page ${index + 1} must have at least 2 options`,
        level: "error",
      });
    }

    if (mcqData.correctAnswer === undefined) {
      errors.push({
        id: "",
        field: `pages[${index}].content.correctAnswer`,
        category: "business",
        message: `MCQ page ${index + 1} must have a correct answer`,
        level: "error",
      });
    }

    return errors;
  }

  private validateContentText(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!content.body || content.body.trim().length === 0) {
      errors.push({
        id: "",
        field: `pages[${index}].content.body`,
        category: "business",
        message: `Content page ${index + 1} must have body text`,
        level: "warning",
      });
    }

    return errors;
  }

  private validateWelcome(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!content.title) {
      errors.push({
        id: "",
        field: `pages[${index}].content.title`,
        category: "business",
        message: `Welcome page must have a title`,
        level: "error",
      });
    }

    return errors;
  }
}
