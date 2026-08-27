# BOANE CONECTA — WORK MASTER HANDOFF V1

**Purpose:** canonical implementation handoff for ChatGPT Work / Codex-assisted frontend delivery
**Repository:** `F:\codebases777\BoaneConeta\repo`
**Active frontend branch:** `feat/frontend-v2-foundation`
**Recovered baseline commit:** `4ff50eb6359328589eea6be2cf3e4b72b1a70364`
**Current implementation stage:** F0 complete; F1 not started
**Primary current objective:** build a production-grade, premium municipal frontend without generic AI/template design language.

---

# 0. EXECUTIVE DIRECTIVE

Boane Conecta is not a generic website, landing page, SaaS dashboard or demo.

It is an integrated municipal digital-service platform with five product surfaces:

1. Public Web
2. Citizen Portal
3. Municipal Staff/Admin Workspace
4. Executive Workspace
5. React Native mobile app later

The frontend must feel institutional, credible, modern, civic, task-oriented, editorial where appropriate, accessible, responsive, operationally efficient and production-grade.

## Non-negotiable anti-AI-template rules

Do not use as global language:

- glassmorphism;
- glow effects;
- decorative gradients;
- oversized rounded cards;
- icon-in-rounded-square repeated everywhere;
- floating blobs;
- dramatic SaaS hero wallpapers;
- shadows as default hierarchy;
- hover translate on every component;
- stagger entrance animation for sections;
- fade-up for every block;
- generic KPI-card dashboards;
- fabricated municipal data.

Prefer typography, grid, controlled density, spacing, borders, information hierarchy, semantic surfaces, real task flows, excellent mobile behavior, accessible focus and intentional motion.

---

# 1. CURRENT F0 STATUS — FROZEN BASELINE

F0 has been implemented locally.

## Verified technical gate

- `npm run lint`: PASS
- `npm run build`: PASS
- `npm run test`: PASS
- `npx tsc --noEmit`: PASS
- `git diff --check`: PASS
- Backend changes during F0: zero
- Push: not performed
- Merge: not performed
- Home V2: not started

## F0 delivered

- API and error typing strengthened.
- Existing lint debt removed.
- Semantic tokens introduced.
- Global DM Sans.
- Serif only explicit via `font-institutional`.
- Decorative global gradient/glass/glow conventions neutralized.
- Hidden global scrollbar behavior removed.
- Global route animation removed.
- Accessibility foundation added.
- Reduced-motion support added.
- Layout primitives created.
- PublicShell created.
- CitizenShell created.
- AdminShell created.
- ExecutiveShell created.
- Municipal header/footer contacts moved to optional configuration.
- Legacy routes and guards preserved for migration safety.

## Known technical debt after F0

- main production bundle is still large and requires route-level code splitting;
- test coverage is still minimal;
- legacy citizen/admin screens still use older layouts;
- public header still requires full F1 IA migration;
- unverified municipal data exists on legacy pages;
- `PageTransition` remains as unused legacy compatibility;
- npm and Bun lockfiles are still both present intentionally;
- provisional colors must not be described as official municipal identity.

---

# 2. PRODUCT DEFINITION

## Academic / institutional working theme

“Concepção e Implementação de uma Plataforma Web Integrada para Gestão e Digitalização dos Serviços Municipais: Caso do Município da Vila de Boane — Boane Conecta.”

## Product goal

Create one coherent digital platform for municipal information, digital public services, request tracking, appointments, queues, citizen documents, complaints, incidents, payments, opportunities, funding, communication, alerts, institutional protocol, executive decision support, transparency and reporting.

## Data safety rule

Do not fabricate municipal organization, official colors, services, fees, deadlines, opening hours, contacts, staff names, laws, phone numbers, email, address, emergency numbers or social accounts.

Any provisional UX example must remain provisional until onsite validation.

---

# 3. CANONICAL PRODUCT SURFACES

## 3.1 Public Web

Purpose: discovery, information, transparency, public search, service understanding, news, alerts, opportunities and municipal information.

## 3.2 Citizen Portal

Purpose: start services, manage requests, upload documents, payments, appointments, queue tickets, complaints/incidents, funding applications, protocol requests, notifications and account.

## 3.3 Staff/Admin Workspace

Purpose: operational work, queues, triage, case processing, assignments, documents, payments, communication, protocol, programs, content, reports and configuration.

## 3.4 Executive Workspace

