# Design Plan: Compliance Templates

## Overview

The Compliance category enforces policy understanding, behavioral standards, and regulatory readiness. These templates prioritize verifiable acknowledgements, scenario-based judgment checks, and audit-ready records.

- Category: `compliance`
- Templates: 5
- Primary intent: policy adherence and risk reduction
- Completion capability: `interact`
- Audit requirement: timestamped evidence for key interactions

---

## Template 1: Policy Acknowledgement

### Purpose
Capture explicit learner acknowledgement for a policy document.

### Preview UX
- Policy header and body text
- Required acknowledgment checkbox
- Optional e-signature field
- Submission timestamp and acknowledgement status

### Editor UX
- Policy title/body
- Acknowledgement statement text
- Require signature toggle
- Confirmation message and legal footer

### Functional Requirements
- Require checkbox before submit
- Optional signature enforcement
- Persist acknowledgement evidence (`userId`, `timestamp`, `policyVersion`)
- Lock after submission (optional admin override)

### Data Contract
```ts
interface PolicyAcknowledgementRecord {
  userId: string;
  acknowledged: boolean;
  signature?: string;
  submittedAt: string; // ISO
  policyVersion: string;
}

interface PolicyAcknowledgementData {
  title: string;
  policyText: string;
  policyVersion: string;
  acknowledgementLabel: string;
  requireSignature?: boolean;
  record?: PolicyAcknowledgementRecord;
}
```

### Interaction Events
- `policy_viewed`
- `acknowledgement_checked`
- `policy_submitted`

---

## Template 2: Do's and Don'ts

### Purpose
Present acceptable vs prohibited behaviors with clear contrast and practical examples.

### Preview UX
- Side-by-side or stacked sections: Do and Do Not
- Icon-led entries
- Optional rationale/tooltips per item

### Editor UX
- Do-item and do-not-item CRUD
- Category grouping
- Layout mode (columns/stacked)
- Optional examples and references

### Functional Requirements
- At least one item in each section
- Optional mapping to policy references
- Optional acknowledgment per section

### Data Contract
```ts
interface DosDontsItem {
  id: string;
  text: string;
  rationale?: string;
  reference?: string;
}

interface DosAndDontsData {
  title: string;
  dos: DosDontsItem[];
  donts: DosDontsItem[];
  layout?: 'columns' | 'stacked';
}
```

### Interaction Events
- `dos_section_viewed`
- `donts_section_viewed`
- `item_expanded`

---

## Template 3: Code of Conduct

### Purpose
Deliver organization behavior principles in structured sections with comprehension checks.

### Preview UX
- Section navigation (tabs/accordion)
- Key principles and examples
- Optional quick-check questions

### Editor UX
- Section CRUD with ordering
- Principle cards within sections
- Optional quiz block configuration
- Completion gating toggle

### Functional Requirements
- Structured multi-section reading flow
- Optional completion gate requiring all sections viewed
- Optional quiz pass threshold

### Data Contract
```ts
interface ConductPrinciple {
  id: string;
  title: string;
  description: string;
  example?: string;
}

interface ConductSection {
  id: string;
  title: string;
  principles: ConductPrinciple[];
}

interface CodeOfConductData {
  title: string;
  sections: ConductSection[];
  requireAllSectionsViewed?: boolean;
  quickCheckEnabled?: boolean;
}
```

### Interaction Events
- `conduct_section_opened`
- `principle_viewed`
- `conduct_completed`

---

## Template 4: Regulatory Scenario

### Purpose
Assess judgment using realistic compliance scenarios and decision options.

### Preview UX
- Scenario narrative
- Response choices
- Immediate feedback and explanation
- Optional retry state and attempt counter

### Editor UX
- Scenario prompt editor
- Choice CRUD with correct answer flag
- Explanation and remediation text
- Retry/attempt configuration

### Functional Requirements
- Single or multi-choice mode
- Immediate correctness feedback
- Attempt tracking
- Optional pass requirement

### Data Contract
```ts
interface RegulatoryChoice {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback?: string;
}

interface RegulatoryScenarioData {
  title: string;
  scenarioText: string;
  choices: RegulatoryChoice[];
  explanation?: string;
  maxAttempts?: number;
  requireCorrectToComplete?: boolean;
}
```

### Interaction Events
- `scenario_answered`
- `scenario_retry`
- `scenario_completed`

---

## Template 5: Audit Checklist

### Purpose
Provide a verifiable checklist flow for operational compliance signoff.

### Preview UX
- Checklist items with required markers
- Item-level notes and evidence links
- Overall completion summary
- Audit trail panel

### Editor UX
- Checklist item CRUD
- Required vs optional toggles
- Evidence requirement settings
- Export settings (CSV/PDF)

### Functional Requirements
- Required item validation
- Item completion timestamps
- Optional reviewer notes/evidence URL
- Export-ready audit log

### Data Contract
```ts
interface AuditChecklistItem {
  id: string;
  label: string;
  required: boolean;
  completed: boolean;
  notes?: string;
  evidenceUrl?: string;
  completedAt?: string; // ISO
}

interface AuditChecklistData {
  title: string;
  items: AuditChecklistItem[];
  completionPct: number;
  reviewerName?: string;
  reviewedAt?: string; // ISO
}
```

### Interaction Events
- `checklist_item_toggled`
- `checklist_note_added`
- `checklist_submitted`

---

## Shared Design System Guidance

### Theme Tokens
- `--theme-primary`
- `--theme-success`
- `--theme-warning`
- `--theme-error`
- `--theme-surface`
- `--theme-border`
- `--theme-text`
- `--theme-text-secondary`

### BEM Naming
- `.tpl-{template}`
- `.tpl-{template}__{element}`
- `.tpl-{template}__{element}--{modifier}`

### Visual Rules
- Compliance-critical actions should remain prominent and unambiguous
- Use explicit labels for required items
- Show legal copy in readable but secondary style
- Keep status chips consistent (`required`, `pending`, `approved`)

### Accessibility
- Clear checkbox labels and instructions
- Keyboard-only completion for all controls
- Error messages tied to fields
- Screen-reader friendly status updates

### Responsive
- Desktop: side panels for evidence and audit log
- Tablet: stacked sections
- Mobile: single-column with sticky action footer for submit

---

## Suggested Registration Metadata

- `policy-acknowledgement` (icon: `badge-check`)
- `dos-and-donts` (icon: `list-checks`)
- `code-of-conduct` (icon: `shield-check`)
- `regulatory-scenario` (icon: `gavel`)
- `audit-checklist` (icon: `clipboard-list`)
