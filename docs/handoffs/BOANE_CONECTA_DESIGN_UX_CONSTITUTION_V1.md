# BOANE CONECTA — DESIGN & UX CONSTITUTION V1

**Status:** Canonical design-system, UI/UX, refactor and visual quality specification
**Project:** Boane Conecta
**Repository:** `F:\codebases777\BoaneConeta\repo`
**Active frontend branch:** `feat/frontend-v2-foundation`
**Depends on:**
- `BOANE_CONECTA_WORK_MASTER_HANDOFF_V1.md`
- `BOANE_CONECTA_RESPONSIVE_WIREFRAME_ATLAS_V1.md`
- `FRONTEND_F0_FOUNDATION.md`

**Purpose:** establish the non-negotiable visual, interaction, UX, design-system, refactor and frontend craft rules required to make Boane Conecta feel like a high-quality civic digital service product rather than an AI-generated template.

---

# 0. AUTHORITY AND SCOPE

This document is the canonical design and UX constitution for Boane Conecta.

It governs:

- visual hierarchy;
- page composition;
- design-system decisions;
- interaction behavior;
- responsive craft;
- accessibility;
- content density;
- component boundaries;
- refactor decisions;
- animation/motion;
- public-service UX;
- citizen workflows;
- staff/admin workflows;
- executive workflows;
- visual QA;
- design QA;
- anti-patterns;
- AI-assisted design usage;
- handoff quality;
- implementation fidelity.

It does not override product/domain/security architecture.

Authority order:

1. Product/domain/security decisions — Master Handoff
2. Screen inventory/use cases/responsive behavior — Responsive Wireframe Atlas
3. Implemented technical baseline — F0 Foundation
4. Visual/UI/UX/refactor quality — this Constitution

When two rules appear to conflict, prefer the rule that protects:

1. user task completion;
2. accessibility;
3. information integrity;
4. domain correctness;
5. responsive usability;
6. visual clarity;
7. aesthetic expression.

---

# 1. DESIGN NORTH STAR

Boane Conecta must feel like a civic digital service platform designed by a mature public-sector product team.

The interface should communicate:

- legitimacy;
- reliability;
- clarity;
- competence;
- accessibility;
- civic responsibility;
- modernity without trend dependence;
- operational seriousness;
- local relevance;
- technological quality.

The interface must not communicate:

- startup template;
- crypto dashboard;
- gaming UI;
- generic SaaS landing page;
- design exercise;
- AI-generated demo;
- marketing microsite pretending to be an operational system.

---

# 2. THE ANTI-“AI SLOP” RULESET

Reject by default:

- giant cards with no structural reason;
- decorative metrics;
- gradient-heavy hero sections;
- purple/blue SaaS gradients;
- unnecessary glow;
- glassmorphism without semantic purpose;
- translucent cards over photos;
- floating blobs;
- fake 3D illustrations;
- feature-card grids that merely repeat icons/titles/text;
- arbitrary icon containers;
- oversized pills;
- excessive rounded corners;
- exaggerated shadows;
- “premium” whitespace with no information hierarchy;
- random use of serif fonts;
- mixed typography systems;
- decorative animation on every component;
- hover elevation on every card;
- generic dashboards full of counters;
- duplicated sections with different titles but identical layouts;
- fabricated testimonials, statistics or municipal facts;
- marketing copy that hides the actual task.

Every visual decision must answer:

> What functional, semantic or communicative problem does this solve?

If the answer is only “it looks modern”, the decision is insufficient.

---

# 3. COMPOSITION BEFORE DECORATION

Every screen must define, in order:

1. **context** — where the user is;
2. **primary question** — what the user needs to understand or do;
3. **priority information** — what matters now;
4. **primary action** — the next best action;
5. **secondary actions** — less important choices;
6. **metadata** — contextual details;
7. **history/detail** — lower priority information.

Do not start screen design by choosing cards, colors or illustration.

Start with the information structure.

---

# 4. VISUAL HIERARCHY

Use hierarchy through:

- type scale;
- font weight;
- spacing;
- alignment;
- grouping;
- borders;
- surface contrast;
- layout proportion;
- content ordering;
- restrained color;
- progressive disclosure.

Do not rely on:

- huge font size;
- random bolding;
- shadows;
- saturated colors;
- background blocks for every section.

Hierarchy should remain understandable in grayscale.

---

# 5. ALIGNMENT

Prefer strong, repeatable axes.

Rules:

- align page title, search, main content and section boundaries;
- align metadata labels;
- align table columns;
- align action groups;
- align visual baselines;
- avoid decorative misalignment;
- avoid centered text for operational content;
- reserve centered compositions for narrow, low-complexity states.

If two things belong together semantically, their alignment should reinforce that relationship.

---

# 6. PROXIMITY

