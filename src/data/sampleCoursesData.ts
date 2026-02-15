/**
 * Sample Courses Master Data
 *
 * 3 full sample courses with realistic pages, components,
 * audio configs, completion criteria, scoring, and navigation.
 * Provides mock data for all CRUD API endpoints.
 */

import type {
  Course,
  Page,
  Component,
  AudioConfig,
  CompletionCriteria,
  PageCompletionConfig,
  NavigationSettings,
  CourseSettings,
  ScoringConfig,
  CourseListItem,
  CourseListResponse,
  PageLayout,
} from '../types/course';

// ─── Helpers ─────────────────────────────────────────────────────

let _ts = '2026-02-15T10:00:00Z';
function ts() { return _ts; }

function comp(
  id: string,
  type: string,
  order: number,
  data: Record<string, any>,
  opts?: {
    audio?: AudioConfig;
    completion?: CompletionCriteria;
  },
): Component {
  return {
    componentId: id,
    componentType: type,
    order,
    data,
    audioConfig: opts?.audio,
    completionCriteria: opts?.completion ?? { type: 'view' },
    createdAt: ts(),
    updatedAt: ts(),
  };
}

function page(
  id: string,
  title: string,
  order: number,
  components: Component[],
  opts?: {
    layout?: PageLayout;
    completion?: PageCompletionConfig;
    audio?: AudioConfig;
  },
): Page {
  return {
    pageId: id,
    title,
    order,
    components,
    layout: opts?.layout ?? { preset: 'single-column', spacing: 'normal' },
    pageCompletion: opts?.completion ?? { enabled: true, strategy: 'all' },
    audioConfig: opts?.audio,
    theme: { inheritCourse: true },
    createdAt: ts(),
    updatedAt: ts(),
  };
}

// ═══════════════════════════════════════════════════════════════════
// Course 1 — Workplace Safety & Compliance (corporate)
// ═══════════════════════════════════════════════════════════════════

