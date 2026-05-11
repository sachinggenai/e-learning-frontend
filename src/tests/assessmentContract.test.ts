/**
 * Assessment contract tests — Phase D
 *
 * Tests for:
 *  - normalizeComponentType aliases (multi-select, fill-blanks, fill-blank)
 *  - validateFinalAssessmentData mirroring backend rules
 *  - buildScoringPayload produces correct selectedOptionIds shapes
 *  - FinalAssessment explicit submit (no auto-grade)
 *  - Fill-in-blank: correctAnswers[] matching
 *  - Finish gate gating on failed final-assessment
 */

import {
  normalizeComponentType,
  buildScoringPayload,
  validateFinalAssessmentData,
} from "../utils/assessmentUtils";

// ─── Type Normalization ────────────────────────────────────────────
describe("normalizeComponentType — aliases", () => {
  it("maps multi-select → multiple-select", () => {
    expect(normalizeComponentType("multi-select")).toBe("multiple-select");
  });

  it("maps fill-blanks → fill-in-blank", () => {
    expect(normalizeComponentType("fill-blanks")).toBe("fill-in-blank");
  });

  it("maps fill-blank → fill-in-blank", () => {
    expect(normalizeComponentType("fill-blank")).toBe("fill-in-blank");
  });

  it("is case-insensitive", () => {
    expect(normalizeComponentType("Fill-Blank")).toBe("fill-in-blank");
    expect(normalizeComponentType("MULTI-SELECT")).toBe("multiple-select");
  });

  it("passes through canonical types unchanged", () => {
    expect(normalizeComponentType("mcq")).toBe("mcq");
    expect(normalizeComponentType("true-false")).toBe("true-false");
    expect(normalizeComponentType("fill-in-blank")).toBe("fill-in-blank");
    expect(normalizeComponentType("multiple-select")).toBe("multiple-select");
    expect(normalizeComponentType("final-assessment")).toBe("final-assessment");
  });

  it("handles null and undefined gracefully", () => {
    expect(normalizeComponentType(null)).toBeDefined();
    expect(normalizeComponentType(undefined)).toBeDefined();
    expect(normalizeComponentType("")).toBeDefined();
  });
});

// ─── buildScoringPayload ───────────────────────────────────────────
describe("buildScoringPayload", () => {
  it("always sends selectedOptionIds as string[]", () => {
    const payload = buildScoringPayload("comp-1", "mcq", { q1: "opt-a" }, [
      { id: "q1", type: "mcq" },
    ]);
    expect(Array.isArray(payload.responses[0].selectedOptionIds)).toBe(true);
    expect(payload.responses[0].selectedOptionIds).toEqual(["opt-a"]);
  });

  it("converts true-false boolean answer to string in selectedOptionIds", () => {
    const payload = buildScoringPayload("comp-2", "true-false", { q1: true }, [
      { id: "q1", type: "true-false" },
    ]);
    expect(payload.responses[0].selectedOptionIds).toEqual(["true"]);
  });

  it("sends fill-in-blank answer inside selectedOptionIds", () => {
    const payload = buildScoringPayload(
      "comp-3",
      "fill-in-blank",
      { q1: "Paris" },
      [{ id: "q1", type: "fill-in-blank" }],
    );
    expect(payload.responses[0].selectedOptionIds).toEqual(["Paris"]);
  });

  it("normalizes fill-blank alias in questions array", () => {
    const payload = buildScoringPayload(
      "comp-4",
      "fill-in-blank",
      { q1: "answer" },
      [{ id: "q1", type: "fill-blank" }],
    );
    expect(payload.responses[0].selectedOptionIds).toEqual(["answer"]);
  });

  it("normalizes componentType to canonical form", () => {
    const payload = buildScoringPayload("comp-5", "fill-blanks", {}, []);
    expect(payload.componentType).toBe("fill-in-blank");
  });

  it("handles multiple-select with array answer", () => {
    const payload = buildScoringPayload(
      "comp-6",
      "multiple-select",
      { q1: ["opt-a", "opt-c"] },
      [{ id: "q1", type: "multiple-select" }],
    );
    expect(payload.responses[0].selectedOptionIds).toEqual(["opt-a", "opt-c"]);
  });

  it("returns empty selectedOptionIds for unanswered questions", () => {
    const payload = buildScoringPayload("comp-7", "mcq", {}, [
      { id: "q1", type: "mcq" },
    ]);
    expect(payload.responses[0].selectedOptionIds).toEqual([]);
  });
});

