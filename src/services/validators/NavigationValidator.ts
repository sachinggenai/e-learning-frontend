import {
  Course,
  ValidationError,
  ValidationResult,
  Validator,
} from "../../types/comprehensive";

export class NavigationValidator implements Validator {
  async validate(course: Course): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    // Validate navigation settings
    if (course.settings?.navigation) {
      errors.push(
        ...this.validateNavigationSettings(course.settings.navigation)
      );
    }

    // Validate page navigation flow
    if (course.pages && course.pages.length > 0) {
      errors.push(...this.validatePageFlow(course.pages));
    }

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
    // Real-time field validation for navigation
    return { valid: true, errors: [], timestamp: new Date().toISOString() };
  }

  supportsField(fieldPath: string): boolean {
    return (
      fieldPath.startsWith("settings.navigation") ||
      fieldPath.startsWith("pages[")
    );
  }

  private validateNavigationSettings(navigation: any): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate navigation mode
    if (
      navigation.mode &&
      !["linear", "free", "branching"].includes(navigation.mode)
    ) {
      errors.push({
        id: "",
        field: "settings.navigation.mode",
        category: "business",
        message: `Invalid navigation mode: ${navigation.mode}. Must be 'linear', 'free', or 'branching'`,
        level: "error",
      });
    }

    // Validate completion requirements
    if (
      navigation.requireCompletion !== undefined &&
      typeof navigation.requireCompletion !== "boolean"
    ) {
      errors.push({
        id: "",
        field: "settings.navigation.requireCompletion",
        category: "schema",
        message: "requireCompletion must be a boolean",
        level: "error",
      });
    }

    // Validate back navigation
    if (
      navigation.allowBack !== undefined &&
      typeof navigation.allowBack !== "boolean"
    ) {
      errors.push({
        id: "",
        field: "settings.navigation.allowBack",
        category: "schema",
        message: "allowBack must be a boolean",
        level: "error",
      });
    }

    return errors;
  }

  private validatePageFlow(pages: any[]): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check for duplicate page IDs
    const pageIds = new Set<string>();
    pages.forEach((page, index) => {
      if (page.id) {
        if (pageIds.has(page.id)) {
          errors.push({
            id: "",
            field: `pages[${index}].id`,
            category: "business",
            message: `Duplicate page ID: ${page.id}`,
            level: "error",
          });
        }
        pageIds.add(page.id);
      }
    });

    // Validate page ordering
    pages.forEach((page, index) => {
      if (page.order !== undefined && page.order !== index) {
        errors.push({
          id: "",
          field: `pages[${index}].order`,
          category: "business",
          message: `Page order mismatch: expected ${index}, got ${page.order}`,
          level: "warning",
        });
      }
    });

    // Validate branching logic if present
    pages.forEach((page, index) => {
      if (page.conditions && Array.isArray(page.conditions)) {
        page.conditions.forEach((condition: any, condIndex: number) => {
          if (!condition.targetPageId) {
            errors.push({
              id: "",
              field: `pages[${index}].conditions[${condIndex}].targetPageId`,
              category: "business",
              message: `Branching condition missing target page ID`,
              level: "error",
            });
          }
        });
      }
    });

    return errors;
  }
}
