/**
 * Scoring, Completion & Interaction Master Data
 *
 * Pre-built mock API responses for:
 * - Score calculation
 * - Course / page completion status
 * - Interaction event history
 * - Audio asset metadata
 * - Export status
 * - Validation
 */

import type {
  ScoreCalculateResponse,
  CourseCompletionResponse,
  PageCompletionResponse,
  InteractionEvent,
  AudioAssetResponse,
  ExportStatusResponse,
  CourseValidationResponse,
  MediaUploadResponse,
} from '../types/course';

// ═══════════════════════════════════════════════════════════════════
// Score Calculation Responses
// ═══════════════════════════════════════════════════════════════════

export const SCORE_RESPONSE_PASS: ScoreCalculateResponse = {
  totalScore: 82,
  maxScore: 100,
  percentage: 82,
  passed: true,
  passingScore: 70,
  attemptNumber: 1,
  remainingAttempts: 2,
  componentResults: [
    {
      componentId: 'c1-04-02',
      componentType: 'scenario',
      score: 10,
      maxScore: 10,
      weight: 1,
      weightedScore: 10,
      questionResults: [
        { questionId: 'opt-2', correct: true, score: 10, maxScore: 10, partialCredit: false },
      ],
    },
    {
      componentId: 'c1-05-01',
      componentType: 'knowledge-check',
      score: 20,
      maxScore: 20,
      weight: 1,
      weightedScore: 20,
      questionResults: [
        { questionId: 'kc-q1', correct: true, score: 10, maxScore: 10, partialCredit: false },
        { questionId: 'kc-q2', correct: true, score: 10, maxScore: 10, partialCredit: false },
      ],
    },
    {
      componentId: 'c1-06-01',
      componentType: 'final-assessment',
      score: 42,
      maxScore: 50,
      weight: 2,
      weightedScore: 84,
      questionResults: [
        { questionId: 'fa-q1', correct: true, score: 10, maxScore: 10, partialCredit: false },
        { questionId: 'fa-q2', correct: true, score: 10, maxScore: 10, partialCredit: false },
        { questionId: 'fa-q3', correct: true, score: 10, maxScore: 10, partialCredit: false },
        { questionId: 'fa-q4', correct: true, score: 10, maxScore: 10, partialCredit: false },
        { questionId: 'fa-q5', correct: false, score: 0, maxScore: 10, partialCredit: false },
      ],
    },
  ],
};