Purpose: exceptions, agenda, decisions, project/program health, service health, reports, protocol/audiences and management summaries.

## 3.5 Mobile App later

Native frequent actions: services, requests, appointments, queue, alerts, notifications, camera, QR, incidents and secure session. It is not a compressed web app.

---

# 4. INFORMATION ARCHITECTURE — FROZEN

## 4.1 Public navigation

- Serviços
- Município
- Viver em Boane
- Desenvolvimento
- Transparência
- Notícias
- Search
- Área do Munícipe

Do not expose Admin as a prominent public navigation item.

## 4.2 Citizen mobile navigation

- Início
- Pedidos
- Serviços
- Alertas
- Conta

## 4.3 Citizen desktop groups

### VISÃO GERAL
- Início

### SERVIÇOS
- Novo pedido
- Meus pedidos
- Documentos
- Agendamentos
- Pagamentos

### PARTICIPAÇÃO
- Reclamações
- Ocorrências

### OPORTUNIDADES
- Fundos
- Candidaturas

### CONTA
- Perfil
- Notificações

## 4.4 Staff/Admin navigation

### HOJE
- Visão operacional

### ATENDIMENTO
- Fila
- Agenda

### PROCESSOS
- Caixa de entrada
- Meus casos
- Pedidos
- Reclamações
- Ocorrências

### PROGRAMAS
- Fundos
- Candidaturas

### PROTOCOLO
- Correspondência
- Audiências
- Convites

### COMUNICAÇÃO
- Notícias
- Comunicados
- Avisos
- Alertas
- Eventos

### GESTÃO
- Serviços
- Projectos
- Organização
- Utilizadores
- Permissões

### ANÁLISE
- Relatórios
- Auditoria

## 4.5 Executive navigation

- Visão Geral
- Indicadores
- Projectos
- Programas
- Audiências
- Agenda
- Relatórios

---

# 5. DESIGN SYSTEM — CANONICAL

## Typography

Primary: DM Sans. Weights 400/500/600/700.

Desktop:
- Display L 64/68
- Display 56/60
- H1 44/52
- H2 36/44
- H3 28/36
- H4 22/30
- Body L 18/28
- Body 16/24
- Body S 14/20
- Caption 12/16

Mobile:
- Display 38–40
- H1 30–32
- H2 26–28
- H3 22
- H4 18–20
- Body 16
- Small 14
- Caption 12

Editorial line length 60–75 characters. Serif only explicit with `.font-institutional`.

## Spacing
4, 8, 12, 16, 24, 32, 48, 64, 80, 96.

## Radius
4, 6, 8, 12, 16. `rounded-full` only for genuinely circular/semantic UI.

## Shadows
xs, sm, md. Prefer border + whitespace before elevation.

## Surfaces
canvas, surface, surface-subtle, surface-raised, surface-inverse.

## Semantic roles
brand-primary, brand-primary-hover, brand-primary-subtle, success, warning, danger, info. Status and severity are distinct.

Colors remain provisional until institutional validation.

---

# 6. RESPONSIVE STANDARD

Breakpoints:
- base below 375
- xs 375
- xsm 480
- tb 768
- lg 1024
- xl 1280
- 2xl 1440
- 3xl 1920

Required QA widths:
320, 375/390, 430, 768, 1024, 1280, 1440, 1920, plus 200% zoom, keyboard-only and reduced motion.

Gutters:
- <480: 16px
- 480+: 20px
- 768+: 24px
- 1024+: 32px
- very large: up to 48px

Containers:
- Public 1280
- Citizen 1280
- Admin 1440
- Executive 1440
- Reading 720–760
- Forms 640–800

Grid:
- mobile 4
- tablet 8
- desktop 12

---

# 7. DENSITY

Public: comfortable. Citizen: standard. Admin: compact.

Approximate row targets:
- public/citizen 56–64px
- standard 48–56px
- compact staff 40–48px

Admin software prioritizes throughput and information density, not giant cards.

---

# 8. LAYOUT PRIMITIVES

Canonical primitives:
- Container
- Section
- Stack
- Inline
- Grid
- Split

No new primitive abstraction without clear repeated structural need.

---

# 9. UI COMPONENT RULES

Buttons: primary, secondary, outline, ghost, danger, link; sm/md/lg; important touch targets approximately 44px.

Inputs: Label, Control, Help, Error; default/focus/error/disabled/read-only; 16px mobile text where required.

Search types: global, catalog, table, command.

