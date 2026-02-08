# Template Engine - Frontend Requirements Specification
**Version**: 1.0 | **Date**: February 2026 | **Status**: Draft

## 1. Executive Summary
This document specifies frontend architecture changes to implement the Template Engine. Key deliverables: Component Registry system, composable page builder, theming engine, audio integration, and completion/scoring UI.

## 2. Current State Analysis
| Area | Current | Gap |
|------|---------|-----|
| Template Types | 5 hardcoded in switch statements | No registry, not extensible |
| Page Composition | 1 template per page | Cannot combine components |
| Component Library | None (inline JSX) | No reusable design system |
| Theming | `settings.theme` stored, unused | No CSS variables, no provider |
| Audio | Upload only | No player, no completion tracking |
| Completion | Boolean `completed[]` array | No interaction tracking |
| Scoring | None | No quiz scoring UI |

## 3. Component Registry Architecture
- Registry pattern for all template/component types
- Self-registration by each component
- Category-based organization

## 4. Page Composition System
- Multi-component pages
- Drag-and-drop reordering
- Dynamic component renderer
- Component picker modal

## 5. Theming System
- Theme provider/context
- CSS variable injection
- Theme editor UI (layout + color system)

## 6. Audio Integration
- Audio player component
- Audio config panel in editor
- Audio completion tracking

## 7. Completion Tracking System
- Completion context/provider
- Page wrapper with completion logic
- Component completion wrappers

## 8. Scoring UI
- Quiz feedback display
- Course score summary

## 9. Redux State Updates
- Editor slice: add component-level actions, completion state
- Course slice: theme, scoring config

## 10. Transform Layer Updates
- Transform component arrays for backend
- Map legacy templates to new structure

## 11. Implementation Phases
- Phase 1: Registry, theming foundation
- Phase 2: Composition, layout
- Phase 3: Audio, completion
- Phase 4: Scoring
- Phase 5: Full template library
