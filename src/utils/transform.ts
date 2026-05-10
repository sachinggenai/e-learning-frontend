import { Course, Template } from "../types/course";

/**
 * Normalize and transform frontend Course into backend-compliant structure.
 * - Ensures required fields (language, settings)
 * - Normalizes template ordering (sequential 0..n-1)
 * - Maps lockProgression -> linearProgression
 * - Consolidates template.data.* into TemplateData (content, subtitle, videoUrl, questions)
 * - Bridges MCQ structure differences (supports legacy question/options => questions[])
 */
export function transformCourseForBackend(course: Course): any {
  // Defensive clone to avoid mutating original state
  const cloned: any = JSON.parse(JSON.stringify(course));

  // Ensure language
  if (!cloned.language) {
    cloned.language = "en";
  }

  // Ensure settings
  cloned.settings = cloned.settings || {
    themeId: "default",
    autoplay: false,
    duration: undefined,
  };

  // Handle both pages (Redux) and templates (API) format
  const sourceTemplates = cloned.templates || cloned.pages || [];

  // Normalize and sort templates by order then reassign sequential indices
  const sortedTemplates: Template[] = [...sourceTemplates].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  const transformedTemplates = sortedTemplates.map((t: any, idx) => {
    // Handle both Redux pages (content) and API templates (data)
    const sourceData: any = t.data || t.content || {};

    // Derive content precedence
    const content =
      sourceData.content ?? sourceData.description ?? sourceData.body ?? "";

    // MCQ bridging: if legacy shape (question + options) convert to questions[] expected by backend OR keep if already questions
    let questions = sourceData.questions;
    if (!questions && sourceData.question && sourceData.options) {
      // Find the index of the correct answer by matching the text
      const correctAnswerIndex = sourceData.correctAnswer
        ? (Array.isArray(sourceData.options)
            ? sourceData.options
            : []
          ).findIndex((opt: any) => {
            const optionText =
              typeof opt === "string" ? opt : opt?.text || opt?.option || "";
            return (
              optionText.trim() === (sourceData.correctAnswer || "").trim()
            );
          })
        : -1;

      // Convert options to proper format with isCorrect field
      const formattedOptions = (
        Array.isArray(sourceData.options) ? sourceData.options : []
      ).map((opt: any, optIdx: number) => {
        if (typeof opt === "string") {
          // Simple string option - check if index matches correct answer
          return {
            id: `opt_${optIdx + 1}`,
            text: opt,
            isCorrect: optIdx === correctAnswerIndex,
          };
        } else if (opt && typeof opt === "object") {
          // Already an object - ensure it has required fields
          return {
            id: opt.id || `opt_${optIdx + 1}`,
            text: opt.text || opt.option || `Option ${optIdx + 1}`,
            isCorrect: optIdx === correctAnswerIndex || opt.isCorrect === true,
          };
        }
        return {
          id: `opt_${optIdx + 1}`,
          text: `Option ${optIdx + 1}`,
          isCorrect: false,
        };
      });

      questions = [
        {
          id: `${t.id}_q1`,
          question: sourceData.question,
          options: formattedOptions,
        },
      ];
    }

    return {
      ...t,
      // Map templateType (Redux) to type (API)
      type: t.type || t.templateType,
      order: idx, // enforce sequential
      data: {
        content,
        subtitle: sourceData.subtitle || undefined,
        videoUrl: sourceData.videoUrl || undefined,
        questions: questions || undefined,
      },
    };
  });

  // Navigation mapping
  const nav = cloned.navigation || {};
  const linearProgression =
    typeof nav.linearProgression === "boolean"
      ? nav.linearProgression
      : (nav.lockProgression ?? false);

  return {
    courseId: cloned.courseId,
    title: cloned.title,
    author: cloned.author || "Unknown",
    version:
      cloned.version && /^\d+\.\d+\.\d+$/.test(cloned.version)
        ? cloned.version
        : "1.0.0",
    language: cloned.language || "en",
    templates: transformedTemplates,
    assets: cloned.assets || [],
    navigation: {
      allowSkip: nav.allowSkip ?? true,
      showProgress: nav.showProgress ?? true,
      linearProgression,
    },
    settings: cloned.settings || {
      themeId: "default",
      autoplay: false,
    },
  };
}

/** Quick preflight diagnostics (optional for development) */
export function diagnosticSummary(transformed: any) {
  return {
    templates: transformed.templates.length,
    hasLinear: !!transformed.navigation?.linearProgression,
    missingContentTemplates: transformed.templates
      .filter((t: any) => !t.data?.content)
      .map((t: any) => t.id),
    mcqTemplates: transformed.templates.filter((t: any) => t.type === "mcq")
      .length,
  };
}

/**
 * Transform course for SCORM export - ensures exact structure per guide
 */