Use proximity to express semantic grouping.

Closer:
- label + input;
- service title + metadata;
- status + next action;
- case title + current state;
- document + validation state.

Farther:
- unrelated sections;
- distinct workflow stages;
- unrelated actions.

Do not use boxes merely because spacing was not resolved correctly.

---

# 7. CONTRAST

Contrast can come from:

- scale;
- weight;
- spacing;
- value;
- border;
- surface;
- structure;
- limited semantic color.

Do not solve every distinction with color.

Primary action should be visually dominant, but not excessively loud.

---

# 8. RHYTHM

Spacing must come from the system.

Canonical scale:

- 4
- 8
- 12
- 16
- 24
- 32
- 48
- 64
- 80
- 96

Use spacing rhythm consistently.

Do not create:

- 13 px
- 17 px
- 27 px
- 43 px

without a strong, documented need.

---

# 9. WHITESPACE

Whitespace is for:

- semantic grouping;
- readability;
- hierarchy;
- task separation;
- focus.

Whitespace is not a substitute for product thinking.

A municipal operational screen with large empty areas and tiny content clusters is not “premium”.

Density must fit the use case.

---

# 10. DENSITY PRINCIPLES

## Public

Comfortable.

Users need:
- discovery;
- confidence;
- readable content.

## Citizen

Standard.

Users need:
- clear actions;
- progress;
- forms;
- tracking.

## Admin

Compact.

Staff need:
- throughput;
- scanning;
- comparison;
- action.

## Executive

Selective.

Executives need:
- exception visibility;
- decision clarity;
- trends;
- agenda.

Do not apply one density mode to the whole system.

---

# 11. TYPOGRAPHY CONSTITUTION

Primary:
**DM Sans**

Weights:
- 400
- 500
- 600
- 700

No global Playfair.

Institutional serif:
only explicit, sparse use through `font-institutional`.

Use serif only where a document/editorial/institutional tone genuinely benefits.

Never mix multiple heading fonts casually.

## Desktop scale

- Display L: 64/68
- Display: 56/60
- H1: 44/52
- H2: 36/44
- H3: 28/36
- H4: 22/30
- Body L: 18/28
- Body: 16/24
- Body S: 14/20
- Caption: 12/16

## Mobile scale

- Display: 38–40
- H1: 30–32
- H2: 26–28
- H3: 22
- H4: 18–20
- Body: 16
- Small: 14
- Caption: 12

## Line length

Editorial reading:
60–75 characters.

Operational:
shorter columns as required.

---

# 12. COPY AND CONTENT STYLE

UI copy should be:

- direct;
- human;
- specific;
- task-oriented;
- respectful;
- plain-language;
- locally understandable.

Avoid:

- vague slogans;
- generic innovation language;
- “transforming the future” copy;
- unnecessary English;
- excessive institutional jargon;
- raw backend state names in citizen UI.

Citizen state:
“Em análise”

not:
`IN_REVIEW`

Internal staff states may use operational vocabulary when helpful.

---

# 13. COLOR RULES

Colors are semantic roles, not decoration.

Use:

- brand-primary
- brand-primary-hover
- brand-primary-subtle
- success
- warning
- danger
- info

Surfaces:

- canvas
- surface
- surface-subtle
- surface-raised
- surface-inverse

Do not state provisional colors are official municipal colors.

Do not use brand color for every action/status.

Do not map all:
- green = good;
- red = bad;
- orange = warning

without text labels.

---

# 14. BORDER RULES

Prefer subtle borders for separation.

Use borders for:

- tables;
- list rows;
- panels;
- form controls;
- context boundaries;
- navigation separation.

Avoid boxing every element.

---

# 15. SHADOW RULES

Canonical:
- xs
- sm
- md

Default:
no shadow.

Use elevation only when the element is physically/interactionally raised:

- menu;
- dialog;
- popover;
- sticky overlay;
- temporary floating panel.

Do not use shadow to make static page sections “premium”.

---

# 16. RADIUS RULES

Canonical:

- 4
- 6
- 8
- 12
- 16

Avoid excessive 20–32 px card radii.

`rounded-full` reserved for:

- avatars;
- icon circles;
- status dot;
- true pills when semantically appropriate.

---

# 17. ICONOGRAPHY

Use Lucide.

Canonical sizes:

- 16
- 20
- 24
- 32 exceptional

Rules:

- icon accompanies meaning;
- icon does not replace text when ambiguity exists;
- do not wrap every icon in a decorative square;
- do not mix stroke styles;
- do not use icons as visual filler.

---

# 18. PHOTOGRAPHY

Photography must be:

- real;
- relevant;
- local;
- documentary/service-oriented;
- validated.

Avoid:

- stock government imagery;
- fake African city photography;
- AI-generated municipal people presented as real;
- random skyline imagery;
- generic “team collaborating” images.

