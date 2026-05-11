/**
 * Assessment Utilities
 *
 * Shared helpers for type normalization, scoring payload building, and
 * final-assessment authoring validation. Used by preview renderers,
 * scoring infrastructure, and authoring editors.
 */

import { normalizeTemplateType } from "../constants/templateTypes";
import type {
  ComponentAnswer,
  QuestionResponse,
  ValidationError,
} from "../types/course";

// ─── Assessment-Specific Type Aliases ────────────────────────────
// Maps legacy/alias types → canonical backend runtime types.
const ASSESSMENT_ALIASES: Record<string, string> = {
  "multi-select": "multiple-select",
  "fill-blanks": "fill-in-blank",
  "fill-blank": "fill-in-blank",
};

/**
 * Normalize a component type string to its canonical runtime form.
 *
 * Handles assessment-specific aliases (multi-select, fill-blanks, fill-blank)
 * plus all legacy template aliases from normalizeTemplateType.
 *
 * Use this everywhere a type string is consumed:
 *  - authoring preview renderer
 *  - learner runtime renderer
 *  - scoring payload builder
 *  - telemetry/interaction events
 */
export function normalizeComponentType(raw: string | undefined | null): string {
  const key = (raw ?? "").toLowerCase().trim();
  if (key in ASSESSMENT_ALIASES) return ASSESSMENT_ALIASES[key];

  // Backend/runtime canonical assessment types that are not part of ComponentTypeId.
  if (
    key === "fill-in-blank" ||
    key === "mcq" ||
    key === "true-false" ||
    key === "multiple-select" ||
    key === "final-assessment"
  ) {
    return key;
  }

  return normalizeTemplateType(raw);
}

// ─── Scoring Payload Builder ──────────────────────────────────────
/**
 * Build a ComponentAnswer for POST /courses/{id}/scoring/calculate.
 *
 * Per question type:
 *  - mcq:            selectedOptionIds = [selectedOptionId]
 *  - multiple-select: selectedOptionIds = [id, id, ...]
 *  - true-false:     selectedOptionIds = ['true'] | ['false']
 *  - fill-in-blank:  selectedOptionIds = [userInput]
 *
 * Always sends selectedOptionIds as string[].
 */
export function buildScoringPayload(
  componentId: string,
  componentType: string,
  questionAnswers: Record<string, any>,
  questions: Array<{ id: string; type: string }>,
): ComponentAnswer {
  const canonicalType = normalizeComponentType(componentType);

  const responses: QuestionResponse[] = questions.map((q) => {
    const answer = questionAnswers[q.id];
    const qType = normalizeComponentType(q.type);

    if (qType === "fill-in-blank") {
      return {
        questionId: q.id,
        selectedOptionIds: answer == null ? [] : [String(answer)],
      };
    }

    if (qType === "true-false") {
      return {
        questionId: q.id,
        selectedOptionIds: answer != null ? [String(answer)] : [],
      };
    }

    if (qType === "multiple-select") {
      const ids = Array.isArray(answer)
        ? answer.map(String)
        : answer != null
          ? [String(answer)]
          : [];
      return { questionId: q.id, selectedOptionIds: ids };
    }

    // mcq (default): single option id string
    return {
      questionId: q.id,
      selectedOptionIds: answer != null ? [String(answer)] : [],
    };
  });

  return { componentId, componentType: canonicalType, responses };
}

// ─── Final Assessment Validation ─────────────────────────────────
export interface FAQuestionShape {
  id: string;
  type: string;
  question: string;
  points?: number;
  options?: Array<{ id: string; text: string; isCorrect: boolean }>;
  correctAnswer?: string | boolean | null;
  correctAnswers?: string[];
  caseSensitive?: boolean;
}

export interface FADataShape {
  questions?: FAQuestionShape[];
  passingScore?: number;
  maxAttempts?: number;
}

/**
 * Validate final-assessment authoring data against backend contract rules.
 * Mirrors backend validation so errors surface client-side before the API call.
 *
 * Returns an array of ValidationError objects (empty array = valid).
 */
export function validateFinalAssessmentData(
  data: FADataShape,
): ValidationError[] {
  const errors: ValidationError[] = [];
  const questions = data.questions ?? [];

  if (questions.length === 0) {
    errors.push({
      field: "questions",
      message: "Final assessment must have at least one question.",
    });
  }

  const passingScore = data.passingScore ?? 80;
  if (
    !Number.isInteger(passingScore) ||
    passingScore < 0 ||
    passingScore > 100
  ) {
    errors.push({
      field: "passingScore",
      message: "Passing score must be an integer between 0 and 100.",
    });
  }

  const maxAttempts = data.maxAttempts ?? 1;
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    errors.push({
      field: "maxAttempts",
      message: "Max attempts must be an integer of at least 1.",
    });
  }

  questions.forEach((q, idx) => {
    const prefix = `questions[${idx}]`;

    if (!q.id || !String(q.id).trim()) {
      errors.push({
        field: `${prefix}.id`,
        message: "Question id is required.",
      });
    }
    if (!q.question || !q.question.trim()) {
      errors.push({
        field: `${prefix}.question`,
        message: "Question text is required.",
      });
    }

    const qType = normalizeComponentType(q.type);
    if (
      !["mcq", "multiple-select", "true-false", "fill-in-blank"].includes(qType)
    ) {
      errors.push({
        field: `${prefix}.type`,
        message: `Unknown question type "${q.type}". Must be mcq, multiple-select, true-false, or fill-in-blank.`,
      });
    }

    if (
      typeof q.points !== "number" ||
      !Number.isFinite(q.points) ||
      q.points <= 0
    ) {
      errors.push({
        field: `${prefix}.points`,
        message: "Points must be a number greater than 0.",
      });
    }

    if (qType === "mcq") {
      if (!q.options || q.options.length < 2) {
        errors.push({
          field: `${prefix}.options`,
          message: "MCQ questions require at least 2 options.",
        });
      } else {
        const correctCount = q.options.filter((o) => o.isCorrect).length;
        if (correctCount !== 1) {
          errors.push({
            field: `${prefix}.options`,
            message: "MCQ questions must have exactly one correct option.",
          });
        }
      }
    }

    if (qType === "multiple-select") {
      if (!q.options || q.options.length < 2) {
        errors.push({
          field: `${prefix}.options`,
          message: "Multi-select questions require at least 2 options.",
        });
      } else if (!q.options.some((o) => o.isCorrect)) {
        errors.push({
          field: `${prefix}.options`,
          message:
            "Multi-select questions must have at least one correct option.",
        });
      }
    }

    if (qType === "true-false" && q.correctAnswer == null) {
      errors.push({
        field: `${prefix}.correctAnswer`,
        message: "True/False questions require a correctAnswer (boolean).",
      });
    }

    if (qType === "fill-in-blank") {
      const answers = q.correctAnswers?.length
        ? q.correctAnswers
        : q.correctAnswer != null
          ? [String(q.correctAnswer)]
          : [];
      if (answers.length === 0 || answers.every((a) => !a.trim())) {
        errors.push({
          field: `${prefix}.correctAnswers`,
          message:
            "Fill-in-blank questions require at least one non-empty accepted answer.",
        });
      }
    }
  });

  return errors;
}