const course1Pages: Page[] = [
  // ── Page 1: Welcome & Overview ────────────────────
  page('p1-01', 'Welcome to Workplace Safety', 0, [
    comp('c1-01-01', 'text-with-media', 0, {
      title: 'Workplace Safety & Compliance',
      body: '<h2>Welcome!</h2><p>This course covers essential workplace safety principles, hazard identification, and compliance requirements. By the end, you will be able to identify common hazards and apply OSHA guidelines.</p>',
      mediaUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
      mediaType: 'image',
    }, { completion: { type: 'view' } }),
    comp('c1-01-02', 'module-overview', 1, {
      title: 'Course Overview',
      description: 'This course contains 7 modules covering hazard identification, PPE, emergency procedures, and compliance requirements.',
      objectives: [
        'Identify common workplace hazards',
        'Understand personal protective equipment requirements',
        'Know emergency evacuation procedures',
        'Apply OSHA compliance guidelines',
      ],
      estimatedDuration: 45,
    }),
    comp('c1-01-03', 'learning-roadmap', 2, {
      title: 'Your Learning Path',
      milestones: [
        { id: 'ms-1', title: 'Hazard Identification', description: 'Learn to spot workplace hazards', pageId: 'p1-02' },
        { id: 'ms-2', title: 'PPE Requirements', description: 'Personal protective equipment', pageId: 'p1-03' },
        { id: 'ms-3', title: 'Emergency Procedures', description: 'What to do in an emergency', pageId: 'p1-04' },
        { id: 'ms-4', title: 'Knowledge Check', description: 'Test your understanding', pageId: 'p1-05' },
        { id: 'ms-5', title: 'Final Assessment', description: 'Prove your competency', pageId: 'p1-06' },
        { id: 'ms-6', title: 'Completion', description: 'Certificate of completion', pageId: 'p1-07' },
      ],
    }),
  ]),

  // ── Page 2: Hazard Identification ────────────────
  page('p1-02', 'Hazard Identification', 1, [
    comp('c1-02-01', 'tabs', 0, {
      tabs: [
        { id: 'tab-physical', title: 'Physical Hazards', body: '<p><strong>Physical hazards</strong> include slippery floors, falling objects, moving machinery, and extreme temperatures. Always be aware of your surroundings.</p>' },
        { id: 'tab-chemical', title: 'Chemical Hazards', body: '<p><strong>Chemical hazards</strong> include toxic fumes, corrosive substances, and flammable materials. Always read Safety Data Sheets (SDS) before handling.</p>' },
        { id: 'tab-ergonomic', title: 'Ergonomic Hazards', body: '<p><strong>Ergonomic hazards</strong> arise from repetitive motions, poor posture, and improper workstation setup. Take regular breaks.</p>' },
        { id: 'tab-biological', title: 'Biological Hazards', body: '<p><strong>Biological hazards</strong> include bacteria, viruses, mold, and animal-related risks. Proper hygiene is essential.</p>' },
      ],
      defaultTabId: 'tab-physical',
    }, {
      audio: { enabled: true, audioItems: [
        { audioUrl: '/audio/hazards-overview.mp3', triggerOn: 'load', autoplay: false, requiredForCompletion: false, label: 'Hazard Overview Narration', duration: 120 },
      ]},
      completion: { type: 'interact' },
    }),
    comp('c1-02-02', 'image-hotspots', 1, {
      title: 'Identify Hazards in This Workspace',
      imageUrl: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800',
      hotspots: [
        { id: 'hs-1', x: 15, y: 40, label: 'Wet Floor', content: 'This wet floor is a slip hazard. Place a warning sign and mop up immediately.' },
        { id: 'hs-2', x: 55, y: 25, label: 'Unsecured Shelf', content: 'This heavy shelf is not bolted to the wall. It could topple and cause injury.' },
        { id: 'hs-3', x: 80, y: 60, label: 'Blocked Exit', content: 'This emergency exit is blocked by boxes. Emergency exits must always remain clear.' },
        { id: 'hs-4', x: 35, y: 75, label: 'Frayed Wire', content: 'This electrical cord is frayed and could cause a fire or shock. Replace it immediately.' },
      ],
    }, { completion: { type: 'interact', requiredInteractions: ['hs-1', 'hs-2', 'hs-3', 'hs-4'] } }),
    comp('c1-02-03', 'dos-donts', 2, {
      title: 'Hazard Awareness Best Practices',
      dos: [
        'Report hazards immediately to your supervisor',
        'Wear appropriate PPE at all times',
        'Keep emergency exits clear',
        'Follow lockout/tagout procedures',
      ],
      donts: [
        'Ignore wet floor signs',
        'Block fire exits with equipment',
        'Use damaged equipment',
        'Handle chemicals without reading SDS',
      ],
      showIcons: true,
    }),
  ]),

  // ── Page 3: Personal Protective Equipment ─────────
  page('p1-03', 'Personal Protective Equipment (PPE)', 2, [
    comp('c1-03-01', 'accordion', 0, {
      panels: [
        { id: 'panel-head', title: 'Head Protection', body: '<p>Hard hats protect against falling objects, bumps, and electrical hazards. Choose ANSI-rated helmets appropriate for your work environment.</p>' },
        { id: 'panel-eye', title: 'Eye & Face Protection', body: '<p>Safety glasses, goggles, and face shields protect against flying debris, chemical splashes, and radiation. Always use ANSI Z87.1 rated eyewear.</p>' },
        { id: 'panel-hand', title: 'Hand Protection', body: '<p>Select gloves based on the hazard: leather for cuts, nitrile for chemicals, insulated for electricity. Replace when worn or torn.</p>' },
        { id: 'panel-foot', title: 'Foot Protection', body: '<p>Steel-toed boots protect against falling objects and compression. Anti-slip soles prevent falls on wet surfaces.</p>' },
        { id: 'panel-resp', title: 'Respiratory Protection', body: '<p>Respirators and masks protect against dust, fumes, and toxic gases. Ensure proper fit testing and filter selection.</p>' },
      ],
      allowMultipleOpen: true,
    }, { completion: { type: 'interact' } }),
    comp('c1-03-02', 'comparison-table', 1, {
      title: 'PPE Selection Guide',
      columns: [
        { id: 'col-hazard', header: 'Hazard Type' },
        { id: 'col-ppe', header: 'Required PPE' },
        { id: 'col-standard', header: 'Standard' },
      ],
      rows: [
        { id: 'row-1', cells: ['Falling objects', 'Hard hat (Type I or II)', 'ANSI Z89.1'] },
        { id: 'row-2', cells: ['Chemical splash', 'Safety goggles + face shield', 'ANSI Z87.1'] },
        { id: 'row-3', cells: ['Noise > 85 dB', 'Ear plugs / muffs', 'OSHA 1910.95'] },
        { id: 'row-4', cells: ['Airborne particles', 'N95 respirator', 'NIOSH 42 CFR 84'] },
      ],
    }),
  ]),

  // ── Page 4: Emergency Procedures ──────────────────
  page('p1-04', 'Emergency Procedures', 3, [
    comp('c1-04-01', 'step-by-step', 0, {
      title: 'Fire Emergency Evacuation',
      steps: [
        { id: 'step-1', title: 'Sound the Alarm', description: 'Pull the nearest fire alarm and call 911. Do not attempt to fight the fire unless you are trained and it is small.', icon: 'alert-triangle' },
        { id: 'step-2', title: 'Evacuate', description: 'Walk quickly to the nearest exit. Do NOT use elevators. Close doors behind you to slow fire spread.', icon: 'log-out' },
        { id: 'step-3', title: 'Assembly Point', description: 'Go to the designated assembly point. Stay at least 50 feet away from the building.', icon: 'map-pin' },
        { id: 'step-4', title: 'Head Count', description: 'Report to your section warden for a head count. Inform them of any missing persons.', icon: 'users' },
        { id: 'step-5', title: 'Wait for All Clear', description: 'Do not re-enter the building until the fire department gives the all-clear signal.', icon: 'check-circle' },
      ],
    }, { completion: { type: 'interact' } }),
    comp('c1-04-02', 'scenario', 1, {
      title: 'Emergency Decision',
      context: 'You smell smoke coming from the server room. The smoke alarm has not gone off yet.',
      question: 'What should you do first?',
      options: [
        { id: 'opt-1', text: 'Investigate the server room yourself', points: 2, feedback: 'Risky — you could be exposed to toxic fumes. Let trained personnel handle it.' },
        { id: 'opt-2', text: 'Pull the fire alarm and evacuate', points: 10, feedback: 'Correct! Safety first. Alert everyone and evacuate immediately.' },
        { id: 'opt-3', text: 'Wait to see if the alarm goes off automatically', points: 0, feedback: 'Dangerous — alarms can fail. Act immediately when you detect a hazard.' },
        { id: 'opt-4', text: 'Email the facilities team', points: 1, feedback: 'Too slow for an emergency. Use the fire alarm for immediate response.' },
      ],
    }, { completion: { type: 'score', threshold: 80 } }),
  ]),

  // ── Page 5: Knowledge Check ───────────────────────
  page('p1-05', 'Knowledge Check', 4, [
    comp('c1-05-01', 'knowledge-check', 0, {
      title: 'Check Your Understanding',
      questions: [
        {
          id: 'kc-q1',
          question: 'Which type of PPE protects against airborne particles?',
          options: [
            { id: 'kc-q1-a', text: 'Hard hat', isCorrect: false },
            { id: 'kc-q1-b', text: 'N95 respirator', isCorrect: true },
            { id: 'kc-q1-c', text: 'Safety glasses', isCorrect: false },
          ],
          explanation: 'N95 respirators filter at least 95% of airborne particles.',
        },
        {
          id: 'kc-q2',
          question: 'What should you do first when you smell smoke?',
          options: [
            { id: 'kc-q2-a', text: 'Pull the fire alarm and evacuate', isCorrect: true },
            { id: 'kc-q2-b', text: 'Investigate the source', isCorrect: false },
            { id: 'kc-q2-c', text: 'Send an email to management', isCorrect: false },
          ],
          explanation: 'Always prioritize safety. Pull the alarm and evacuate immediately.',
        },
      ],
    }, { completion: { type: 'score', threshold: 50 } }),
  ]),

  // ── Page 6: Final Assessment ──────────────────────
  page('p1-06', 'Final Assessment', 5, [
    comp('c1-06-01', 'final-assessment', 0, {
      title: 'Workplace Safety Final Assessment',
      instructions: 'You must score 70% or higher to pass and receive your certificate. You have 3 attempts.',
      passingScore: 70,
      questions: [
        { id: 'fa-q1', type: 'mcq', question: 'What is the minimum noise level requiring hearing protection?', options: [{ id: 'a', text: '70 dB', isCorrect: false }, { id: 'b', text: '85 dB', isCorrect: true }, { id: 'c', text: '100 dB', isCorrect: false }, { id: 'd', text: '60 dB', isCorrect: false }], maxScore: 10 },
        { id: 'fa-q2', type: 'mcq', question: 'Which agency sets workplace safety standards in the US?', options: [{ id: 'a', text: 'EPA', isCorrect: false }, { id: 'b', text: 'FDA', isCorrect: false }, { id: 'c', text: 'OSHA', isCorrect: true }, { id: 'd', text: 'CDC', isCorrect: false }], maxScore: 10 },
        { id: 'fa-q3', type: 'true-false', question: 'You should use elevators during a fire evacuation.', correctAnswer: false, explanation: 'Never use elevators during a fire. Use stairs.', maxScore: 10 },
        { id: 'fa-q4', type: 'mcq', question: 'What document provides information about chemical hazards?', options: [{ id: 'a', text: 'Safety Data Sheet (SDS)', isCorrect: true }, { id: 'b', text: 'Employee handbook', isCorrect: false }, { id: 'c', text: 'Fire escape plan', isCorrect: false }], maxScore: 10 },
        { id: 'fa-q5', type: 'mcq', question: 'Lockout/Tagout procedures are used for:', options: [{ id: 'a', text: 'Fire prevention', isCorrect: false }, { id: 'b', text: 'Machine maintenance safety', isCorrect: true }, { id: 'c', text: 'Chemical storage', isCorrect: false }], maxScore: 10 },
      ],
    }, { completion: { type: 'score', threshold: 70 } }),
  ]),

  // ── Page 7: Summary & Certificate ─────────────────
  page('p1-07', 'Course Complete', 6, [
    comp('c1-07-01', 'summary-takeaways', 0, {
      title: 'Key Takeaways',
      keyPoints: [
        'Workplace hazards fall into physical, chemical, ergonomic, and biological categories',
        'Always select PPE based on the specific hazard and applicable standard',
        'In an emergency: Alarm → Evacuate → Assembly → Head Count → Wait for All Clear',
        'OSHA mandates hearing protection at 85 dB or above',
        'Safety Data Sheets (SDS) provide essential chemical hazard information',
      ],
      nextSteps: 'Download the reference card below and keep it at your workstation.',
    }),
    comp('c1-07-02', 'policy-acknowledgement', 1, {
      title: 'Workplace Safety Policy',
      policyText: 'I acknowledge that I have completed the Workplace Safety & Compliance training and understand my responsibilities to maintain a safe working environment. I will follow all safety procedures and report hazards immediately.',
      acknowledgementText: 'I have read and agree to abide by the workplace safety policy',
      requireSignature: true,
    }, { completion: { type: 'interact' } }),
    comp('c1-07-03', 'completion-certificate', 2, {
      title: 'Certificate of Completion',
      recipientField: 'learnerName',
      courseTitle: 'Workplace Safety & Compliance',
      completionDate: '',
      signatureText: 'Safety Training Department',
      templateStyle: 'classic',
    }),
  ]),
];

