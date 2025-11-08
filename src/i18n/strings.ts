// Basic i18n scaffold. In future, can be replaced by a full library (react-intl, i18next)
// For now, provides a typed dictionary and simple lookup with fallback.

export type Locale = "en";

interface TranslationMap {
  [key: string]: string;
}

const en: TranslationMap = {
  "menu.file": "File",
  "menu.edit": "Edit",
  "menu.insert": "Insert",
  "menu.tools": "Tools",
  "menu.view": "View",
  "menu.help": "Help",
  "menu.file.newCourse": "New Course",
  "menu.file.openCourse": "Open Course",
  "menu.file.save": "Save",
  "menu.file.saveAs": "Save As...",
  "menu.file.export": "Export",
  "menu.edit.undo": "Undo",
  "menu.edit.redo": "Redo",
  "menu.insert.addPage": "Add Page from Template",
  "menu.insert.uploadMedia": "Upload Media",
  "menu.tools.validatePage": "Validate Page",
  "menu.tools.validateCourse": "Validate Course",
  "menu.tools.previewCourse": "Preview Course",
  "menu.tools.enableAutoSave": "Enable Auto-Save",
  "media.upload.title": "Upload Media Files",
  "media.drop.or.browse": "Drop files here or click to browse",
  "media.supported.types":
    "Supported: Images, Videos, Audio, PDF, Text files (Max {max}MB each)",
  "media.max.files": "Maximum {max} files • Current: {current}",
  "confirm.delete.page": 'Delete "{title}"? This action cannot be undone.',
  "export.no.course": "Please load a course before exporting.",
  "export.validation.block":
    "Please fix {count} validation error(s) before exporting",
  "export.confirm":
    'Export "{title}" as SCORM package?\n\nThis will download a ZIP file with the course content.',
  "validate.no.course": "Please load a course before validating.",
  "validate.error.title.required": "Course title is required",
  "validate.error.page.required": "At least one page is required",
  "validate.success": "Course is valid!",
  "validate.errors.prefix": "Validation errors: ",
  "confirm.reset.course":
    "Are you sure you want to reset the course? All changes will be lost.",
  "media.files.heading": "Files ({count})",
  "media.status.pending": "pending",
  "media.status.uploaded": "uploaded",
  "media.status.failed": "failed",
  "media.status.uploading": "uploading",
  "media.overall.progress": "Overall Progress: {p}%",
  "media.file.progress": "{p}% uploaded",
  "media.total.size": "Total size: {size}",
  "media.uploading.status": "Uploading...",
  "media.upload.n.files": "Upload {n} Files",
  "menu.view.zoomIn": "Zoom In",
  "menu.view.zoomOut": "Zoom Out",
  "menu.view.resetZoom": "Reset Zoom",
  "menu.view.themeSettings": "Theme Settings",
  "menu.help.documentation": "Documentation",
  "menu.help.keyboardShortcuts": "Keyboard Shortcuts",
  "menu.help.about": "About",
  "pagemanager.header": "Course Pages",
  "pagemanager.addPage": "Add Page",
  "pagemanager.emptyState": "No pages yet",
  "pagemanager.emptyHint":
    'Click "Add Page" to create your first page from a template',
  "validation.pageTitleRequired": "Page title is required",
  "validation.noPageSelected": "No page selected for validation",
  "unsaved.changes.confirm":
    "You have unsaved changes. Save before creating a new course?",
  "course.prompt.title": "Enter course title:",
  "course.open.placeholder": "Course selection dialog would appear here",
  "export.placeholder": "Export initiated (placeholder)",
  "add.page.via.manager":
    "Use the Page Manager panel to add pages from templates",
  "templates.search.placeholder": "Search templates...",
  "templates.available": "Available Templates",
  "loading.templates": "Loading templates...",
  "actions.retry": "Retry",
  "templates.none.match": "No templates match your search",
  "templates.none.available": "No templates available",
  "templates.configure": "Configure Your Page",
  "page.title.label": "Page Title",
  "page.title.placeholder": "Enter page title...",
  "templates.structure": "Template Structure:",
  "actions.cancel": "Cancel",
  "actions.createPage": "Create Page",
  "validation.report.title": "Validation Report",
  "validation.issues.found": "issues found",
  "validation.errors": "errors",
  "validation.warnings": "warnings",
  "validation.info": "info",
  "validation.autofix": "Auto-fix",
  "validation.export.report": "Export validation report",
  "validation.tab.all": "All Issues",
  "validation.tab.errors": "Errors",
  "validation.tab.warnings": "Warnings",
  "validation.tab.info": "Info",
  "validation.none.title": "No Issues Found",
  "validation.none.allPass": "Your course passes all validation checks!",
  "validation.none.tabEmpty": "No items found in this category.",
  "validation.issues.in": "issues in",
  "validation.categories": "categories",
  "validation.ignoreAllWarnings": "Ignore All Warnings",
  "actions.collapseAll": "Collapse All",
  "actions.expandAll": "Expand All",
  "actions.ignore": "Ignore",
  "actions.navigate": "Navigate",
  "validation.context": "Context",
  "validation.suggestion": "Suggestion",
  "validation.mustFixBefore": "must be fixed before publishing",
  "validation.shouldReview": "should be reviewed",
  "validation.allPassed": "All validation checks passed!",
  "actions.close": "Close",
  "actions.continue": "Continue",
  "error.app.title": "Application Error",
  "error.app.message":
    "The application encountered an unexpected error. You can try recovering below. If the problem persists, share the copied error details with support.",
  "actions.reloadApp": "Reload App",
  "actions.copyErrorDetails": "Copy Error Details",
  "actions.dismiss": "Dismiss",
  "error.technical.details": "Technical details",
  "actions.preview": "Preview",
  "actions.validate": "Validate",
  "page.editor.objectives.label": "Learning Objectives",
  "page.editor.objectives.placeholder":
    "Enter learning objectives for this course...",
  "page.editor.introduction.label": "Introduction",
  "page.editor.introduction.placeholder": "Enter a brief introduction...",
  "page.editor.content.label": "Content",
  "page.editor.content.placeholder": "Enter your content here...",
  "page.editor.video.url.label": "Video URL",
  "page.editor.video.url.placeholder": "https://example.com/video.mp4",
  "page.editor.video.description.label": "Description",
  "page.editor.video.description.placeholder":
    "Describe what learners will see in this video...",
  "page.editor.quiz.question.label": "Question",
  "page.editor.quiz.option.label": "Option",
  "page.editor.quiz.option.placeholder": "Enter option {option}...",
  "page.editor.quiz.correct.label": "Correct Answer",
  "page.editor.quiz.correct.placeholder": "Select correct answer...",
  "page.editor.quiz.optionA": "Option A",
  "page.editor.quiz.optionB": "Option B",
  "page.editor.quiz.optionC": "Option C",
  "page.editor.quiz.optionD": "Option D",
  "page.editor.image.url.label": "Image URL",
  "page.editor.image.url.placeholder": "https://example.com/image.jpg",
  "page.editor.image.alt.label": "Alt Text",
  "page.editor.image.alt.placeholder":
    "Describe the image for accessibility...",
  "page.editor.image.caption.label": "Caption",
  "page.editor.image.caption.placeholder": "Optional caption or description...",
  "page.editor.generic.content.label": "Content (Generic)",
  "page.editor.generic.content.placeholder": "Edit content as JSON...",
  "page.editor.title.placeholder": "Enter page title...",
  "page.editor.status.draft": "Draft",
  "page.editor.status.published": "Published",
  "page.editor.modified.prefix": "Modified:",
};

const locales: Record<Locale, TranslationMap> = { en };

let currentLocale: Locale = "en";

export function setLocale(locale: Locale) {
  if (locales[locale]) currentLocale = locale;
}

export function t(key: string, fallback?: string): string {
  return locales[currentLocale][key] || fallback || key;
}

export function translateMenuName(name: string): string {
  switch (name) {
    case "File":
      return t("menu.file");
    case "Edit":
      return t("menu.edit");
    case "Insert":
      return t("menu.insert");
    case "Tools":
      return t("menu.tools");
    case "View":
      return t("menu.view");
    case "Help":
      return t("menu.help");
    default:
      return name;
  }
}
