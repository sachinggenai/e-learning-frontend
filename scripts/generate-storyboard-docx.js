/**
 * Generates a rich-text Word (.docx) document for the Cybersecurity Basics storyboard.
 * Run: node scripts/generate-storyboard-docx.js
 * Output: docs/continuation/STORYBOARD_Cybersecurity_Basics.docx
 */

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, AlignmentType,
  BorderStyle, ShadingType, PageBreak, convertInchesToTwip,
  TableLayoutType,
} = require('docx');
const fs = require('fs');
const path = require('path');

// ── Colour palette ────────────────────────────────────────────
const BRAND_BLUE   = '1E3A5F';
const ACCENT_TEAL  = '0D7377';
const LIGHT_GREY   = 'F2F4F7';
const MID_GREY     = 'D0D5DD';
const WHITE        = 'FFFFFF';
const DARK_TEXT    = '111827';
const MUTED_TEXT   = '6B7280';
const GREEN        = '166534';
const GREEN_BG     = 'DCFCE7';

// ── Helper builders ───────────────────────────────────────────

function coverTitle(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 56, color: WHITE, font: 'Calibri' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    shading: { type: ShadingType.SOLID, color: BRAND_BLUE, fill: BRAND_BLUE },
  });
}

function coverSubtitle(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 28, color: 'C9D8EC', font: 'Calibri' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    shading: { type: ShadingType.SOLID, color: BRAND_BLUE, fill: BRAND_BLUE },
  });
}

function coverMeta(label, value) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 22, color: 'C9D8EC', font: 'Calibri' }),
      new TextRun({ text: value, size: 22, color: WHITE, font: 'Calibri' }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    shading: { type: ShadingType.SOLID, color: BRAND_BLUE, fill: BRAND_BLUE },
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, bold: true, size: 36, color: WHITE, font: 'Calibri' })],
    shading: { type: ShadingType.SOLID, color: BRAND_BLUE, fill: BRAND_BLUE },
    spacing: { before: 400, after: 160 },
    indent: { left: convertInchesToTwip(0.2) },
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, bold: true, size: 28, color: BRAND_BLUE, font: 'Calibri' })],
    spacing: { before: 320, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT_TEAL } },
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, bold: true, size: 24, color: ACCENT_TEAL, font: 'Calibri' })],
    spacing: { before: 240, after: 80 },
  });
}

function h4(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 22, color: BRAND_BLUE, font: 'Calibri' })],
    spacing: { before: 180, after: 60 },
  });
}

function body(text, { italic = false, color = DARK_TEXT } = {}) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, color, font: 'Calibri', italics: italic })],
    spacing: { after: 120 },
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    bullet: { level },
    children: [new TextRun({ text, size: 22, color: DARK_TEXT, font: 'Calibri' })],
    spacing: { after: 80 },
    indent: { left: convertInchesToTwip(0.25 + level * 0.25) },
  });
}

