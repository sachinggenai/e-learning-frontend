import { ExportRenderer } from "../contracts/renderer";

// ─── Image Hotspots ──────────────────────────────────────────────────────────

export const imageHotspotsRenderer: ExportRenderer = {
  type: "image-hotspots",
  render(component, { sanitizeText }) {
    const data = component.data;
    const title = sanitizeText(component.title ?? data.title ?? "Image Hotspots");
    const instructions = sanitizeText(data.instructions ?? "Click each hotspot to reveal details.");
    const imageUrl = sanitizeText(data.imageUrl ?? "");
    const hotspots: Array<{ id?: string; label?: string; content?: string; x?: number; y?: number }> =
      Array.isArray(data.hotspots) ? data.hotspots : [];

    const hotspotsHtml = hotspots
      .map((hs) => {
        const label = sanitizeText(hs.label ?? "");
        const content = sanitizeText(hs.content ?? "");
        return `<li class="rt-hotspots__item"><strong>${label}:</strong> ${content}</li>`;
      })
      .join("\n");

    const imageMarkup = imageUrl
      ? `<img class="rt-hotspots__image" src="${imageUrl}" alt="${title}" />`
      : "";

    return [
      `<section class="rt-component rt-hotspots" data-component-type="image-hotspots">`,
      `<h2 class="rt-hotspots__title">${title}</h2>`,
      `<p class="rt-hotspots__instructions">${instructions}</p>`,
      imageMarkup,
      hotspots.length ? `<ul class="rt-hotspots__list">${hotspotsHtml}</ul>` : "",
      `</section>`,
    ].join("\n");
  },
};

// ─── Flip Cards ──────────────────────────────────────────────────────────────

export const flipCardsRenderer: ExportRenderer = {
  type: "flip-cards",
  render(component, { sanitizeText, renderRichText }) {
    const data = component.data;
    const title = sanitizeText(component.title ?? data.title ?? "Flip Cards");
    const cards: Array<{ id?: string; front?: string; back?: string }> =
      Array.isArray(data.cards) ? data.cards : [];

    const cardsHtml = cards
      .map((card, i) => {
        const front = sanitizeText(card.front ?? `Card ${i + 1}`);
        const back = renderRichText(card.back ?? "");
        return [
          `<div class="rt-flipcards__card">`,
          `  <div class="rt-flipcards__front">${front}</div>`,
          `  <div class="rt-flipcards__back">${back}</div>`,
          `</div>`,
        ].join("\n");
      })
      .join("\n");

    return [
      `<section class="rt-component rt-flipcards" data-component-type="flip-cards">`,
      title ? `<h2 class="rt-flipcards__title">${title}</h2>` : "",
      `<div class="rt-flipcards__grid">${cardsHtml}</div>`,
      `</section>`,
    ].join("\n");
  },
};

// ─── Carousel ────────────────────────────────────────────────────────────────

export const carouselRenderer: ExportRenderer = {
  type: "carousel",
  render(component, { sanitizeText, renderRichText }) {
    const data = component.data;
    const title = sanitizeText(component.title ?? data.title ?? "Carousel");
    const slides: Array<{ id?: string; title?: string; content?: string; imageUrl?: string }> =
      Array.isArray(data.slides) ? data.slides : [];

    const slidesHtml = slides
      .map((slide, i) => {
        const slideTitle = sanitizeText(slide.title ?? `Slide ${i + 1}`);
        const content = renderRichText(slide.content ?? "");
        const img = slide.imageUrl
          ? `<img class="rt-carousel__image" src="${sanitizeText(slide.imageUrl)}" alt="${slideTitle}" />`
          : "";
        return [
          `<div class="rt-carousel__slide" aria-label="Slide ${i + 1} of ${slides.length}">`,
          img,
          `  <h3 class="rt-carousel__slide-title">${slideTitle}</h3>`,
          content ? `  <div class="rt-carousel__slide-content">${content}</div>` : "",
          `</div>`,
        ].join("\n");
      })
      .join("\n");

    return [
      `<section class="rt-component rt-carousel" data-component-type="carousel">`,
      title ? `<h2 class="rt-carousel__title">${title}</h2>` : "",
      `<div class="rt-carousel__slides">${slidesHtml}</div>`,
      `</section>`,
    ].join("\n");
  },
};

// ─── Drag & Drop Sort ────────────────────────────────────────────────────────