const course1Scoring: ScoringConfig = {
  config: {
    passingScore: 70,
    maxAttempts: 3,
    attemptScoring: 'best',
    showCorrectAnswers: true,
    showScoreAfterQuestion: true,
    showScoreAfterPage: true,
    weightedScoring: false,
    allowPartialCredit: true,
  },
  componentScores: [
    { componentId: 'c1-04-02', maxPoints: 10, weight: 1 },
    { componentId: 'c1-05-01', maxPoints: 20, weight: 1 },
    { componentId: 'c1-06-01', maxPoints: 50, weight: 2 },
  ],
  scormReporting: {
    enabled: true,
    version: '1.2',
    reportScore: true,
    reportCompletion: true,
    reportInteractions: true,
  },
};

export const COURSE_1: Course = {
  courseId: 'course-safety-101',
  title: 'Workplace Safety & Compliance',
  author: 'Safety Training Dept.',
  language: 'en',
  description: 'A comprehensive workplace safety course covering hazard identification, PPE requirements, emergency procedures, and OSHA compliance guidelines.',
  version: '1.0.0',
  status: 'published',
  pages: course1Pages,
  navigation: { allowSkip: false, showProgress: true, linearProgression: true },
  settings: { themeId: 'preset-corporate', autoplay: false, duration: 45 },
  scoring: course1Scoring,
  createdAt: '2026-01-15T09:00:00Z',
  updatedAt: '2026-02-15T10:00:00Z',
};