If no validated photo exists:
use typography and layout instead.

---

# 19. ILLUSTRATION

Do not default to illustration.

Illustration may be used only when:

- it explains a process;
- it supports onboarding;
- it communicates an abstract concept;
- it is clearly non-documentary.

Never use AI-generated “municipal citizens” imagery that could be mistaken for real local people/events.

---

# 20. DESIGN SYSTEM STRUCTURE

Design-system layers:

```text
tokens
→ primitives
→ components
→ patterns
→ shells
→ features
→ pages
```

Do not reverse this hierarchy.

Pages should not define new foundational visual language.

---

# 21. TOKENS

Tokens must represent meaning.

Prefer:

- `surface-subtle`
- `text-muted`
- `border-default`
- `action-primary`

over:
- `gray-200`
- `green-700`

inside high-level feature code when semantic mappings exist.

---

# 22. PRIMITIVES

Canonical:

- Container
- Section
- Stack
- Inline
- Grid
- Split

Add new primitives only when repeated structural behavior is proven.

Avoid “design-system explosion”.

---

# 23. COMPONENT RULES

A component should exist when it has:

- repeated semantics;
- repeated behavior;
- repeated accessibility responsibility;
- repeated visual contract.

Do not componentize every `<div>`.

Do not create a generic `Card` abstraction to solve every layout.

---

# 24. CARD POLICY

Cards are allowed.

Cards are not the default page grammar.

Use a card when the content is:

- a distinct object;
- independently actionable;
- movable/reorderable;
- meaningfully bounded.

Do not use cards merely because sections need padding.

Prefer:
- list rows;
- editorial sections;
- tables;
- split layouts;
- border-separated groups.

---

# 25. BUTTON RULES

Variants:

- primary
- secondary
- outline
- ghost
- danger
- link

Sizes:
- sm
- md
- lg

Rules:

- one clear primary action per action context;
- destructive action should not be visually equal to normal primary;
- avoid many full-width buttons on desktop;
- mobile may use full-width primary action;
- minimum practical touch target around 44px.

Do not create:
- success button;
- info button;
- hero button

as semantic button families.

Those are context-specific presentation problems.

---

# 26. LINK VS BUTTON

Use link:
navigation.

Use button:
state-changing action.

Do not style navigation as fake buttons everywhere.

---

# 27. FORM RULES

Every control needs:

- label;
- control;
- optional help;
- error.

States:

- default;
- focus;
- error;
- disabled;
- read-only.

Do not use placeholder as label.

Do not validate every field before the user interacts.

Prefer:
- validation on blur;
- validation on continue;
- server validation on submit.

---

# 28. FORM LAYOUT

Mobile:
one column.

Desktop:
still one primary form column unless field relationships genuinely benefit from two columns.

Avoid huge two-column forms.

Form width:
640–800 px.

---

# 29. FIELD GROUPING

Group by user mental model.

Examples:
- identity;
- contact;
- address;
- request details;
- documents.

Do not group based on database table structure.

---

# 30. GUIDED FORMS

Long public forms must use steps.

Rules:

- progress visible;
- no false precision;
- keep number of steps reasonable;
- autosave;
- preserve progress;
- resume after reauth;
- review before submit.

---

# 31. INPUT MOBILE RULES

Use correct:

- `inputMode`
- `type`
- autocomplete
- date input strategy
- numeric keyboard

Avoid font sizes below 16px where iOS zoom could occur.

---

# 32. ERROR UX

Errors must answer:

- what happened;
- what can the user do;
- whether data is preserved;
- whether retry is safe.

Never show:

- stack trace;
- `Failed to fetch`;
- raw SQL;
- raw HTTP exception;
- unknown JSON.

---

# 33. ERROR SUMMARY

Long forms need an error summary when multiple fields fail.

Focus should move appropriately.

Fields must retain inline messages.

---

# 34. LOADING UX

Loading should preserve expected layout.

Prefer:
- skeleton region;
- inline progress;
- local pending state.

Avoid:
- page-wide spinner;
- blocking entire dashboard for one request.

---

# 35. EMPTY STATES

Empty state anatomy:

1. what is empty;
2. why that may be;
3. what to do next.

No generic astronaut illustration.

---

# 36. PARTIAL DATA

Public home/dashboard sections must fail independently.

A failed News request must not hide Services.

A failed chart must not blank the executive screen.

---

# 37. OFFLINE UX

Public:
show network issue and cached/stale content where available.

Citizen:
allow safe local continuation only where appropriate.

Do not claim submission succeeded offline.

Do not keep sensitive document content casually in localStorage.

---

# 38. STALE DATA

Show freshness when stale data could affect action.

Examples:
- queue;
- executive indicators;
- appointments availability.

---

# 39. SEARCH UX