// ─── validateFinalAssessmentData ─────────────────────────────────
describe("validateFinalAssessmentData", () => {
  it("returns no errors for valid data", () => {
    const errors = validateFinalAssessmentData({
      passingScore: 80,
      maxAttempts: 2,
      questions: [
        {
          id: "q1",
          type: "mcq",
          question: "Which is correct?",
          points: 10,
          options: [
            { id: "a", text: "Yes", isCorrect: true },
            { id: "b", text: "No", isCorrect: false },
          ],
        },
      ],
    });
    expect(errors).toHaveLength(0);
  });

  it("rejects empty questions array", () => {
    const errors = validateFinalAssessmentData({ questions: [] });
    expect(errors.some((e) => e.field === "questions")).toBe(true);
  });

  it("rejects passingScore outside 0-100", () => {
    const errors = validateFinalAssessmentData({
      passingScore: 110,
      questions: [
        {
          id: "q1",
          type: "mcq",
          question: "Q?",
          points: 10,
          options: [
            { id: "a", text: "Yes", isCorrect: true },
            { id: "b", text: "No", isCorrect: false },
          ],
        },
      ],
    });
    expect(errors.some((e) => e.field === "passingScore")).toBe(true);
  });

  it("rejects maxAttempts < 1", () => {
    const errors = validateFinalAssessmentData({
      maxAttempts: 0,
      questions: [
        {
          id: "q1",
          type: "mcq",
          question: "Q?",
          points: 10,
          options: [
            { id: "a", text: "Yes", isCorrect: true },
            { id: "b", text: "No", isCorrect: false },
          ],
        },
      ],
    });
    expect(errors.some((e) => e.field === "maxAttempts")).toBe(true);
  });

  it("rejects MCQ with fewer than 2 options", () => {
    const errors = validateFinalAssessmentData({
      questions: [
        {
          id: "q1",
          type: "mcq",
          question: "Q?",
          points: 10,
          options: [{ id: "a", text: "Only", isCorrect: true }],
        },
      ],
    });
    expect(errors.some((e) => e.field.includes("options"))).toBe(true);
  });

  it("rejects MCQ with no correct option", () => {
    const errors = validateFinalAssessmentData({
      questions: [
        {
          id: "q1",
          type: "mcq",
          question: "Q?",
          points: 10,
          options: [
            { id: "a", text: "A", isCorrect: false },
            { id: "b", text: "B", isCorrect: false },
          ],
        },
      ],
    });
    expect(errors.some((e) => e.field.includes("options"))).toBe(true);
  });

  it("rejects true-false with missing correctAnswer", () => {
    const errors = validateFinalAssessmentData({
      questions: [
        { id: "q1", type: "true-false", question: "True?", points: 10 },
      ],
    });
    expect(errors.some((e) => e.field.includes("correctAnswer"))).toBe(true);
  });

  it("rejects fill-in-blank with no accepted answers", () => {
    const errors = validateFinalAssessmentData({
      questions: [
        {
          id: "q1",
          type: "fill-in-blank",
          question: "Capital of France?",
          points: 10,
          correctAnswers: [],
        },
      ],
    });
    expect(errors.some((e) => e.field.includes("correctAnswers"))).toBe(true);
  });

  it("accepts fill-blank alias and validates correctly", () => {
    // fill-blank → fill-in-blank alias, correctAnswer fallback
    const errors = validateFinalAssessmentData({
      questions: [
        {
          id: "q1",
          type: "fill-blank",
          question: "Capital?",
          points: 10,
          correctAnswer: "Paris",
        },
      ],
    });
    expect(errors).toHaveLength(0);
  });

  it("rejects blank question text", () => {
    const errors = validateFinalAssessmentData({
      questions: [
        {
          id: "q1",
          type: "mcq",
          question: "   ",
          points: 10,
          options: [
            { id: "a", text: "A", isCorrect: true },
            { id: "b", text: "B", isCorrect: false },
          ],
        },
      ],
    });
    expect(errors.some((e) => e.field.includes("question"))).toBe(true);
  });

  it("rejects questions with invalid points", () => {
    const errors = validateFinalAssessmentData({
      questions: [
        {
          id: "q1",
          type: "mcq",
          question: "Q?",
          points: 0,
          options: [
            { id: "a", text: "A", isCorrect: true },
            { id: "b", text: "B", isCorrect: false },
          ],
        },
      ],
    });
    expect(errors.some((e) => e.field.includes("points"))).toBe(true);
  });

  it("accepts valid multiple-select question", () => {
    const errors = validateFinalAssessmentData({
      questions: [
        {
          id: "q1",
          type: "multiple-select",
          question: "Select all correct options",
          points: 10,
          options: [
            { id: "a", text: "A", isCorrect: true },
            { id: "b", text: "B", isCorrect: true },
            { id: "c", text: "C", isCorrect: false },
          ],
        },
      ],
    });
    expect(errors).toHaveLength(0);
  });
});
