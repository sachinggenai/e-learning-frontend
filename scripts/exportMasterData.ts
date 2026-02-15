/**
 * Export Master Data as JSON Files
 *
 * Run: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/exportMasterData.ts
 * Or:  npx tsx scripts/exportMasterData.ts
 *
 * Output: seed-data/ folder with JSON files ready for backend DB import.
 */

import * as fs from 'fs';
import * as path from 'path';

// We use require to avoid ESM issues in ts-node
/* eslint-disable @typescript-eslint/no-var-requires */

const OUT_DIR = path.resolve(__dirname, '..', 'seed-data');

function write(filename: string, data: any) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const filepath = path.join(OUT_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  ✔ ${filepath}`);
}

async function main() {
  // Dynamic import for the data modules
  const registry = await import('../src/data/componentRegistryData');
  const themes = await import('../src/data/themePresetsData');
  const courses = await import('../src/data/sampleCoursesData');
  const scoring = await import('../src/data/scoringCompletionData');

  console.log('\n📦 Exporting master data to seed-data/ ...\n');

  // ── 1. Component Categories ──────────────────────
  write('01-categories.json', registry.CATEGORIES);

  // ── 2. All 89 Component Types (full detail) ──────
  write('02-component-types.json', registry.ALL_COMPONENT_TYPES);

  // ── 3. Component Types grouped by category ───────
  const byCategory: Record<string, any[]> = {};
  for (const cat of registry.CATEGORIES) {
    byCategory[cat.categoryId] = registry.getComponentTypesByCategory(cat.categoryId);
  }
  write('03-component-types-by-category.json', byCategory);

  // ── 4. Theme Presets ─────────────────────────────
  write('04-theme-presets.json', themes.THEME_PRESETS);

  // ── 5. Sample Courses (full) ─────────────────────
  write('05-courses.json', courses.ALL_COURSES);

  // ── 6. Individual courses ────────────────────────
  write('06-course-safety-101.json', courses.COURSE_1);
  write('07-course-cs-excellence.json', courses.COURSE_2);
  write('08-course-webdev-intro.json', courses.COURSE_3);

  // ── 7. Course List Items (summary) ───────────────
  write('09-course-list.json', courses.getCourseListItems());

  // ── 8. Scoring samples ──────────────────────────
  write('10-score-response-pass.json', scoring.SCORE_RESPONSE_PASS);
  write('11-score-response-fail.json', scoring.SCORE_RESPONSE_FAIL);

  // ── 9. Completion samples ───────────────────────
  write('12-course-completion.json', scoring.COURSE_COMPLETION_SAMPLE);
  write('13-page-completion.json', scoring.PAGE_COMPLETION_SAMPLE);

  // ── 10. Interaction events ──────────────────────
  write('14-interaction-events.json', scoring.INTERACTION_EVENTS);

  // ── 11. Audio assets ────────────────────────────
  write('15-audio-assets.json', scoring.AUDIO_ASSETS);

  // ── 12. Export status samples ───────────────────
  write('16-export-statuses.json', {
    pending: scoring.EXPORT_STATUS_PENDING,
    processing: scoring.EXPORT_STATUS_PROCESSING,
    completed: scoring.EXPORT_STATUS_COMPLETED,
    failed: scoring.EXPORT_STATUS_FAILED,
  });

  // ── 13. Validation samples ─────────────────────
  write('17-validation-pass.json', scoring.VALIDATION_PASS);
  write('18-validation-fail.json', scoring.VALIDATION_FAIL);

  // ── 14. Media uploads ──────────────────────────
  write('19-media-uploads.json', scoring.MEDIA_UPLOADS);

  console.log(`\n✅ Done! ${fs.readdirSync(OUT_DIR).length} files written to ${OUT_DIR}\n`);
}

main().catch(err => {
  console.error('❌ Export failed:', err);
  process.exit(1);
});