Search must distinguish:

- global search;
- catalog search;
- table search;
- command search.

Do not use one universal search component without contextual behavior.

---

# 40. FILTER UX

Mobile:
sheet/bottom sheet.

Desktop:
persistent or popover filters where density requires.

Keep applied filter state visible.

Allow clear/reset.

Use URL state for public/catalog search where shareability matters.

---

# 41. TABLE UX

Admin tables are legitimate.

Do not convert desktop operational tables into cards to look “modern”.

Tables need:

- meaningful headers;
- sortable columns where useful;
- compact density;
- row action strategy;
- loading;
- empty;
- pagination;
- permission-aware controls.

---

# 42. MOBILE TABLE STRATEGY

Every table must explicitly choose:

1. horizontal scroll;
2. collapse;
3. record list;
4. desktop-only.

Default for operational mobile:
record list.

---

# 43. LIST ROWS

ListRow is first-class.

Use for:

- services;
- requests;
- payments;
- alerts;
- notifications;
- mobile admin queues;
- protocol records.

A row should expose:
- identity/title;
- key metadata;
- state;
- next action/chevron.

---

# 44. STATUS UI

Status should answer:

- what state is it in;
- is action required;
- is it late;
- is it blocked.

Use:
- StatusDot;
- StatusText;
- StatusBadge.

Do not over-pill.

---

# 45. ACTION REQUIRED

`ActionRequired` is a first-class pattern.

It should be visually prominent because it changes user priority.

Use in:
- citizen request;
- payment;
- document correction;
- staff cases;
- executive decisions.

---

# 46. ALERT UX

Levels:

- InlineAlert
- PageAlert
- SystemBanner
- EmergencyAlert

Severity != status.

Emergency must be visually distinct without causing panic or inaccessible color usage.

---

# 47. DIALOGS

Use dialogs for:

- confirmation;
- small decisions;
- compact forms;
- high-risk action verification.

Do not put long multi-section workflows into small dialogs.

---

# 48. SHEETS

Use:

Mobile:
- filters;
- menu;
- action selection;
- quick metadata.

Desktop:
- contextual preview;
- support;
- secondary detail.

---

# 49. TOASTS

Toast is transient.

Use for:
- save completed;
- copy success;
- non-critical mutation acknowledgment.

Do not use toast for:
- action required;
- submission failure with consequences;
- payment state;
- durable workflow state.

---

# 50. TIMELINE

Citizen:
simple, human.

Staff:
detailed operational.

Audit:
separate security history.

Do not show audit-level metadata to citizen.

---

# 51. DOCUMENT UX

Citizen states:

- pending;
- valid;
- invalid;
- expired;
- replaced;
- safe-processing language for quarantine/scanning.

Staff:
detailed validation status.

No scary malware terminology unless operationally necessary and authorized.

---

# 52. CALENDAR UX

Appointment:
availability/task oriented.

Staff:
schedule/capacity oriented.

Executive:
agenda/decision oriented.

Do not use the same calendar component contract for all.

---

# 53. QUEUE UX

Citizen:
clarity and reassurance.

Staff:
throughput and control.

Citizen should never be able to manipulate queue position/state.

---

# 54. DASHBOARD RULES

A dashboard must answer a question.

Public:
generally avoid dashboard.

Citizen:
“What requires my attention?”

Admin:
“What must I work on now?”

Executive:
“What is at risk / needs decision?”

Do not begin with KPI cards.

---

# 55. METRIC RULES

A number should appear only when:

- its definition is known;
- it supports decision/action;
- its freshness is known;
- its comparison is meaningful.

No decorative metrics.

---

# 56. CHART RULES

Charts require:

- clear question;
- correct chart type;
- scale clarity;
- accessible text/table alternative;
- no 3D;
- no unnecessary legend;
- no rainbow colors.

Do not add charts because dashboards “need charts”.

---

# 57. PUBLIC HOME RULES

Primary task:
service discovery.

Hero should:
- explain the service value;
- provide search;
- expose quick tasks.

Hero should not:
- be giant;
- use wallpaper by default;
- contain marketing slogans without utility.

---

# 58. PUBLIC HEADER RULES

Header must prioritize:

- Services
- Search
- Citizen area
- Main civic IA

Do not include:
- prominent Admin
- unverified phone/email/social
- multiple utility buttons competing with navigation.

---

# 59. PUBLIC FOOTER RULES

Footer is a navigation/support structure, not an information dump.

Only validated contacts.

Do not fabricate:
- hours;
- address;
- phone;
- email;
- social.

---

# 60. CITIZEN HOME RULES

Priority order:

1. Action Required
2. Active requests
3. Next appointment
4. Payment
5. Notifications
6. Secondary information

Avoid:
- welcome dashboards with meaningless stats.

---