Status: StatusDot, StatusText, StatusBadge. Do not make every status a large colored pill.

Alerts: InlineAlert, PageAlert, SystemBanner, EmergencyAlert.

Tables must explicitly choose mobile behavior: horizontal scroll, collapse, record-list or desktop-only.

ListRow is a first-class mobile structure.

Dialogs for small decisions. Long forms on mobile use full-screen/sheet patterns.

Sheets: mobile filters/selections/actions; desktop preview/support/context.

Toast: transient feedback only, never durable business state.

Timeline: citizen simplified; staff operational detail.

Empty state: title, explanation, action. No generic illustration required.

Loading: preserve layout using local skeleton regions. Avoid global blocking spinners.

Errors: human language. Never expose raw “Failed to fetch”.

---

# 10. MOTION

Durations 140/200/280ms. Use for disclosure, overlays, state changes and direct interaction. Do not use motion as page decoration. Respect `prefers-reduced-motion`.

---

# 11. SHELL ARCHITECTURE

## PublicShell
SkipLink → SystemAlertRegion → PublicHeader → `main#main-content` → PublicFooter.

## CitizenShell
Desktop: sidebar + contextual header + main. Mobile: header + main + bottom navigation. Tablet: drawer where appropriate.

## AdminShell
Task-oriented sidebar + contextual header + breadcrumb/context + main operational workspace.

## ExecutiveShell
Separate from Admin. Priority: exceptions, decision items, agenda, headline metrics.

---

# 12. CANONICAL SCREEN PATTERNS

1. Landing
2. Catalog
3. Detail
4. Guided Form
5. Case Detail
6. Work Queue
7. Calendar
8. Appointment
9. Queue Console
10. Digital Ticket
11. Review Workspace
12. Management
13. Dashboard
14. Executive Dashboard
15. System State

Every new screen maps to one of these or explicitly justifies a new pattern.

---

# 13. CANONICAL UX STATES

LOADING, SUCCESS, EMPTY, PARTIAL, ERROR, OFFLINE, STALE, READ_ONLY, FORBIDDEN, REAUTH_REQUIRED, DRAFT, SUBMITTING, SUCCESS_MUTATION, FAILED_MUTATION, AVAILABLE, HELD, EXPIRED, CLOSED, ACTION_REQUIRED, OVERDUE.

---

# 14. FRONTEND TARGET STRUCTURE

```text
src/
├── app/
│   ├── router/
│   ├── providers/
│   └── config/
├── design-system/
│   ├── tokens/
│   ├── primitives/
│   └── components/
├── shells/
│   ├── public/
│   ├── citizen/
│   ├── admin/
│   └── executive/
├── features/
│   ├── services/
│   ├── requests/
│   ├── cases/
│   ├── appointments/
│   ├── queue/
│   ├── payments/
│   ├── communication/
│   ├── protocol/
│   ├── funding/
│   ├── projects/
│   ├── reporting/
│   └── identity/
└── shared/
```

No big-bang migration. Pages compose features. Business/data logic should not continue growing inside pages.

---

# 15. ROUTE FAMILIES

Public:
`/`, `/servicos`, `/servicos/:slug`, `/noticias`, `/alertas`, `/programas`, `/transparencia`.

Citizen:
`/municipe`, `/municipe/pedidos`, `/municipe/pedidos/:id`, `/municipe/servicos/:slug/iniciar`, `/municipe/agendamentos`, `/municipe/agendamentos/:id`, `/municipe/fila/:ticketId`, `/municipe/pagamentos/:id`, `/municipe/protocolo`, `/municipe/protocolo/:id`, `/municipe/programas`, `/municipe/candidaturas/:id`, `/municipe/notificacoes`, `/municipe/conta`.

Admin:
`/admin`, `/admin/atendimento`, `/admin/atendimento/fila`, `/admin/agenda`, `/admin/processos`, `/admin/processos/:id`, `/admin/financas`, `/admin/reconciliacao`, `/admin/protocolo`, `/admin/protocolo/:id`, `/admin/conteudo`, `/admin/alertas`, `/admin/programas`, `/admin/candidaturas`, `/admin/projectos`, `/admin/relatorios`, `/admin/gestao/servicos`, `/admin/gestao/organizacao`, `/admin/gestao/utilizadores`, `/admin/gestao/permissoes`.

Executive:
`/executivo`, `/executivo/indicadores`, `/executivo/projectos`, `/executivo/programas`, `/executivo/audiencias`, `/executivo/agenda`, `/executivo/relatorios`.