export const SCORE_RESPONSE_FAIL: ScoreCalculateResponse = {
  totalScore: 35,
  maxScore: 100,
  percentage: 35,
  passed: false,
  passingScore: 70,
  attemptNumber: 1,
  remainingAttempts: 2,
  componentResults: [
    {
      componentId: 'c1-06-01',
      componentType: 'final-assessment',
      score: 20,
      maxScore: 50,
      weight: 2,
      weightedScore: 40,
      questionResults: [
        { questionId: 'fa-q1', correct: true, score: 10, maxScore: 10, partialCredit: false },
        { questionId: 'fa-q2', correct: false, score: 0, maxScore: 10, partialCredit: false },
        { questionId: 'fa-q3', correct: false, score: 0, maxScore: 10, partialCredit: false },
        { questionId: 'fa-q4', correct: true, score: 10, maxScore: 10, partialCredit: false },
        { questionId: 'fa-q5', correct: false, score: 0, maxScore: 10, partialCredit: false },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════
// Completion Responses
// ═══════════════════════════════════════════════════════════════════

export const PAGE_COMPLETION_SAMPLE: PageCompletionResponse = {
  pageId: 'p1-02',
  title: 'Hazard Identification',
  completed: true,
  strategy: 'all',
  components: [
    { componentId: 'c1-02-01', completed: true, completionType: 'interact' },
    { componentId: 'c1-02-02', completed: true, completionType: 'interact' },
    { componentId: 'c1-02-03', completed: true, completionType: 'view' },
  ],
};

export const COURSE_COMPLETION_SAMPLE: CourseCompletionResponse = {
  courseId: 'course-safety-101',
  status: 'in-progress',
  overallProgress: 57,
  pages: [
    {
      pageId: 'p1-01', title: 'Welcome to Workplace Safety', completed: true, strategy: 'all',
      components: [
        { componentId: 'c1-01-01', completed: true, completionType: 'view' },
        { componentId: 'c1-01-02', completed: true, completionType: 'view' },
        { componentId: 'c1-01-03', completed: true, completionType: 'view' },
      ],
    },
    {
      pageId: 'p1-02', title: 'Hazard Identification', completed: true, strategy: 'all',
      components: [
        { componentId: 'c1-02-01', completed: true, completionType: 'interact' },
        { componentId: 'c1-02-02', completed: true, completionType: 'interact' },
        { componentId: 'c1-02-03', completed: true, completionType: 'view' },
      ],
    },
    {
      pageId: 'p1-03', title: 'Personal Protective Equipment (PPE)', completed: true, strategy: 'all',
      components: [
        { componentId: 'c1-03-01', completed: true, completionType: 'interact' },
        { componentId: 'c1-03-02', completed: true, completionType: 'view' },
      ],
    },
    {
      pageId: 'p1-04', title: 'Emergency Procedures', completed: true, strategy: 'all',
      components: [
        { componentId: 'c1-04-01', completed: true, completionType: 'interact' },
        { componentId: 'c1-04-02', completed: true, completionType: 'score', threshold: 80 },
      ],
    },
    {
      pageId: 'p1-05', title: 'Knowledge Check', completed: false, strategy: 'all',
      components: [
        { componentId: 'c1-05-01', completed: false, completionType: 'score', threshold: 50 },
      ],
    },
    {
      pageId: 'p1-06', title: 'Final Assessment', completed: false, strategy: 'all',
      components: [
        { componentId: 'c1-06-01', completed: false, completionType: 'score', threshold: 70 },
      ],
    },
    {
      pageId: 'p1-07', title: 'Course Complete', completed: false, strategy: 'all',
      components: [
        { componentId: 'c1-07-01', completed: false, completionType: 'view' },
        { componentId: 'c1-07-02', completed: false, completionType: 'interact' },
        { componentId: 'c1-07-03', completed: false, completionType: 'view' },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════
// Interaction Events
// ═══════════════════════════════════════════════════════════════════

export const INTERACTION_EVENTS: InteractionEvent[] = [
  { pageId: 'p1-01', componentId: 'c1-01-01', interactionType: 'view', completed: true },
  { pageId: 'p1-02', componentId: 'c1-02-01', interactionType: 'click', data: { interactionId: 'tab-chemical', value: 'Chemical Hazards' }, completed: true },
  { pageId: 'p1-02', componentId: 'c1-02-02', interactionType: 'click', data: { interactionId: 'hs-1', value: 'Wet Floor' }, completed: false },
  { pageId: 'p1-02', componentId: 'c1-02-02', interactionType: 'click', data: { interactionId: 'hs-2', value: 'Unsecured Shelf' }, completed: false },
  { pageId: 'p1-02', componentId: 'c1-02-02', interactionType: 'click', data: { interactionId: 'hs-3', value: 'Blocked Exit' }, completed: false },
  { pageId: 'p1-02', componentId: 'c1-02-02', interactionType: 'click', data: { interactionId: 'hs-4', value: 'Frayed Wire' }, completed: true },
  { pageId: 'p1-04', componentId: 'c1-04-02', interactionType: 'submit', data: { interactionId: 'opt-2', value: 'Pull the fire alarm', score: 10, maxScore: 10, isCorrect: true }, completed: true },
  { pageId: 'p1-02', componentId: 'c1-02-01', interactionType: 'audio-play', data: { interactionId: 'audio-hazards', duration: 120 }, completed: false },
  { pageId: 'p1-02', componentId: 'c1-02-01', interactionType: 'audio-complete', data: { interactionId: 'audio-hazards', duration: 120 }, completed: true },
  { pageId: 'p2-02', componentId: 'c2-02-02', interactionType: 'click', data: { interactionId: 'fc-1' }, completed: false },
  { pageId: 'p2-03', componentId: 'c2-03-01', interactionType: 'select', data: { interactionId: 'opt-1a', value: 'Respond calmly', score: 10, maxScore: 10, isCorrect: true }, completed: false },
  { pageId: 'p2-03', componentId: 'c2-03-01', interactionType: 'select', data: { interactionId: 'opt-2a', value: 'Show empathy & resolve', score: 10, maxScore: 10, isCorrect: true }, completed: true },
  { pageId: 'p3-02', componentId: 'c3-02-01', interactionType: 'navigation', data: { interactionId: 'sl-3', value: 'Document Structure' }, completed: false },
  { pageId: 'p3-04', componentId: 'c3-04-03', interactionType: 'submit', data: { interactionId: 'opt-3', value: 'const', score: 10, maxScore: 10, isCorrect: true }, completed: true },
];

// ═══════════════════════════════════════════════════════════════════
// Audio Assets
// ═══════════════════════════════════════════════════════════════════

export const AUDIO_ASSETS: AudioAssetResponse[] = [
  {
    audioId: 'audio-001',
    audioUrl: '/audio/hazards-overview.mp3',
    duration: 120,
    label: 'Hazard Overview Narration',
    transcript: 'In this section we cover the four main types of workplace hazards: physical, chemical, ergonomic, and biological...',
    mimeType: 'audio/mpeg',
    fileSize: 1920000,
    courseId: 'course-safety-101',
    createdAt: '2026-01-16T10:00:00Z',
  },
  {
    audioId: 'audio-002',
    audioUrl: '/audio/ppe-intro.mp3',
    duration: 90,
    label: 'PPE Introduction',
    transcript: 'Personal Protective Equipment, or PPE, is your last line of defense against workplace hazards...',
    mimeType: 'audio/mpeg',
    fileSize: 1440000,
    courseId: 'course-safety-101',
    createdAt: '2026-01-16T10:30:00Z',
  },
  {
    audioId: 'audio-003',
    audioUrl: '/audio/welcome-cs.mp3',
    duration: 60,
    label: 'Customer Service Welcome',
    transcript: 'Welcome to the Customer Service Excellence course. Great customer service builds loyalty...',
    mimeType: 'audio/mpeg',
    fileSize: 960000,
    courseId: 'course-cs-excellence',
    createdAt: '2026-01-21T09:00:00Z',
  },
  {
    audioId: 'audio-004',
    audioUrl: '/audio/html-basics.mp3',
    duration: 180,
    label: 'HTML Fundamentals Narration',
    transcript: 'HTML, or HyperText Markup Language, is the standard language for creating web pages...',
    mimeType: 'audio/mpeg',
    fileSize: 2880000,
    courseId: 'course-webdev-intro',
    createdAt: '2026-02-02T08:00:00Z',
  },
];

// ═══════════════════════════════════════════════════════════════════
// Export Status Responses
// ═══════════════════════════════════════════════════════════════════

export const EXPORT_STATUS_PENDING: ExportStatusResponse = {
  exportId: 'exp-001',
  status: 'pending',
  progress: 0,
  downloadUrl: null,
  error: null,
};

export const EXPORT_STATUS_PROCESSING: ExportStatusResponse = {
  exportId: 'exp-001',
  status: 'processing',
  progress: 45,
  downloadUrl: null,
  error: null,
};

export const EXPORT_STATUS_COMPLETED: ExportStatusResponse = {
  exportId: 'exp-001',
  status: 'completed',
  progress: 100,
  downloadUrl: '/exports/course-safety-101-scorm12.zip',
  error: null,
};

export const EXPORT_STATUS_FAILED: ExportStatusResponse = {
  exportId: 'exp-002',
  status: 'failed',
  progress: 60,
  downloadUrl: null,
  error: 'Failed to package audio assets: file not found /audio/missing.mp3',
};

// ═══════════════════════════════════════════════════════════════════
// Validation Responses
// ═══════════════════════════════════════════════════════════════════

export const VALIDATION_PASS: CourseValidationResponse = {
  valid: true,
  errors: [],
};

export const VALIDATION_FAIL: CourseValidationResponse = {
  valid: false,
  errors: [
    { field: 'pages[2].components[0].data.question', message: 'Question text is required for MCQ component.' },
    { field: 'pages[4].components[1].data.pairs', message: 'Matching component requires at least 2 pairs.' },
    { field: 'scoring.config.passingScore', message: 'Passing score must be between 0 and 100.' },
    { field: 'pages[5].pageCompletion.requiredComponents', message: 'Cannot reference non-existent component ID "c-missing".' },
  ],
};

// ═══════════════════════════════════════════════════════════════════
// Media Upload Responses
// ═══════════════════════════════════════════════════════════════════

export const MEDIA_UPLOAD_SAMPLE: MediaUploadResponse = {
  fileId: 'media-001',
  filePath: '/uploads/images/workspace-hazards.jpg',
  fileUrl: 'https://cdn.example.com/uploads/images/workspace-hazards.jpg',
  fileName: 'workspace-hazards.jpg',
  mimeType: 'image/jpeg',
  fileSize: 245760,
  category: 'image',
};

export const MEDIA_UPLOADS: MediaUploadResponse[] = [
  { fileId: 'media-001', filePath: '/uploads/images/workspace-hazards.jpg', fileUrl: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800', fileName: 'workspace-hazards.jpg', mimeType: 'image/jpeg', fileSize: 245760, category: 'image' },
  { fileId: 'media-002', filePath: '/uploads/images/customer-service.jpg', fileUrl: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=800', fileName: 'customer-service.jpg', mimeType: 'image/jpeg', fileSize: 198400, category: 'image' },
  { fileId: 'media-003', filePath: '/uploads/images/webdev-coding.jpg', fileUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800', fileName: 'webdev-coding.jpg', mimeType: 'image/jpeg', fileSize: 312000, category: 'image' },
  { fileId: 'media-004', filePath: '/uploads/audio/hazards-overview.mp3', fileUrl: '/audio/hazards-overview.mp3', fileName: 'hazards-overview.mp3', mimeType: 'audio/mpeg', fileSize: 1920000, category: 'audio' },
  { fileId: 'media-005', filePath: '/uploads/documents/html-cheatsheet.pdf', fileUrl: '/downloads/html-cheatsheet.pdf', fileName: 'html-cheatsheet.pdf', mimeType: 'application/pdf', fileSize: 524288, category: 'document' },
];
