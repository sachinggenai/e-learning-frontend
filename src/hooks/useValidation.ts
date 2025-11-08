import { useCallback, useEffect, useRef, useState } from "react";
import { ValidationService } from "../services/ValidationService";
import {
  Course,
  ValidationError,
  ValidationResult,
} from "../types/comprehensive";

interface ValidationState {
  isValidating: boolean;
  result: ValidationResult | null;
  lastValidated: string | null;
}

interface UseValidationReturn {
  validate: (course: Course) => Promise<ValidationResult>;
  validateField: (fieldPath: string, value: any) => Promise<ValidationResult>;
  clearValidation: () => void;
  isValidating: boolean;
  result: ValidationResult | null;
  lastValidated: string | null;
  errors: ValidationError[];
  warnings: ValidationError[];
  hasErrors: boolean;
  hasWarnings: boolean;
}

/**
 * Custom hook for real-time course validation using Observer Pattern
 * Provides reactive validation state and field-level validation
 */
export const useValidation = (): UseValidationReturn => {
  const [state, setState] = useState<ValidationState>({
    isValidating: false,
    result: null,
    lastValidated: null,
  });

  const validationServiceRef = useRef<ValidationService | null>(null);

  // Initialize validation service
  useEffect(() => {
    if (!validationServiceRef.current) {
      validationServiceRef.current = new ValidationService();
    }
  }, []);

  const validate = useCallback(
    async (course: Course): Promise<ValidationResult> => {
      if (!validationServiceRef.current) {
        throw new Error("Validation service not initialized");
      }

      setState((prev) => ({ ...prev, isValidating: true }));

      try {
        const result =
          await validationServiceRef.current.validateCourse(course);
        setState({
          isValidating: false,
          result,
          lastValidated: new Date().toISOString(),
        });
        return result;
      } catch (error) {
        console.error("Validation error:", error);
        const errorResult: ValidationResult = {
          valid: false,
          errors: [
            {
              id: "",
              field: "general",
              category: "schema",
              message: "Validation service error",
              level: "error",
            },
          ],
          timestamp: new Date().toISOString(),
        };
        setState({
          isValidating: false,
          result: errorResult,
          lastValidated: new Date().toISOString(),
        });
        return errorResult;
      }
    },
    [],
  );

  const validateField = useCallback(
    async (fieldPath: string, value: any): Promise<ValidationResult> => {
      if (!validationServiceRef.current) {
        throw new Error("Validation service not initialized");
      }

      // For field validation, we need the current course state
      // This would typically come from Redux or props
      // For now, return a basic result
      const result: ValidationResult = {
        valid: true,
        errors: [],
        timestamp: new Date().toISOString(),
      };

      return result;
    },
    [],
  );

  const clearValidation = useCallback(() => {
    setState({
      isValidating: false,
      result: null,
      lastValidated: null,
    });
  }, []);

  const errors = state.result?.errors.filter((e) => e.level === "error") || [];
  const warnings =
    state.result?.errors.filter((e) => e.level === "warning") || [];

  return {
    validate,
    validateField,
    clearValidation,
    isValidating: state.isValidating,
    result: state.result,
    lastValidated: state.lastValidated,
    errors,
    warnings,
    hasErrors: errors.length > 0,
    hasWarnings: warnings.length > 0,
  };
};