---

# 16. HOME V2 — F1 TARGET

Home answers:
1. what service do I need?
2. how do I start?
3. how do I track?
4. how do I book?
5. how do I report a problem?
6. are there active alerts?
7. where is municipal information?

Hierarchy:
1. Public Header
2. Hero / Service Finder
3. Quick Tasks
4. Active Alerts
5. Most Requested / Featured Services
6. Mobility & Local Information
7. Opportunities
8. What’s Happening in Boane
9. Projects & Development
10. Transparency
11. Emergency & Essential Contacts
12. Footer

Conditional sections disappear when no valid data exists.

## Hero wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ PUBLIC HEADER                                                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Serviços municipais mais simples e próximos de si.           │
│                                                              │
│ [ Pesquisar serviço, documento ou informação...          ]   │
│                                                              │
│ restrained secondary task links                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

Target height approximately 380–480 desktop, 300–380 mobile. No huge wallpaper hero. Photography only if real and validated.

## Quick Tasks

```text
Solicitar serviço      →
Consultar pedido       →
Agendar atendimento    →
Reportar problema      →
```

Structural row/list, not four giant cards.

Active alert severity: INFO, ADVISORY, WARNING, EMERGENCY.

Featured services: restrained list/grid hybrid. Avoid repeated rounded service cards.

Local Updates: editorial treatment for news + agenda/events, not identical card templates.

---

# 17. SERVICE CATALOG V2

Goal: “Que serviços existem e qual resolve o que preciso?”

Desktop:

```text
Breadcrumb
Serviços

[ Search services ........................................ ]

┌───────────────┬──────────────────────────────────────────────┐
│ FILTERS       │ RESULTS                                      │
│ Category      │ Service title                                │
│ Channel       │ short description                            │
│ Audience      │ channels · duration · fee                    │
│ Availability  │ ------------------------------------------   │
└───────────────┴──────────────────────────────────────────────┘
```

Mobile: search + Categorias + Filtros sheet + list rows.

Search supports name, description, category, associated terms and synonyms.

Filter V1: category, channel, audience, availability. Search/filter state lives in URL.

---

# 18. SERVICE DETAIL V2

Goal: understand what it is, eligibility, requirements, documents, fee, time, where/how and CTA before transaction.

```text
Breadcrumb
SERVICE TITLE
short description

┌────────────────────────────────┬────────────────────────────┐
│ MAIN 8                         │ SUMMARY 4                  │
│ About                          │ Availability               │
│ Requirements                   │ Fee                        │
│ Documents                      │ Time                       │
│ Process                        │ Channel                    │
│ Locations                      │ [Start Request]            │
│ Legal refs if validated        │ [Book Appointment]        │
└────────────────────────────────┴────────────────────────────┘
```

CTA logic:
- online + in-person → Start Request + Book Appointment
- in-person → Book Appointment
- online → Start Request
- informational → no transaction CTA

Suspended services remain visible and informative.

Fees: FREE, FIXED, VARIABLE, CALCULATED_LATER.
Durations: FIXED, RANGE, VARIABLE.
Requirements separate from documents.

---

# 19. GUIDED REQUEST FORM V2

Flow:
Service Detail → Start → Eligibility → Authentication/identity → Draft → Guided form → Documents → Review → Submit → Confirmation → Request Detail.

Rules:
- dynamic steps;
- no 30-field single page;
- desktop width 640–800;
- mobile single column;
- step X of Y;
- autosave;
- server draft;
- optimistic lock;
- explicit validation;
- accessible errors.

Autosave: blur, debounce, before next step. Status: A guardar / Guardado / erro. No toast spam.

Conditional fields use rules. Hidden field policy CLEAR_ON_HIDE or PRESERVE_ON_HIDE.

Upload states: selecting, uploading, received, scanning, valid, rejected.

Submit is idempotent. Timeout triggers status verification rather than an immediate failure claim.

Confirmation:

```text
PEDIDO SUBMETIDO

Reference:
BC-REQ-2026-00182  [Copy]

Submitted:
date/time

Next steps:
...

[View request]
```

No confetti.

---

# 20. CITIZEN REQUEST DETAIL

Include reference, service, friendly status, current next action, submitted date, expected deadline if meaningful, documents, messages, simplified timeline, payment action where applicable and appointment link where applicable.

Do not expose unnecessary internal workflow jargon.

---

# 21. APPOINTMENTS

