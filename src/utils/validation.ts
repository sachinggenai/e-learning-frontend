/**
 * Course validation utilities using AJV for client-side validation
 * Implements JSON Schema validation as specified in Phase 1 requirements
 */

import Ajv from "ajv";
import addFormats from "ajv-formats";
import courseSchema from "../course.json";
import { Course, ValidationError } from "../types/course";
import { transformCourseForBackend } from "./transform";

// Initialize AJV with format support
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// Compile the course schema
const validateCourse = ajv.compile(courseSchema);

/**
 * Validates a course object against the JSON schema
 * @param course - The course object to validate
 * @returns Object with validation result and errors
 */
export const validateCourseData = (
  course: Course,
): { valid: boolean; errors: ValidationError[] } => {
  try {
    const isValid = validateCourse(course);

    if (isValid) {
      return { valid: true, errors: [] };
    }

    const errors: ValidationError[] =
      validateCourse.errors?.map((error) => ({
        field: error.instancePath || error.schemaPath || "unknown",
        message: `${error.instancePath || "Data"} ${error.message}`,
      })) || [];

    return { valid: false, errors };
  } catch (error) {
    console.error("Course validation error:", error);
    return {
      valid: false,
      errors: [
        {
          field: "validation",
          message: "Failed to validate course structure",
        },
      ],
    };
  }
};

/**
 * Validates template ordering (must be sequential starting from 0)
 * @param templates - Array of templates to validate
 * @returns Validation result
 */
export const validateTemplateOrdering = (
  templates: any[],
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!Array.isArray(templates)) {
    errors.push({
      field: "templates",
      message: "Templates must be an array",
    });
    return errors;
  }

  // Check for duplicate orders
  const orders = templates
    .map((t) => t.order)
    .filter((o) => typeof o === "number");
  const uniqueOrders = new Set(orders);

  if (orders.length !== uniqueOrders.size) {
    errors.push({
      field: "templates.order",
      message: "Template orders must be unique",
    });
  }

  // Check if orders are sequential starting from 0
  const sortedOrders = Array.from(uniqueOrders).sort((a, b) => a - b);
  for (let i = 0; i < sortedOrders.length; i++) {
    if (sortedOrders[i] !== i) {
      errors.push({
        field: "templates.order",
        message: `Template orders must be sequential starting from 0. Missing order: ${i}`,
      });
      break;
    }
  }

  return errors;
};

/**
 * Validates MCQ template data
 * @param mcqData - MCQ data to validate
 * @returns Validation errors
 */
export const validateMCQData = (mcqData: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!mcqData.question || typeof mcqData.question !== "string") {
    errors.push({
      field: "mcq.question",
      message: "MCQ question is required and must be a string",
    });
  }

  if (!Array.isArray(mcqData.options) || mcqData.options.length < 2) {
    errors.push({
      field: "mcq.options",
      message: "MCQ must have at least 2 options",
    });
    return errors;
  }

  const correctAnswers = mcqData.options.filter(
    (opt: any) => opt.isCorrect === true,
  );
  if (correctAnswers.length !== 1) {
    errors.push({
      field: "mcq.options",
      message: "MCQ must have exactly one correct answer",
    });
  }

  // Validate each option
  mcqData.options.forEach((option: any, index: number) => {
    if (!option.id || typeof option.id !== "string") {
      errors.push({
        field: `mcq.options[${index}].id`,
        message: "Option ID is required and must be a string",
      });
    }

    if (!option.text || typeof option.text !== "string") {
      errors.push({
        field: `mcq.options[${index}].text`,
        message: "Option text is required and must be a string",
      });
    }

    if (typeof option.isCorrect !== "boolean") {
      errors.push({
        field: `mcq.options[${index}].isCorrect`,
        message: "Option isCorrect must be a boolean",
      });
    }
  });

  return errors;
};

/**
 * Comprehensive course validation combining schema and business rules
 * @param course - Course to validate
 * @returns Complete validation result
 */
export const validateCourseFull = (course: Course) => {
  // IMPORTANT: Use backend-transformed clone for schema validation so that
  // navigation.lockProgression -> navigation.linearProgression mapping (and
  // MCQ data normalization) occur before JSON Schema evaluation. This avoids
  // additionalProperties errors on /navigation caused by the frontend-only
  // lockProgression field while preserving original authoring state for
  // business rule checks below.
  const transformedForSchema: any = transformCourseForBackend(course);
  const schemaValidation = validateCourseData(transformedForSchema as Course);
  let allErrors = [...schemaValidation.errors];

  // Additional business rule validations
  // NOTE: We intentionally run business rule validations against the original
  // (pre-transform) course so that editor-facing structures (e.g. MCQ legacy
  // question/options shape) can still be validated with existing rules. If we
  // later migrate all MCQ editing to the normalized questions[] shape we can
  // switch this to transformedForSchema.
  if (course.templates) {
    const orderErrors = validateTemplateOrdering(course.templates);
    allErrors = [...allErrors, ...orderErrors];

    // Validate MCQ templates - using templateType for consistency
    course.templates
      .filter(
        (template) =>
          (template as any).templateType === "mcq" || template.type === "mcq",
      )
      .forEach((template) => {
        const mcqErrors = validateMCQData(template.data);
        allErrors = [...allErrors, ...mcqErrors];
      });
  }

  // Check template count limit (100 max as per schema)
  if (course.templates && course.templates.length > 100) {
    allErrors.push({
      field: "templates",
      message: "Course cannot have more than 100 templates",
    });
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
  };
};
