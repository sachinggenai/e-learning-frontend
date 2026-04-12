import { ExportRenderer } from "../contracts/renderer";

// ─── Multiple-select ────────────────────────────────────────────────────────

export const multipleSelectRenderer: ExportRenderer = {
  type: "multiple-select",
  render(component, { sanitizeText, renderRichText }) {
    const questions: Array<{
      id?: string;
      question?: string;
      options?: Array<{ id?: string; text?: string }>;
    }> = Array.isArray(component.data?.questions) ? component.data.questions : [];

    const qs = questions
      .map((q, qi) => {
        const qText = sanitizeText(q.question ?? "");
        const options = (q.options ?? [])
          .map((opt, oi) => {
            const optId = `${component.componentId}-q${qi}-opt${oi}`;
            return `<li class="rt-assessment__option"><label>
          <input type="checkbox" name="${component.componentId}-q${qi}" id="${optId}" value="${sanitizeText(opt.id ?? String(oi))}" />
          ${sanitizeText(opt.text ?? "")}
        </label></li>`;
          })
          .join("\n");
        return `<div class="rt-assessment__question">
      <p class="rt-assessment__prompt">${qText}</p>
      <ul class="rt-assessment__options">${options}</ul>
    </div>`;
      })
      .join("\n");

    return `<section class="rt-component rt-assessment rt-multiple-select" data-component-type="multiple-select">${qs}</section>`;
  },
};

// ─── True / False ───────────────────────────────────────────────────────────

export const trueFalseRenderer: ExportRenderer = {
  type: "true-false",
  render(component, { sanitizeText }) {
    const questions: Array<{ id?: string; question?: string; statement?: string }> =
      Array.isArray(component.data?.questions) ? component.data.questions : [];

    const qs = questions
      .map((q, qi) => {
        const qText = sanitizeText(q.question ?? q.statement ?? "");
        const trueId = `${component.componentId}-q${qi}-true`;
        const falseId = `${component.componentId}-q${qi}-false`;
        return `<div class="rt-assessment__question">
      <p class="rt-assessment__prompt">${qText}</p>
      <ul class="rt-assessment__options rt-true-false__options">
        <li class="rt-assessment__option"><label>
          <input type="radio" name="${component.componentId}-q${qi}" id="${trueId}" value="true" /> True
        </label></li>
        <li class="rt-assessment__option"><label>
          <input type="radio" name="${component.componentId}-q${qi}" id="${falseId}" value="false" /> False
        </label></li>
      </ul>
    </div>`;
      })
      .join("\n");

    return `<section class="rt-component rt-assessment rt-true-false" data-component-type="true-false">${qs}</section>`;
  },
};

// ─── Step-by-step ───────────────────────────────────────────────────────────

export const stepByStepRenderer: ExportRenderer = {
  type: "step-by-step",
  render(component, { sanitizeText, renderRichText }) {
    const steps: Array<{ title?: string; body?: string; description?: string }> =
      Array.isArray(component.data?.steps) ? component.data.steps : [];

    const items = steps
      .map((step, i) => {
        const title = sanitizeText(step.title ?? `Step ${i + 1}`);
        const body = renderRichText(step.body ?? step.description ?? "");
        return `<li class="rt-step-by-step__step">
      <span class="rt-step-by-step__number" aria-label="Step ${i + 1}">${i + 1}</span>
      <div class="rt-step-by-step__content">
        <h3 class="rt-step-by-step__title">${title}</h3>
        <div class="rt-step-by-step__body">${body}</div>
      </div>
    </li>`;
      })
      .join("\n");

    return `<section class="rt-component rt-step-by-step" data-component-type="step-by-step">\n<ol class="rt-step-by-step">\n${items}\n</ol>\n</section>`;
  },
};

// ─── Comparison table ───────────────────────────────────────────────────────

export const comparisonTableRenderer: ExportRenderer = {
  type: "comparison-table",
  render(component, { sanitizeText, renderRichText }) {
    const columns: Array<{ header?: string }> = Array.isArray(component.data?.columns)
      ? component.data.columns
      : [];
    const rows: Array<{ cells?: string[] }> = Array.isArray(component.data?.rows)
      ? component.data.rows
      : [];

    const headerRow = columns.length
      ? `<thead><tr>${columns.map((c) => `<th>${sanitizeText(c.header ?? "")}</th>`).join("")}</tr></thead>`
      : "";

    const bodyRows = rows
      .map(
        (row) =>
          `<tr>${(row.cells ?? []).map((cell) => `<td>${renderRichText(cell)}</td>`).join("")}</tr>`
      )
      .join("\n");

    return `<section class="rt-component rt-comparison-table" data-component-type="comparison-table"><div class="rt-comparison-table-wrapper"><table class="rt-comparison-table">\n  ${headerRow}\n  <tbody>${bodyRows}</tbody>\n</table></div></section>`;
  },
};

// ─── Video slide ────────────────────────────────────────────────────────────

export const videoSlideRenderer: ExportRenderer = {
  type: "video-slide",
  render(component, { sanitizeText, renderRichText }) {
    const title = sanitizeText(component.data?.title ?? "");
    const description = renderRichText(component.data?.description ?? "");
    const rawSrc: string =
      typeof component.data?.videoUrl === "string"
        ? component.data.videoUrl
        : typeof component.data?.src === "string"
        ? component.data.src
        : "";
    const caption = sanitizeText(component.data?.caption ?? "");

    // Only allow relative paths or http/https to prevent javascript: URI injection
    const safeSrc =
      typeof rawSrc === "string" && /^(https?:\/\/|[a-zA-Z0-9_./-]+)/.test(rawSrc)
        ? sanitizeText(rawSrc)
        : "";

    const titleHtml = title ? `<h3 class="rt-video-slide__title">${title}</h3>` : "";
    const descHtml = description
      ? `<div class="rt-video-slide__description">${description}</div>`
      : "";
    const videoHtml = safeSrc
      ? `<div class="rt-video-slide__player"><video src="${safeSrc}" controls preload="metadata" class="rt-video-slide__video"></video></div>`
      : `<div class="rt-video-slide__placeholder">[Video not available]</div>`;
    const captionHtml = caption ? `<p class="rt-video-slide__caption">${caption}</p>` : "";

    return `<section class="rt-component rt-video-slide" data-component-type="video-slide">
  ${titleHtml}
  ${descHtml}
  ${videoHtml}
  ${captionHtml}
</section>`;
  },
};