Flow: Service Detail → Book → location → date/time → review → confirmation → arrival → check-in → queue.

Backend generates available slots.

States: CONFIRMED, CHECKED_IN, WAITING, CALLED, IN_SERVICE, COMPLETED, CANCELLED, NO_SHOW, EXPIRED.

Use a temporary slot hold before confirmation. Never expose executive/private calendar availability publicly.

---

# 22. CHECK-IN / QUEUE

Methods: QR, local code, reception staff. GPS is not required.

Queue ticket states: WAITING, CALLED, SERVING, COMPLETED, TRANSFERRED, NO_SHOW, CANCELLED.

Digital ticket:

```text
SENHA DIGITAL

B-042

Estado:
A aguardar

Pessoas à frente:
8

Tempo estimado:
20–35 min

Última atualização:
10:24
```

Only show people ahead / ETA if sufficiently reliable.

---

# 23. STAFF QUEUE CONSOLE

Desk states: CLOSED, OPEN, PAUSED, SERVING.

Actions: Call Next, Recall, Start Service, Complete, Transfer, No-show.

`Call Next` must be atomic server-side.

---

# 24. ADMIN OPERATIONS CORE

Flow: submitted → operational queue → triage → assignment → analysis → action required/internal review → approval/rejection → completion → citizen notified.

---

# 25. WORK QUEUE

Goal: “What should I handle now?”

Saved views:
- Atribuídos a mim
- Não atribuídos
- Requer triagem
- Ação do cidadão pendente
- SLA hoje
- SLA ultrapassado
- Prontos para aprovação
- Concluídos hoje

Compact table/record list. No KPI wall above the queue.

---

# 26. CASE WORKSPACE

```text
CASE REF / SERVICE / STATUS

ACTION REQUIRED
Review request and decide next action.

[Request info] [Send for approval] [Reject] [More]

┌────────────────────────────────┬────────────────────────────┐
│ MAIN 8                         │ CONTEXT 4                  │
│ Request data                   │ Applicant                  │
│ Documents                      │ Service                    │
│ Citizen messages               │ Department                 │
│ Internal notes                 │ Assignee                   │
│ Operational timeline           │ SLA                        │
└────────────────────────────────┴────────────────────────────┘
```

Citizen messages and internal notes are separate.

Case base states: DRAFT, SUBMITTED, UNDER_TRIAGE, IN_REVIEW, ACTION_REQUIRED, RESUBMITTED, READY_FOR_APPROVAL, APPROVED, REJECTED, COMPLETED, WITHDRAWN, ARCHIVED.

Approval and completion are distinct. Critical state changes use commands, not arbitrary `PATCH status`.

---

# 27. FINANCE

Rule: request, obligation and payment are separate entities.

Flow: Case → Financial Obligation → Payment Intent → Payment Transaction → Confirmation → Reconciliation → Receipt → Workflow continues.

No `paid=true` on request.

Payment states: PENDING, PROCESSING, CONFIRMED, FAILED, EXPIRED, CANCELLED, REVERSED, REFUNDED.

Reconciliation: MATCHED, UNMATCHED, AMOUNT_MISMATCH, POSSIBLE_DUPLICATE, MANUAL_REVIEW, RECONCILED, REJECTED.

Finance UI is exception-driven.

---

# 28. COMMUNICATION

Distinct entities: News, Official Communiqué, Alert, Event, Notification, Campaign.

News states: DRAFT, IN_REVIEW, APPROVED, SCHEDULED, PUBLISHED, UNPUBLISHED, ARCHIVED.

Communiqué states: DRAFT, IN_REVIEW, APPROVED, PUBLISHED, SUPERSEDED, ARCHIVED.

Alert severity: INFO, ADVISORY, WARNING, EMERGENCY.

Alert states: DRAFT, ACTIVE, UPDATED, RESOLVED, EXPIRED, CANCELLED.

Emergency publishing may require stronger capability, reauth and second approval.

---

# 29. NOTIFICATIONS

Categories: PROCESS, APPOINTMENT, QUEUE, PAYMENT, ALERT, PROGRAM, SECURITY, INFORMATION.

Channels: IN_APP, PUSH, EMAIL, SMS, WHATSAPP. Not all must ship in V1.

Flow: Domain event → Notification policy → delivery jobs → channel adapters.

No sensitive information on lock-screen push.

---

# 30. PROTOCOL & INSTITUTIONAL RELATIONS

