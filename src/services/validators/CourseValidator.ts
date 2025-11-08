import { t } from "../../i18n/strings";
import {
  Course,
  ValidationError,
  ValidationResult,
  Validator,
} from "../../types/comprehensive";

export class CourseValidator implements Validator {
  async validate(course: Course): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    // Required fields validation
    if (!course.title || course.title.trim().length === 0) {
      errors.push(
        this.createError(
          "course.title",
          "schema",
          t("validate.error.title.required", "Course title is required"),
          { suggestion: "Add a descriptive title for your course" }
        )
      );
    }

    // Title length validation
    if (course.title && course.title.length > 200) {
      errors.push(
        this.createError(
          "course.title",
          "business",
          t(
            "validate.error.title.length",
            "Title must be 200 characters or less"
          ),
          { currentLength: course.title.length, maxLength: 200 }
        )
      );
    }

    // Author validation
    if (!course.author || course.author.trim().length === 0) {
      errors.push(
        this.createError(
          "course.author",
          "schema",
          "Course author is required",
          { suggestion: "Add the course author name" }
        )
      );
    }

    // Author length validation
    if (course.author && course.author.length > 100) {
      errors.push(
        this.createError(
          "course.author",
          "business",
          "Author name must be 100 characters or less",
          { currentLength: course.author.length, maxLength: 100 }
        )
      );
    }

    // Description length validation (optional but with length limit)
    if (course.description && course.description.length > 500) {
      errors.push(
        this.createError(
          "course.description",
          "business",
          "Description must be 500 characters or less",
          { currentLength: course.description.length, maxLength: 500 }
        )
      );
    }

    // Pages validation
    if (!course.pages || course.pages.length === 0) {
      errors.push(
        this.createError(
          "course.pages",
          "business",
          t("validate.error.page.required", "At least one page is required"),
          { suggestion: "Add a page from templates" }
        )
      );
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
    const errors: ValidationError[] = [];

    switch (fieldPath) {
      case "title":
        if (!value || value.trim().length === 0) {
          errors.push(
            this.createError(fieldPath, "schema", "Title is required")
          );
        } else if (value.length > 200) {
          errors.push(
            this.createError(fieldPath, "business", "Title too long")
          );
        }
        break;
      case "author":
        if (!value || value.trim().length === 0) {
          errors.push(
            this.createError(fieldPath, "schema", "Author is required")
          );
        } else if (value.length > 100) {
          errors.push(
            this.createError(fieldPath, "business", "Author name too long")
          );
        }
        break;
      case "description":
        if (value && value.length > 500) {
          errors.push(
            this.createError(fieldPath, "business", "Description too long")
          );
        }
        break;
    }

    return {
      valid: errors.length === 0,
      errors,
      timestamp: new Date().toISOString(),
    };
  }

  supportsField(fieldPath: string): boolean {
    return ["title", "description", "author", "version"].includes(fieldPath);
  }

  private createError(
    field: string,
    category: string,
    message: string,
    context?: any
  ): ValidationError {
    return {
      id: "",
      field,
      category: category as any,
      message,
      level: "error",
      context,
    };
  }
}
