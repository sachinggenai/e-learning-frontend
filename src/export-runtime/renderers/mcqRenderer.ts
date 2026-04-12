import { ExportRenderer } from "../contracts/renderer";

interface McqOption {
  id?: string;
  text?: string;
}

interface McqQuestion {
  id?: string;
  question?: string;
  options?: McqOption[];
}

function isMcqQuestion(value: unknown): value is McqQuestion {
  return typeof value === "object" && value !== null;
}

function isMcqOption(value: unknown): value is McqOption {
  return typeof value === "object" && value !== null;
}

export const mcqRenderer: ExportRenderer = {
  type: "mcq",
  render: (component, context) => {
    const questionsRaw = Array.isArray(component.data.questions) ? component.data.questions : [];
    const first = questionsRaw.find(isMcqQuestion);

    if (!first) {
      return '<section class="rt-component rt-mcq" data-component-type="mcq"><p>No questions configured.</p></section>';
    }

    const questionText = context.sanitizeText(first.question ?? "Question");
    const options = Array.isArray(first.options) ? first.options.filter(isMcqOption) : [];

    const optionsHtml = options
      .map((opt, index) => {
        const text = context.sanitizeText(opt.text ?? `Option ${index + 1}`);
        return [
          '<label class="rt-mcq__option">',
          `<input type="radio" name="mcq-${context.sanitizeText(component.componentId)}" value="${index}" />`,
          `<span>${text}</span>`,
          "</label>",
        ].join("");
      })
      .join("");

    return [
      '<section class="rt-component rt-mcq" data-component-type="mcq">',
      `<h2 class="rt-mcq__question">${questionText}</h2>`,
      `<div class="rt-mcq__options">${optionsHtml}</div>`,
      "</section>",
    ].join("");
  },
};