Types: AUDIENCE_REQUEST, MEETING_REQUEST, INVITATION, PARTNERSHIP_PROPOSAL, OFFICIAL_CORRESPONDENCE, SUPPORT_REQUEST.

Potential later: OFFICIAL_VISIT, CEREMONIAL_REQUEST, INTERINSTITUTIONAL_REQUEST.

Flow: Requester → Submission → Protocol Inbox → Triage → Destination/Cabinet → Review → Decision → Scheduling → Meeting/Event → Follow-up → Archive.

States: DRAFT, SUBMITTED, UNDER_TRIAGE, FORWARDED, UNDER_REVIEW, ADDITIONAL_INFO_REQUIRED, ACCEPTED, DECLINED, DELEGATED, SCHEDULING, SCHEDULED, COMPLETED, CANCELLED, ARCHIVED.

Never expose executive agenda availability publicly.

Protocol inbox is compact, filterable, action-first.

---

# 31. EXECUTIVE AGENDA

Not an Outlook clone. Goal: “What requires institutional attention?”

```text
AGENDA EXECUTIVA

TODAY
09:00 Internal meeting        PRIVATE
10:30 Audience — Org X       PRIVATE
14:00 Public event           PUBLIC

Preparation:
✓ dossier
✓ brief
○ pending document
```

Visibility: PUBLIC, INTERNAL, PRIVATE, CONFIDENTIAL.

---

# 32. FUNDING / ECONOMIC DEVELOPMENT

Flow: Program → Call → Eligibility → Application → Validation → Evaluation → Scoring → Committee → Decision → Award → Agreement → Disbursement → Monitoring → Closeout.

Main entities: FundingProgram, FundingCall, EligibilityRule, Application, Evaluation, ReviewerAssignment, ConflictOfInterest, CommitteeDecision, Award, Agreement, Disbursement, Milestone, MonitoringReport, Closeout.

Application states: DRAFT, SUBMITTED, ELIGIBILITY_REVIEW, INELIGIBLE, ELIGIBLE, UNDER_EVALUATION, ADDITIONAL_INFO_REQUIRED, RESUBMITTED, READY_FOR_COMMITTEE, APPROVED, REJECTED, WAITLISTED, AWARDED, AGREEMENT_PENDING, ACTIVE, COMPLETED, CANCELLED, WITHDRAWN.

Conflict-of-interest declaration is mandatory before evaluation.

AI must not decide funding applications. AI may assist later with summarization, extraction and risk flagging while humans remain responsible.

---

# 33. EXECUTIVE / REPORTING / TRANSPARENCY

Four levels: Operational, Management, Executive, Public Transparency.

Executive Dashboard hierarchy: exceptions → health → trends → detail.

Avoid 12 KPI cards.

Canonical reporting models: MetricDefinition, MetricSnapshot, ReportDefinition, ReportRun, PublicDataSnapshot.

Public transparency is an approved aggregate, not a copy of internal dashboards.

---

# 34. TRANSPARENCY PORTAL

Sections:
- Planos & Estratégias
- Orçamento
- Relatórios
- Projectos
- Programas
- Concursos
- Deliberações
- Documentos Públicos
- Indicadores

```text
TRANSPARÊNCIA MUNICIPAL

[Search public documents...]

Planos e orçamento →
Projectos →
Programas →
Concursos →
Relatórios →
Documentos →
```

---

# 35. CANONICAL BACKEND ARCHITECTURE

Spring Boot modular monolith. No premature microservices.

Bounded contexts:
1. Identity & Access
2. Organization & Territory
3. Service Catalog
4. Case Management
5. Documents & Media
6. Appointments & Queue
7. Finance
8. Communication
9. Protocol
10. Funding
11. Projects & Transparency
12. Reporting & Audit

Platform engines: Identity, Permission, Workflow, Rules, Form, Document, Calendar, Task, Assignment, Business Calendar, SLA, Escalation, Notification, Search, Audit, Reporting, Media.

---

# 36. CANONICAL DOMAIN RULES

One generic Task engine. No CaseTask/ProtocolTask/FundingTask/ProjectTask engines.

One canonical Document/DocumentVersion system. No independent upload subsystem per domain.

DecisionRecord is immutable and may be superseded, never silently rewritten.

Workflow is versioned: WorkflowDefinition, WorkflowVersion, WorkflowInstance, WorkflowTransition.

Request is citizen submission; Case is municipal operational process. Do not conflate them.

Domain Event is a business fact. Audit Event is who did what. They are not identical.