function numberedItem(n, text) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${n}.  `, bold: true, size: 22, color: ACCENT_TEAL, font: 'Calibri' }),
      new TextRun({ text, size: 22, color: DARK_TEXT, font: 'Calibri' }),
    ],
    spacing: { after: 100 },
    indent: { left: convertInchesToTwip(0.2) },
  });
}

function labelValue(label, value) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 22, color: BRAND_BLUE, font: 'Calibri' }),
      new TextRun({ text: value, size: 22, color: DARK_TEXT, font: 'Calibri' }),
    ],
    spacing: { after: 100 },
  });
}

function correctMark(text) {
  return new Paragraph({
    children: [
      new TextRun({ text: '✓ CORRECT  ', bold: true, size: 22, color: GREEN, font: 'Calibri' }),
      new TextRun({ text, size: 22, color: DARK_TEXT, font: 'Calibri' }),
    ],
    shading: { type: ShadingType.SOLID, color: GREEN_BG, fill: GREEN_BG },
    spacing: { after: 80 },
    indent: { left: convertInchesToTwip(0.1) },
  });
}

function wrongOption(text) {
  return new Paragraph({
    children: [new TextRun({ text: `✗  ${text}`, size: 22, color: MUTED_TEXT, font: 'Calibri' })],
    spacing: { after: 80 },
    indent: { left: convertInchesToTwip(0.1) },
  });
}

function explanationBox(text) {
  return new Paragraph({
    children: [
      new TextRun({ text: '💡 Explanation: ', bold: true, size: 21, color: ACCENT_TEAL, font: 'Calibri' }),
      new TextRun({ text, size: 21, color: DARK_TEXT, font: 'Calibri', italics: true }),
    ],
    shading: { type: ShadingType.SOLID, color: 'EFF8FF', fill: 'EFF8FF' },
    border: { left: { style: BorderStyle.SINGLE, size: 12, color: ACCENT_TEAL } },
    spacing: { before: 60, after: 160 },
    indent: { left: convertInchesToTwip(0.15) },
  });
}

function divider() {
  return new Paragraph({
    children: [new TextRun({ text: '', size: 4 })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: MID_GREY } },
    spacing: { before: 200, after: 200 },
  });
}

function spacer(pts = 120) {
  return new Paragraph({ children: [new TextRun({ text: '', size: pts / 2 })], spacing: { after: pts } });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function pageHeader(n, title, template) {
  return new Paragraph({
    children: [
      new TextRun({ text: `PAGE ${n}  `, bold: true, size: 28, color: WHITE, font: 'Calibri' }),
      new TextRun({ text: `— ${title}`, size: 26, color: 'C9D8EC', font: 'Calibri' }),
      new TextRun({ text: `   [${template}]`, size: 20, color: 'A8BFDA', font: 'Calibri', italics: true }),
    ],
    shading: { type: ShadingType.SOLID, color: ACCENT_TEAL, fill: ACCENT_TEAL },
    spacing: { before: 0, after: 200 },
    indent: { left: convertInchesToTwip(0.2) },
  });
}

function summaryTable() {
  const rows = [
    ['#', 'Template', 'Page Title'],
    ['1',  'Course Menu',            'Course Overview & Navigation'],
    ['2',  'Text Content',           'Why Every Employee is a Cybersecurity Defender'],
    ['3',  'Tabs',                   'The Four Types of Cyber Threat'],
    ['4',  'Accordion',              'Cybersecurity FAQ'],
    ['5',  'Text with Media',        'The Anatomy of a Phishing Email'],
    ['6',  'Image Hotspots',         'Inside a Corporate Network'],
    ['7',  'Click & Reveal',         'Cybersecurity Myths Busted'],
    ['8',  'Flip Cards',             'Key Security Terms'],
    ['9',  'Carousel',               'Five Principles of Staying Safe Online'],
    ['10', 'Drag & Drop Sort',       'Responding to a Security Incident'],
    ['11', 'Knowledge Check',        'Knowledge Check — Modules 1–5'],
    ['12', 'Multiple Choice',        'Password Security: Test Yourself'],
    ['13', 'Multiple Select',        'Spot the Phishing Red Flags'],
    ['14', 'True / False',           'Data Protection: Fact or Myth?'],
    ['15', 'Fill in the Blanks',     'Complete the Security Statements'],
    ['16', 'Matching',               'Match the Threat'],
    ['17', 'Summary & Takeaways',    'What You Have Learned'],
    ['18', 'Final Assessment',       'Final Assessment'],
    ['19', 'Completion Certificate', 'Certificate of Completion'],
  ];

  return new Table({
    layout: TableLayoutType.FIXED,
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map((row, rowIdx) =>
      new TableRow({
        tableHeader: rowIdx === 0,
        children: row.map((cell, colIdx) => {
          const isHeader = rowIdx === 0;
          const widths = [8, 25, 67];
          return new TableCell({
            width: { size: widths[colIdx], type: WidthType.PERCENTAGE },
            shading: isHeader
              ? { type: ShadingType.SOLID, color: BRAND_BLUE, fill: BRAND_BLUE }
              : rowIdx % 2 === 0
                ? { type: ShadingType.SOLID, color: LIGHT_GREY, fill: LIGHT_GREY }
                : { type: ShadingType.SOLID, color: WHITE, fill: WHITE },
            children: [new Paragraph({
              children: [new TextRun({
                text: cell,
                bold: isHeader,
                size: isHeader ? 22 : 20,
                color: isHeader ? WHITE : DARK_TEXT,
                font: 'Calibri',
              })],
              alignment: colIdx === 0 ? AlignmentType.CENTER : AlignmentType.LEFT,
              spacing: { before: 80, after: 80 },
              indent: { left: convertInchesToTwip(0.05), right: convertInchesToTwip(0.05) },
            })],
          });
        }),
      })
    ),
  });
}

function flipCardRow(front, back) {
  return new Table({
    layout: TableLayoutType.FIXED,
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: [
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.SOLID, color: BRAND_BLUE, fill: BRAND_BLUE },
          children: [new Paragraph({
            children: [new TextRun({ text: front, bold: true, size: 20, color: WHITE, font: 'Calibri' })],
            spacing: { before: 80, after: 80 },
            indent: { left: convertInchesToTwip(0.1) },
          })],
        }),
        new TableCell({
          width: { size: 70, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.SOLID, color: LIGHT_GREY, fill: LIGHT_GREY },
          children: [new Paragraph({
            children: [new TextRun({ text: back, size: 20, color: DARK_TEXT, font: 'Calibri' })],
            spacing: { before: 80, after: 80 },
            indent: { left: convertInchesToTwip(0.1) },
          })],
        }),
      ]}),
    ],
  });
}

function matchingRow(left, right) {
  return new Table({
    layout: TableLayoutType.FIXED,
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: [
      new TableCell({
        width: { size: 35, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.SOLID, color: 'DBEAFE', fill: 'DBEAFE' },
        children: [new Paragraph({
          children: [new TextRun({ text: left, bold: true, size: 20, color: BRAND_BLUE, font: 'Calibri' })],
          spacing: { before: 80, after: 80 },
          indent: { left: convertInchesToTwip(0.1) },
        })],
      }),
      new TableCell({
        width: { size: 65, type: WidthType.PERCENTAGE },
        children: [new Paragraph({
          children: [new TextRun({ text: right, size: 20, color: DARK_TEXT, font: 'Calibri' })],
          spacing: { before: 80, after: 80 },
          indent: { left: convertInchesToTwip(0.1) },
        })],
      }),
    ]})],
  });
}

// ── Document assembly ─────────────────────────────────────────

const children = [

  // ── COVER PAGE ───────────────────────────────────────────────
  ...Array(4).fill(null).map(() => spacer(200)),
  coverTitle('Cybersecurity Basics'),
  coverTitle('for Every Employee'),
  spacer(200),
  coverSubtitle('Course Storyboard — Full Content Document'),
  spacer(400),
  coverMeta('Topic',    'Cybersecurity Awareness'),
  coverMeta('Audience', 'All employees — no technical background required'),
  coverMeta('Duration', '45–60 minutes'),
  coverMeta('Pages',    '19 (one per template)'),
  coverMeta('Pass mark','80%'),
  coverMeta('Date',     'May 2026'),
  spacer(600),

  pageBreak(),

  // ── SUMMARY TABLE ────────────────────────────────────────────
  h1('Course at a Glance'),
  body('Use this table as your build checklist. Tick off each page as you create it in the demo app.'),
  spacer(),
  summaryTable(),

  pageBreak(),

  // ═══════════════════════════════════════════════════════════
  // PAGE 1 — COURSE MENU
  // ═══════════════════════════════════════════════════════════
  pageHeader(1, 'Course Overview & Navigation', 'Course Menu'),
  labelValue('Purpose', 'Give learners a clear map of the course before they begin'),
  divider(),
  h3('Course Title'),
  body('Cybersecurity Basics for Every Employee'),
  h3('Subtitle'),
  body('Protect yourself, your colleagues, and your organisation online'),
  h3('Menu Items'),
  ...[ ['1', 'Module 1: Why Cybersecurity Matters',    'Understand the real-world risks and why every employee is a critical line of defence.'],
       ['2', 'Module 2: Recognising Cyber Threats',    'Learn to identify phishing, malware, social engineering, and insider threats.'],
       ['3', 'Module 3: Safe Online Behaviour',        'Master the practical habits that keep you and your organisation secure every day.'],
       ['4', 'Module 4: Key Terms & Concepts',         'Build your security vocabulary through interactive exercises and scenarios.'],
       ['5', 'Module 5: Practice & Assessment',        'Reinforce your learning with a knowledge check and a graded final assessment.'],
       ['6', 'Completion Certificate',                 'Earn your certificate by achieving 80% or higher on the final assessment.'],
  ].flatMap(([n, label, desc]) => [
    numberedItem(n, label),
    new Paragraph({
      children: [new TextRun({ text: `      ${desc}`, size: 20, color: MUTED_TEXT, font: 'Calibri', italics: true })],
      spacing: { after: 100 },
    }),
  ]),

  pageBreak(),

  // ═══════════════════════════════════════════════════════════
  // PAGE 2 — TEXT CONTENT
  // ═══════════════════════════════════════════════════════════
  pageHeader(2, 'Why Every Employee is a Cybersecurity Defender', 'Text Content'),
  labelValue('Purpose', 'Set the scene — explain why cybersecurity is everyone\'s responsibility'),
  divider(),
  body('In today\'s connected workplace, cybersecurity is no longer solely the concern of the IT department. Every person who uses a computer, sends an email, or connects to the internet is both a potential target and a critical line of defence. Cyberattacks cost organisations worldwide hundreds of billions of pounds each year — and the vast majority of successful breaches begin with a single human action: clicking a malicious link, using a weak password, or inadvertently sharing sensitive information.'),
  body('This course — Cybersecurity Basics for Every Employee — is designed for anyone who works with digital tools, regardless of their technical background. If you use email, browse the web, or access company systems, this course is for you.'),
  h4('What you will be able to do by the end of this course:'),
  bullet('Explain the most common types of cyber threat and how they work'),
  bullet('Identify phishing emails, suspicious links, and social engineering tactics'),
  bullet('Apply strong password practices and understand multi-factor authentication'),
  bullet('Know exactly what to do — and what not to do — if you suspect a security incident'),
  bullet('Handle sensitive data responsibly in your day-to-day work'),
  spacer(),
  h4('Why this matters:'),
  body('The consequences of a cyberattack extend far beyond the IT team. A data breach can expose customer records, damage your organisation\'s reputation, trigger significant regulatory fines under data protection law, and disrupt operations for days or weeks. In some sectors, a serious breach can threaten an organisation\'s licence to operate.'),
  body('When an attack succeeds due to a human error, it is rarely because of carelessness or bad intent. Attackers are sophisticated. They craft messages that look exactly like communications from your bank, your CEO, or a trusted colleague. Understanding how they think is your best defence.'),
  h4('How this course is structured:'),
  body('The course is divided into five modules covering the core concepts you need to stay safe online. You will explore real-world examples, interact with practical exercises, test your knowledge with formative quizzes, and complete a graded final assessment. Upon passing, you will receive a certificate of completion. The course takes approximately 45–60 minutes. No prior technical knowledge is required.'),

  pageBreak(),

  // ═══════════════════════════════════════════════════════════
  // PAGE 3 — TABS
  // ═══════════════════════════════════════════════════════════
  pageHeader(3, 'The Four Types of Cyber Threat', 'Tabs'),
  labelValue('Purpose', 'Introduce the four major threat categories with enough detail to recognise each in the real world'),
  divider(),
  h3('Tab 1 — Phishing'),
  body('Phishing is one of the most common and damaging forms of cyberattack. A cybercriminal sends an email, text message, or instant message that appears to come from a legitimate source — a bank, a government agency, a well-known retailer, or even a colleague. The message creates a sense of urgency, asking you to "verify your account", "reset your password", or "review an urgent document". When you click the link or open the attachment, you may be taken to a fake website designed to harvest your login credentials, or a file may silently install malicious software on your device.'),
  body('Phishing attacks are highly effective because they exploit human psychology rather than technical vulnerabilities. Even experienced professionals can be fooled by a well-crafted phishing email. The best defence is to slow down, question unexpected requests, and verify the sender through a separate channel before taking any action.'),
  divider(),
  h3('Tab 2 — Malware'),
  body('Malware — short for malicious software — is any program designed to damage, disrupt, or gain unauthorised access to a computer system. It encompasses a broad family of threats: viruses, which attach themselves to legitimate files and spread when shared; ransomware, which encrypts your files and demands payment for their release; spyware, which secretly monitors your activity and transmits data to attackers; and trojans, which disguise themselves as legitimate software to trick you into installing them.'),
  body('Malware typically enters an organisation through email attachments, downloads from untrusted websites, infected USB drives, or vulnerabilities in unpatched software. Once inside a network, it can spread rapidly and cause significant damage. The best protection includes keeping software updated, never opening unexpected attachments, and ensuring your device\'s antivirus protection is active and current.'),
  divider(),
  h3('Tab 3 — Social Engineering'),
  body('Social engineering is the art of manipulating people into revealing confidential information or taking actions that compromise security. Unlike hacking, which exploits technical weaknesses, social engineering exploits human weaknesses — trust, helpfulness, fear, curiosity, and the desire to be polite.'),
  body('Common techniques include pretexting, where an attacker creates a fabricated scenario (such as posing as an IT support technician) to extract information; baiting, where an infected USB drive is left in a public area hoping someone will plug it in; and vishing (voice phishing), where attackers call employees and impersonate authority figures to request sensitive data.'),
  divider(),
  h3('Tab 4 — Insider Threats'),
  body('Not all cybersecurity threats originate externally. Insider threats involve employees, contractors, or business partners who — intentionally or accidentally — compromise organisational security. Malicious insiders may steal data for financial gain, sabotage systems out of grievance, or sell access to external attackers.'),
  body('Accidental insiders are far more common and cause harm through simple mistakes: sending a file to the wrong email address, falling for a phishing attack, or mishandling sensitive data. Organisations should implement the principle of least privilege — ensuring people only have access to the data and systems they need for their specific role.'),

  pageBreak(),

  // ═══════════════════════════════════════════════════════════
  // PAGE 4 — ACCORDION
  // ═══════════════════════════════════════════════════════════
  pageHeader(4, 'Cybersecurity FAQ', 'Accordion'),
  labelValue('Purpose', 'Answer the most common questions employees have about cybersecurity'),
  divider(),
  ...([
    ['Do I really need a different password for every account?',
     'Yes — and this is one of the most important habits you can develop. If you reuse the same password across multiple accounts and one is breached, attackers will automatically test your credentials on other sites — a technique called credential stuffing. A breach of one low-importance account can quickly cascade into a breach of your email, work systems, or banking. Use a password manager to generate and store unique, complex passwords for every account. You only need to remember one strong master password.'],
    ['Is it safe to use public Wi-Fi for work?',
     'Public Wi-Fi networks — in cafés, hotels, airports, and conference centres — are inherently insecure. Attackers on the same network can potentially intercept your traffic and capture login credentials in a "man-in-the-middle" attack. If you must use public Wi-Fi, always connect through your organisation\'s VPN, which encrypts your traffic and shields it from other users. Avoid accessing sensitive systems without VPN protection. When in doubt, use your mobile phone\'s hotspot — it is significantly more secure.'],
    ['What should I do if I accidentally click a suspicious link?',
     'Stay calm and act quickly. Do not enter any information on any webpage that opened. Disconnect your device from the internet immediately — this can prevent malware from communicating with external servers. Then contact your IT or security team straight away and be completely honest about what happened. Do not attempt to investigate or fix the problem yourself. Reporting quickly is the most important thing you can do — incidents caught early are far less damaging than those discovered days later.'],
    ['How do I know if an email is genuine?',
     'Check the sender\'s full email address, not just the display name — attackers often use addresses that look plausible but are not official domains. Look for urgency, requests for sensitive information, and generic greetings. Hover over links before clicking to see the actual URL. Be especially cautious of unexpected attachments. If in doubt, contact the supposed sender through a known, trusted channel to verify whether they sent it.'],
    ['What is multi-factor authentication and why does it matter?',
     'Multi-factor authentication (MFA) requires you to verify your identity in two or more ways before gaining access to a system — typically combining something you know (your password) with something you have (a one-time code sent to your phone). Even if an attacker steals your password, they cannot access your account without the second factor. MFA is one of the most effective security controls available. Enable it on every account that supports it.'],
  ]).flatMap(([q, a]) => [h3(q), body(a), spacer(80)]),

  pageBreak(),

  // ═══════════════════════════════════════════════════════════
  // PAGE 5 — TEXT WITH MEDIA
  // ═══════════════════════════════════════════════════════════
  pageHeader(5, 'The Anatomy of a Phishing Email', 'Text with Media'),
  labelValue('Purpose', 'Visually break down the elements of a phishing email so learners can recognise them'),
  labelValue('Layout',  'Image Right'),
  labelValue('Media',   'Annotated diagram of a phishing email with numbered callout arrows'),
  divider(),
  h3('How to Spot a Phishing Email'),
  body('Phishing emails have become increasingly sophisticated, but they almost always contain identifiable warning signs if you know what to look for.'),
  body('The sender address is often the first clue. Attackers register domains that closely resemble legitimate ones: "paypa1.com" instead of "paypal.com", or "support@microsoft-helpcentre.org" instead of a genuine Microsoft domain. Always check the full email address, not just the display name.'),
  body('The subject line is typically designed to trigger an emotional response — urgency ("Immediate action required"), fear ("Your account has been compromised"), or curiosity ("You have a pending payment"). These emotional triggers are intentional: the attacker wants you to react before your critical thinking engages.'),
  body('The body of the email often contains subtle errors — slightly awkward phrasing, unexpected capitalisation, or inconsistencies in formatting. Legitimate companies invest in professional communications. Imperfections are a red flag.'),
  body('The call to action always involves clicking a link or opening an attachment. Before clicking any link, hover your cursor over it to reveal the actual URL. If it does not match the organisation it claims to represent, do not click.'),
  body('Finally, legitimate organisations will never ask you to confirm your password or full bank details by email. If any email asks for this, it is fraudulent — regardless of how convincing it looks. When in doubt: delete it, and report it.'),
  spacer(),
  labelValue('Image callout labels', '① Spoofed sender address  ② Urgent subject line  ③ Generic greeting  ④ Grammatical error  ⑤ Misleading URL on hover'),

  pageBreak(),

  // ═══════════════════════════════════════════════════════════
  // PAGE 6 — IMAGE HOTSPOTS
  // ═══════════════════════════════════════════════════════════
  pageHeader(6, 'Inside a Corporate Network', 'Image Hotspots'),
  labelValue('Purpose', 'Help learners understand which parts of their workplace carry cybersecurity risk'),
  labelValue('Image',   'Flat-design office illustration with networked zones labelled: reception, workstations, server room, Wi-Fi AP, shared printer, internet gateway'),
  divider(),
  ...[
    ['Hotspot 1 — Internet Gateway / Firewall', 'top-right',    'The firewall acts as a barrier between your internal network and the public internet, filtering traffic based on security rules and blocking known threats. However, it cannot stop threats that are invited in — such as malware downloaded by an employee clicking a malicious link. It is one layer of defence, not the only one.'],
    ['Hotspot 2 — Employee Workstation',        'centre-left',  'Each employee\'s device is a potential entry point for attackers. Workstations should always run up-to-date operating systems and antivirus software. Employees should lock their screens when stepping away and avoid installing unapproved software.'],
    ['Hotspot 3 — Server Room',                 'top-left',     'Servers store the organisation\'s most critical data. Physical access must be strictly controlled. Only authorised personnel should enter, and access logs should be reviewed regularly. A physical breach can be as damaging as a digital one.'],
    ['Hotspot 4 — Wi-Fi Access Point',          'centre-right', 'Corporate Wi-Fi should use strong encryption and require authenticated access. Guest networks must be completely separated from the internal corporate network. A poorly configured access point can allow attackers within physical range to intercept traffic or access internal systems.'],
    ['Hotspot 5 — Shared Printer / Scanner',    'bottom-centre','Networked printers are frequently overlooked as security risks. They store copies of recently printed documents internally and can be compromised like any other networked device. Use PIN-release printing wherever available and collect sensitive printouts immediately.'],
    ['Hotspot 6 — Visitor Sign-In Area',        'bottom-left',  'Visitor management systems can be exploited by social engineers posing as contractors or delivery personnel. Always verify visitor identities, never hold secure doors open for unknown individuals (tailgating), and report anyone in a restricted area without visible identification.'],
  ].flatMap(([label, position, popup]) => [
    h4(label),
    labelValue('Position on image', position),
    labelValue('Popup text', popup),
    spacer(80),
  ]),

  pageBreak(),

  // ═══════════════════════════════════════════════════════════
  // PAGE 7 — CLICK & REVEAL
  // ═══════════════════════════════════════════════════════════
  pageHeader(7, 'Cybersecurity Myths Busted', 'Click & Reveal'),
  labelValue('Purpose', 'Learners click on a common belief to reveal why it is wrong'),
  divider(),
  ...[
    ['"I\'m not important enough to be a target."',
     'Every employee is a target. Attackers often focus on less senior employees precisely because they may have fewer personal security precautions in place, while still having access to systems, credentials, and data. A compromised junior account can serve as a stepping stone to reach more sensitive targets within the organisation.'],
    ['"Our IT team will catch anything dangerous."',
     'Technology is only one layer of defence. No security system is 100% effective, and sophisticated attacks are specifically designed to bypass automated defences. Only you can control whether you click a suspicious link, share your password, or plug in an unknown USB drive.'],
    ['"Strong passwords are impossible to remember."',
     'A passphrase — three or four random words such as "purple-lamp-ocean-fork" — is both highly secure and far easier to remember than a complex string of characters. Better still, a password manager generates and remembers unique passwords for every account.'],
    ['"HTTPS means a website is safe."',
     'HTTPS means the connection is encrypted — it does not mean the website itself is trustworthy. Phishing websites routinely use HTTPS and display the padlock icon. Always verify that the domain name is correct and that you arrived via a trusted route, not a link in an email.'],
    ['"I\'d know if my device were infected."',
     'Modern malware, particularly spyware and certain ransomware strains, is specifically designed to operate silently for weeks or months. Your device may look and behave entirely normally while a serious breach is under way.'],
    ['"Cybersecurity is too technical for non-IT people."',
     'The most impactful security behaviours require no technical expertise — verifying email senders, using unique passwords, locking your screen, and reporting suspicious activity. Cybersecurity awareness is a mindset, not a skill set.'],
  ].flatMap(([front, back], i) => [
    new Paragraph({
      children: [
        new TextRun({ text: `Card ${i + 1}  FRONT: `, bold: true, size: 21, color: BRAND_BLUE, font: 'Calibri' }),
        new TextRun({ text: front, size: 21, color: DARK_TEXT, font: 'Calibri', italics: true }),
      ],
      shading: { type: ShadingType.SOLID, color: LIGHT_GREY, fill: LIGHT_GREY },
      spacing: { before: 120, after: 40 },
      indent: { left: convertInchesToTwip(0.1) },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'BACK: ', bold: true, size: 21, color: ACCENT_TEAL, font: 'Calibri' }),
        new TextRun({ text: back, size: 21, color: DARK_TEXT, font: 'Calibri' }),
      ],
      spacing: { before: 40, after: 160 },
      indent: { left: convertInchesToTwip(0.1) },
    }),
  ]),

  pageBreak(),

  // ═══════════════════════════════════════════════════════════
  // PAGE 8 — FLIP CARDS
  // ═══════════════════════════════════════════════════════════
  pageHeader(8, 'Key Security Terms', 'Flip Cards'),
  labelValue('Purpose', 'Reinforce essential cybersecurity vocabulary — term on front, definition on back'),
  labelValue('Columns', '3'),
  divider(),
  ...[
    ['Phishing',                      'A deceptive message — usually email — designed to trick you into revealing credentials or installing malware. Phishing exploits trust and urgency rather than technical vulnerabilities.'],
    ['Malware',                       'Malicious software designed to damage, disrupt, or gain unauthorised access to a device or network. Includes viruses, ransomware, spyware, and trojans.'],
    ['Ransomware',                    'A type of malware that encrypts the victim\'s files and demands payment — usually in cryptocurrency — in exchange for the decryption key.'],
    ['Social Engineering',            'Manipulating people into revealing information or taking harmful actions by exploiting trust, urgency, authority, or curiosity rather than hacking systems directly.'],
    ['Multi-Factor Authentication',   'A security method requiring two or more verification steps — typically a password plus a one-time code. Makes a stolen password insufficient on its own.'],
    ['Credential Stuffing',           'An automated attack that tests large volumes of stolen username/password combinations across multiple websites, exploiting the fact that many people reuse passwords.'],
    ['VPN',                           'A Virtual Private Network encrypts your internet traffic and masks your network location — essential for securing connections on public or untrusted Wi-Fi networks.'],
    ['Least Privilege',               'The security principle of granting users only the access rights needed for their specific job. Limits the potential damage if an account is compromised.'],
    ['Pretexting',                    'A social engineering technique where an attacker fabricates a believable scenario — such as posing as IT support — to extract sensitive information or gain access.'],
  ].map(([front, back]) => flipCardRow(front, back)),
  spacer(),

  pageBreak(),

  // ═══════════════════════════════════════════════════════════
  // PAGE 9 — CAROUSEL
  // ═══════════════════════════════════════════════════════════
  pageHeader(9, 'Five Principles of Staying Safe Online', 'Carousel'),
  labelValue('Purpose', 'Present the five core safe-behaviour principles as a navigable slide deck'),
  divider(),
  ...[
    ['Slide 1 — Think Before You Click',
     'The most dangerous moment in cybersecurity is the split second before you click a link or open an attachment. Attackers rely on impulse — they craft messages designed to trigger an immediate reaction before your critical thinking engages. Before clicking anything, ask yourself: Was I expecting this? Do I recognise the sender? Does the link destination look right when I hover over it? If anything feels off, stop. Verify through a separate, trusted channel before taking any action. Slowing down is not paranoia — it is your most powerful security tool.'],
    ['Slide 2 — Use Strong, Unique Passwords',
     'A strong password is long (at least 14 characters), random, and completely unique to each account. Avoid using names, dates, or dictionary words. Never reuse a password — if one service is breached, credential stuffing attacks will immediately test your password elsewhere. A password manager removes the burden of memorising multiple complex credentials: it generates, stores, and autofills passwords securely, meaning you only need to remember one strong master password.'],
    ['Slide 3 — Enable Multi-Factor Authentication',
     'MFA adds a second layer of security to your accounts. Even if an attacker obtains your password, they cannot access your account without the second factor — typically a time-sensitive code sent to your phone or generated by an authenticator app. Enable MFA on every account that offers it, prioritising email, cloud storage, financial systems, and any work platform. MFA is one of the most effective individual security steps you can take.'],
    ['Slide 4 — Keep Everything Updated',
     'Software updates are primarily about security, not new features. When developers discover a vulnerability, they release a patch. Attackers actively scan for systems running outdated software and can exploit known vulnerabilities — sometimes within hours of a patch being published. Enable automatic updates wherever possible. If your organisation manages updates centrally through IT, never delay or dismiss them.'],
    ['Slide 5 — Report, Don\'t Ignore',
     'If you notice something suspicious — an unusual email, an unexpected login notification, a file you don\'t recognise — report it to your IT or security team immediately. Many breaches go undetected for months because employees didn\'t report early warning signs. There is no such thing as an over-reported security concern. Reporting promptly is not an overreaction — it is exactly what protects your organisation.'],
  ].flatMap(([title, text]) => [h3(title), body(text), spacer(80)]),

  pageBreak(),

  // ═══════════════════════════════════════════════════════════
  // PAGE 10 — DRAG & DROP SORT
  // ═══════════════════════════════════════════════════════════
  pageHeader(10, 'Responding to a Security Incident', 'Drag & Drop Sort'),
  labelValue('Purpose', 'Learners practise the correct sequence of steps for responding to a suspected incident'),
  labelValue('Instructions', 'Arrange these steps in the correct order for responding to a suspected cybersecurity incident.'),
  divider(),
  body('Enter each item below in order. The app will shuffle them for the learner.', { italic: true, color: MUTED_TEXT }),
  spacer(),
  ...[
    'Stop what you are doing and do not continue using the affected device or system.',
    'Disconnect the device from the internet and any shared network drives if it is safe to do so.',
    'Do not shut the device down — this preserves forensic evidence the security team will need.',
    'Contact your IT or security team immediately and describe exactly what happened.',
    'Preserve any evidence — save screenshots of suspicious messages before deleting anything.',
    'Follow all instructions from your security team and cooperate fully with their investigation.',
  ].map((step, i) => numberedItem(i + 1, step)),

  pageBreak(),

  // ═══════════════════════════════════════════════════════════
  // PAGE 11 — KNOWLEDGE CHECK
  // ═══════════════════════════════════════════════════════════
  pageHeader(11, 'Knowledge Check — Modules 1–5', 'Knowledge Check'),
  labelValue('Purpose', 'Formative mid-course quiz to consolidate learning'),
  labelValue('Title',   'Knowledge Check — How Are You Doing?'),
  labelValue('Passing score', '80%'),
  divider(),

  h3('Question 1 — Multiple Choice'),
  body('What is a phishing attack?'),
  wrongOption('A) A technical exploit targeting unpatched software on a server'),
  correctMark('B) A deceptive message designed to trick you into revealing information or clicking a malicious link'),
  wrongOption('C) A type of malware that encrypts files and demands a ransom payment'),
  wrongOption('D) A physical intrusion into an office to steal hardware'),
  explanationBox('Phishing uses deceptive messages — emails, texts, or calls — to manipulate people psychologically. It exploits trust and urgency rather than technical vulnerabilities.'),

  h3('Question 2 — Multiple Choice'),
  body('What is the primary purpose of multi-factor authentication (MFA)?'),
  wrongOption('A) To replace your password with a more secure alternative'),
  wrongOption('B) To encrypt your internet traffic so others cannot intercept it'),
  correctMark('C) To ensure that a stolen password alone is not enough to access your account'),
  wrongOption('D) To automatically detect and block phishing emails before they reach your inbox'),
  explanationBox('MFA adds a second verification step so that a stolen password alone is insufficient to gain access. It is one of the most effective controls available.'),

  h3('Question 3 — True / False'),
  body('A website displaying a padlock icon and HTTPS is always safe to use.'),
  correctMark('Answer: FALSE'),
  explanationBox('HTTPS only confirms the connection is encrypted — it does not confirm the website is legitimate. Phishing sites routinely use HTTPS. Always verify the full domain name carefully.'),

  h3('Question 4 — Multiple Choice'),
  body('What should you do immediately if you accidentally click a suspicious link?'),
  wrongOption('A) Run an antivirus scan while continuing to work normally if nothing seems wrong'),
  wrongOption('B) Close the browser tab and change your password later that evening'),
  wrongOption('C) Shut the device down immediately to stop any malware from spreading'),
  correctMark('D) Disconnect from the internet and contact your IT security team right away'),
  explanationBox('Speed matters. Disconnecting prevents malware from communicating with external servers. Your security team has specialist tools — do not attempt to fix it yourself.'),

  pageBreak(),

  // ═══════════════════════════════════════════════════════════
  // PAGE 12 — MCQ
  // ═══════════════════════════════════════════════════════════
  pageHeader(12, 'Password Security: Test Yourself', 'Multiple Choice (MCQ)'),
  labelValue('Purpose', 'A standalone question reinforcing one of the most important personal security behaviours'),
  divider(),
  h3('Question'),
  body('A colleague suggests using the same strong password across all their work accounts because it would take a supercomputer years to crack it. What is the biggest risk with this approach?'),
  wrongOption('A) The password may still not be long enough to be truly uncrackable'),
  correctMark('B) If any one of those accounts is breached, all other accounts immediately become vulnerable to credential stuffing'),
  wrongOption('C) Strong passwords with symbols are harder to type quickly and reduce productivity'),
  wrongOption('D) Using the same password is actually recommended by most IT security teams to reduce complexity'),
  spacer(),
  explanationBox('Password strength matters — but it is only one factor. Even a very strong password becomes a serious liability when reused across multiple accounts. Data breaches at any one service expose that password to attackers, who automatically test it against hundreds of other sites within hours. Unique passwords ensure a breach of one account cannot unlock all the others.'),

  pageBreak(),

  // ═══════════════════════════════════════════════════════════
  // PAGE 13 — MULTIPLE SELECT
  // ═══════════════════════════════════════════════════════════
  pageHeader(13, 'Spot the Phishing Red Flags', 'Multiple Select'),
  labelValue('Purpose', 'Learners identify which characteristics in a list are warning signs of a phishing email'),
  divider(),
  h3('Question — Select ALL that apply'),
  body('Which of the following characteristics suggest an email may be a phishing attempt?'),
  correctMark('A) The sender\'s email address domain does not match the organisation it claims to represent'),
  correctMark('B) The email creates strong urgency and asks you to take immediate action to avoid a negative consequence'),
  wrongOption('C) The email is addressed to you by your full name and references a specific recent order you placed'),
  correctMark('D) The email asks you to click a link and enter your login credentials to "verify your account"'),
  correctMark('E) The email uses a generic greeting such as "Dear Valued Customer" rather than your name'),
  spacer(),
  explanationBox('A, B, D and E are classic phishing indicators: spoofed sender addresses, artificial urgency, credential harvesting requests, and generic greetings are all deliberate tactics. Option C — a personalised greeting with reference to a real recent transaction — suggests the email is more likely genuine, since phishing attacks are typically sent to thousands of people at once.'),

  pageBreak(),

  // ═══════════════════════════════════════════════════════════
  // PAGE 14 — TRUE / FALSE
  // ═══════════════════════════════════════════════════════════
  pageHeader(14, 'Data Protection: Fact or Myth?', 'True / False'),
  labelValue('Purpose', 'Challenge a common misconception about data protection responsibility'),
  divider(),
  h3('Statement'),
  body('Under data protection regulations, individual employees who handle customer data are personally exempt from responsibility — only the organisation itself is legally accountable.'),
  spacer(),
  correctMark('Answer: FALSE'),
  spacer(),
  explanationBox('While organisations bear primary regulatory accountability under data protection legislation such as GDPR, individual employees can face personal consequences for deliberate or seriously negligent mishandling of personal data. Employment law, professional standards, and contractual obligations all place clear responsibilities on individuals who handle personal information. Data protection is a shared responsibility — not something that belongs exclusively to the legal or compliance team.'),

  pageBreak(),

  // ═══════════════════════════════════════════════════════════
  // PAGE 15 — FILL IN THE BLANKS
  // ═══════════════════════════════════════════════════════════
  pageHeader(15, 'Complete the Security Statements', 'Fill in the Blanks'),
  labelValue('Purpose', 'Reinforce three core vocabulary terms through active recall'),
  labelValue('Instructions', 'Type the missing cybersecurity terms to complete the sentence.'),
  divider(),
  h3('Sentence (enter as-is; app will render the blanks)'),
  new Paragraph({
    children: [
      new TextRun({ text: '"A ', size: 22, color: DARK_TEXT, font: 'Calibri' }),
      new TextRun({ text: '[BLANK 1]', bold: true, size: 22, color: 'B45309', font: 'Calibri' }),
      new TextRun({ text: ' attack occurs when criminals send deceptive emails to trick employees into revealing passwords or installing malicious software, while ', size: 22, color: DARK_TEXT, font: 'Calibri' }),
      new TextRun({ text: '[BLANK 2]', bold: true, size: 22, color: 'B45309', font: 'Calibri' }),
      new TextRun({ text: ' is the term for any program specifically designed to damage or gain unauthorised access to a computer system, and ', size: 22, color: DARK_TEXT, font: 'Calibri' }),
      new TextRun({ text: '[BLANK 3]', bold: true, size: 22, color: 'B45309', font: 'Calibri' }),
      new TextRun({ text: ' adds a second layer of account protection beyond a password by requiring a one-time code."', size: 22, color: DARK_TEXT, font: 'Calibri' }),
    ],
    shading: { type: ShadingType.SOLID, color: 'FFFBEB', fill: 'FFFBEB' },
    spacing: { before: 100, after: 200 },
    indent: { left: convertInchesToTwip(0.15) },
  }),
  labelValue('Blank 1 correct answer', 'phishing  |  alternatives: Phishing'),
  labelValue('Blank 2 correct answer', 'malware  |  alternatives: Malware, malicious software'),
  labelValue('Blank 3 correct answer', 'multi-factor authentication  |  alternatives: MFA, two-factor authentication, 2FA'),

  pageBreak(),

  // ═══════════════════════════════════════════════════════════
  // PAGE 16 — MATCHING
  // ═══════════════════════════════════════════════════════════
  pageHeader(16, 'Match the Threat', 'Matching'),
  labelValue('Purpose', 'Consolidate knowledge of five key terms by matching each to its correct definition'),
  labelValue('Instructions', 'Match each cybersecurity term on the left to its correct definition on the right.'),
  divider(),
  ...[
    ['Ransomware',                   'Malware that encrypts your files and demands payment in exchange for the decryption key'],
    ['Pretexting',                   'A social engineering technique where the attacker invents a scenario — such as posing as IT support — to extract information'],
    ['Credential Stuffing',          'An automated attack that tests stolen username/password combinations across multiple websites'],
    ['VPN (Virtual Private Network)','A tool that encrypts your internet traffic and secures your connection on public or untrusted networks'],
    ['Least Privilege',              'The security principle of granting users only the access they need to perform their specific role'],
  ].map(([term, def]) => matchingRow(term, def)),
  spacer(),

  pageBreak(),

  // ═══════════════════════════════════════════════════════════
  // PAGE 17 — SUMMARY & TAKEAWAYS
  // ═══════════════════════════════════════════════════════════
  pageHeader(17, 'What You Have Learned', 'Summary & Takeaways'),
  labelValue('Purpose', 'Recap the six most important learning points and direct learners to the final assessment'),
  divider(),
  h3('Title'),
  body('What You Have Learned'),
  h3('Intro Text'),
  body('You have now covered the essential foundations of cybersecurity awareness. Here are the most important points to carry with you — in the workplace and beyond.'),
  h3('Key Takeaway Points'),
  ...[
    ['Every employee is a target.',             'Cybercriminals do not discriminate by seniority — a compromised junior account can unlock an entire organisation.',                         'HIGH'],
    ['Phishing is the most common entry point.','Always verify unexpected messages before clicking links, opening attachments, or providing any information.',                                'normal'],
    ['Strong, unique passwords and MFA.',       'Use a password manager and enable multi-factor authentication on every account that supports it.',                                          'HIGH'],
    ['Malware is often invisible.',             'Keep your software updated and ensure antivirus protection is active — even when your device appears to be working normally.',              'normal'],
    ['Social engineering exploits trust.',      'Slow down, question unusual requests, and always verify identities through a separate, trusted channel before sharing anything sensitive.', 'normal'],
    ['Reporting quickly is critical.',          'There is no such thing as an over-reported security concern — act fast, be honest, and involve your security team immediately.',            'HIGH'],
  ].map(([heading, text, emphasis]) =>
    new Paragraph({
      children: [
        new TextRun({ text: `${emphasis === 'HIGH' ? '★ ' : '• '}${heading}  `, bold: true, size: 21, color: emphasis === 'HIGH' ? BRAND_BLUE : ACCENT_TEAL, font: 'Calibri' }),
        new TextRun({ text, size: 21, color: DARK_TEXT, font: 'Calibri' }),
      ],
      shading: emphasis === 'HIGH' ? { type: ShadingType.SOLID, color: 'DBEAFE', fill: 'DBEAFE' } : undefined,
      spacing: { before: 80, after: 80 },
      indent: { left: convertInchesToTwip(0.1) },
    })
  ),
  spacer(),
  labelValue('Closing remark', 'Cybersecurity is not a one-time task — it is an ongoing habit. The awareness you have built in this course will help protect you, your colleagues, and your organisation every single day.'),
  labelValue('Next steps',     'Proceed to the Final Assessment to test your knowledge across all five modules. You need 80% or higher to pass and earn your certificate of completion.'),
  labelValue('Button text',    'Start Final Assessment'),

  pageBreak(),

  // ═══════════════════════════════════════════════════════════
  // PAGE 18 — FINAL ASSESSMENT
  // ═══════════════════════════════════════════════════════════
  pageHeader(18, 'Final Assessment', 'Final Assessment'),
  labelValue('Passing score',  '80% (7 of 8 correct)'),
  labelValue('Instructions',   'Answer all 8 questions. You need to score 80% or higher to pass and receive your certificate of completion.'),
  divider(),

  h3('Question 1 — Multiple Choice (1 pt)'),
  body('What does the term "phishing" describe?'),
  wrongOption('A) A software vulnerability that allows attackers to access systems remotely'),
  correctMark('B) The use of deceptive messages to trick people into revealing credentials or installing malware'),
  wrongOption('C) A method of encrypting sensitive data before it is transmitted'),
  wrongOption('D) The process of scanning a network to discover connected devices'),
  explanationBox('Phishing uses deception — email, text, or voice messages — to manipulate people psychologically rather than exploiting technical vulnerabilities. It is the most common initial stage of a cyberattack.'),

  h3('Question 2 — Multiple Choice (1 pt)'),
  body('Which is the safest approach to managing passwords across multiple accounts?'),
  wrongOption('A) Using one complex password for all accounts because it is easier to remember'),
  wrongOption('B) Writing passwords in a notebook kept in a locked desk drawer'),
  correctMark('C) Using a trusted password manager to generate and store a unique password for each account'),
  wrongOption('D) Changing every password to the same new one each month'),
  explanationBox('A password manager generates strong, unique passwords for every account and stores them securely, eliminating both the risk of password reuse and the cognitive burden of remembering dozens of complex credentials.'),

  h3('Question 3 — True / False (1 pt)'),
  body('Malware always causes obvious, immediate symptoms such as pop-ups or system slowdowns.'),
  correctMark('Answer: FALSE'),
  explanationBox('Many malware types — particularly spyware and certain ransomware strains — are designed to operate silently for extended periods, collecting credentials or waiting for activation with no visible impact on device performance.'),

  h3('Question 4 — Multiple Choice (1 pt)'),
  body('An attacker calls claiming to be from IT support and asks you to confirm your password to fix a problem. What should you do?'),
  wrongOption('A) Provide the information — IT staff have a legitimate need to access accounts'),
  wrongOption('B) Ask for their employee ID, then provide the details if they supply one'),
  correctMark('C) Refuse to provide your credentials and report the call to your actual IT security team'),
  wrongOption('D) Change your password immediately, then provide the new one to the caller'),
  explanationBox('Legitimate IT teams never need to ask for your password — they have system-level tools to manage accounts. This is a classic vishing (voice phishing) social engineering attack designed to exploit your trust in authority.'),

  h3('Question 5 — Multiple Choice (1 pt)'),
  body('What is the correct first action if you suspect your device has been infected with malware?'),
  wrongOption('A) Run a full antivirus scan while continuing to work normally'),
  wrongOption('B) Shut down the device immediately to prevent further spread'),
  correctMark('C) Disconnect from the network and contact your IT security team'),
  wrongOption('D) Locate and delete any suspicious files you can find, then monitor the device'),
  explanationBox('Disconnecting from the network prevents malware from communicating with external servers or spreading to other systems. Shutting down can destroy forensic evidence. Contact the team immediately — do not attempt to fix it yourself.'),

  h3('Question 6 — True / False (1 pt)'),
  body('If an attacker has your password, multi-factor authentication (MFA) can still prevent them from accessing your account.'),
  correctMark('Answer: TRUE'),
  explanationBox('MFA requires a second verification factor — such as a time-sensitive code sent to your phone — in addition to your password. A stolen password alone is insufficient to gain access, making MFA one of the most effective individual account protections available.'),

  h3('Question 7 — Multiple Choice (1 pt)'),
  body('Which of the following best describes the principle of "least privilege"?'),
  wrongOption('A) Employees should receive the minimum salary needed for their role to reduce organisational costs'),
  correctMark('B) Users should only have access to the data and systems necessary for their specific job'),
  wrongOption('C) Software should be installed with the minimum number of features enabled'),
  wrongOption('D) Security incidents should only be reported if the potential financial damage exceeds a set threshold'),
  explanationBox('Least privilege limits the potential impact of a compromised account by ensuring users cannot access systems or data beyond what their role genuinely requires. It is a foundational principle of good security design.'),

  h3('Question 8 — Multiple Choice (1 pt)'),
  body('You receive an email that appears to be from your CEO, marked urgent, asking you to make an immediate bank transfer to a new supplier. What is the correct response?'),
  wrongOption('A) Process the transfer — the CEO\'s authority takes precedence over standard procedures'),
  wrongOption('B) Reply to the email asking for a purchase order number before proceeding'),
  wrongOption('C) Forward it to the Finance team and let them decide according to standard procedures'),
  correctMark('D) Verify the request directly with the CEO via a known phone number or in person before taking any action'),
  explanationBox('This describes a "CEO fraud" or "business email compromise" attack — one of the most financially damaging forms of cybercrime. Always verify unusual financial requests through a separate, independently confirmed channel. Never rely on replying to the same email thread.'),

  pageBreak(),

  // ═══════════════════════════════════════════════════════════
  // PAGE 19 — COMPLETION CERTIFICATE
  // ═══════════════════════════════════════════════════════════
  pageHeader(19, 'Certificate of Completion', 'Completion Certificate'),
  labelValue('Purpose', 'Award learners who achieve 80% or higher on the final assessment'),
  divider(),
  labelValue('Certificate title',     'Certificate of Completion'),
  labelValue('Course title (formal)', 'Cybersecurity Basics for Every Employee'),
  labelValue('Organisation name',     '[Your Organisation Name]'),
  labelValue('Recipient label',       'This is to certify that'),
  labelValue('Completion message',    'has successfully completed Cybersecurity Basics for Every Employee and demonstrated the knowledge and skills required to identify, avoid, and respond to common cybersecurity threats in the workplace.'),
  labelValue('Date label',            'Date of Completion'),
  labelValue('Show date',             'Yes'),
  labelValue('Show score',            'Yes'),
  labelValue('Score suffix',          '% — Pass'),
  spacer(),

  divider(),

  // ── END ──────────────────────────────────────────────────────
  new Paragraph({
    children: [new TextRun({ text: 'END OF STORYBOARD', bold: true, size: 22, color: BRAND_BLUE, font: 'Calibri' })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 80 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '19 pages · All templates used · Cybersecurity Basics for Every Employee · May 2026', size: 18, color: MUTED_TEXT, font: 'Calibri' })],
    alignment: AlignmentType.CENTER,
  }),
];

// ── Build & save ──────────────────────────────────────────────

const doc = new Document({
  creator: 'e-learning-frontend',
  title: 'Cybersecurity Basics — Course Storyboard',
  description: 'Full storyboard document for the Cybersecurity Basics for Every Employee demo course',
  styles: {
    default: {
      document: {
        run: { font: 'Calibri', size: 22 },
      },
    },
  },
  sections: [{
    properties: {
      page: {
        margin: {
          top:    convertInchesToTwip(0.75),
          bottom: convertInchesToTwip(0.75),
          left:   convertInchesToTwip(0.9),
          right:  convertInchesToTwip(0.9),
        },
      },
    },
    children,
  }],
});

const outPath = path.join(__dirname, '..', 'docs', 'continuation', 'STORYBOARD_Cybersecurity_Basics.docx');
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(outPath, buf);
  console.log(`✅ Storyboard saved to: ${outPath}`);
});
