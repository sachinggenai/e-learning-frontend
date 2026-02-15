/**
 * ComponentRegistry — Singleton registry for all component types.
 *
 * Design Principles:
 * - Open/Closed: New component types register themselves; registry code never changes.
 * - Single Responsibility: Only handles registration, lookup, and search.
 * - Interface Segregation: Consumers use narrow query methods (get, getByCategory, search).
 * - Dependency Inversion: Components depend on ComponentDefinition interface, not concrete classes.
 */

import {
  ComponentDefinition,
  CategoryDefinition,
  RegistrySearchParams,
  RegistrySearchResult,
} from '../../types/registry';

class ComponentRegistry {
  private components = new Map<string, ComponentDefinition>();
  private categories = new Map<string, CategoryDefinition>();
  private categoryComponents = new Map<string, Set<string>>(); // categoryId → Set<typeId>

  // ─── Registration ────────────────────────────────────────────

  /**
   * Register a component type. Idempotent — re-registration overwrites.
   * Called by each component module at import time (self-registration pattern).
   */
  register(definition: ComponentDefinition): void {
    this.components.set(definition.typeId, definition);

    // Track category membership
    if (!this.categoryComponents.has(definition.category)) {
      this.categoryComponents.set(definition.category, new Set());
    }
    this.categoryComponents.get(definition.category)!.add(definition.typeId);
  }

  /**
   * Register a category definition.
   */
  registerCategory(category: CategoryDefinition): void {
    this.categories.set(category.categoryId, category);
  }

  /**
   * Bulk-register multiple categories at once.
   */
  registerCategories(categories: CategoryDefinition[]): void {
    categories.forEach((cat) => this.registerCategory(cat));
  }

  // ─── Lookup ──────────────────────────────────────────────────

  /**
   * Get a component definition by typeId.
   * Returns undefined if not registered.
   */
  get(typeId: string): ComponentDefinition | undefined {
    return this.components.get(typeId);
  }

  /**
   * Get a component definition or throw if not found.
   * Use when you know the component must exist (e.g., rendering).
   */
  getOrThrow(typeId: string): ComponentDefinition {
    const def = this.components.get(typeId);
    if (!def) {
      throw new Error(
        `Component type "${typeId}" is not registered. ` +
        `Available types: ${Array.from(this.components.keys()).join(', ')}`
      );
    }
    return def;
  }

  /**
   * Check if a component type is registered.
   */
  has(typeId: string): boolean {
    return this.components.has(typeId);
  }

  /**
   * Get the React component for rendering in editor mode.
   */
  getEditor(typeId: string): ComponentDefinition['editorComponent'] | undefined {
    return this.components.get(typeId)?.editorComponent;
  }

  /**
   * Get the React component for rendering in preview/player mode.
   */
  getPreview(typeId: string): ComponentDefinition['previewComponent'] | undefined {
    return this.components.get(typeId)?.previewComponent;
  }

  // ─── Category Queries ────────────────────────────────────────

  /**
   * Get all component definitions in a category, sorted by sortOrder.
   */
  getByCategory(categoryId: string): ComponentDefinition[] {
    const typeIds = this.categoryComponents.get(categoryId);
    if (!typeIds) return [];

    return Array.from(typeIds)
      .map((id) => this.components.get(id)!)
      .filter(Boolean)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  /**
   * Get all registered categories, sorted by sortOrder.
   */
  getCategories(): CategoryDefinition[] {
    return Array.from(this.categories.values()).sort(
      (a, b) => a.sortOrder - b.sortOrder
    );
  }

  /**
   * Get a category definition by ID.
   */
  getCategory(categoryId: string): CategoryDefinition | undefined {
    return this.categories.get(categoryId);
  }

  // ─── Search ──────────────────────────────────────────────────

  /**
   * Search components by text query across displayName, description, tags.
   * Supports optional category filter and scoring filter.
   */
  search(params: RegistrySearchParams): RegistrySearchResult {
    let results = Array.from(this.components.values());

    // Filter by category
    if (params.category) {
      results = results.filter((c) => c.category === params.category);
    }

    // Filter by scoring enabled
    if (params.scoringEnabled !== undefined) {
      results = results.filter((c) => c.scoringEnabled === params.scoringEnabled);
    }

    // Filter by tags
    if (params.tags && params.tags.length > 0) {
      const searchTags = params.tags.map((t) => t.toLowerCase());
      results = results.filter((c) =>
        searchTags.some((tag) => c.tags.some((ct) => ct.toLowerCase().includes(tag)))
      );
    }

    // Text search
    if (params.query) {
      const q = params.query.toLowerCase();
      results = results.filter(
        (c) =>
          c.displayName.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)) ||
          c.typeId.toLowerCase().includes(q)
      );
    }

    // Sort by category sortOrder then component sortOrder
    results.sort((a, b) => {
      const catA = this.categories.get(a.category)?.sortOrder ?? 0;
      const catB = this.categories.get(b.category)?.sortOrder ?? 0;
      if (catA !== catB) return catA - catB;
      return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    });

    return { items: results, total: results.length };
  }

  // ─── Utility ─────────────────────────────────────────────────

  /**
   * Get all registered component definitions.
   */
  getAll(): ComponentDefinition[] {
    return Array.from(this.components.values());
  }

  /**
   * Get count of registered components.
   */
  get size(): number {
    return this.components.size;
  }

  /**
   * Clear all registrations (for testing).
   */
  clear(): void {
    this.components.clear();
    this.categories.clear();
    this.categoryComponents.clear();
  }
}

export default ComponentRegistry;