---

# 37. PERMISSIONS — CANONICAL

Permission = ROLE + CAPABILITY + RESOURCE + SCOPE + CONTEXT.

Scopes: OWN, ASSIGNED, TEAM, DEPARTMENT, TERRITORY, MUNICIPALITY, GLOBAL.

Principles: deny by default, least privilege, backend authority, separation of duties, immutable audit, document classification, no permanent hardcoded role names in UI.

Frontend target: `can("cases.approve", case)`.

API may return `availableActions`.

---

# 38. API BOUNDARIES

Public: `/api/v1/public/*`
Citizen: `/api/v1/citizen/*`
Staff: `/api/v1/admin/*`
Executive: `/api/v1/executive/*`
Internal/provider: `/api/internal/*` or explicit webhook endpoints.

---

# 39. SECURITY TARGET

- Cloudflare/WAF
- reverse proxy/API gateway
- Spring Security
- scoped authorization
- JWT access tokens
- refresh-token rotation
- session/device tracking
- revocation
- admin MFA target
- reauthentication for critical actions
- rate limiting
- idempotency
- file quarantine
- malware scanning
- object storage
- correlation IDs
- logs/metrics/traces
- audit
- database never public

Critical actions may require reauth: refund, payment waiver, emergency alert, permission modification, high-risk approval, break-glass.

---

# 40. DOCUMENT SECURITY

Upload → Quarantine → Malware scan → Validation → Safe object storage.

Classification: PUBLIC, PERSONAL, INTERNAL, CONFIDENTIAL, RESTRICTED.

---

# 41. BUSINESS CALENDAR

Used by SLA, appointments and institutional scheduling.

Models: WorkingPeriod, Holiday, Closure, SpecialHours.

Timezone: Africa/Maputo.

---

# 42. CONCURRENCY / IDEMPOTENCY

Important flows: request submit, appointment confirmation, slot reservation, queue join, payment intent, payment callback, funding submit, protocol scheduling.

Use optimistic locking/versioning where appropriate. Do not solve races in frontend only.

---

# 43. ERROR CONTRACT

```json
{
  "code": "SLOT_UNAVAILABLE",
  "message": "O horário já não está disponível.",
  "correlationId": "...",
  "details": []
}
```

Never expose stack traces.

---

# 44. PERFORMANCE TARGETS

Public core web-vitals target: LCP <2.5s, CLS <0.1, INP <200ms.

Known bundle issue: route-level code splitting required.

Independent Home sections should load/fail independently.

---

# 45. ACCESSIBILITY GATE

Required: visible focus, semantic landmarks, skip link, keyboard navigation, 200% zoom, reduced motion, appropriate aria, color not sole status indicator, chart text/table alternative, correct headings, form label/help/error relationships.

---

# 46. IMPLEMENTATION ROADMAP

F0 — COMPLETE: foundation/hygiene/shells/accessibility/lint.

F1 — Public Shell + Home V2.

F2 — Service Catalog V2 + Service Detail V2.

F3 — Guided Request + Documents + Review + Submit + Request Detail.

F4 — Citizen Portal migration and screens.

F5 — Appointments + Check-in + Queue.

F6 — Staff Operations + Work Queue + Case Workspace.

F7 — Finance + Communication.

F8 — Protocol + Funding.

F9 — Executive + Reporting + Transparency.

---

# 47. F1 IMPLEMENTATION ORDER

1. inspect F0 diff and current PublicShell;
2. public header architecture;
3. mobile navigation behavior;
4. public footer;
5. Home route/data composition;
6. HomeHero;
7. HomeSearch;
8. QuickTasks;
9. ActiveAlerts;
10. FeaturedServices;
11. MobilityOverview;
12. OpportunitiesOverview;
13. LocalUpdates;
14. ProjectsOverview;
15. TransparencyLinks;
16. EssentialContacts;
17. route-level lazy loading/code splitting where appropriate;
18. visual QA;
19. responsive QA;
20. accessibility QA;
21. build/lint/test/tsc/diff-check;
22. documentation;
23. stop.

Do not proceed to F2 automatically.

---

# 48. F1 DATA CONTRACT PRINCIPLE

Home components:
HomeHero, HomeSearch, QuickTasks, ActiveAlerts, FeaturedServices, MobilityOverview, OpportunitiesOverview, LocalUpdates, ProjectsOverview, TransparencyLinks, EssentialContacts.

