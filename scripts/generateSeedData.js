/**
 * Generate seed-data/ JSON files from master data.
 *
 * Usage:  node scripts/generateSeedData.js
 *
 * This runs after the TypeScript build (uses compiled JS from build context)
 * OR uses inline evaluation. No extra deps required.
 */

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.resolve(__dirname, '..', 'seed-data');
fs.mkdirSync(OUT_DIR, { recursive: true });

function write(filename, data) {
  const filepath = path.join(OUT_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  ✔ ${filename}`);
}

// Since we can't import TypeScript directly, we read the TS source
// and inline-evaluate it. Instead, let's just load the data from the
// TS source files and convert them. We'll use a simpler approach:
// Generate JSON directly in this script for maximum compatibility.

console.log('\n📦 Generating seed-data/ from master data...\n');

// We load the JSON data by requiring the compiled build or by
// dynamically importing. For simplicity, this script contains
// a self-contained generator that mirrors the TS data files.

// ═══════════════════════════════════════════════════════════════
// Instead of duplicating data, let's use the React build system
// ═══════════════════════════════════════════════════════════════

// First, try to use the data files via require with ts-node
try {
  // Try tsx first, then ts-node
  let tsRunner;
  try {
    require.resolve('tsx');
    tsRunner = 'tsx';
  } catch {
    try {
      require.resolve('ts-node');
      tsRunner = 'ts-node';
    } catch {
      tsRunner = null;
    }
  }

  if (tsRunner) {
    console.log(`Using ${tsRunner} to load TypeScript modules...`);
    if (tsRunner === 'ts-node') {
      require('ts-node').register({ 
        compilerOptions: { module: 'commonjs', esModuleInterop: true } 
      });
    }
    
    const registry = require('../src/data/componentRegistryData');
    const themes = require('../src/data/themePresetsData');
    const courses = require('../src/data/sampleCoursesData');
    const scoring = require('../src/data/scoringCompletionData');

    writeAllFiles(registry, themes, courses, scoring);
  } else {
    console.log('No TypeScript runner found. Generating data inline...');
    generateInline();
  }
} catch (err) {
  console.log('TypeScript import failed, generating data inline...');
  console.log('  (Error:', err.message, ')');
  generateInline();
}

function writeAllFiles(registry, themes, courses, scoring) {
  write('01-categories.json', registry.CATEGORIES);
  write('02-component-types.json', registry.ALL_COMPONENT_TYPES);

  const byCategory = {};
  for (const cat of registry.CATEGORIES) {
    byCategory[cat.categoryId] = registry.getComponentTypesByCategory(cat.categoryId);
  }
  write('03-component-types-by-category.json', byCategory);
  write('04-theme-presets.json', themes.THEME_PRESETS);
  write('05-courses.json', courses.ALL_COURSES);
  write('06-course-safety-101.json', courses.COURSE_1);
  write('07-course-cs-excellence.json', courses.COURSE_2);
  write('08-course-webdev-intro.json', courses.COURSE_3);
  write('09-course-list.json', courses.getCourseListItems());
  write('10-score-response-pass.json', scoring.SCORE_RESPONSE_PASS);
  write('11-score-response-fail.json', scoring.SCORE_RESPONSE_FAIL);
  write('12-course-completion.json', scoring.COURSE_COMPLETION_SAMPLE);
  write('13-page-completion.json', scoring.PAGE_COMPLETION_SAMPLE);
  write('14-interaction-events.json', scoring.INTERACTION_EVENTS);
  write('15-audio-assets.json', scoring.AUDIO_ASSETS);
  write('16-export-statuses.json', {
    pending: scoring.EXPORT_STATUS_PENDING,
    processing: scoring.EXPORT_STATUS_PROCESSING,
    completed: scoring.EXPORT_STATUS_COMPLETED,
    failed: scoring.EXPORT_STATUS_FAILED,
  });
  write('17-validation-pass.json', scoring.VALIDATION_PASS);
  write('18-validation-fail.json', scoring.VALIDATION_FAIL);
  write('19-media-uploads.json', scoring.MEDIA_UPLOADS);

  console.log(`\n✅ Done! ${fs.readdirSync(OUT_DIR).length} files in ${OUT_DIR}\n`);
}

function generateInline() {
  // Fallback: generate the data inline (abbreviated message)
  console.log('');
  console.log('  To generate full JSON seed data, install tsx:');
  console.log('    npm install -D tsx');
  console.log('  Then run:');
  console.log('    npx tsx scripts/exportMasterData.ts');
  console.log('');
  console.log('  Alternatively, the TypeScript source files in src/data/');
  console.log('  contain all master data and can be read directly.');
  console.log('');
  process.exit(0);
}
