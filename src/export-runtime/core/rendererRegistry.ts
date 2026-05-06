import { ExportRenderer } from "../contracts/renderer";
import { accordionRenderer } from "../renderers/accordionRenderer";
import { clickRevealRenderer } from "../renderers/clickRevealRenderer";
import { contentRenderer, legacyContentRenderer } from "../renderers/contentRenderer";
import {
  carouselRenderer,
  completionCertificateRenderer,
  dragDropSortRenderer,
  fillBlanksRenderer,
  finalAssessmentRenderer,
  flipCardsRenderer,
  imageHotspotsRenderer,
  knowledgeCheckRenderer,
  matchingRenderer,
} from "../renderers/demoRenderers";
import {
  courseMenuRenderer,
  learningRoadmapRenderer,
  moduleOverviewRenderer,
  resourcesDownloadsRenderer,
  summaryTakeawaysRenderer,
} from "../renderers/navigationRenderers";
import { mcqRenderer } from "../renderers/mcqRenderer";
import { tabsRenderer } from "../renderers/tabsRenderer";
import { textWithMediaRenderer } from "../renderers/textWithMediaRenderer";
import { timelineRenderer } from "../renderers/timelineRenderer";
import {
  comparisonTableRenderer,
  multipleSelectRenderer,
  stepByStepRenderer,
  trueFalseRenderer,
  videoSlideRenderer,
} from "../renderers/wave2Renderers";

export class RendererRegistry {
  private readonly renderers = new Map<string, ExportRenderer>();

  register(renderer: ExportRenderer): void {
    this.renderers.set(renderer.type, renderer);
  }

  get(type: string): ExportRenderer | undefined {
    return this.renderers.get(type);
  }

  has(type: string): boolean {
    return this.renderers.has(type);
  }

  getRegisteredTypes(): string[] {
    return Array.from(this.renderers.keys()).sort();
  }
}

export function createDefaultRendererRegistry(): RendererRegistry {
  const registry = new RendererRegistry();
  [
    contentRenderer,
    legacyContentRenderer,
    tabsRenderer,
    accordionRenderer,
    clickRevealRenderer,
    timelineRenderer,
    textWithMediaRenderer,
    courseMenuRenderer,
    resourcesDownloadsRenderer,
    moduleOverviewRenderer,
    learningRoadmapRenderer,
    summaryTakeawaysRenderer,
    mcqRenderer,
    multipleSelectRenderer,
    trueFalseRenderer,
    stepByStepRenderer,
    comparisonTableRenderer,
    videoSlideRenderer,
    // Demo template renderers
    imageHotspotsRenderer,
    flipCardsRenderer,
    carouselRenderer,
    dragDropSortRenderer,
    fillBlanksRenderer,
    matchingRenderer,
    knowledgeCheckRenderer,
    finalAssessmentRenderer,
    completionCertificateRenderer,
  ].forEach((renderer) => registry.register(renderer));
  return registry;
}