# 61. ADMIN HOME RULES

Priority order:

1. critical exceptions;
2. work assigned;
3. unassigned work;
4. SLA risk;
5. queue/appointments;
6. recent operational events.

Avoid:
- six oversized metric cards.

---

# 62. CASE WORKSPACE RULES

The case screen must always reveal:

- current state;
- current action;
- applicant context;
- service context;
- assignee;
- SLA;
- documents;
- messages;
- notes;
- timeline.

Primary action is contextual.

---

# 63. CITIZEN MESSAGES VS INTERNAL NOTES

Never mix.

Citizen message:
visible externally.

Internal note:
staff only.

UI must make the distinction obvious before input.

---

# 64. DECISION UX

Decision actions require:

- explicit decision;
- rationale;
- public explanation if relevant;
- confirmation;
- reauth for high risk;
- immutable record.

Avoid accidental approval via ambiguous buttons.

---

# 65. FINANCE UX

Finance uses exception-driven design.

Normal confirmed transactions should not demand staff attention.

Prioritize:
- mismatch;
- duplicate;
- unmatched;
- failed;
- manual review.

---

# 66. PROTOCOL UX

Protocol is formal institutional work.

Avoid contact-form visual language.

Use:
- reference;
- type;
- sender;
- destination;
- priority;
- deadline;
- state;
- history.

---

# 67. FUNDING UX

Funding applications should feel rigorous and transparent.

Must clearly show:

- eligibility;
- deadline;
- requirements;
- application progress;
- review status;
- requested corrections;
- decisions.

No AI auto-decision.

---

# 68. EXECUTIVE UX

Executive UI must minimize operational noise.

Prioritize:
- exceptions;
- decisions;
- agenda;
- risk;
- trend.

Avoid:
- case-level PII by default;
- giant operational tables;
- vanity statistics.

---

# 69. ACCESSIBILITY CONSTITUTION

Must support:

- visible focus;
- keyboard navigation;
- semantic landmarks;
- heading hierarchy;
- labels;
- error associations;
- 200% zoom;
- reduced motion;
- color-independent meaning;
- screen-reader clarity;
- touch target sizing.

Accessibility is part of done, not post-processing.

---

# 70. FOCUS DESIGN

Focus must be visible and consistent.

Never remove outline without replacement.

Focus order must follow reading/task order.

Overlay closing must return focus to the triggering control.

---

# 71. KEYBOARD

Critical paths must work without mouse.

Examples:
- public navigation;
- service search;
- form completion;
- dialog interaction;
- admin table actions;
- case workflow.

---

# 72. REDUCED MOTION

Respect `prefers-reduced-motion`.

Disable:
- non-essential entrance;
- smooth scroll where problematic;
- decorative transform.

Keep necessary state transitions understandable.

---

# 73. MOTION CONSTITUTION

Durations:

- fast 140 ms
- standard 200 ms
- slow 280 ms

Motion may explain:
- menu open;
- disclosure;
- dialog;
- selection;
- state transition.

Motion must not become the visual identity.

---

# 74. RESPONSIVE DESIGN RULE

Every viewport must feel intentionally composed.

Do not simply stack desktop columns.

For each breakpoint ask:

- what is primary?
- what can move below?
- what becomes a sheet?
- what becomes bottom navigation?
- what can be hidden?
- what must remain visible?
- does touch change interaction?
- does density need changing?

---

# 75. MOBILE DESIGN

Mobile is a primary interface.

Requirements:

- 320 px minimum;
- no accidental horizontal overflow;
- thumb-friendly action placement;
- safe-area support;
- meaningful sticky actions;
- readable forms;
- no tiny controls;
- no desktop sidebar squeezed into drawer without IA review.

---

# 76. TABLET DESIGN

Tablet is not “large mobile”.

Use:
- 8-column grid;
- more persistent context;
- drawer/rail;
- dual-pane where beneficial.

---

# 77. DESKTOP DESIGN

Desktop should exploit width for:

- context;
- comparison;
- productivity;
- metadata;
- tables;
- two-region workspaces.

Do not stretch reading text to 1200 px.

---

# 78. WIDESCREEN DESIGN

At 1920+:
do not increase text width indefinitely.

Use:
- bounded container;
- additional context;
- controlled whitespace;
- better panel proportions.

---

# 79. 200% ZOOM

Must remain usable.

Avoid:
- fixed pixel viewport assumptions;
- clipped dialogs;
- sticky headers consuming entire view;
- inaccessible horizontal layouts.

---

# 80. REFACTOR PHILOSOPHY

Refactor incrementally.

Prioritize:

1. correctness;
2. architecture;
3. accessibility;
4. responsive behavior;
5. visual quality;
6. cleanup.

Do not rewrite working features solely to produce “cleaner” code.

---