// ═══════════════════════════════════════════════════════════════════
// Course 2 — Customer Service Excellence (soft skills)
// ═══════════════════════════════════════════════════════════════════

const course2Pages: Page[] = [
  page('p2-01', 'Welcome to Customer Service Excellence', 0, [
    comp('c2-01-01', 'text-with-media', 0, {
      title: 'Delivering 5-Star Customer Service',
      body: '<h2>Welcome!</h2><p>Great customer service builds loyalty and drives business growth. In this interactive course, you\'ll learn the HEART framework, handle difficult situations, and practice empathetic communication.</p>',
      mediaUrl: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=800',
      mediaType: 'image',
    }),
    comp('c2-01-02', 'pre-assessment', 1, {
      title: 'How much do you know?',
      instructions: 'Take this quick pre-assessment so we can customize your learning path.',
      questions: [
        { id: 'pre-q1', question: 'What does empathy mean in customer service?', options: [{ id: 'a', text: 'Understanding the customer\'s feelings', isCorrect: true }, { id: 'b', text: 'Giving refunds immediately', isCorrect: false }], maxScore: 10 },
        { id: 'pre-q2', question: 'The HEART framework stands for...', options: [{ id: 'a', text: 'Hear, Empathize, Apologize, Resolve, Thank', isCorrect: true }, { id: 'b', text: 'Help, Explain, Ask, Recite, Tell', isCorrect: false }], maxScore: 10 },
      ],
      skipIfPassed: true,
      passingScore: 80,
    }, { completion: { type: 'score', threshold: 0 } }),
  ]),

  page('p2-02', 'The HEART Framework', 1, [
    comp('c2-02-01', 'step-by-step', 0, {
      title: 'The HEART Framework',
      steps: [
        { id: 'h', title: 'Hear', description: 'Actively listen to the customer. Let them finish speaking without interruption. Use verbal affirmations like "I understand."', icon: 'ear' },
        { id: 'e', title: 'Empathize', description: 'Show genuine empathy. Say things like "I can see how frustrating that must be" to validate their feelings.', icon: 'heart' },
        { id: 'a', title: 'Apologize', description: 'Offer a sincere apology even if it\'s not your fault. "I\'m sorry you\'re experiencing this" goes a long way.', icon: 'message-circle' },
        { id: 'r', title: 'Resolve', description: 'Take ownership and find a solution. If you can\'t fix it immediately, give a clear timeline and follow up.', icon: 'check-circle' },
        { id: 't', title: 'Thank', description: 'Thank the customer for their patience and for bringing the issue to your attention.', icon: 'thumbs-up' },
      ],
    }, { completion: { type: 'interact' } }),
    comp('c2-02-02', 'flip-cards', 1, {
      title: 'Practice Phrases',
      cards: [
        { id: 'fc-1', front: '🗣️ Hear', back: '"Thank you for sharing that with me. Let me make sure I understand correctly..."' },
        { id: 'fc-2', front: '❤️ Empathize', back: '"I completely understand your frustration. That would bother me too."' },
        { id: 'fc-3', front: '🙏 Apologize', back: '"I sincerely apologize for the inconvenience. This should not have happened."' },
        { id: 'fc-4', front: '✅ Resolve', back: '"Here\'s what I\'m going to do to fix this for you right away..."' },
        { id: 'fc-5', front: '🌟 Thank', back: '"Thank you for your patience. We really value your feedback."' },
      ],
      columns: 3,
    }, { completion: { type: 'interact' } }),
  ]),

  page('p2-03', 'Handling Difficult Customers', 2, [
    comp('c2-03-01', 'branching-scenario', 0, {
      title: 'The Angry Customer',
      nodes: [
        {
          id: 'node-start',
          text: 'A customer storms in, visibly upset, and says loudly: "I\'ve been waiting for 30 minutes! This is unacceptable!"',
          options: [
            { id: 'opt-1a', text: 'Respond calmly: "I\'m so sorry for the wait. Let me help you right away."', nextNodeId: 'node-good1', points: 10 },
            { id: 'opt-1b', text: 'Say: "Everyone has to wait. Please be patient."', nextNodeId: 'node-bad1', points: 0 },
            { id: 'opt-1c', text: 'Call your manager immediately.', nextNodeId: 'node-ok1', points: 5 },
          ],
        },
        {
          id: 'node-good1',
          text: 'The customer calms down slightly. "Well, at least someone is paying attention. My order was wrong last time too."',
          options: [
            { id: 'opt-2a', text: '"That must have been very frustrating. Let me look into your previous order and fix everything today."', nextNodeId: 'node-best', points: 10 },
            { id: 'opt-2b', text: '"I\'ll fix today\'s order. The previous one is done."', nextNodeId: 'node-ok2', points: 5 },
          ],
        },
        { id: 'node-bad1', text: 'The customer becomes more upset and asks for a manager. You missed an opportunity to de-escalate. Score: 0/20', options: [] },
        { id: 'node-ok1', text: 'Your manager resolves the issue. However, you could have handled this yourself using the HEART framework. Score: 5/20', options: [] },
        { id: 'node-ok2', text: 'The customer is partially satisfied but feels their past issue was dismissed. Score: 15/20', options: [] },
        { id: 'node-best', text: 'Excellent! The customer feels heard and valued. They leave happy and tell a friend about the great service. Score: 20/20', options: [] },
      ],
      startNodeId: 'node-start',
    }, { completion: { type: 'score', threshold: 50 } }),
  ]),

  page('p2-04', 'Self-Assessment & Action Plan', 3, [
    comp('c2-04-01', 'self-assessment', 0, {
      title: 'Rate Your Customer Service Skills',
      criteria: [
        { id: 'crit-listen', name: 'Active Listening', description: 'I listen fully before responding', scale: 5 },
        { id: 'crit-empathy', name: 'Empathy', description: 'I genuinely understand customer feelings', scale: 5 },
        { id: 'crit-resolve', name: 'Problem Resolution', description: 'I find effective solutions quickly', scale: 5 },
        { id: 'crit-follow', name: 'Follow-Up', description: 'I follow up to ensure satisfaction', scale: 5 },
      ],
    }, { completion: { type: 'interact' } }),
    comp('c2-04-02', 'action-planning', 1, {
      title: 'My Action Plan',
      goals: [
        { id: 'goal-1', description: 'Practice the HEART framework with 3 customers this week', deadline: '', actions: ['Use the phrase card at my desk', 'Ask a colleague to role-play'] },
        { id: 'goal-2', description: 'Reduce average complaint resolution time by 20%', deadline: '', actions: ['Identify common issues', 'Prepare solution templates'] },
      ],
    }, { completion: { type: 'interact' } }),
  ]),

  page('p2-05', 'Final Quiz & Certificate', 4, [
    comp('c2-05-01', 'quiz-game', 0, {
      title: 'Customer Service Challenge',
      questions: [
        { id: 'qg-1', question: 'What does the "H" in HEART stand for?', options: [{ id: 'a', text: 'Hear', isCorrect: true }, { id: 'b', text: 'Help', isCorrect: false }, { id: 'c', text: 'Handle', isCorrect: false }], difficulty: 'easy', timeLimit: 20 },
        { id: 'qg-2', question: 'When a customer is angry, you should first...', options: [{ id: 'a', text: 'Listen without interrupting', isCorrect: true }, { id: 'b', text: 'Offer a discount', isCorrect: false }, { id: 'c', text: 'Transfer to manager', isCorrect: false }], difficulty: 'medium', timeLimit: 25 },
        { id: 'qg-3', question: 'Which is the best way to close a service interaction?', options: [{ id: 'a', text: 'Say goodbye and hang up', isCorrect: false }, { id: 'b', text: 'Thank the customer and confirm resolution', isCorrect: true }, { id: 'c', text: 'Ask them to fill out a survey', isCorrect: false }], difficulty: 'medium', timeLimit: 25 },
      ],
      streakBonus: true,
      showLeaderboard: false,
    }, { completion: { type: 'score', threshold: 60 } }),
    comp('c2-05-02', 'completion-certificate', 1, {
      title: 'Certificate of Excellence',
      recipientField: 'learnerName',
      courseTitle: 'Customer Service Excellence',
      completionDate: '',
      signatureText: 'Learning & Development',
      templateStyle: 'classic',
    }),
  ]),
];