export const dragDropSortRenderer: ExportRenderer = {
  type: "drag-drop-sort",
  render(component, { sanitizeText }) {
    const data = component.data;
    const title = sanitizeText(component.title ?? data.title ?? "Sort the Items");
    const instructions = sanitizeText(data.instructions ?? "Arrange the items in the correct order.");
    const items: Array<{ id?: string; text?: string; correctOrder?: number }> =
      Array.isArray(data.items) ? data.items : [];

    // Sort by correctOrder so SCORM static output shows items in the correct order
    const sorted = [...items].sort((a, b) => (a.correctOrder ?? 0) - (b.correctOrder ?? 0));

    const itemsHtml = sorted
      .map((item, i) => {
        const text = sanitizeText(item.text ?? `Item ${i + 1}`);
        return `<li class="rt-dragdrop__item">${text}</li>`;
      })
      .join("\n");

    return [
      `<section class="rt-component rt-dragdrop" data-component-type="drag-drop-sort">`,
      `<h2 class="rt-dragdrop__title">${title}</h2>`,
      `<p class="rt-dragdrop__instructions">${instructions}</p>`,
      `<ol class="rt-dragdrop__list">${itemsHtml}</ol>`,
      `</section>`,
    ].join("\n");
  },
};

// ─── Fill in the Blanks ──────────────────────────────────────────────────────

export const fillBlanksRenderer: ExportRenderer = {
  type: "fill-blanks",
  render(component, { sanitizeText }) {
    const data = component.data;
    const title = sanitizeText(component.title ?? data.title ?? "Fill in the Blanks");
    const templateText = sanitizeText(data.templateText ?? "");
    const blanks: Array<{ id?: string; answer?: string; placeholder?: string }> =
      Array.isArray(data.blanks) ? data.blanks : [];

    const blanksListHtml = blanks
      .map((blank, i) => {
        const placeholder = sanitizeText(blank.placeholder ?? `Blank ${i + 1}`);
        const inputId = `${sanitizeText(component.componentId)}-blank-${i}`;
        return `<li class="rt-fillblanks__item"><label for="${inputId}">${placeholder}</label><input type="text" id="${inputId}" class="rt-fillblanks__input" /></li>`;
      })
      .join("\n");

    return [
      `<section class="rt-component rt-fillblanks" data-component-type="fill-blanks">`,
      `<h2 class="rt-fillblanks__title">${title}</h2>`,
      templateText ? `<p class="rt-fillblanks__template">${templateText}</p>` : "",
      blanks.length ? `<ul class="rt-fillblanks__list">${blanksListHtml}</ul>` : "",
      `</section>`,
    ].join("\n");
  },
};

// ─── Matching ────────────────────────────────────────────────────────────────

export const matchingRenderer: ExportRenderer = {
  type: "matching",
  render(component, { sanitizeText }) {
    const data = component.data;
    const title = sanitizeText(component.title ?? data.title ?? "Matching");
    const pairs: Array<{ id?: string; left?: string; right?: string }> =
      Array.isArray(data.pairs) ? data.pairs : [];

    const rowsHtml = pairs
      .map((pair, i) => {
        const left = sanitizeText(pair.left ?? `Item ${i + 1}`);
        const right = sanitizeText(pair.right ?? `Match ${i + 1}`);
        const inputId = `${sanitizeText(component.componentId)}-pair-${i}`;
        return [
          `<div class="rt-matching__pair">`,
          `  <span class="rt-matching__left">${left}</span>`,
          `  <input type="text" id="${inputId}" class="rt-matching__input" aria-label="Match for ${left}" />`,
          `</div>`,
        ].join("\n");
      })
      .join("\n");

    return [
      `<section class="rt-component rt-matching" data-component-type="matching">`,
      `<h2 class="rt-matching__title">${title}</h2>`,
      `<div class="rt-matching__pairs">${rowsHtml}</div>`,
      `</section>`,
    ].join("\n");
  },
};

// ─── Knowledge Check ─────────────────────────────────────────────────────────