Feature data separation:
services, alerts, news, events, opportunities, projects, mobility.

When API is unavailable, use clearly marked temporary internal mock/config adapters, never fabricated “official” values.

---

# 49. F1 VISUAL QA MATRIX

For every public screen validate 320, 375, 390, 430, 768, 1024, 1280, 1440, 1920, 200% zoom, keyboard-only and reduced motion.

Audit wrapping, overflow, header collision, touch targets, readable line length, focus order, mobile navigation, menu-close behavior, search usability, content hierarchy, skeletons, empty states and error states.

---

# 50. GIT DISCIPLINE

Never work on master.

Current branch: `feat/frontend-v2-foundation`.

Before work: `git status`, `git branch --show-current`, baseline check.

During work: logical diffs, no destructive reset, no clean of unknown files, no backend rewrite, no push, no merge unless explicitly authorized.

Recommended F0 commit split:
1. `fix(frontend): eliminate lint debt and strengthen api typing`
2. `feat(frontend): establish semantic design foundation`
3. `feat(frontend): add accessible layout primitives and shells`
4. `docs(frontend): document F0 architecture and migration`

---

# 51. WORK OPERATING RULES

Before modifying any feature, answer internally:
1. Which bounded context?
2. Which canonical entity?
3. Which screen pattern?
4. Which state?
5. Which permission?
6. Which API boundary?
7. Which responsive behavior?
8. Which loading/empty/error behavior?
9. Which accessibility behavior?
10. Which analytics/security implications?

If unclear, do not invent architecture silently.

---

# 52. DEFINITION OF DONE — SCREEN

A screen is done only when it has correct IA, task hierarchy, responsive behavior, keyboard usability, 200% zoom usability, reduced-motion handling, loading/empty/error/partial states, route behavior, permission behavior, API-ready data boundaries, no fabricated municipal facts, green build/lint/test/tsc, visual QA and updated documentation.

---

# 53. DEFINITION OF DONE — F1

F1 is complete only when PublicHeader matches approved IA; PublicFooter contains only validated/configurable contacts; Home V2 is implemented; old generic Home composition is removed/migrated; no decorative global regression occurs; all primary Home sections are responsive; bundle/code splitting improves; accessibility checks pass; all QA widths pass; build/lint/tests/tsc/diff-check pass; backend remains untouched; an F1 report is produced; Work stops before F2.

---

# 54. MASTER STOP CONDITIONS

Stop and report before proceeding if:
- municipal facts are required but not validated;
- backend contract is missing and frontend behavior would become fake;
- F0 architecture would need a breaking rewrite;
- branch is not approved;
- backend files unexpectedly change;
- build/lint/tests regress;
- a screen requires a new design pattern not covered here;
- permissions cannot be represented safely;
- sensitive data would leak to public UI.

---

# 55. FINAL PRODUCT NORTH STAR

The product should feel like a credible municipal digital-service platform designed by a strong civic product team, not a generated template.

Public users immediately understand what they can do, where to find a service, how to track, how to book, how to report a problem, which alerts matter and where transparency information lives.

Staff immediately understand what requires attention, what they are assigned, which cases are late, what action comes next, what can be decided and what requires citizen response.

Executives immediately understand what is at risk, what needs decision, what is happening today, where service health is deteriorating and which projects/programs need intervention.

---

# 56. WORK MASTER INSTRUCTION

Treat this document as the canonical frontend/product implementation authority for Boane Conecta Frontend V2.

When legacy code conflicts with this document:
- preserve working behavior where possible;
- migrate incrementally;
- do not preserve obsolete visual patterns merely for compatibility;
- do not perform big-bang rewrites;
- do not invent municipal content;
- do not redesign beyond the currently authorized phase.

Current authorized next phase:

# F1 — PUBLIC SHELL + HOME V2

Do not proceed beyond F1 without explicit authorization.

At the end of F1 return:
1. exact files changed;
2. route changes;
3. component architecture;
4. visual hierarchy decisions;
5. responsive decisions;
6. accessibility decisions;
7. API/data boundaries;
8. removed legacy patterns;
9. compatibility retained;
10. build result;
11. lint result;
12. tests result;
13. TypeScript result;
14. git diff check;
15. git status;
16. bundle impact;
17. remaining risks;
18. screenshots/viewport QA evidence if Work supports them;
19. suggested commit breakdown;
20. explicit statement that F2 was not started.

---

**END OF CANONICAL WORK MASTER HANDOFF V1**
