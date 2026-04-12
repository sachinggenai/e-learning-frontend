/**
 * ComponentPicker — Modal for selecting and adding components to a page.
 *
 * UX Features:
 * - Category tabs on the left for filtering
 * - Component grid on the right with cards
 * - Search bar with real-time filtering
 * - Keyboard navigation (Tab, Escape, Enter)
 * - Focus trap within modal
 * - ARIA labels for accessibility
 */

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  Accessibility,
  Activity,
  Award,
  BarChart3,
  Box,
  Brain,
  CheckSquare,
  Columns,
  Film,
  GitBranch,
  Layout,
  LayoutGrid,
  Map as MapIcon,
  MessageCircle,
  MousePointer,
  MousePointerClick,
  Navigation,
  PlayCircle,
  Route,
  Search,
  Shield,
  ShieldCheck,
  Trophy,
  Users,
  Wrench,
  X,
  Zap,
  Eye,
  LucideIcon,
} from 'lucide-react';
import { registry } from './registry';
import { ComponentDefinition, CategoryDefinition } from '../types/registry';
import './ComponentPicker.css';

interface ComponentPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (definition: ComponentDefinition) => void;
}

const ComponentPicker: React.FC<ComponentPickerProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Get categories from registry
  const categories = useMemo(() => registry.getCategories(), []);

  // Filter components based on search and category
  const filteredComponents = useMemo(() => {
    const result = registry.search({
      query: searchQuery || undefined,
      category: selectedCategory || undefined,
    });
    return result.items;
  }, [searchQuery, selectedCategory]);

  // Group filtered results by category for display
  const groupedComponents = useMemo(() => {
    const groups = new Map<string, ComponentDefinition[]>();
    filteredComponents.forEach((comp) => {
      if (!groups.has(comp.category)) {
        groups.set(comp.category, []);
      }
      groups.get(comp.category)!.push(comp);
    });
    return groups;
  }, [filteredComponents]);

  // Focus search on open
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => searchRef.current?.focus());
    } else {
      setSearchQuery('');
      setSelectedCategory(null);
    }
  }, [isOpen]);

  // Keyboard handling
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const modal = modalRef.current;
    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    modal.addEventListener('keydown', trap);
    return () => modal.removeEventListener('keydown', trap);
  }, [isOpen, filteredComponents]);

  const handleSelect = useCallback(
    (def: ComponentDefinition) => {
      onSelect(def);
      onClose();
    },
    [onSelect, onClose]
  );

  const handleCategoryClick = useCallback((categoryId: string) => {
    setSelectedCategory((prev) => (prev === categoryId ? null : categoryId));
  }, []);

  if (!isOpen) return null;

  return (
    <div className="component-picker__overlay" onClick={onClose} role="presentation">
      <div
        ref={modalRef}
        className="component-picker"
        role="dialog"
        aria-modal="true"
        aria-label="Add Component"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="component-picker__header">
          <h2 className="component-picker__title">Add Component</h2>
          <button
            className="component-picker__close"
            onClick={onClose}
            aria-label="Close component picker"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="component-picker__search">
          <Search size={16} className="component-picker__search-icon" aria-hidden="true" />
          <input
            ref={searchRef}
            type="text"
            className="component-picker__search-input"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search components"
          />
          {searchQuery && (
            <button
              className="component-picker__search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="component-picker__body">
          {/* Category sidebar */}
          <nav className="component-picker__categories" aria-label="Component categories">
            <button
              className={`component-picker__category-btn ${!selectedCategory ? 'component-picker__category-btn--active' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              All ({registry.size})
            </button>
            {categories.map((cat: CategoryDefinition) => {
              const count = registry.getByCategory(cat.categoryId).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat.categoryId}
                  className={`component-picker__category-btn ${selectedCategory === cat.categoryId ? 'component-picker__category-btn--active' : ''}`}
                  onClick={() => handleCategoryClick(cat.categoryId)}
                  aria-pressed={selectedCategory === cat.categoryId}
                >
                  <span className="component-picker__category-name">{cat.displayName}</span>
                  <span className="component-picker__category-count">{count}</span>
                </button>
              );
            })}
          </nav>

          {/* Component grid */}
          <div className="component-picker__grid" role="list">
            {filteredComponents.length === 0 ? (
              <div className="component-picker__empty">
                <p>No components found{searchQuery ? ` for "${searchQuery}"` : ''}.</p>
              </div>
            ) : selectedCategory ? (
              // Single category view
              filteredComponents.map((comp) => (
                <ComponentCard key={comp.typeId} definition={comp} onSelect={handleSelect} />
              ))
            ) : (
              // All categories view (grouped)
              Array.from(groupedComponents.entries()).map(([categoryId, components]) => {
                const cat = registry.getCategory(categoryId);
                return (
                  <div key={categoryId} className="component-picker__category-group">
                    <h3 className="component-picker__category-title">
                      {cat?.displayName || categoryId}
                    </h3>
                    <div className="component-picker__category-grid">
                      {components.map((comp) => (
                        <ComponentCard key={comp.typeId} definition={comp} onSelect={handleSelect} />
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ComponentCard ─────────────────────────────────────────────
interface ComponentCardProps {
  definition: ComponentDefinition;
  onSelect: (def: ComponentDefinition) => void;
}

const ComponentCard: React.FC<ComponentCardProps> = React.memo(({ definition, onSelect }) => {
  const category = registry.getCategory(definition.category);
  const iconKey = definition.icon || category?.icon;
  const CategoryIcon = resolveCategoryIcon(iconKey, definition.category);

  return (
    <button
      className="component-card"
      onClick={() => onSelect(definition)}
      role="listitem"
      aria-label={`Add ${definition.displayName}: ${definition.description}`}
    >
      <div className="component-card__header">
        <span className="component-card__icon" aria-hidden="true">
          <CategoryIcon size={18} />
        </span>
        <span className="component-card__name">{definition.displayName}</span>
      </div>
      <p className="component-card__description">{definition.description}</p>
      <div className="component-card__badges">
        {definition.scoringEnabled && (
          <span className="component-card__badge component-card__badge--scoring">Scored</span>
        )}
        {definition.completionCapabilities.includes('audio') && (
          <span className="component-card__badge component-card__badge--audio">Audio</span>
        )}
        {definition.completionCapabilities.includes('interact') && (
          <span className="component-card__badge component-card__badge--interact">Interactive</span>
        )}
      </div>
    </button>
  );
});
ComponentCard.displayName = 'ComponentCard';

const iconByName: Record<string, LucideIcon> = {
  // Backend category icon aliases
  'layout': Layout,
  'layout-grid': LayoutGrid,
  'git-branch': GitBranch,
  'mouse-pointer': MousePointer,
  'mouse-pointer-click': MousePointerClick,
  'map': MapIcon,
  'route': Route,
  'check-square': CheckSquare,
  'columns': Columns,
  'film': Film,
  'play-circle': PlayCircle,
  'navigation': Navigation,
  'award': Award,
  'shield': Shield,
  'shield-check': ShieldCheck,
  'activity': Activity,
  'tool': Wrench,
  'wrench': Wrench,
  'message-circle': MessageCircle,
  'users': Users,
  'accessibility': Accessibility,
  'eye': Eye,
  'bar-chart': BarChart3,
  'bar-chart-3': BarChart3,
  'brain': Brain,
  'trophy': Trophy,
  'zap': Zap,
};

const iconByCategory: Record<string, LucideIcon> = {
  'content-presentation': LayoutGrid,
  'process-flow': GitBranch,
  'interaction': MousePointerClick,
  'scenario': Route,
  'assessment': CheckSquare,
  'comparison': Columns,
  'media-rich': Film,
  'microlearning': Zap,
  'navigation': MapIcon,
  'gamification': Trophy,
  'compliance': ShieldCheck,
  'diagnostic': Brain,
  'practice': Wrench,
  'feedback': MessageCircle,
  'social': Users,
  'accessibility': Accessibility,
  'analytics': BarChart3,
};

function resolveCategoryIcon(iconName: string | undefined, categoryId: string) {
  if (iconName && iconByName[iconName]) return iconByName[iconName];
  return iconByCategory[categoryId] || Box;
}

export default ComponentPicker;
