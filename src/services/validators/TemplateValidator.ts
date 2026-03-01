import {
  Course,
  ValidationError,
  ValidationResult,
  Validator,
} from "../../types/comprehensive";
import { COMPONENT_TYPE_CATEGORY } from "../../constants/templateTypes";

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
        case "welcome":
          errors.push(...this.validateWelcome(page, index));
          break;
        case "content-text":
          errors.push(...this.validateContentText(page, index));
          break;
        case "content-image":
          errors.push(...this.validateContentImage(page, index));
          break;
        case "content-video":
          errors.push(...this.validateContentVideo(page, index));
          break;
        case "tabs":
          errors.push(...this.validateTabs(page, index));
          break;
        case "accordion":
          errors.push(...this.validateAccordion(page, index));
          break;
        case "summary":
          errors.push(...this.validateSummary(page, index));
          break;
        case "mcq":
          errors.push(...this.validateMCQ(page, index));
          break;
        case "true-false":
          errors.push(...this.validateTrueFalse(page, index));
          break;
        case "fill-blanks":
          errors.push(...this.validateFillBlanks(page, index));
          break;
        case "matching":
          errors.push(...this.validateMatching(page, index));
          break;
        case "multiple-select":
          errors.push(...this.validateMultipleSelect(page, index));
          break;
        case "scenario-question":
          errors.push(...this.validateScenarioQuestion(page, index));
          break;
        case "knowledge-check":
          errors.push(...this.validateKnowledgeCheck(page, index));
          break;
        case "final-assessment":
          errors.push(...this.validateFinalAssessment(page, index));
          break;
        case "flip-cards":
          errors.push(...this.validateFlipCards(page, index));
          break;
        case "click-reveal":
          errors.push(...this.validateClickReveal(page, index));
          break;
        case "drag-drop-sort":
          errors.push(...this.validateDragDropSort(page, index));
          break;
        case "timeline":
          errors.push(...this.validateTimeline(page, index));
          break;
        case "layered-content":
          errors.push(...this.validateLayeredContent(page, index));
          break;
        case "text-with-media":
          errors.push(...this.validateTextWithMedia(page, index));
          break;
        case "carousel":
          errors.push(...this.validateCarousel(page, index));
          break;
        case "step-by-step":
          errors.push(...this.validateStepByStep(page, index));
          break;
        case "cycle-diagram":
          errors.push(...this.validateCycleDiagram(page, index));
          break;
        case "comparison-table":
          errors.push(...this.validateComparisonTable(page, index));
          break;
        case "flashcards":
          errors.push(...this.validateFlashcards(page, index));
          break;
        case "image-hotspots":
          errors.push(...this.validateImageHotspots(page, index));
          break;
        case "video-slide":
          errors.push(...this.validateVideoSlide(page, index));
          break;
        case "infographic":
          errors.push(...this.validateInfographic(page, index));
          break;
        case "branching-scenario":
          errors.push(...this.validateBranchingScenario(page, index));
          break;
        case "case-study":
          errors.push(...this.validateCaseStudy(page, index));
          break;
        case "course-menu":
          errors.push(...this.validateCourseMenu(page, index));
          break;
        case "resources-downloads":
          errors.push(...this.validateResourcesDownloads(page, index));
          break;
        case "progress-tracker":
          errors.push(...this.validateProgressTracker(page, index));
          break;
        case "quiz-game":
          errors.push(...this.validateQuizGame(page, index));
          break;
        default:
          // Check if the template type is a known component type from the registry
          if (!(templateType in COMPONENT_TYPE_CATEGORY)) {
            errors.push({
              id: "",
              field: `pages[${index}].templateType`,
              category: "business",
              message: `Unknown template type: ${templateType}`,
              level: "warning",
            });
          } else {
            // Known types should be explicit; warn if missing a rule
            errors.push({
              id: "",
              field: `pages[${index}].templateType`,
              category: "business",
              message: `No validation rules configured for template type: ${templateType}`,
              level: "warning",
            });
          }
          break;
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

    const hasCorrectOption = Array.isArray(mcqData.options)
      ? mcqData.options.some((opt: any) => opt?.isCorrect)
      : false;

    if (!hasCorrectOption && mcqData.correctAnswer === undefined) {
      errors.push({
        id: "",
        field: `pages[${index}].content.options`,
        category: "business",
        message: `MCQ page ${index + 1} must include a correct option`,
        level: "error",
      });
    }

    return errors;
  }

  private validateContentImage(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.isNonEmptyString(content.imageUrl)) {
      errors.push(this.makeError(index, "content.imageUrl", "Image content requires an image URL"));
    }

    if (!this.isNonEmptyString(content.altText)) {
      errors.push(this.makeWarning(index, "content.altText", "Image content should include alt text"));
    }

    return errors;
  }

  private validateContentVideo(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.isNonEmptyString(content.videoUrl)) {
      errors.push(this.makeError(index, "content.videoUrl", "Video content requires a video URL"));
    }

    return errors;
  }

  private validateTabs(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.hasMinItems(content.tabs, 1)) {
      errors.push(this.makeError(index, "content.tabs", "Tabs must include at least one tab"));
      return errors;
    }

    content.tabs.forEach((tab: any, t: number) => {
      if (!this.isNonEmptyString(tab.title)) {
        errors.push(this.makeError(index, `content.tabs[${t}].title`, "Each tab needs a title"));
      }
      if (!this.isNonEmptyString(tab.body)) {
        errors.push(this.makeWarning(index, `content.tabs[${t}].body`, "Each tab should include body text"));
      }
    });

    return errors;
  }

  private validateAccordion(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.hasMinItems(content.panels, 1)) {
      errors.push(this.makeError(index, "content.panels", "Accordion must include at least one panel"));
      return errors;
    }

    content.panels.forEach((panel: any, p: number) => {
      if (!this.isNonEmptyString(panel.title)) {
        errors.push(this.makeError(index, `content.panels[${p}].title`, "Each panel needs a title"));
      }
      if (!this.isNonEmptyString(panel.body)) {
        errors.push(this.makeWarning(index, `content.panels[${p}].body`, "Each panel should include body text"));
      }
    });

    return errors;
  }

  private validateSummary(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.hasMinItems(content.keyPoints, 1)) {
      errors.push(this.makeWarning(index, "content.keyPoints", "Summary should include at least one key point"));
    }

    return errors;
  }

  private validateTrueFalse(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.isNonEmptyString(content.question)) {
      errors.push(this.makeError(index, "content.question", "True/False question text is required"));
    }

    if (typeof content.correctAnswer !== "boolean") {
      errors.push(this.makeError(index, "content.correctAnswer", "True/False requires a correctAnswer boolean"));
    }

    return errors;
  }

  private validateFillBlanks(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.isNonEmptyString(content.templateText)) {
      errors.push(this.makeError(index, "content.templateText", "Fill-in-the-blanks requires template text"));
    }

    if (!this.hasMinItems(content.blanks, 1)) {
      errors.push(this.makeError(index, "content.blanks", "Fill-in-the-blanks requires at least one blank"));
    }

    return errors;
  }

  private validateMatching(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.hasMinItems(content.pairs, 1)) {
      errors.push(this.makeError(index, "content.pairs", "Matching requires at least one pair"));
      return errors;
    }

    content.pairs.forEach((pair: any, p: number) => {
      if (!this.isNonEmptyString(pair.left)) {
        errors.push(this.makeError(index, `content.pairs[${p}].left`, "Each pair needs a left value"));
      }
      if (!this.isNonEmptyString(pair.right)) {
        errors.push(this.makeError(index, `content.pairs[${p}].right`, "Each pair needs a right value"));
      }
    });

    return errors;
  }

  private validateMultipleSelect(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.isNonEmptyString(content.question)) {
      errors.push(this.makeError(index, "content.question", "Multiple select requires a question"));
    }

    if (!this.hasMinItems(content.options, 2)) {
      errors.push(this.makeError(index, "content.options", "Multiple select requires at least 2 options"));
    } else if (!content.options.some((opt: any) => opt?.isCorrect)) {
      errors.push(this.makeWarning(index, "content.options", "Multiple select should have at least one correct option"));
    }

    return errors;
  }

  private validateScenarioQuestion(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.isNonEmptyString(content.scenario)) {
      errors.push(this.makeError(index, "content.scenario", "Scenario question requires scenario context"));
    }

    if (!this.isNonEmptyString(content.question)) {
      errors.push(this.makeError(index, "content.question", "Scenario question requires a question"));
    }

    if (!this.hasMinItems(content.options, 2)) {
      errors.push(this.makeError(index, "content.options", "Scenario question requires at least 2 options"));
    }

    return errors;
  }

  private validateKnowledgeCheck(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.hasMinItems(content.questions, 1)) {
      errors.push(this.makeError(index, "content.questions", "Knowledge check requires at least one question"));
      return errors;
    }

    content.questions.forEach((q: any, i: number) => {
      if (!this.isNonEmptyString(q.question)) {
        errors.push(this.makeError(index, `content.questions[${i}].question`, "Each question needs text"));
      }
      if (!this.hasMinItems(q.options, 2)) {
        errors.push(this.makeError(index, `content.questions[${i}].options`, "Each question needs at least 2 options"));
      }
    });

    return errors;
  }

  private validateFinalAssessment(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.hasMinItems(content.questions, 1)) {
      errors.push(this.makeError(index, "content.questions", "Final assessment requires at least one question"));
    }

    if (content.passingScore !== undefined && (content.passingScore < 0 || content.passingScore > 100)) {
      errors.push(this.makeWarning(index, "content.passingScore", "Passing score should be between 0 and 100"));
    }

    return errors;
  }

  private validateFlipCards(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.hasMinItems(content.cards, 1)) {
      errors.push(this.makeError(index, "content.cards", "Flip cards require at least one card"));
      return errors;
    }

    content.cards.forEach((card: any, c: number) => {
      const hasFront = this.isNonEmptyString(card.front) || this.isNonEmptyString(card.frontText) || this.isNonEmptyString(card.title);
      const hasBack = this.isNonEmptyString(card.back) || this.isNonEmptyString(card.backText) || this.isNonEmptyString(card.body);
      if (!hasFront || !hasBack) {
        errors.push(this.makeWarning(index, `content.cards[${c}]`, "Each card should include front and back content"));
      }
    });

    return errors;
  }

  private validateClickReveal(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.hasMinItems(content.items, 1)) {
      errors.push(this.makeError(index, "content.items", "Click & Reveal requires at least one item"));
      return errors;
    }

    content.items.forEach((item: any, i: number) => {
      if (!this.isNonEmptyString(item.title)) {
        errors.push(this.makeWarning(index, `content.items[${i}].title`, "Each item should include a title"));
      }
      if (!this.isNonEmptyString(item.body) && !this.isNonEmptyString(item.description)) {
        errors.push(this.makeWarning(index, `content.items[${i}]`, "Each item should include reveal content"));
      }
    });

    return errors;
  }

  private validateDragDropSort(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.hasMinItems(content.items, 2)) {
      errors.push(this.makeError(index, "content.items", "Drag & Drop Sort requires at least two items"));
      return errors;
    }

    content.items.forEach((item: any, i: number) => {
      if (!this.isNonEmptyString(item.label) && !this.isNonEmptyString(item.text)) {
        errors.push(this.makeWarning(index, `content.items[${i}]`, "Each item should include label text"));
      }
    });

    return errors;
  }

  private validateTimeline(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.hasMinItems(content.events, 1)) {
      errors.push(this.makeError(index, "content.events", "Timeline requires at least one event"));
      return errors;
    }

    content.events.forEach((event: any, e: number) => {
      if (!this.isNonEmptyString(event.title) && !this.isNonEmptyString(event.label)) {
        errors.push(this.makeWarning(index, `content.events[${e}]`, "Each event should include a title"));
      }
    });

    return errors;
  }

  private validateLayeredContent(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.hasMinItems(content.layers, 1)) {
      errors.push(this.makeError(index, "content.layers", "Layered content requires at least one layer"));
      return errors;
    }

    content.layers.forEach((layer: any, layerIndex: number) => {
      if (!this.isNonEmptyString(layer.label)) {
        errors.push(this.makeWarning(index, `content.layers[${layerIndex}].label`, "Each layer should include a label"));
      }
      if (!this.isNonEmptyString(layer.content)) {
        errors.push(this.makeWarning(index, `content.layers[${layerIndex}].content`, "Each layer should include content"));
      }
    });

    return errors;
  }

  private validateTextWithMedia(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.isNonEmptyString(content.body)) {
      errors.push(this.makeWarning(index, "content.body", "Text with media should include body text"));
    }

    const mediaType = typeof content.mediaType === "string" ? content.mediaType : "none";
    if (mediaType !== "none" && !this.isNonEmptyString(content.mediaUrl)) {
      errors.push(this.makeWarning(index, "content.mediaUrl", "Media URL is required when media type is image or video"));
    }

    return errors;
  }

  private validateCarousel(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.hasMinItems(content.slides, 1)) {
      errors.push(this.makeError(index, "content.slides", "Carousel requires at least one slide"));
      return errors;
    }

    content.slides.forEach((slide: any, s: number) => {
      if (!this.isNonEmptyString(slide.title) && !this.isNonEmptyString(slide.body)) {
        errors.push(this.makeWarning(index, `content.slides[${s}]`, "Each slide should include content"));
      }
    });

    return errors;
  }

  private validateStepByStep(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.hasMinItems(content.steps, 1)) {
      errors.push(this.makeError(index, "content.steps", "Step-by-step requires at least one step"));
      return errors;
    }

    content.steps.forEach((step: any, s: number) => {
      if (!this.isNonEmptyString(step.title) && !this.isNonEmptyString(step.body)) {
        errors.push(this.makeWarning(index, `content.steps[${s}]`, "Each step should include content"));
      }
    });

    return errors;
  }

  private validateCycleDiagram(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.hasMinItems(content.stages, 1)) {
      errors.push(this.makeError(index, "content.stages", "Cycle diagram requires at least one stage"));
      return errors;
    }

    content.stages.forEach((stage: any, s: number) => {
      if (!this.isNonEmptyString(stage.label)) {
        errors.push(this.makeWarning(index, `content.stages[${s}]`, "Each stage should have a label"));
      }
    });

    return errors;
  }

  private validateComparisonTable(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.hasMinItems(content.columns, 2)) {
      errors.push(this.makeError(index, "content.columns", "Comparison table needs at least two columns"));
    }
    if (!this.hasMinItems(content.rows, 1)) {
      errors.push(this.makeError(index, "content.rows", "Comparison table needs at least one row"));
    }

    return errors;
  }

  private validateFlashcards(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.hasMinItems(content.cards, 1)) {
      errors.push(this.makeError(index, "content.cards", "Flashcards require at least one card"));
      return errors;
    }

    content.cards.forEach((card: any, c: number) => {
      const hasFront = this.isNonEmptyString(card.front) || this.isNonEmptyString(card.question);
      const hasBack = this.isNonEmptyString(card.back) || this.isNonEmptyString(card.answer);
      if (!hasFront || !hasBack) {
        errors.push(this.makeWarning(index, `content.cards[${c}]`, "Each flashcard should include front and back content"));
      }
    });

    return errors;
  }

  private validateImageHotspots(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.isNonEmptyString(content.imageUrl)) {
      errors.push(this.makeError(index, "content.imageUrl", "Image hotspots require a base image"));
    }

    if (!this.hasMinItems(content.hotspots, 1)) {
      errors.push(this.makeError(index, "content.hotspots", "Image hotspots require at least one hotspot"));
    }

    return errors;
  }

  private validateVideoSlide(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.isNonEmptyString(content.videoUrl)) {
      errors.push(this.makeError(index, "content.videoUrl", "Video slide requires a video URL"));
    }

    return errors;
  }

  private validateInfographic(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.hasMinItems(content.sections, 1)) {
      errors.push(this.makeError(index, "content.sections", "Infographic requires at least one section"));
    }

    return errors;
  }

  private validateBranchingScenario(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.hasMinItems(content.nodes, 1)) {
      errors.push(this.makeError(index, "content.nodes", "Branching scenario requires at least one node"));
    }

    return errors;
  }

  private validateCaseStudy(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.isNonEmptyString(content.context)) {
      errors.push(this.makeWarning(index, "content.context", "Case study should include context"));
    }

    if (!this.hasMinItems(content.prompts, 1)) {
      errors.push(this.makeWarning(index, "content.prompts", "Case study should include at least one prompt"));
    }

    return errors;
  }

  private validateCourseMenu(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.hasMinItems(content.items, 1)) {
      errors.push(this.makeWarning(index, "content.items", "Course menu should include at least one item"));
    }

    return errors;
  }

  private validateResourcesDownloads(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.hasMinItems(content.resources, 1)) {
      errors.push(this.makeWarning(index, "content.resources", "Resources should include at least one item"));
    }

    return errors;
  }

  private validateProgressTracker(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (content.totalPages !== undefined && Number(content.totalPages) <= 0) {
      errors.push(this.makeWarning(index, "content.totalPages", "Total pages should be greater than 0"));
    }

    return errors;
  }

  private validateQuizGame(page: any, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = page.content as any;

    if (!this.hasMinItems(content.questions, 1)) {
      errors.push(this.makeError(index, "content.questions", "Quiz game requires at least one question"));
      return errors;
    }

    content.questions.forEach((q: any, i: number) => {
      if (!this.isNonEmptyString(q.question)) {
        errors.push(this.makeError(index, `content.questions[${i}].question`, "Each quiz question needs text"));
      }
      if (!this.hasMinItems(q.options, 2)) {
        errors.push(this.makeError(index, `content.questions[${i}].options`, "Each quiz question needs at least 2 options"));
      }
    });

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

  private isNonEmptyString(value: any): boolean {
    return typeof value === "string" && value.trim().length > 0;
  }

  private hasMinItems(value: any, min: number): boolean {
    return Array.isArray(value) && value.length >= min;
  }

  private makeError(index: number, field: string, message: string): ValidationError {
    return {
      id: "",
      field: `pages[${index}].${field}`,
      category: "business",
      message,
      level: "error",
    };
  }

  private makeWarning(index: number, field: string, message: string): ValidationError {
    return {
      id: "",
      field: `pages[${index}].${field}`,
      category: "business",
      message,
      level: "warning",
    };
  }
}