export const COURSE_2: Course = {
  courseId: 'course-cs-excellence',
  title: 'Customer Service Excellence',
  author: 'Learning & Development',
  language: 'en',
  description: 'Master the HEART framework, handle difficult customers with empathy, and elevate your customer service skills.',
  version: '2.1.0',
  status: 'published',
  pages: course2Pages,
  navigation: { allowSkip: true, showProgress: true, linearProgression: false },
  settings: { themeId: 'preset-vibrant', autoplay: false, duration: 30 },
  scoring: {
    config: {
      passingScore: 60,
      maxAttempts: null,
      attemptScoring: 'best',
      showCorrectAnswers: true,
      showScoreAfterQuestion: true,
      showScoreAfterPage: true,
      weightedScoring: true,
      allowPartialCredit: true,
    },
    componentScores: [
      { componentId: 'c2-03-01', componentType: 'branching-scenario', maxPoints: 20, weight: 2 },
      { componentId: 'c2-05-01', componentType: 'quiz-game', maxPoints: 30, weight: 1 },
    ],
  },
  createdAt: '2026-01-20T14:00:00Z',
  updatedAt: '2026-02-14T16:30:00Z',
};

// ═══════════════════════════════════════════════════════════════════
// Course 3 — Introduction to Web Development (technical)
// ═══════════════════════════════════════════════════════════════════