# 81. REFACTOR RULE: PRESERVE BEHAVIOR FIRST

Before refactor:
understand current behavior.

After refactor:
verify same or intentionally changed behavior.

Do not conflate:
- visual redesign;
- domain rewrite;
- API migration;
- permissions rewrite

in one uncontrolled patch.

---

# 82. REFACTOR RULE: SMALL LOGICAL CHANGES

Prefer small coherent changes.

Examples:

- header IA;
- button normalization;
- service list migration;
- one route lazy-load group.

Avoid one commit changing:
- design tokens;
- auth;
- payments;
- home;
- admin;
- backend

simultaneously.

---

# 83. REFACTOR RULE: NO BIG-BANG FOLDER MOVE

Target structure is progressive.

Move code when:
- a feature is actively touched;
- ownership is clear;
- imports remain manageable;
- tests/build validate.

---

# 84. REFACTOR RULE: DO NOT PRESERVE BAD VISUAL COMPATIBILITY FOREVER

Temporary aliases are acceptable.

They must have:
- documented reason;
- migration path;
- removal target.

Do not let compatibility aliases become permanent design language.

---

# 85. REFACTOR RULE: NO GLOBAL CSS PATCHING OF FEATURE PROBLEMS

Do not fix a component problem with a broad global selector.

Prefer local, semantic component behavior.

---

# 86. REFACTOR RULE: NO RANDOM TAILWIND VALUES

Prefer tokens and canonical spacing.

Arbitrary values allowed only for:
- precise documented layout requirement;
- external integration constraint;
- unavoidable technical requirement.

---

# 87. REFACTOR RULE: TYPES

Avoid `any`.

Prefer:
- specific DTO;
- discriminated unions;
- `unknown` + narrowing for errors;
- domain state unions/enums.

Do not weaken TypeScript to make refactor pass.

---

# 88. REFACTOR RULE: ESLINT

Do not globally disable rules to obtain green CI.

Fix root cause.

---

# 89. REFACTOR RULE: ACCESSIBILITY

Do not remove semantics while redesigning.

Radix primitives should preserve:
- focus;
- keyboard;
- aria;
- dismissal behavior.

---

# 90. REFACTOR RULE: ROUTES

Do not change public routes casually.

Routing changes need:
- migration;
- redirects if public;
- API/deep-link awareness.

---

# 91. REFACTOR RULE: PERMISSIONS

Do not add more:
`role === "admin"`

Move gradually toward:
capabilities + scope + available actions.

---

# 92. REFACTOR RULE: API BOUNDARIES

Page components should not construct ad-hoc fetches.

Prefer:
- feature API;
- query hook;
- domain DTO;
- presentation component.

---

# 93. REFACTOR RULE: SERVER STATE

TanStack Query:
server state.

React Hook Form:
form/local input state.

Do not duplicate server data in random local state.

---

# 94. REFACTOR RULE: MUTATIONS

Critical workflow mutations should be explicit commands.

Avoid:
`PATCH status = APPROVED`

Prefer:
`POST /cases/{id}/approve`

when backend architecture supports it.

---

# 95. DESIGN QA PROCESS

Every redesigned screen goes through:

```text
Spec
→ Implement
→ Browser render
→ Screenshot
→ Visual audit
→ Responsive audit
→ Accessibility audit
→ Interaction audit
→ Code review
→ Build/lint/test
→ Freeze
```

No screen is approved directly from source code.

---

# 96. VISUAL QA CHECKLIST

Check:

- hierarchy;
- alignment;
- spacing;
- density;
- type scale;
- color contrast;
- border usage;
- radius consistency;
- icon consistency;
- card overuse;
- content realism;
- empty states;
- loading;
- error;
- responsive wrap;
- mobile touch;
- large-screen stretching.

---

# 97. SCREENSHOT QA

Required widths:

- 320
- 375
- 390
- 430
- 768
- 1024
- 1280
- 1440
- 1920

Screenshots should capture:
- top;
- middle;
- lower page;
- open menu;
- filters;
- dialogs;
- relevant state.

---

# 98. DESIGN REVIEW QUESTION SET

For every screen ask:

1. What is the user trying to accomplish?
2. Is the primary action obvious?
3. Is the most important information first?
4. Is anything visually loud without functional reason?
5. Are there unnecessary cards?
6. Is there unnecessary rounding?
7. Is there decorative motion?
8. Does mobile feel designed?
9. Does desktop use space productively?
10. Are states covered?
11. Are permissions safe?
12. Is any municipal fact invented?
13. Can it be used with keyboard?
14. Does 200% zoom work?
15. Does it look like a real municipal product?

---

# 99. PREMIUM QUALITY DOES NOT MEAN DECORATION

Premium means:

