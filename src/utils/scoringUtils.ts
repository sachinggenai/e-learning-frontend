/**
 * Scoring Utilities
 *
 * Pure functions for calculating scores across all assessment component types.
 * Used by ScoringService and scoring Redux thunks.
 *
 * Scoring Types Supported:
 *   - MCQ (binary: correct/incorrect)
 *   - Multiple Select (proportional or all-or-nothing)
 *   - True/False (binary)
 *   - Fill in the Blanks (per-blank proportional)
 *   - Matching (per-pair or all-or-nothing)
 *   - Drag and Drop (proportional)
 *   - Scenario (sum of choice node points)
 *   - Weighted Aggregation
 */

// ─── Individual Scoring Functions ─────────────────────────────────

/**
 * Score a single Multiple Choice Question (MCQ).
 * Binary: correct option selected = 100%, else 0%.
 */
export function scoreMCQ(
  selectedOptionId: string,
  correctOptionId: string,
  maxPoints = 100,
): { score: number; maxScore: number; correct: boolean } {
  const correct = selectedOptionId === correctOptionId;
  return {
    score: correct ? maxPoints : 0,
    maxScore: maxPoints,
    correct,
  };
}

/**
 * Score a Multiple Select question.
 * @param mode - 'proportional': partial credit per correct selection
 *             - 'all-or-nothing': must select all correct and no incorrect
 */
export function scoreMultiSelect(
  selectedIds: string[],
  correctIds: string[],
  mode: "proportional" | "all-or-nothing" = "proportional",
  maxPoints = 100,
): {
  score: number;
  maxScore: number;
  correct: boolean;
  partialCredit: boolean;
} {
  const selected = new Set(selectedIds);
  const correct = new Set(correctIds);

  if (mode === "all-or-nothing") {
    const isExactMatch =
      selected.size === correct.size &&
      Array.from(selected).every((id) => correct.has(id));
    return {
      score: isExactMatch ? maxPoints : 0,
      maxScore: maxPoints,
      correct: isExactMatch,
      partialCredit: false,
    };
  }

  // Proportional mode:
  // +1 for each correct selection, -1 for each incorrect selection
  // Minimum score is 0
  const totalCorrect = correct.size;
  if (totalCorrect === 0) {
    return {
      score: maxPoints,
      maxScore: maxPoints,
      correct: true,
      partialCredit: false,
    };
  }

  let hits = 0;
  let falsePositives = 0;

  Array.from(selected).forEach((id) => {
    if (correct.has(id)) {
      hits++;
    } else {
      falsePositives++;
    }
  });

  const rawScore = Math.max(0, hits - falsePositives);
  const percentage = rawScore / totalCorrect;
  const score = Math.round(percentage * maxPoints);

  return {
    score,
    maxScore: maxPoints,
    correct: hits === totalCorrect && falsePositives === 0,
    partialCredit: score > 0 && score < maxPoints,
  };
}

/**
 * Score a True/False question. Binary.
 */
export function scoreTrueFalse(
  response: boolean,
  correctAnswer: boolean,
  maxPoints = 100,
): { score: number; maxScore: number; correct: boolean } {
  const correct = response === correctAnswer;
  return {
    score: correct ? maxPoints : 0,
    maxScore: maxPoints,
    correct,
  };
}

/**
 * Score Fill in the Blanks.
 * Proportional: each blank scored independently.
 */
export function scoreFillBlanks(
  responses: string[],
  correctAnswers: string[],
  options: { caseSensitive?: boolean; trimWhitespace?: boolean } = {},
): { score: number; maxScore: number; correct: boolean; perBlank: boolean[] } {
  const { caseSensitive = false, trimWhitespace = true } = options;
  const maxPoints = 100;

  if (correctAnswers.length === 0) {
    return {
      score: maxPoints,
      maxScore: maxPoints,
      correct: true,
      perBlank: [],
    };
  }

  const normalize = (s: string): string => {
    let result = s;
    if (trimWhitespace) result = result.trim();
    if (!caseSensitive) result = result.toLowerCase();
    return result;
  };

  const perBlank: boolean[] = correctAnswers.map((answer, i) => {
    const response = responses[i] ?? "";
    // Support multiple accepted answers separated by |
    const acceptedAnswers = answer.split("|").map(normalize);
    return acceptedAnswers.includes(normalize(response));
  });

  const correctCount = perBlank.filter(Boolean).length;
  const percentage = correctCount / correctAnswers.length;
  const score = Math.round(percentage * maxPoints);

  return {
    score,
    maxScore: maxPoints,
    correct: correctCount === correctAnswers.length,
    perBlank,
  };
}

/**
 * Score Matching pairs.
 * @param mode - 'per-pair': partial credit for each correct pair
 *             - 'all-or-nothing': must match all correctly
 */
