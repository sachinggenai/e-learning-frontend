import { ExportComponentPayload } from "../contracts/payload";
import { ExportRendererContext } from "../contracts/renderer";

export function renderUnsupportedComponent(
  component: ExportComponentPayload,
  context: Pick<ExportRendererContext, "sanitizeText">
): string {
  const safeType = context.sanitizeText(component.componentType);
  return [
    '<section class="rt-component rt-unsupported" data-component-type="unsupported">',
    `<p>Unsupported export component type: ${safeType}</p>`,
    "</section>",
  ].join("");
}