- coherent decisions;
- excellent typography;
- disciplined spacing;
- high-quality interaction;
- no accidental states;
- thoughtful responsiveness;
- clarity;
- accessibility;
- performance;
- polished details.

Premium does not mean:
- more gradients;
- more animation;
- more shadows;
- more cards;
- more whitespace.

---

# 100. AI-ASSISTED DESIGN RULES

AI may help with:

- ideation;
- alternative layouts;
- copy drafts;
- component exploration;
- visual reference generation;
- asset ideation.

AI output is never automatically final.

Required process:

1. AI proposes;
2. product/design rules evaluate;
3. composition is refined;
4. content is verified;
5. visual details are manually adjusted;
6. responsive states are implemented;
7. accessibility is checked;
8. browser QA confirms result.

---

# 101. FIGMA / STITCH / DESIGN TOOL RULES

When external design tools are used:

- retain editable layers;
- use Auto Layout;
- use reusable components;
- use variables/tokens;
- use variants;
- use component properties;
- use constraints;
- use nested components deliberately;
- document responsive logic;
- do not flatten screens into images and call them implementation-ready.

A screenshot may be reference evidence, not source-of-truth code architecture.

---

# 102. DESIGN-TO-CODE RULE

Do not pixel-copy a mockup blindly.

Preserve:

- hierarchy;
- proportions;
- relationships;
- responsive intention;
- semantics.

Adapt implementation where necessary for:
- accessibility;
- browser behavior;
- dynamic content;
- internationalization;
- state changes.

---

# 103. BRANDING RULE

Boane Conecta branding must be distinct without inventing official municipal identity.

Use provisional semantic tokens until validation.

Do not label an internal design palette as “official”.

---

# 104. LOCAL CONTEXT RULE

The product should eventually use real Boane context.

Until verified:
- no fake statistics;
- no fake residents;
- no fake municipal building photo;
- no fake staff;
- no fake services.

Use neutral content placeholders/configuration safely.

---

# 105. SECURITY-AWARE UX

Sensitive actions require UX proportional to risk.

Examples:
- permission changes;
- refund;
- payment waiver;
- emergency alert;
- executive confidential information.

Consider:
- reauthentication;
- confirmation;
- reason;
- audit message;
- limited scope.

---

# 106. PRIVACY UX

Do not reveal PII unnecessarily.

Admin tables:
show only what task requires.

Executive:
aggregate by default.

Public:
no personal data.

---

# 107. NOTIFICATION UX

Notifications must be useful, not noisy.

Do not send multiple alerts for one event unless policy requires.

Deep link to exact resource.

---

# 108. AUTOSAVE UX

Autosave status should be quiet.

Examples:
- A guardar...
- Guardado
- Não foi possível guardar

Do not toast every successful autosave.

---

# 109. CONCURRENCY UX

When another update conflicts:

- explain conflict;
- preserve user work;
- offer refresh/review;
- avoid silent overwrite.

---

# 110. IDEMPOTENCY UX

After timeout:
do not encourage repeated submission without checking state.

Show:
“Estamos a confirmar o estado do pedido.”

---

# 111. PERFORMANCE IS UX

Avoid heavy initial page loads.

Use:
- route splitting;
- deferred below-fold content;
- image optimization;
- selective chart loading;
- skeletons.

Public target:
- LCP < 2.5s
- CLS < 0.1
- INP < 200ms

---

# 112. CONTENT SKELETON VS VISUAL SKELETON

Loading skeleton should match actual structure.

Do not show generic three-card skeleton when the result is a list.

---

# 113. MOBILE BOTTOM NAV RULE

Citizen mobile nav:

- Início
- Pedidos
- Serviços
- Alertas
- Conta

Safe-area aware.

Do not add more items unless IA changes formally.

---

# 114. HEADER STICKINESS

Sticky header only when it improves navigation/task continuity.

Do not create huge sticky headers.

On 200% zoom, sticky UI must not consume most viewport.

---

# 115. STICKY ACTION RULE

Mobile sticky primary actions are appropriate for:

- long guided forms;
- booking confirmation;
- payment;
- action-required response.

Not for every page.

---

# 116. BREADCRUMBS

Desktop public/admin detail screens should use breadcrumbs where hierarchy benefits.

Mobile can simplify or omit when page hierarchy is clear through back navigation.

---

# 117. PAGE TITLE RULE

One clear H1 per page.

Avoid:
- marketing eyebrow + massive title + duplicate section title without reason.

---

# 118. SECTION TITLE RULE

Section title should explain content.

Avoid generic:
- “Explore”
- “Discover”
- “More”
- “Highlights”

unless context is unambiguous.

---

# 119. BADGE RULE

Badges are compact labels.

Avoid using badges as:
- navigation;
- primary actions;
- paragraphs.

---

# 120. CHIP RULE