export function scoreMatching(
  pairs: Array<{ left: string; right: string }>,
  correctPairs: Array<{ left: string; right: string }>,
  mode: "per-pair" | "all-or-nothing" = "per-pair",
  maxPoints = 100,
): {
  score: number;
  maxScore: number;
  correct: boolean;
  partialCredit: boolean;
} {
  if (correctPairs.length === 0) {
    return {
      score: maxPoints,
      maxScore: maxPoints,
      correct: true,
      partialCredit: false,
    };
  }

  const correctMap = new Map(correctPairs.map((p) => [p.left, p.right]));
  let correctCount = 0;

  for (const pair of pairs) {
    if (correctMap.get(pair.left) === pair.right) {
      correctCount++;
    }
  }

  if (mode === "all-or-nothing") {
    const allCorrect =
      correctCount === correctPairs.length &&
      pairs.length === correctPairs.length;
    return {
      score: allCorrect ? maxPoints : 0,
      maxScore: maxPoints,
      correct: allCorrect,
      partialCredit: false,
    };
  }

  const percentage = correctCount / correctPairs.length;
  const score = Math.round(percentage * maxPoints);

  return {
    score,
    maxScore: maxPoints,
    correct: correctCount === correctPairs.length,
    partialCredit: score > 0 && score < maxPoints,
  };
}

/**
 * Score Drag and Drop placements. Proportional.
 */
export function scoreDragDrop(
  placements: Record<string, string>,
  correctPlacements: Record<string, string>,
  maxPoints = 100,
): { score: number; maxScore: number; correct: boolean } {
  const correctKeys = Object.keys(correctPlacements);
  if (correctKeys.length === 0) {
    return { score: maxPoints, maxScore: maxPoints, correct: true };
  }

  let correctCount = 0;
  for (const key of correctKeys) {
    if (placements[key] === correctPlacements[key]) {
      correctCount++;
    }
  }

  const percentage = correctCount / correctKeys.length;
  const score = Math.round(percentage * maxPoints);

  return {
    score,
    maxScore: maxPoints,
    correct: correctCount === correctKeys.length,
  };
}

/**
 * Score a Scenario (branching paths).
 * Sum of choice node points along the selected path.
 */
export function scoreScenario(
  pathChoices: string[],
  scoringTree: Record<string, number>,
  maxPoints = 100,
): { score: number; maxScore: number; correct: boolean } {
  let totalEarned = 0;
  let totalPossible = 0;

  // Max possible = sum of max value at each decision point
  for (const value of Object.values(scoringTree)) {
    if (value > 0) totalPossible += value;
  }

  for (const choiceId of pathChoices) {
    const points = scoringTree[choiceId] ?? 0;
    totalEarned += points;
  }

  // Normalize to maxPoints scale
  const percentage =
    totalPossible > 0 ? Math.max(0, totalEarned / totalPossible) : 1;
  const score = Math.round(percentage * maxPoints);

  return {
    score: Math.min(score, maxPoints),
    maxScore: maxPoints,
    correct: score === maxPoints,
  };
}

// ─── Aggregation ──────────────────────────────────────────────────

export interface ComponentScoreEntry {
  componentId: string;
  score: number;
  maxScore: number;
  weight: number;
}

/**
 * Calculate weighted total across components.
 * Weights should sum to 1.0 (or be normalized).
 */
export function calculateWeightedTotal(
  componentScores: ComponentScoreEntry[],
): { totalScore: number; maxScore: number; percentage: number } {
  if (componentScores.length === 0) {
    return { totalScore: 0, maxScore: 0, percentage: 0 };
  }

  const totalWeight = componentScores.reduce((sum, c) => sum + c.weight, 0);

  let weightedSum = 0;
  let weightedMax = 0;

  for (const entry of componentScores) {
    const normalizedWeight =
      totalWeight > 0 ? entry.weight / totalWeight : 1 / componentScores.length;
    weightedSum += (entry.score / entry.maxScore) * normalizedWeight * 100;
    weightedMax += normalizedWeight * 100;
  }

  const percentage =
    weightedMax > 0 ? Math.round((weightedSum / weightedMax) * 100) : 0;

  return {
    totalScore: Math.round(weightedSum),
    maxScore: Math.round(weightedMax),
    percentage,
  };
}

/**
 * Determine pass/fail based on score and threshold.
 */
export function determinePassFail(
  percentage: number,
  passingScore: number,
): "passed" | "failed" {
  return percentage >= passingScore ? "passed" : "failed";
}

/**
 * Select the effective score from multiple attempts.
 */
export function selectAttemptScore(
  attemptScores: number[],
  mode: "best" | "last" | "average",
): number {
  if (attemptScores.length === 0) return 0;

  switch (mode) {
    case "best":
      return Math.max(...attemptScores);
    case "last":
      return attemptScores[attemptScores.length - 1];
    case "average":
      return Math.round(
        attemptScores.reduce((sum, s) => sum + s, 0) / attemptScores.length,
      );
    default:
      return attemptScores[attemptScores.length - 1];
  }
}
