/**
 * Component Registry — Public API
 *
 * Exports the singleton registry instance and category definitions.
 * Import this module to access `registry.get()`, `registry.search()`, etc.
 */

import ComponentRegistry from './ComponentRegistry';
import { CategoryDefinition } from '../../types/registry';

// ─── Category Definitions (17 categories) ────────────────────────
export const CATEGORIES: CategoryDefinition[] = [
  { categoryId: 'content-presentation', displayName: 'Content Presentation', description: 'Display content in interactive layouts', icon: 'layout-grid', sortOrder: 1 },
  { categoryId: 'process-flow', displayName: 'Process & Flow', description: 'Step-by-step processes and flow diagrams', icon: 'git-branch', sortOrder: 2 },
  { categoryId: 'interaction', displayName: 'Interaction', description: 'Interactive engagement components', icon: 'mouse-pointer-click', sortOrder: 3 },
  { categoryId: 'scenario', displayName: 'Scenario-Based', description: 'Scenario and branching exercises', icon: 'route', sortOrder: 4 },
  { categoryId: 'assessment', displayName: 'Assessment', description: 'Quizzes, tests, and graded activities', icon: 'clipboard-check', sortOrder: 5 },
  { categoryId: 'comparison', displayName: 'Comparison & Analysis', description: 'Compare and analyze information', icon: 'columns', sortOrder: 6 },
  { categoryId: 'media-rich', displayName: 'Media-Rich', description: 'Video, audio, and rich media content', icon: 'play-circle', sortOrder: 7 },
  { categoryId: 'microlearning', displayName: 'Microlearning', description: 'Bite-sized learning chunks', icon: 'zap', sortOrder: 8 },
  { categoryId: 'navigation', displayName: 'Navigation & Structural', description: 'Course structure and navigation', icon: 'map', sortOrder: 9 },
  { categoryId: 'gamification', displayName: 'Gamification', description: 'Game-based learning elements', icon: 'trophy', sortOrder: 10 },
  { categoryId: 'compliance', displayName: 'Compliance & Corporate', description: 'Compliance and policy templates', icon: 'shield-check', sortOrder: 11 },
  { categoryId: 'diagnostic', displayName: 'Diagnostic & Adaptive', description: 'Assessments that adapt to learner', icon: 'brain', sortOrder: 12 },
  { categoryId: 'practice', displayName: 'Practice & Simulation', description: 'Hands-on practice activities', icon: 'wrench', sortOrder: 13 },
  { categoryId: 'feedback', displayName: 'Feedback & Reflection', description: 'Reflection and self-assessment', icon: 'message-circle', sortOrder: 14 },
  { categoryId: 'social', displayName: 'Social & Collaborative', description: 'Discussion and peer activities', icon: 'users', sortOrder: 15 },
  { categoryId: 'accessibility', displayName: 'Accessibility & Support', description: 'Accessibility guidance and support', icon: 'accessibility', sortOrder: 16 },
  { categoryId: 'analytics', displayName: 'Analytics & Learning Insight', description: 'Progress tracking and reports', icon: 'bar-chart-3', sortOrder: 17 },
];

// ─── Singleton Instance ──────────────────────────────────────────
const registry = new ComponentRegistry();

// Initialise categories
registry.registerCategories(CATEGORIES);

export { registry, ComponentRegistry };
export type { CategoryDefinition };