export const knowledgeCheckRenderer: ExportRenderer = {
  type: "knowledge-check",
  render(component, { sanitizeText }) {
    const data = component.data;
    const title = sanitizeText(component.title ?? data.title ?? "Knowledge Check");
    const questions: Array<{
      id?: string;
      question?: string;
      options?: Array<{ id?: string; text?: string }>;
      explanation?: string;
    }> = Array.isArray(data.questions) ? data.questions : [];

    const questionsHtml = questions
      .map((q, qi) => {
        const qText = sanitizeText(q.question ?? "");
        const options = Array.isArray(q.options) ? q.options : [];
        const optionsHtml = options
          .map((opt, oi) => {
            const optId = `${sanitizeText(component.componentId)}-q${qi}-opt${oi}`;
            return `<li class="rt-assessment__option"><label><input type="radio" name="${sanitizeText(component.componentId)}-q${qi}" id="${optId}" value="${oi}" />${sanitizeText(opt.text ?? "")}</label></li>`;
          })
          .join("\n");
        const explanation = q.explanation ? `<p class="rt-assessment__explanation">${sanitizeText(q.explanation)}</p>` : "";
        return [
          `<div class="rt-assessment__question">`,
          `  <p class="rt-assessment__prompt">${qText}</p>`,
          `  <ul class="rt-assessment__options">${optionsHtml}</ul>`,
          explanation,
          `</div>`,
        ].join("\n");
      })
      .join("\n");

    return [
      `<section class="rt-component rt-assessment rt-knowledge-check" data-component-type="knowledge-check">`,
      `<h2 class="rt-assessment__title">${title}</h2>`,
      questionsHtml,
      `</section>`,
    ].join("\n");
  },
};

// ─── Final Assessment ────────────────────────────────────────────────────────

export const finalAssessmentRenderer: ExportRenderer = {
  type: "final-assessment",
  render(component, { sanitizeText }) {
    const data = component.data;
    const title = sanitizeText(component.title ?? data.title ?? "Final Assessment");
    const instructions = data.instructions ? sanitizeText(data.instructions) : "";
    const passingScore = data.passingScore ?? 70;
    const questions: Array<{
      id?: string;
      question?: string;
      type?: string;
      options?: Array<{ id?: string; text?: string }>;
    }> = Array.isArray(data.questions) ? data.questions : [];

    const questionsHtml = questions
      .map((q, qi) => {
        const qText = sanitizeText(q.question ?? "");
        const options = Array.isArray(q.options) ? q.options : [];
        const optionType = q.type === "multiple-select" ? "checkbox" : "radio";
        const optionsHtml = options
          .map((opt, oi) => {
            const optId = `${sanitizeText(component.componentId)}-q${qi}-opt${oi}`;
            return `<li class="rt-assessment__option"><label><input type="${optionType}" name="${sanitizeText(component.componentId)}-q${qi}" id="${optId}" value="${oi}" />${sanitizeText(opt.text ?? "")}</label></li>`;
          })
          .join("\n");
        return [
          `<div class="rt-assessment__question">`,
          `  <p class="rt-assessment__prompt">${qText}</p>`,
          optionsHtml ? `  <ul class="rt-assessment__options">${optionsHtml}</ul>` : "",
          `</div>`,
        ].join("\n");
      })
      .join("\n");

    return [
      `<section class="rt-component rt-assessment rt-final-assessment" data-component-type="final-assessment">`,
      `<h2 class="rt-assessment__title">${title}</h2>`,
      instructions ? `<p class="rt-assessment__instructions">${instructions}</p>` : "",
      `<p class="rt-assessment__passing-score">Passing score: ${passingScore}%</p>`,
      questionsHtml,
      `</section>`,
    ].join("\n");
  },
};

// ─── Completion Certificate ──────────────────────────────────────────────────

export const completionCertificateRenderer: ExportRenderer = {
  type: "completion-certificate",
  render(component, { sanitizeText }) {
    const data = component.data;
    const title = sanitizeText(data.title ?? "Certificate of Completion");
    const learnerName = sanitizeText(data.learnerName ?? "Learner Name");
    const courseName = sanitizeText(data.courseName ?? "Course Name");
    const completionDate = sanitizeText(data.completionDate ?? "");
    const issuerName = sanitizeText(data.issuerName ?? "");
    const signatoryName = sanitizeText(data.signatoryName ?? "");
    const signatoryTitle = sanitizeText(data.signatoryTitle ?? "");
    const certificateId = sanitizeText(data.certificateId ?? "");

    return [
      `<section class="rt-component rt-certificate" data-component-type="completion-certificate">`,
      `<h2 class="rt-certificate__title">${title}</h2>`,
      `<p class="rt-certificate__recipient">Presented to: <strong>${learnerName}</strong></p>`,
      `<p class="rt-certificate__course">For completing: <strong>${courseName}</strong></p>`,
      completionDate ? `<p class="rt-certificate__date">Date: ${completionDate}</p>` : "",
      issuerName ? `<p class="rt-certificate__issuer">Issued by: ${issuerName}</p>` : "",
      signatoryName ? `<p class="rt-certificate__signatory">${signatoryName}${signatoryTitle ? `, ${signatoryTitle}` : ""}</p>` : "",
      certificateId ? `<p class="rt-certificate__id">Certificate ID: ${certificateId}</p>` : "",
      `</section>`,
    ].join("\n");
  },
};
