/**
 * LayoutSelector
 *
 * Provides 8 preset layout options for page component arrangement.
 * Each layout prescribes column split and max component slots.
 */

import React from "react";
import "./LayoutSelector.css";

export interface LayoutPreset {
  id: string;
  name: string;
  description: string;
  columns: string; // CSS grid-template-columns value
  maxSlots: number;
  /** Visual ASCII representation */
  visual: string[];
}

export const LAYOUT_PRESETS: LayoutPreset[] = [
  {
    id: "single",
    name: "Single Column",
    description: "Full-width stacked components",
    columns: "1fr",
    maxSlots: 10,
    visual: ["████████"],
  },
  {
    id: "two-equal",
    name: "Two Equal Columns",
    description: "Side-by-side 50/50 split",
    columns: "1fr 1fr",
    maxSlots: 6,
    visual: ["████ ████"],
  },
  {
    id: "left-wide",
    name: "Left Wide",
    description: "Two thirds + one third",
    columns: "2fr 1fr",
    maxSlots: 6,
    visual: ["██████ ██"],
  },
  {
    id: "right-wide",
    name: "Right Wide",
    description: "One third + two thirds",
    columns: "1fr 2fr",
    maxSlots: 6,
    visual: ["██ ██████"],
  },
  {
    id: "three-equal",
    name: "Three Columns",
    description: "Equal three-column grid",
    columns: "1fr 1fr 1fr",
    maxSlots: 9,
    visual: ["██ ██ ██"],
  },
  {
    id: "sidebar-left",
    name: "Left Sidebar",
    description: "Narrow sidebar + main content",
    columns: "250px 1fr",
    maxSlots: 6,
    visual: ["█ ██████"],
  },
  {
    id: "sidebar-right",
    name: "Right Sidebar",
    description: "Main content + narrow sidebar",
    columns: "1fr 250px",
    maxSlots: 6,
    visual: ["██████ █"],
  },
  {
    id: "hero-below",
    name: "Hero + Content",
    description: "Full-width hero then two columns",
    columns: "1fr",
    maxSlots: 5,
    visual: ["████████", "████ ████"],
  },
];

interface LayoutSelectorProps {
  currentLayoutId: string;
  onChange: (layout: LayoutPreset) => void;
}

export const LayoutSelector: React.FC<LayoutSelectorProps> = React.memo(
  ({ currentLayoutId, onChange }) => {
    return (
      <div
        className="layout-selector"
        role="radiogroup"
        aria-label="Page layout"
      >
        <h4 className="layout-selector__title">Page Layout</h4>
        <div className="layout-selector__grid">
          {LAYOUT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              className={[
                "layout-selector__option",
                currentLayoutId === preset.id &&
                  "layout-selector__option--active",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onChange(preset)}
              role="radio"
              aria-checked={currentLayoutId === preset.id}
              aria-label={preset.name}
              title={preset.description}
            >
              <div className="layout-selector__visual">
                {preset.visual.map((row, i) => (
                  <div key={i} className="layout-selector__visual-row">
                    {row}
                  </div>
                ))}
              </div>
              <span className="layout-selector__name">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  },
);

LayoutSelector.displayName = "LayoutSelector";