export function transformCourseForExport(course: Course): any {
  console.log("Original course for export:", course); // Debug log

  // Transform to match backend Course model expectations
  const transformed = {
    courseId: course.courseId,
    title: course.title,
    author: course.author || "Unknown Author", // Required field
    language: course.language || "en", // Required field
    version: course.version || "1.0.0", // Required field
    templates: [] as any[], // Backend expects 'templates', not 'pages'
  };

  // Handle both pages (Redux) and templates (API) format
  const sourceTemplates =
    (course as any).templates || (course as any).pages || [];

  // Map frontend type identifiers to canonical backend type names
  const EXPORT_TYPE_MAP: Record<string, string> = {
    'text-with-media': 'content-media',
  };

  // Transform each template with proper structure
  transformed.templates = sourceTemplates.map((page: any, index: number) => {
    const rawType = page.type || page.templateType;
    const base = {
      id: page.id,
      type: EXPORT_TYPE_MAP[rawType] ?? rawType,
      order: index, // Required sequential order
      title: page.title,
      data: {} as any,
    };

    if (page.type === "mcq" || page.templateType === "mcq") {
      // Handle MCQ structure - ensure questions array with proper format
      const content = page.data || page.content || {};
      const questions = content.questions || [];

      // If no questions but has legacy format, convert
      let mcqQuestions = questions;
      if (!mcqQuestions.length && content.question && content.options) {
        const optionsList = Array.isArray(content.options) ? content.options : [];
        const correctAnswerRaw = (content.correctAnswer || "").trim();

        // 1. Try text-match
        let correctAnswerIndex = correctAnswerRaw
          ? optionsList.findIndex((opt: any) => {
              const optionText =
                typeof opt === "string" ? opt : opt?.text || opt?.option || "";
              return optionText.trim() === correctAnswerRaw;
            })
          : -1;

        // 2. Fallback: interpret as letter (A→0, B→1 …)
        if (correctAnswerIndex === -1 && /^[A-Za-z]$/.test(correctAnswerRaw)) {
          const letterIdx = correctAnswerRaw.toUpperCase().charCodeAt(0) - 65;
          if (letterIdx >= 0 && letterIdx < optionsList.length) {
            correctAnswerIndex = letterIdx;
          }
        }

        const options = optionsList.map((opt: any, i: number) => {
          if (typeof opt === "string") {
            return {
              id: `opt_${i}`,
              text: opt,
              isCorrect: i === correctAnswerIndex,
            };
          } else if (opt && typeof opt === "object") {
            return {
              id: opt.id || `opt_${i}`,
              text: opt.text || opt.option || `Option ${i + 1}`,
              isCorrect: i === correctAnswerIndex || opt.isCorrect === true,
            };
          }
          return { id: `opt_${i}`, text: `Option ${i + 1}`, isCorrect: false };
        });

        mcqQuestions = [
          {
            id: `q_${page.id}`,
            question: content.question || "Question?",
            options: options,
          },
        ];
      } else if (mcqQuestions.length > 0 && content.correctAnswer) {
        // Questions exist but correct answer needs to be applied.
        // correctAnswer may be a text string OR a letter like "A"/"B"/"C".
        const correctAnswerRaw = (content.correctAnswer || "").trim();

        // 1. Try text-match against content.options
        let correctAnswerIndex = (
          Array.isArray(content.options) ? content.options : []
        ).findIndex((opt: any) => {
          const optionText =
            typeof opt === "string" ? opt : opt?.text || opt?.option || "";
          return optionText.trim() === correctAnswerRaw;
        });

        // 2. If no text match, interpret as a letter (A→0, B→1, C→2 …)
        if (correctAnswerIndex === -1 && /^[A-Za-z]$/.test(correctAnswerRaw)) {
          correctAnswerIndex = correctAnswerRaw.toUpperCase().charCodeAt(0) - 65;
          // Clamp to valid option range
          const firstQ = mcqQuestions[0];
          const optCount = firstQ?.options?.length ?? 0;
          if (correctAnswerIndex < 0 || correctAnswerIndex >= optCount) {
            correctAnswerIndex = -1;
          }
        }

        // Only override isCorrect when we found a valid match
        if (correctAnswerIndex !== -1) {
          mcqQuestions = mcqQuestions.map((q: any) => ({
            ...q,
            options: q.options.map((opt: any, i: number) => ({
              ...opt,
              isCorrect: i === correctAnswerIndex,
            })),
          }));
        }
      }

      // Ensure at least one question with valid options
      if (!mcqQuestions.length) {
        mcqQuestions = [
          {
            id: `q_${page.id}`,
            question: "Sample Question",
            options: [
              { id: "opt_0", text: "Option 1", isCorrect: false },
              { id: "opt_1", text: "Option 2", isCorrect: true },
            ],
          },
        ];
      }

      base.data = {
        content: content.content || "Quiz",
        questions: mcqQuestions,
      };
    } else {
      // For non-MCQ templates, map content appropriately
      const content = page.data || page.content || {};
      base.data = {
        // Use body as the canonical text field; fall back to content/template_name for legacy data
        body: content.body || content.content || content.template_name || "Content",
        // Keep content for backward-compat fallback on backend
        content: content.content || content.template_name || content.body || "Content",
        subtitle: content.subtitle || null,
        videoUrl: content.videoUrl || null,
        questions: null,
        tabs: null,
        panels: null,
        // Preserve media fields — critical for content-media template
        mediaUrl: content.mediaUrl ?? "",
        mediaType: content.mediaType ?? "none",
        mediaPosition: content.mediaPosition ?? "right",
      };
    }

    return base;
  });

  console.log("Transformed course for export:", transformed); // Debug log
  return transformed;
}
