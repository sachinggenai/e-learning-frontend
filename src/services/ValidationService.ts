import {
  Course,
  ValidationError,
  ValidationResult,
  Validator,
} from "../types/comprehensive";
import { CourseValidator } from "./validators/CourseValidator";
import { NavigationValidator } from "./validators/NavigationValidator";
import { TemplateValidator } from "./validators/TemplateValidator";

/**
 * Centralized validation service implementing Strategy Pattern
 * Follows SOLID: SRP (single validation responsibility), OCP (extensible validators), DIP (depends on abstractions)
 */
export class ValidationService {
  private validators: Array<Validator>;

  constructor(validators?: Array<Validator>) {
    // Dependency Injection for testability
    this.validators = validators || [
      new CourseValidator(),
      new TemplateValidator(),
      new NavigationValidator(),
    ];
  }

  /**
   * Validate course with all registered validators
   * @param course - Course to validate
   * @returns Promise<ValidationResult> with categorized errors
   */
  async validateCourse(course: Course): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    // Run all validators in parallel for performance
    const results = await Promise.all(
      this.validators.map((v) => v.validate(course)),
    );

    // Flatten and categorize errors
    results.forEach((result) => errors.push(...result.errors));

    return {
      valid: errors.length === 0,
      errors: this.categorizeErrors(errors),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Validate specific field for real-time feedback
   */
  async validateField(
    course: Course,
    fieldPath: string,
    value: any,
  ): Promise<ValidationError[]> {
    const relevantValidator = this.validators.find((v) =>
      v.supportsField(fieldPath),
    );

    if (!relevantValidator) return [];

    const result = await relevantValidator.validateField(
      course,
      fieldPath,
      value,
    );
    return result.errors;
  }

  /**
   * Categorize errors using Factory Pattern
   */
  private categorizeErrors(errors: ValidationError[]): ValidationError[] {
    return errors.map((error) => ({
      ...error,
      id: `${error.category}-${Date.now()}-${Math.random()}`,
      level: this.determineLevel(error),
    }));
  }

  private determineLevel(error: ValidationError): "error" | "warning" | "info" {
    // Business logic for error severity
    if (error.category === "schema") return "error";
    if (error.category === "business" && error.field.includes("required"))
      return "error";
    if (error.category === "business") return "warning";
    return "info";
  }
}

/**
 * Singleton instance for app-wide use
 */
export const validationService = new ValidationService();
