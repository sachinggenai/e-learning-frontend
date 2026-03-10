# Design Plan: Accessibility Templates

## Overview

The Accessibility category ensures inclusive learning delivery by providing templates that guide accessible usage, offer alternate language/caption support, and improve assistive technology compatibility.

- Category: `accessibility`
- Templates: 5
- Primary intent: inclusive UX and compliance support
- Completion capability: `view` and `interact` (template dependent)
- Standard target: WCAG 2.1 AA minimum

---

## Template 1: Accessibility Tip Card

### Purpose
Surface compact, actionable accessibility guidance within course flow.

### Preview UX
- Tip title and concise guidance
- Optional icon and severity/type badge
- Optional learn-more link

### Editor UX
- Tip text fields
- Category/type selector (vision/hearing/mobility/cognitive)
- Optional link and icon controls
- Display emphasis toggle

### Functional Requirements
- Short-form card rendering
- Optional dismiss/acknowledge behavior
- Reusable tip library support

### Data Contract
```ts
interface AccessibilityTipCardData {
  title: string;
  tip: string;
  category?: 'vision' | 'hearing' | 'mobility' | 'cognitive' | 'general';
  icon?: string;
  linkLabel?: string;
  linkUrl?: string;
  dismissible?: boolean;
}
```

### Interaction Events
- `tip_viewed`
- `tip_dismissed`
- `tip_link_clicked`

---

## Template 2: Keyboard Navigation Guide

### Purpose
Teach users keyboard shortcuts and tab flow for course controls.

### Preview UX
- Shortcut table/cards
- Key combo + action descriptions
- Practice mode toggle (optional)

### Editor UX
- Shortcut CRUD
- Grouping by context (global/editor/quiz/media)
- Practice mode toggle and hints

### Functional Requirements
- Display clear key-action mapping
- Support OS-specific labels (Ctrl vs Cmd)
- Optional interactive practice checks

### Data Contract
```ts
interface ShortcutItem {
  id: string;
  combo: string;
  action: string;
  context?: string;
}

interface KeyboardNavigationGuideData {
  title: string;
  intro?: string;
  shortcuts: ShortcutItem[];
  osMode?: 'auto' | 'windows' | 'mac';
  showPracticeMode?: boolean;
}
```

### Interaction Events
- `shortcut_viewed`
- `practice_mode_started`
- `practice_mode_completed`

---

## Template 3: Screen Reader Guide

### Purpose
Provide stepwise instructions for screen reader users to navigate learning content.

### Preview UX
- Intro and prerequisites
- Step list with expected output examples
- Assistive tool notes (NVDA/JAWS/VoiceOver)

### Editor UX
- Guide step CRUD
- Tool-specific notes
- Common issue FAQ entries
- Optional downloadable quick reference

### Functional Requirements
- Ordered instruction rendering
- Tool-specific conditional display
- Optional issue/solution accordions

### Data Contract
```ts
interface ScreenReaderStep {
  id: string;
  step: string;
  expectedResult?: string;
  toolNotes?: string;
}

interface ScreenReaderGuideData {
  title: string;
  intro?: string;
  steps: ScreenReaderStep[];
  supportedTools?: string[];
  troubleshooting?: Array<{ issue: string; fix: string }>;
}
```

### Interaction Events
- `sr_step_opened`
- `sr_tool_switched`
- `sr_guide_completed`

---

## Template 4: Language Selector

### Purpose
Allow learners to switch language/localization for content text and support materials.

### Preview UX
- Current language indicator
- Dropdown or segmented selector
- Confirmation hint for language changes

### Editor UX
- Language options CRUD
- Default language setting
- Fallback language configuration
- Label localization fields

### Functional Requirements
- Switch language state and persist preference
- Fallback handling for missing translations
- Optional RTL mode support

### Data Contract
```ts
interface LanguageOption {
  code: string; // e.g., en, es, ar
  label: string;
  rtl?: boolean;
}

interface LanguageSelectorData {
  title: string;
  options: LanguageOption[];
  defaultCode: string;
  fallbackCode?: string;
  persistPreference?: boolean;
}
```

### Interaction Events
- `language_changed`
- `language_fallback_used`

---

## Template 5: Transcript / Caption Page

### Purpose
Provide synchronized transcript/caption access for media-rich content.

### Preview UX
- Transcript text with timecodes
- Search/filter within transcript
- Optional click-to-seek timestamp links
- Caption download options

### Editor UX
- Transcript segment CRUD (time + text)
- Upload/import transcript
- Download format options (VTT/SRT/TXT)
- Sync enable toggle

### Functional Requirements
- Render transcript segments in chronological order
- Search highlights
- Optional media sync callbacks
- Multi-language transcript support

### Data Contract
```ts
interface TranscriptSegment {
  id: string;
  startTime: number; // seconds
  endTime?: number;
  text: string;
  speaker?: string;
}

interface TranscriptCaptionPageData {
  title: string;
  mediaId?: string;
  languageCode?: string;
  segments: TranscriptSegment[];
  searchable?: boolean;
  seekOnClick?: boolean;
  downloadableFormats?: Array<'txt' | 'srt' | 'vtt'>;
}
```

### Interaction Events
- `transcript_searched`
- `timestamp_clicked`
- `transcript_downloaded`

---

## Shared Design Guidance

### Theme Tokens
- `--theme-primary`
- `--theme-info`
- `--theme-success`
- `--theme-warning`
- `--theme-text`
- `--theme-text-secondary`
- `--theme-surface`
- `--theme-border`

### BEM Pattern
- `.tpl-{template}`
- `.tpl-{template}__{element}`
- `.tpl-{template}__{element}--{modifier}`

### Accessibility Requirements
- Full keyboard operability
- Proper heading hierarchy
- ARIA labels for controls and status changes
- Non-color cues for state/importance
- Minimum contrast ratio 4.5:1
- Focus-visible states across all components

### Responsive
- Desktop: side-by-side where content density allows
- Tablet: balanced two-column fallback
- Mobile: stacked controls with touch-safe targets (>= 44px)

---

## Suggested Registration Metadata

- `accessibility-tip-card` (icon: `lightbulb`)
- `keyboard-navigation-guide` (icon: `keyboard`)
- `screen-reader-guide` (icon: `audio-lines`)
- `language-selector` (icon: `languages`)
- `transcript-caption-page` (icon: `captions`)