Chips appropriate for:
- filters;
- selections;
- compact classifications.

Not every metadata item.

---

# 121. PROGRESS RULE

Progress should reflect real workflow.

Do not show progress percentages if process is not linear/measurable.

Use state/timeline instead.

---

# 122. DEADLINE UX

Show exact dates/times where deadlines matter.

Avoid vague:
“soon”
when actual deadline exists.

Use Africa/Maputo business time.

---

# 123. SLA UX

Citizen:
understandable expected deadline.

Staff:
operational SLA detail.

Do not expose internal SLA formula unnecessarily to citizen.

---

# 124. FEE UX

Show:
- FREE
- FIXED
- VARIABLE
- CALCULATED_LATER

Never display `0` without context if “free” is more understandable.

---

# 125. SUSPENDED SERVICE UX

Do not remove the page.

Show:
- service exists;
- current availability;
- reason if approved;
- alternative channel if validated;
- expected return if validated.

---

# 126. CRITICAL ALERT UX

Emergency alert should:

- clearly state severity;
- explain what happened;
- explain who is affected;
- explain what to do;
- show time/update;
- not depend only on color.

---

# 127. PUBLIC TRANSPARENCY DESIGN

Transparency should feel document-oriented and trustworthy.

Prefer:
- indexes;
- search;
- dates;
- versions;
- categories.

Avoid marketing cards.

---

# 128. NEWS DESIGN

News is editorial.

Use:
- headlines;
- dates;
- summaries;
- image only when meaningful.

Avoid turning every news item into a heavily styled product card.

---

# 129. SERVICE DESIGN

Service rows/details should prioritize:

- what it is;
- who it is for;
- channel;
- fee;
- duration;
- documents;
- action.

Icon is secondary.

---

# 130. OPERATIONAL WORK DESIGN

Staff UI should optimize:

- scanning;
- comparison;
- fast next action;
- keyboard;
- saved views;
- filters;
- compact rows.

Do not optimize staff software for screenshot aesthetics at the expense of throughput.

---

# 131. EXECUTIVE DESIGN

Use selective emphasis.

Exceptions:
strong.

Routine health:
quiet.

Historical detail:
secondary.

---

# 132. DESIGN SYSTEM DOCUMENTATION

Every new foundational component must document:

- purpose;
- anatomy;
- variants;
- states;
- responsive behavior;
- accessibility;
- do/don’t;
- migration note if replacing legacy.

---

# 133. COMPONENT NAME RULES

Names should reflect meaning.

Prefer:
- `ActionRequiredPanel`
- `ServiceMeta`
- `CaseTimeline`

Avoid:
- `CoolCard`
- `InfoBox2`
- `FancySection`

---

# 134. CSS RULES

Prefer:
- semantic Tailwind tokens;
- component-scoped classes;
- explicit layout.

Avoid:
- deeply nested global selectors;
- magic z-index;
- arbitrary important flags;
- utility explosion.

---

# 135. Z-INDEX CONVENTION

Target conceptual layers:

- base 0
- sticky 20
- header 30
- dropdown 40
- overlay 50
- modal 60
- toast 70

Do not solve stacking conflicts with random `z-[99999]`.

---

# 136. FOCUS RING

Use consistent semantic focus treatment.

Focus ring must remain visible against:
- canvas;
- raised surface;
- inverse surface.

---

# 137. DESIGN REVIEW EVIDENCE

A screen should not be called complete without evidence.

Evidence:
- browser screenshot(s);
- responsive screenshots;
- lint/build/test;
- interaction state verification;
- accessibility notes.

---

# 138. REFRACTOR “DONE” GATE

A refactor is done when:

- behavior preserved/intentionally improved;
- API remains correct;
- responsive states verified;
- accessibility preserved/improved;
- no new lint errors;
- tests/build pass;
- no hidden compatibility debt introduced.

---

# 139. DESIGN “DONE” GATE

A design is done when:

- information hierarchy is resolved;
- primary action is resolved;
- states are resolved;
- responsive behavior is resolved;
- accessibility is resolved;
- content is credible;
- visual system is consistent;
- code can implement it without guessing.

---

# 140. FINAL WORK DIRECTIVE

ChatGPT Work must use this Constitution as the quality bar for every UI/refactor decision.

Before accepting a design decision, ask:

- Does this improve the user’s task?
- Is it semantically justified?
- Does it work on all relevant viewports?
- Does it remain accessible?
- Is it consistent with the system?
- Does it avoid generic AI/template visual language?
- Is the content verified?
- Is the implementation maintainable?

If not, revise before continuing.

The objective is not to create the most decorated interface.

The objective is to create **the most coherent, trustworthy, responsive and operationally excellent interface possible for Boane Conecta.**

---

**END — BOANE CONECTA DESIGN & UX CONSTITUTION V1**