const course3Pages: Page[] = [
  page('p3-01', 'Welcome to Web Development', 0, [
    comp('c3-01-01', 'text-with-media', 0, {
      title: 'Learn HTML, CSS & JavaScript',
      body: '<h2>Welcome, Future Web Developer!</h2><p>In this hands-on course you\'ll build your first web page from scratch. We start with HTML structure, add CSS styling, and bring it to life with JavaScript.</p>',
      mediaUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
      mediaType: 'image',
    }),
  ], { layout: { preset: 'hero-content', spacing: 'spacious' } }),

  page('p3-02', 'HTML Fundamentals', 1, [
    comp('c3-02-01', 'carousel', 0, {
      title: 'HTML Building Blocks',
      slides: [
        { id: 'sl-1', title: 'What is HTML?', body: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page using elements.', imageUrl: '' },
        { id: 'sl-2', title: 'Elements & Tags', body: 'HTML elements are defined by a start tag, content, and an end tag: <code>&lt;p&gt;Hello World&lt;/p&gt;</code>', imageUrl: '' },
        { id: 'sl-3', title: 'Document Structure', body: 'Every HTML page has: <code>&lt;!DOCTYPE html&gt;</code>, <code>&lt;html&gt;</code>, <code>&lt;head&gt;</code>, and <code>&lt;body&gt;</code> elements.', imageUrl: '' },
        { id: 'sl-4', title: 'Common Elements', body: '<ul><li>Headings: h1 – h6</li><li>Paragraphs: p</li><li>Links: a</li><li>Images: img</li><li>Lists: ul, ol, li</li></ul>', imageUrl: '' },
      ],
    }, { completion: { type: 'interact' } }),
    comp('c3-02-02', 'flashcards', 1, {
      title: 'HTML Tag Flashcards',
      cards: [
        { id: 'fc-1', front: '&lt;h1&gt;', back: 'Main heading — the most important heading on the page. Use only once per page.' },
        { id: 'fc-2', front: '&lt;p&gt;', back: 'Paragraph — defines a block of text content.' },
        { id: 'fc-3', front: '&lt;a href="..."&gt;', back: 'Anchor — creates a hyperlink to another page or resource.' },
        { id: 'fc-4', front: '&lt;img src="..." alt="..."&gt;', back: 'Image — embeds an image. Always include alt text for accessibility.' },
        { id: 'fc-5', front: '&lt;div&gt;', back: 'Division — a generic container for grouping elements.' },
        { id: 'fc-6', front: '&lt;ul&gt; / &lt;ol&gt;', back: 'Unordered / Ordered list — contains &lt;li&gt; list items.' },
      ],
    }, { completion: { type: 'interact' } }),
    comp('c3-02-03', 'fill-blanks', 2, {
      title: 'Complete the HTML',
      templateText: 'To create a link, use the _____ tag with the _____ attribute to specify the URL.',
      blanks: [
        { id: 'b-1', correctAnswers: ['a', '<a>', 'anchor'], caseSensitive: false },
        { id: 'b-2', correctAnswers: ['href'], caseSensitive: false },
      ],
      maxScore: 10,
    }, { completion: { type: 'score', threshold: 50 } }),
  ]),

  page('p3-03', 'CSS Styling', 2, [
    comp('c3-03-01', 'tabs', 0, {
      tabs: [
        { id: 'tab-selectors', title: 'Selectors', body: '<p>CSS selectors target HTML elements. Types include: <strong>element</strong> (p), <strong>class</strong> (.intro), <strong>id</strong> (#header), and <strong>attribute</strong> ([type="text"]).</p>' },
        { id: 'tab-box', title: 'Box Model', body: '<p>Every element is a box with: <strong>content</strong>, <strong>padding</strong>, <strong>border</strong>, and <strong>margin</strong>. Use <code>box-sizing: border-box</code> for predictable sizing.</p>' },
        { id: 'tab-layout', title: 'Flexbox', body: '<p>Flexbox creates flexible layouts. Set <code>display: flex</code> on a container, then use <code>justify-content</code>, <code>align-items</code>, and <code>flex-wrap</code> to control layout.</p>' },
        { id: 'tab-grid', title: 'CSS Grid', body: '<p>Grid creates 2D layouts. Use <code>display: grid</code> with <code>grid-template-columns</code> and <code>grid-template-rows</code> to define structure.</p>' },
      ],
      defaultTabId: 'tab-selectors',
    }, { completion: { type: 'interact' } }),
    comp('c3-03-02', 'before-after', 1, {
      title: 'CSS Transformation',
      beforeLabel: 'Without CSS',
      afterLabel: 'With CSS',
      beforeContent: 'Plain HTML with no styling — black text on white, no spacing, default fonts, elements stacked vertically.',
      afterContent: 'Styled page with custom fonts, colors, spacing, responsive layout, shadows, and animations.',
    }),
    comp('c3-03-03', 'matching', 2, {
      title: 'Match CSS Properties',
      pairs: [
        { id: 'pair-1', left: 'color', right: 'Changes text color' },
        { id: 'pair-2', left: 'margin', right: 'Space outside the border' },
        { id: 'pair-3', left: 'padding', right: 'Space inside the border' },
        { id: 'pair-4', left: 'display: flex', right: 'Creates a flex container' },
        { id: 'pair-5', left: 'font-size', right: 'Sets text size' },
      ],
    }, { completion: { type: 'score', threshold: 60 } }),
  ]),

  page('p3-04', 'JavaScript Basics', 3, [
    comp('c3-04-01', 'timeline', 0, {
      title: 'JavaScript History',
      events: [
        { id: 'evt-1', date: '1995', title: 'JavaScript Created', description: 'Brendan Eich created JavaScript in 10 days at Netscape.' },
        { id: 'evt-2', date: '1997', title: 'ECMAScript 1', description: 'JavaScript standardized as ECMAScript.' },
        { id: 'evt-3', date: '2009', title: 'Node.js Released', description: 'JavaScript runs on servers with V8 engine.' },
        { id: 'evt-4', date: '2015', title: 'ES6 / ES2015', description: 'Major update: let/const, arrow functions, classes, modules.' },
        { id: 'evt-5', date: '2024', title: 'Modern JavaScript', description: 'Top programming language with vast ecosystem.' },
      ],
    }),
    comp('c3-04-02', 'click-reveal', 1, {
      title: 'JavaScript Core Concepts',
      items: [
        { id: 'cr-1', label: 'Variables', content: 'Use <code>let</code> for mutable variables and <code>const</code> for constants. Avoid <code>var</code>.' },
        { id: 'cr-2', label: 'Functions', content: 'Functions are declared with <code>function name() {}</code> or <code>const name = () => {}</code> (arrow function).' },
        { id: 'cr-3', label: 'DOM Manipulation', content: 'Use <code>document.querySelector()</code> to select elements and modify their content, styles, and attributes.' },
        { id: 'cr-4', label: 'Events', content: 'Attach event listeners: <code>element.addEventListener("click", handler)</code>' },
      ],
      columns: 2,
    }, { completion: { type: 'interact', requiredInteractions: ['cr-1', 'cr-2', 'cr-3', 'cr-4'] } }),
    comp('c3-04-03', 'mcq', 2, {
      question: 'Which keyword declares a variable that cannot be reassigned?',
      options: [
        { id: 'opt-1', text: 'var', isCorrect: false },
        { id: 'opt-2', text: 'let', isCorrect: false },
        { id: 'opt-3', text: 'const', isCorrect: true },
        { id: 'opt-4', text: 'function', isCorrect: false },
      ],
      explanation: 'const declares a constant — its value cannot be reassigned after initialization.',
      maxScore: 10,
    }, { completion: { type: 'score', threshold: 100 } }),
  ]),

  page('p3-05', 'Wrap-Up & Resources', 4, [
    comp('c3-05-01', 'summary-takeaways', 0, {
      title: 'What You Learned',
      keyPoints: [
        'HTML provides the structure of web pages using elements and tags',
        'CSS controls visual presentation: colors, layout, typography',
        'JavaScript adds interactivity and dynamic behavior',
        'The Box Model, Flexbox, and Grid are key CSS layout tools',
        'Modern JavaScript (ES6+) uses let/const, arrow functions, and modules',
      ],
      nextSteps: 'Build a personal portfolio page to practice everything you\'ve learned!',
    }),
    comp('c3-05-02', 'resources-downloads', 1, {
      title: 'Helpful Resources',
      resources: [
        { id: 'res-1', title: 'MDN Web Docs', type: 'link', url: 'https://developer.mozilla.org', description: 'The best reference for HTML, CSS, and JavaScript' },
        { id: 'res-2', title: 'CSS Tricks — Flexbox Guide', type: 'link', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', description: 'Visual guide to CSS Flexbox' },
        { id: 'res-3', title: 'JavaScript.info', type: 'link', url: 'https://javascript.info', description: 'Modern JavaScript tutorial' },
        { id: 'res-4', title: 'HTML Cheat Sheet', type: 'pdf', url: '/downloads/html-cheatsheet.pdf', description: 'Quick reference card' },
      ],
    }),
    comp('c3-05-03', 'confidence-rating', 2, {
      title: 'Rate Your Confidence',
      topics: [
        { id: 'topic-html', name: 'HTML', description: 'Creating page structure with HTML elements' },
        { id: 'topic-css', name: 'CSS', description: 'Styling pages with CSS selectors and properties' },
        { id: 'topic-js', name: 'JavaScript', description: 'Adding interactivity with JS' },
      ],
      scale: { min: 1, max: 5, labels: ['Not confident', 'Very confident'] },
    }, { completion: { type: 'interact' } }),
  ]),
];

export const COURSE_3: Course = {
  courseId: 'course-webdev-intro',
  title: 'Introduction to Web Development',
  author: 'Tech Academy',
  language: 'en',
  description: 'A beginner-friendly introduction to web development covering HTML, CSS, and JavaScript fundamentals with interactive exercises.',
  version: '1.2.0',
  status: 'draft',
  pages: course3Pages,
  navigation: { allowSkip: true, showProgress: true, linearProgression: false },
  settings: { themeId: 'preset-light', autoplay: false, duration: 60 },
  scoring: {
    config: {
      passingScore: 60,
      maxAttempts: null,
      attemptScoring: 'best',
      showCorrectAnswers: true,
      showScoreAfterQuestion: true,
      showScoreAfterPage: false,
      weightedScoring: false,
      allowPartialCredit: true,
    },
    componentScores: [
      { componentId: 'c3-02-03', componentType: 'fill-blanks', maxPoints: 10, weight: 1 },
      { componentId: 'c3-03-03', componentType: 'matching', maxPoints: 10, weight: 1 },
      { componentId: 'c3-04-03', componentType: 'mcq', maxPoints: 10, weight: 1 },
    ],
  },
  createdAt: '2026-02-01T08:00:00Z',
  updatedAt: '2026-02-15T09:00:00Z',
};

// ═══════════════════════════════════════════════════════════════════
// Exports
// ═══════════════════════════════════════════════════════════════════

export const ALL_COURSES: Course[] = [COURSE_1, COURSE_2, COURSE_3];

export function getCourseById(courseId: string): Course | undefined {
  return ALL_COURSES.find(c => c.courseId === courseId);
}

export function getCourseListItems(): CourseListItem[] {
  return ALL_COURSES.map(c => ({
    courseId: c.courseId,
    title: c.title,
    author: c.author,
    status: c.status,
    pageCount: c.pages.length,
    createdAt: c.createdAt ?? '2026-01-01T00:00:00Z',
    updatedAt: c.updatedAt ?? '2026-01-01T00:00:00Z',
  }));
}

export function courseListResponse(page = 1, limit = 20): CourseListResponse {
  const items = getCourseListItems();
  const start = (page - 1) * limit;
  return { items: items.slice(start, start + limit), total: items.length, page, limit };
}
