/**
 * Master Data — Barrel Export
 *
 * Single entry point for all seed/master data.
 * Backend teams can use these to populate their database.
 */

// Component Registry
export {
  CATEGORIES,
  ALL_COMPONENT_TYPES,
  categoryListResponse,
  getComponentTypesByCategory,
  getComponentTypeById,
  searchComponentTypes,
  componentTypeListResponse,
} from "./componentRegistryData";

// Themes
export { THEME_PRESETS, getThemeById, resolveTheme } from "./themePresetsData";

// Sample Courses (with pages, components, scoring, navigation)
export {
  COURSE_1,
  COURSE_2,
  COURSE_3,
  ALL_COURSES,
  getCourseById,
  getCourseListItems,
  courseListResponse,
} from "./sampleCoursesData";

// Scoring, Completion, Interactions, Audio, Export, Validation, Media
export {
  SCORE_RESPONSE_PASS,
  SCORE_RESPONSE_FAIL,
  PAGE_COMPLETION_SAMPLE,
  COURSE_COMPLETION_SAMPLE,
  INTERACTION_EVENTS,
  AUDIO_ASSETS,
  EXPORT_STATUS_PENDING,
  EXPORT_STATUS_PROCESSING,
  EXPORT_STATUS_COMPLETED,
  EXPORT_STATUS_FAILED,
  VALIDATION_PASS,
  VALIDATION_FAIL,
  MEDIA_UPLOAD_SAMPLE,
  MEDIA_UPLOADS,
} from "./scoringCompletionData";
