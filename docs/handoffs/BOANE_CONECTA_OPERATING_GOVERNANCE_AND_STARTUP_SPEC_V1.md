# BOANE CONECTA — OPERATING, GOVERNANCE & STARTUP SPEC V1

**Status:** Final canonical operating authority
**Project:** Boane Conecta
**Repository:** `F:\codebases777\BoaneConeta\repo`
**Active frontend branch:** `feat/frontend-v2-foundation`
**Current authorized phase:** F1 — PublicShell + Home V2
**Purpose:** close all remaining product-operating gaps: actors, permissions, use cases, business rules, non-functional requirements, quality gates, traceability, data classification, audit, content governance, implementation governance and startup protocol.

---

# 0. WHY THIS DOCUMENT EXISTS

The project already has four strong canonical authorities:

1. `BOANE_CONECTA_WORK_MASTER_HANDOFF_V1.md`
   - product
   - domain
   - architecture
   - security
   - roadmap

2. `BOANE_CONECTA_RESPONSIVE_WIREFRAME_ATLAS_V1.md`
   - screens
   - use cases
   - flows
   - viewport behavior

3. `BOANE_CONECTA_DESIGN_UX_CONSTITUTION_V1.md`
   - design
   - interaction
   - refactor rules
   - anti-AI-slop
   - quality bar

4. `FRONTEND_F0_FOUNDATION.md`
   - actual implemented technical state

This fifth authority exists to answer the remaining questions that otherwise invite interpretation:

- who are the actors?
- what may each actor do?
- what business rules govern behavior?
- which use cases are canonical?
- what data is sensitive?
- what must be audited?
- what is required for release quality?
- what is the definition of done?
- how must Work begin each phase?
- what must Work never assume?
- how are design, engineering, permissions and domain tied together?
- how are decisions traced?
- what happens when requirements are incomplete?

This document is the **operating constitution**.

---

# 1. AUTHORITY MODEL

The five canonical documents have distinct authority.

## 1.1 Master Handoff

Authority over:

- product scope
- bounded contexts
- domain model
- architecture
- APIs
- security
- sequencing
- high-level workflow

## 1.2 Wireframe Atlas

Authority over:

- screen inventory
- use cases
- viewport behavior
- interaction composition
- responsive structure

## 1.3 Design & UX Constitution

Authority over:

- visual hierarchy
- design-system behavior
- refactor rules
- anti-patterns
- accessibility
- interaction quality
- visual QA

## 1.4 F0 Foundation

Authority over:

- what currently exists
- baseline implementation
- compatibility constraints
- current debt

## 1.5 This document

Authority over:

- actors
- roles/capabilities/scopes
- permission governance
- canonical use-case catalog
- business rules
- data classification
- audit rules
- content governance
- acceptance criteria
- non-functional quality
- test strategy
- traceability
- phase startup protocol
- release gates
- decision escalation

---

# 2. ACTOR MODEL

Actors are not the same as roles.

An actor is a participant in a use case.

A user may perform multiple actor roles depending on context.

## 2.1 Public Visitor

Unauthenticated person.

Typical goals:

- browse services
- search information
- read news
- see alerts
- browse transparency
- discover opportunities
- access public documents
- enter citizen portal

Restrictions:

- no private citizen data
- no operational case data
- no staff tools
- no executive information
- no internal documents

---

# 2.2 Citizen / Resident User

Authenticated person using citizen services.

Typical goals:

- start service request
- manage drafts
- upload documents
- track requests
- respond to corrections
- manage appointments
- check in
- see queue ticket
- make/track payment
- submit complaints
- apply to programs
- submit institutional requests
- receive notifications

Scope:
primarily OWN.

---

# 2.3 Citizen Representative

Future/conditional actor.

May act on behalf of:

- minor
- organization
- dependent
- authorized third party

Do not implement until representation requirements are validated.

---

# 2.4 Front Desk / Service Desk Staff

Municipal staff focused on:

- appointments
- check-in
- queue
- service reception
- basic case intake
- citizen support

Likely scopes:

- assigned desk
- service desk
- department

Do not assume authority to approve cases.

---

# 2.5 Case Officer / Municipal Staff

Operational case processor.

Typical goals:

- review assigned cases
- validate documents
- request information
- add internal notes
- communicate with citizen
- update workflow through allowed commands
- prepare for decision

Typical scope:
ASSIGNED / TEAM / DEPARTMENT.

---

# 2.6 Supervisor

Operational manager.

Typical goals:

- view backlog
- assign/reassign
- monitor SLA
- review workloads
- approve certain decisions
- resolve escalations

No automatic global access.

---

# 2.7 Finance Officer

Typical goals:

- inspect obligations
- inspect payments
- reconcile
- handle manual review
- process authorized adjustments

Must not receive unrelated case access without need.

---

# 2.8 Finance Supervisor / Approver

Higher-risk finance capability.

Potential abilities:

- approve refund
- approve waiver
- approve reversal
- resolve exceptional reconciliation

Requires stronger controls.

---

# 2.9 Content Editor

Typical goals:

- draft news
- edit content
- prepare communiqué
- create event
- prepare alert

Does not automatically publish.

---

# 2.10 Content Reviewer / Publisher

Typical goals:

- review
- approve
- schedule
- publish
- unpublish
- supersede official communiqué

Critical alert publication may require distinct capability.

---

# 2.11 Protocol Officer

Typical goals:

- receive
- triage
- classify
- assign destination
- request info
- forward
- manage correspondence
- prepare scheduling

---

# 2.12 Cabinet / Executive Support Staff

Typical goals:

- review protocol requests
- manage agenda
- prepare dossiers
- track follow-up
- support executive decisions

---

# 2.13 Funding Program Officer

Typical goals:

- configure programs/calls
- review eligibility
- manage application flow
- assign reviewers
- monitor awards

---

# 2.14 Funding Reviewer

Typical goals:

- declare conflict
- review application
- score criteria
- provide rationale

Must not decide if conflict exists.

---

# 2.15 Funding Committee Member

Typical goals:

- review evaluations
- participate in formal decision
- approve/reject/waitlist according to process

---

# 2.16 Project Manager

Typical goals:

- maintain municipal project data
- milestones
- risks
- documents
- public visibility status

---

# 2.17 Reporting / Analyst User

Typical goals:

- run reports
- inspect approved metrics
- export authorized datasets

Data access still scope-bound.

---

# 2.18 Organization Administrator

Administrative actor for:

- users
- memberships
- organization settings
- department configuration
- service management

Not equivalent to unrestricted superuser.

---

# 2.19 Security / Audit Officer

Typical goals:

- inspect audit events
- investigate privileged actions
- inspect security events

Should not mutate historical audit data.

---

# 2.20 Executive

Typical goals:

- review exceptions
- see agenda
- review programs/projects
- inspect decision items
- view approved executive metrics

Default view should minimize PII.

---

# 2.21 System / Automation Actor

Non-human actor.

Examples:

- outbox dispatcher
- notification worker
- payment webhook
- scheduled publication
- SLA timer
- appointment hold expiry

System actions must be identifiable in audit.

---

# 3. AUTHORIZATION MODEL

Canonical model:

```text
ROLE
+
CAPABILITY
+
RESOURCE
+
SCOPE
+
CONTEXT
```

Roles are bundles.

Capabilities authorize actions.

Scopes define data reach.

Context constrains action based on state or conditions.

---

# 4. CANONICAL SCOPES

- OWN
- ASSIGNED
- TEAM
- DEPARTMENT
- TERRITORY
- MUNICIPALITY
- GLOBAL

Default:
deny.

No capability implies no action.

No scope implies no resource access.

---

# 5. CAPABILITY NAMESPACE

Use domain-oriented capabilities.

Examples:

## Cases

- `cases.read`
- `cases.create`
- `cases.triage`
- `cases.assign`
- `cases.reassign`
- `cases.request_information`
- `cases.review_documents`
- `cases.prepare_decision`
- `cases.approve`
- `cases.reject`
- `cases.complete`
- `cases.reopen`
- `cases.export`

## Documents

- `documents.read`
- `documents.preview`
- `documents.download`
- `documents.validate`
- `documents.reject`
- `documents.replace`
- `documents.manage`

## Appointments

- `appointments.read`
- `appointments.create`
- `appointments.reschedule`
- `appointments.cancel`
- `appointments.checkin`
- `appointments.manage_capacity`

## Queue

- `queue.read`
- `queue.join`
- `queue.call_next`
- `queue.recall`
- `queue.transfer`
- `queue.complete`
- `queue.mark_no_show`
- `queue.manage_desk`

## Payments

- `payments.read`
- `payments.create_intent`
- `payments.confirm_manual`
- `payments.reconcile`
- `payments.adjust`
- `payments.refund`
- `payments.waive`
- `payments.export`

## Communication

- `content.read`
- `content.create`
- `content.edit`
- `content.review`
- `content.publish`
- `content.unpublish`
- `alerts.create`
- `alerts.approve`
- `alerts.publish`
- `alerts.resolve`

## Protocol

- `protocol.read`
- `protocol.triage`
- `protocol.forward`
- `protocol.assign`
- `protocol.request_information`
- `protocol.accept`
- `protocol.decline`
- `protocol.delegate`
- `protocol.schedule`
- `protocol.complete`

## Funding

- `funding.read`
- `funding.configure`
- `funding.submit`
- `funding.eligibility_review`
- `funding.assign_reviewer`
- `funding.evaluate`
- `funding.committee_review`
- `funding.decide`
- `funding.award`
- `funding.monitor`

## Reporting

- `reports.read`
- `reports.run`
- `reports.export`
- `reports.publish_snapshot`

## Administration

- `users.read`
- `users.manage`
- `roles.read`
- `roles.manage`
- `permissions.read`
- `permissions.manage`
- `organization.read`
- `organization.manage`

## Audit

- `audit.read`
- `audit.export`

---

# 6. PERMISSION RULES

## 6.1 Backend authority

Frontend permission checks are UX hints.

Backend is authoritative.

Never assume UI hiding equals security.

---

# 6.2 Available actions

Preferred API pattern:

```json
{
  "availableActions": [
    "REQUEST_INFORMATION",
    "SEND_FOR_APPROVAL"
  ]
}
```

Frontend renders actions from authoritative policy result.

---

# 6.3 Separation of duties

High-risk action should not automatically be performed by the same actor who prepared it.

Examples:

- funding reviewer vs committee decision
- finance operator vs refund approval
- content editor vs emergency alert publication
- case processor vs final approval where policy requires

---

# 6.4 Reauthentication

Sensitive actions may require reauth:

- permission modification
- emergency alert publication
- refund/reversal
- payment waiver
- critical approval
- confidential executive action
- break-glass access

---

# 6.5 Break-glass access

Future/conditional.

If implemented:

- explicit reason
- time-limited
- strongly audited
- visible security event
- reviewable after use

---

# 7. CANONICAL USE-CASE REGISTRY

Each use case must map to:

- actor
- capability
- resource
- scope
- screen
- state
- API boundary
- audit requirement

---

# 8. PUBLIC USE CASES

## UC-PUB-001 Browse public home

Actor:
Public Visitor

Screen:
Home

Permission:
public

Result:
view public-approved content only.

---

# 9. UC-PUB-002 Search public information

Actor:
Public Visitor

Resources:
services/news/projects/programs/public documents

Rules:
only public/published resources.

---

# 10. UC-PUB-003 View service detail

Actor:
Public Visitor

Rules:
service may be unavailable/suspended but still visible.

No private operational fields.

---

# 11. UC-PUB-004 View active alerts

Only active/public alerts.

Resolved/expired may be available in archive if policy allows.

---

# 12. UC-CIT-001 Start service request

Actor:
Citizen

Preconditions:
- service exists
- channel permits digital request
- service version active
- eligibility path available

Creates:
draft.

Pins:
- service version
- form version
- workflow version
- fee definition version where applicable.

---

# 13. UC-CIT-002 Save draft

Draft must preserve user progress.

Autosave must not mark request submitted.

---

# 14. UC-CIT-003 Submit request

Rules:

- server validation
- idempotency
- valid authenticated actor
- required docs satisfied or intentionally deferred
- current service policy permits submission

Result:

- immutable submission timestamp
- request reference
- case creation if workflow requires
- domain event
- audit event

---

# 15. UC-CIT-004 Track request

Citizen sees:

- friendly state
- next action
- dates
- simplified timeline
- relevant documents/messages

Citizen does not see:
- internal notes
- security audit
- confidential staff metadata

---

# 16. UC-CIT-005 Respond to information request

Allowed only when case/request is in appropriate action-required state.

Response must preserve history.

---

# 17. UC-CIT-006 Book appointment

Rules:

- location valid
- service/location relationship valid
- available slot
- temporary hold
- confirmation atomic
- idempotency

---

# 18. UC-CIT-007 Check in

Methods may include:

- QR
- local code
- staff assistance

No mandatory GPS.

---

# 19. UC-CIT-008 Join queue

Ticket created only by valid queue policy.

Appointment and queue ticket remain separate entities.

---

# 20. UC-CIT-009 Pay obligation

Amount comes from server obligation.

Frontend never calculates authoritative payable amount.

---

# 21. UC-CIT-010 Submit complaint / incident

Uses configured categories only.

Do not invent categories.

---

# 22. UC-CIT-011 Apply to funding call

Allowed only while call is open.

Server deadline authoritative.

---

# 23. UC-CIT-012 Submit protocol request

Creates formal institutional request.

Not treated as generic contact message.

---

# 24. ADMIN / STAFF USE CASES

## UC-ADM-001 Triage case

Actor:
Case Officer / Supervisor

Rules:

- resource must be within scope
- action allowed by workflow
- all state changes audited

---

# 25. UC-ADM-002 Assign case

Actor:
authorized staff

Rules:

- assignee valid
- assignee scope valid
- assignment preserved historically
- reason where required
- no silent reassignment

---

# 26. UC-ADM-003 Validate document

Rules:

- classification permits view
- validation decision captured
- rejection reason structured where possible
- previous document versions preserved

---

# 27. UC-ADM-004 Request more information

Result:

- workflow to ACTION_REQUIRED
- citizen notified
- SLA may pause only according to policy
- request preserved
- internal/public message separated

---

# 28. UC-ADM-005 Approve case

Rules:

- capability
- correct state
- separation-of-duties policy
- reason
- decision record
- optional reauth
- immutable history

---

# 29. UC-ADM-006 Reject case

Must include appropriate reason.

Public explanation distinct from internal rationale.

---

# 30. UC-ADM-007 Complete case

Approval and completion may be separate.

Completion only when downstream obligations are satisfied.

---

# 31. UC-ADM-008 Call next queue ticket

Must be atomic server-side.

No two desks should receive the same next ticket.

---

# 32. UC-ADM-009 Reconcile payment

Normal matched transactions should auto-resolve where safe.

Staff attention prioritizes exceptions.

---

# 33. UC-ADM-010 Publish content

Content must be in allowed state.

Scheduled publication uses Africa/Maputo time.

---

# 34. UC-ADM-011 Publish emergency alert

Potential requirements:

- special capability
- reauth
- second approval
- strong audit

---

# 35. UC-ADM-012 Triage protocol request

Must preserve sender, type, destination, priority, history.

---

# 36. UC-ADM-013 Evaluate funding application

Reviewer must declare conflict status before evaluation.

Conflict blocks evaluation.

---

# 37. UC-ADM-014 Record funding decision

Decision separate from individual reviewer scoring.

---

# 38. EXECUTIVE USE CASES

## UC-EXE-001 View executive overview

Default:
aggregated operational health.

Minimize PII.

---

# 39. UC-EXE-002 Review decision item

Only authoritative actionable items.

No fake “AI recommendation” as decision.

---

# 40. UC-EXE-003 View agenda

Visibility respected:

- PUBLIC
- INTERNAL
- PRIVATE
- CONFIDENTIAL

---

# 41. BUSINESS RULE REGISTRY

Business rules should be explicit and testable.

Use identifiers:

`BR-<DOMAIN>-NNN`

---

# 42. SERVICE BUSINESS RULES

## BR-SVC-001

A `MunicipalService` has a permanent identity.

Operational/public rules belong to versioned definitions.

## BR-SVC-002

A request draft pins the relevant service/form/workflow/fee versions.

## BR-SVC-003

A suspended service remains discoverable unless policy explicitly hides it.

## BR-SVC-004

Eligibility requirements are separate from document requirements.

## BR-SVC-005

Fees are represented as:
- FREE
- FIXED
- VARIABLE
- CALCULATED_LATER

---

# 43. REQUEST / CASE BUSINESS RULES

## BR-REQ-001

Request != Case.

Request is the citizen submission.

Case is the municipal operational process.

## BR-REQ-002

Submitted data history must be preserved.

## BR-REQ-003

Critical submission is idempotent.

## BR-CASE-001

State changes happen through allowed workflow transitions.

## BR-CASE-002

Citizen-friendly state labels may differ from internal states.

## BR-CASE-003

Internal note and citizen message are distinct channels.

## BR-CASE-004

Formal decision is immutable.

Correction creates superseding decision record.

---

# 44. DOCUMENT BUSINESS RULES

## BR-DOC-001

Document bytes live in safe object storage.

Metadata lives in DB.

## BR-DOC-002

Uploads enter quarantine before trusted use.

## BR-DOC-003

Document versions are preserved.

## BR-DOC-004

Document classification affects preview/download capability.

---

# 45. APPOINTMENT BUSINESS RULES

## BR-APT-001

Slot availability is server authoritative.

## BR-APT-002

Booking uses temporary hold to reduce race conditions.

## BR-APT-003

Reschedule creates/holds new slot before releasing previous confirmed state.

## BR-APT-004

Appointment != QueueTicket.

---

# 46. QUEUE BUSINESS RULES

## BR-QUE-001

Queue position cannot be manipulated by citizen.

## BR-QUE-002

Public queue display contains no PII.

## BR-QUE-003

`Call Next` must be atomic.

## BR-QUE-004

ETA only shown if reliability is acceptable.

---

# 47. FINANCE BUSINESS RULES

## BR-FIN-001

Request, obligation and payment are separate entities.

## BR-FIN-002

Frontend never sets authoritative payable amount.

## BR-FIN-003

Provider callback must be validated and idempotent.

## BR-FIN-004

Duplicate payment records are never deleted to “clean up”.

## BR-FIN-005

Refund/reversal/waiver are explicit adjustment records.

---

# 48. COMMUNICATION BUSINESS RULES

## BR-COM-001

News, communiqué, alert and notification are distinct entities.

## BR-COM-002

Published official content is versioned.

## BR-COM-003

Emergency alert severity is not inferred from UI color.

## BR-COM-004

Citizen notifications contain only necessary information.

---

# 49. PROTOCOL BUSINESS RULES

## BR-PRO-001

Audience/meeting/invitation/correspondence are formal institutional processes.

## BR-PRO-002

Executive availability is not public.

## BR-PRO-003

Delegation != rejection.

## BR-PRO-004

Meeting scheduling occurs after positive decision where applicable.

---

# 50. FUNDING BUSINESS RULES

## BR-FUN-001

Program != Call.

## BR-FUN-002

Call deadline is server authoritative.

## BR-FUN-003

Reviewer conflict declaration is mandatory before evaluation.

## BR-FUN-004

AI cannot make funding decisions.

## BR-FUN-005

Committee decision is separate from evaluator scoring.

## BR-FUN-006

Approved amount can differ from requested amount with rationale.

---

# 51. REPORTING BUSINESS RULES

## BR-REP-001

Metric definitions must have known formula/source.

## BR-REP-002

Public metric snapshot != live internal metric.

## BR-REP-003

Exports obey data classification and scope.

---

# 52. DATA CLASSIFICATION

Canonical levels:

- PUBLIC
- PERSONAL
- INTERNAL
- CONFIDENTIAL
- RESTRICTED

---

# 53. PUBLIC

Examples:

- published news
- public service descriptions
- approved transparency documents
- public projects
- active public alerts

May be indexed/cached publicly.

---

# 54. PERSONAL

Examples:

- citizen profile
- personal contact details
- citizen-submitted request fields
- documents

Access:
need-to-know and scope-bound.

---

# 55. INTERNAL

Examples:

- operational notes
- staff workflow metadata
- internal reports

Not public.

---

# 56. CONFIDENTIAL

Examples:

- sensitive institutional correspondence
- executive private agenda
- restricted case details
- funding/conflict information where applicable

Strong access control.

---

# 57. RESTRICTED

Highest internal sensitivity.

Examples may include:
- security-sensitive documents
- privileged audit investigations
- highly sensitive personal or institutional data

Requires strongest access control and audit.

---

# 58. AUDIT MODEL

Audit answers:

- who
- did what
- to which resource
- when
- from which scope/context
- previous state
- resulting state
- reason
- correlation ID

---

# 59. AUDIT-REQUIRED ACTIONS

Always audit:

- login/security-relevant events
- permission changes
- role changes
- case assignment
- state decisions
- document validation
- payment reconciliation
- refund/waiver/reversal
- content publication
- alert publication
- protocol decision
- funding evaluation submission
- funding committee decision
- export of sensitive datasets
- break-glass access
- executive confidential access where policy requires

---

# 60. AUDIT INTEGRITY

Audit records:

- immutable
- append-only in business terms
- not editable from normal UI
- not deleted through normal workflow

---

# 61. CONTENT GOVERNANCE

Public content requires:

- source
- owner
- status
- publication state
- timestamps
- version
- validity where relevant

---

# 62. UNVERIFIED CONTENT RULE

If content is not validated:

- do not label it official
- do not invent replacement
- hide or configure as optional
- mark as provisional in development-only context

---

# 63. OFFICIAL CONTENT TYPES

Distinct:

- service information
- news
- communiqué
- alert
- event
- project
- funding call
- public document
- transparency metric

Each has own lifecycle.

---

# 64. NON-FUNCTIONAL REQUIREMENTS

Use identifiers:

`NFR-<AREA>-NNN`

---

# 65. PERFORMANCE

## NFR-PERF-001

Public:
LCP < 2.5s target.

## NFR-PERF-002

CLS < 0.1 target.

## NFR-PERF-003

INP < 200ms target.

## NFR-PERF-004

Route-level code splitting required.

## NFR-PERF-005

Below-fold media lazy-loaded.

---

# 66. ACCESSIBILITY

## NFR-A11Y-001

Keyboard-only support on critical paths.

## NFR-A11Y-002

200% zoom usable.

## NFR-A11Y-003

Reduced motion supported.

## NFR-A11Y-004

Color not sole signal.

## NFR-A11Y-005

Form error semantics correct.

---

# 67. SECURITY

## NFR-SEC-001

Frontend never trusts role visibility as authorization.

## NFR-SEC-002

No secrets in frontend bundle.

## NFR-SEC-003

Sensitive errors sanitized.

## NFR-SEC-004

File uploads validated server-side.

## NFR-SEC-005

Critical mutations protected against duplicate submission.

---

# 68. PRIVACY

## NFR-PRV-001

Minimum necessary PII shown.

## NFR-PRV-002

Executive defaults to aggregate information.

## NFR-PRV-003

No sensitive data in client logs.

---

# 69. RELIABILITY

## NFR-REL-001

Partial section failure must not blank whole dashboard/home.

## NFR-REL-002

Submission timeout triggers status verification.

## NFR-REL-003

Autosave failure is visible.

---

# 70. OBSERVABILITY

## NFR-OBS-001

Correlation ID across API errors/logs.

## NFR-OBS-002

Client errors should be traceable without exposing sensitive data.

---

# 71. QUALITY MODEL

Quality has multiple gates.

A screen can be:

- technically valid
- visually invalid
- accessible but unusable
- beautiful but domain-invalid

Therefore quality requires all dimensions.

---

# 72. QUALITY DIMENSIONS

1. Domain correctness
2. Permission correctness
3. Information architecture
4. UX task clarity
5. Responsive behavior
6. Accessibility
7. Visual craft
8. Performance
9. Reliability
10. Security
11. Maintainability
12. Testability
13. Content integrity

---

# 73. ANTI-AI-SLOP ACCEPTANCE GATE

Reject screen if it exhibits:

- generic SaaS card grid
- excessive pills
- gradient hero
- random glass
- fake stats
- meaningless icon blocks
- repeated identical section structure
- decorative motion
- unverified photography
- oversized empty whitespace
- dashboard KPI wall without task purpose
- mobile as simple stacked desktop
- arbitrary pastel color system
- fake “premium” copy

---

# 74. VISUAL QUALITY GATE

Must validate:

- hierarchy
- spacing
- alignment
- density
- typography
- iconography
- radius
- borders
- shadows
- responsive structure
- state presentation
- content realism

---

# 75. UX QUALITY GATE

Every screen must answer:

- What is the user trying to do?
- What is the next action?
- What happens if there is no data?
- What happens if data fails?
- What happens if user lacks permission?
- What happens on mobile?
- What happens at 200% zoom?
- What happens if action conflicts with current state?

---

# 76. ENGINEERING QUALITY GATE

Required:

- lint pass
- build pass
- tests pass
- TypeScript pass
- `git diff --check` pass
- no accidental backend changes
- no unreviewed route changes
- no broad rule disable

---

# 77. TEST STRATEGY

Testing must grow with phases.

## Layer 1 — Type/static

- TypeScript
- ESLint
- diff check

## Layer 2 — Unit

- utilities
- formatters
- rules
- permission rendering logic
- component state logic

## Layer 3 — Component

Critical components:
- header
- navigation
- form controls
- alerts
- status
- action-required
- filters

## Layer 4 — Integration

Critical journeys:
- service discovery
- request start
- submit
- appointment
- queue
- payment
- staff case
- approval
- protocol
- funding

## Layer 5 — E2E later

Browser-driven full journeys.

---

# 78. RESPONSIVE TEST MATRIX

Each authorized phase must test applicable screens at:

- 320
- 375
- 390
- 430
- 768
- 1024
- 1280
- 1440
- 1920

Also:
- zoom 200%
- keyboard
- reduced motion

---

# 79. TRACEABILITY MODEL

Every implementation item should be traceable.

Recommended mapping:

```text
Screen
→ Use Case
→ Actor
→ Capability
→ Business Rule
→ API
→ State
→ Test
```

Example:

```text
Case Workspace
→ UC-ADM-005 Approve case
→ Supervisor
→ cases.approve
→ BR-CASE-004
→ POST /api/v1/admin/cases/{id}/approve
→ READY_FOR_APPROVAL
→ integration test
```

---

# 80. REQUIREMENT IDENTIFIERS

Use:

- UC-... for use cases
- BR-... for business rules
- NFR-... for non-functional requirements
- ADR-... for architecture decisions
- UX-... for UX-specific decisions where needed
- SEC-... for security decisions where needed

This supports future academic documentation and implementation traceability.

---

# 81. DECISION REGISTRY

Any material change must record:

- decision
- reason
- alternatives
- tradeoff
- affected screens
- affected domain
- migration impact

Use ADR when architectural.

Use design decision log for UI-only decisions.

---

# 82. OPEN-QUESTION REGISTRY

Unknown municipal facts must go into an explicit validation backlog.

Categories:

- service catalog
- organization
- contacts
- hours
- fees
- SLAs
- districts/territories
- protocols
- funding rules
- branding
- emergency contacts

Do not resolve unknowns by invention.

---

# 83. REQUIREMENTS ENGINEERING GATE

Before production freeze, conduct onsite validation for:

- real services
- current workflows
- departments
- roles
- fees
- forms
- documents
- opening hours
- queues
- appointment rules
- payment channels
- communication policy
- protocol
- funding programs
- reporting
- branding

---

# 84. PHASE CONTROL

Only the explicitly authorized phase may be implemented.

Current:

F1 only.

F2 blocked.

Work must stop after F1 validation.

---

# 85. F1 SCOPE

Authorized:

- PublicShell refinement
- PublicHeader
- public navigation
- responsive menu
- PublicFooter
- Home V2
- home search
- quick tasks
- active alerts
- featured services
- local info/mobility
- opportunities
- local updates/news/events
- projects
- transparency links
- optional validated contacts
- route-level code splitting where directly relevant

Not authorized:

- Service Catalog V2
- Service Detail V2
- Guided Request
- Citizen Portal migration
- Admin migration
- Executive screens
- backend domain rewrite

---

# 86. F1 BUSINESS CONTENT RULE

If backend does not provide real data:

Use:
- safe adapters
- empty states
- development fixtures clearly isolated

Do not invent official content.

Fixtures must never be presented as validated municipal truth.

---

# 87. F1 HOME PRIORITY

Home answers:

1. What service do I need?
2. How do I start?
3. How do I track?
4. How do I book?
5. How do I report a problem?
6. Are there alerts?
7. Where can I find municipal information?

This is more important than visual novelty.

---

# 88. F1 QUALITY BAR

Home must not resemble:

- generic shadcn landing page
- Lovable output
- SaaS template
- AI web concept
- card grid demo

It must feel:
civic, editorial, service-first, responsive, credible.

---

# 89. F1 HEADER QUALITY BAR

Header:

- clear IA
- accessible
- compact
- task-oriented
- mobile deliberate
- no unverified contacts
- no prominent admin
- no glass/glow
- no oversized rounded nav

---

# 90. F1 HOME SECTION RULE

Each section must have distinct information grammar.

Do not render every section as:
heading + subtitle + three cards.

Examples:

- quick tasks → action list
- alerts → alert strip/panel
- services → service list/grid hybrid
- news → editorial composition
- projects → structured development summary
- transparency → link index

---

# 91. F1 EMPTY/FAILURE STATES

Every conditional home section must define:

- loading
- empty
- error
- partial

Empty sections may disappear when appropriate.

Critical alerts should not disappear due to unrelated fetch failure.

---

# 92. F1 PERFORMANCE

Avoid large hero imagery.

Prefer text-first LCP.

Use lazy loading below fold.

Code split routes.

Do not bundle admin/executive code into initial public route if avoidable.

---

# 93. F1 ACCESSIBILITY

Validate:

- skip link
- landmarks
- heading order
- mobile menu keyboard behavior
- focus trap
- focus return
- search labels
- visible focus
- 200% zoom
- reduced motion
- alert semantics

---

# 94. F1 RESPONSIVE BEHAVIOR

## 320–479

- mobile header
- search full width
- task list vertical
- no multi-column assumptions
- touch 44px
- no overflow

## 480–767

- improved spacing
- 2-column only where content benefits

## 768–1023

- tablet layout
- 2-column contextual sections

## 1024+

- full nav
- bounded content
- 12-column composition
- no stretched reading lines

## 1920+

- maintain max widths
- use whitespace/context, not giant scaling

---

# 95. F1 REVIEW OUTPUT

At completion Work must return:

1. exact files changed
2. exact files added
3. exact files removed
4. route changes
5. component tree
6. data adapters/hooks
7. responsive decisions
8. accessibility decisions
9. visual decisions
10. legacy compatibility
11. anti-AI-slop removals
12. bundle impact
13. lint result
14. build result
15. tests
16. tsc
17. diff check
18. git status
19. viewport evidence
20. known risks
21. recommended commit split
22. explicit confirmation F2 not started

---

# 96. COMMIT POLICY

F1 should use logical commits.

Recommended:

1. `feat(frontend): refine public shell and navigation`
2. `feat(frontend): implement home v2 service-first composition`
3. `perf(frontend): introduce public route code splitting`
4. `test(frontend): cover public shell and home states`
5. `docs(frontend): document f1 implementation and qa`

Adjust based on actual changes.

---

# 97. NO-COMMIT-UNTIL-REVIEW RULE

If operating interactively with Work:

- implementation may remain uncommitted until review
- inspect full diff
- run all gates
- then commit logically

Do not push automatically.

---

# 98. BRANCH SAFETY

Before any change:

```bash
git branch --show-current
git status
git log -1 --oneline
```

Expected branch:
`feat/frontend-v2-foundation`

If branch differs:
stop.

---

# 99. BACKEND PROTECTION

During frontend-only F1:

Backend changes:
zero.

If backend file changes unexpectedly:
stop and report.

---

# 100. FILE OWNERSHIP PRINCIPLE

New F1 work should live in appropriate areas:

- `shells/public`
- `features/...`
- `design-system/...`
- `app/...`
- existing pages only as composition/migration boundaries

Do not add more architecture debt into monolithic page files.

---

# 101. PUBLIC DATA ADAPTER RULE

UI component:
presentation.

Feature hook:
query/state.

API adapter:
transport.

Do not make Home component fetch directly.

---

# 102. SOURCE OF TRUTH RULE

Server state:
TanStack Query.

Form state:
React Hook Form.

Navigation state:
router/URL.

Theme/layout state:
appropriate context only if needed.

Avoid duplicate state.

---

# 103. ERROR CONTRACT RULE

Frontend should normalize API errors to:

- code
- human message
- correlation id
- optional details

No raw exception leakage.

---

# 104. ANALYTICS RULE

Do not track PII.

Potential future event names:

- public_search_submitted
- service_opened
- quick_task_selected
- citizen_portal_entered

Analytics must be privacy-aware.

---

# 105. CONTENT SECURITY RULE

Public HTML must not expose:

- internal IDs when unnecessary
- internal notes
- unpublished content
- confidential drafts
- staff-only metadata

---

# 106. SEO RULES

Public pages:

- semantic title
- description
- canonical route
- structured heading
- indexable only if public

Authenticated screens:
not indexed.

---

# 107. INTERNATIONALIZATION PREPARATION

Current language may be Portuguese.

Do not hardwire architecture in a way that prevents future localization.

Avoid layout assumptions based on exact text length.

---

# 108. DATE / TIME RULE

Business timezone:
Africa/Maputo.

Store/transport:
ISO.

Display:
localized.

Deadlines:
exact date/time where meaningful.

---

# 109. MONEY RULE

Use Decimal/minor-units semantics.

Never JS floating point as authoritative financial calculation.

---

# 110. ID RULE

Internal:
UUID.

Public:
human reference.

Do not expose DB ID as citizen reference.

---

# 111. REFERENCE FORMAT

Examples only, provisional namespace:

- BC-REQ-2026-00182
- PR-2026-00182
- FD-2026-00182

Reference generation server-side.

---

# 112. CONCURRENCY RULE

Important resources use versioning.

Conflict UX:
- preserve user work
- explain conflict
- provide refresh/review
- no silent overwrite

---

# 113. OFFLINE RULE

No false success.

Do not allow offline financial confirmation.

Do not allow offline submission unless backend protocol explicitly supports safe synchronization.

---

# 114. RATE LIMIT UX

When rate limited:

- human explanation
- safe retry guidance
- no raw 429 screen

---

# 115. SESSION EXPIRY UX

On expiry:

- preserve draft where safe
- reauthenticate
- return to intended route/step

---

# 116. DESTRUCTIVE ACTION UX

Require:

- clear action label
- consequence
- reason if required
- confirmation
- reauth if sensitive

Avoid generic “OK”.

---

# 117. FILE UPLOAD UX

Before upload:
accepted type/size if known.

During:
progress.

After:
received/scanning/valid/rejected.

Backend remains authority.

---

# 118. SEARCH QUALITY

Public search should eventually support:

- synonyms
- category terms
- service names
- natural municipal terminology

Do not overpromise semantic search until implemented.

---

# 119. DESIGN TOKEN GOVERNANCE

No page-level arbitrary palette.

New semantic token requires:

- repeated need
- meaning
- accessibility review
- documented use

---

# 120. COMPONENT GOVERNANCE

Before creating new component:

Check:
- existing design-system component
- feature component
- pattern
- repeated need

Avoid duplicates.

---

# 121. LEGACY DEPRECATION

Legacy compatibility is temporary.

Any alias retained must be documented with:

- current consumers
- replacement
- removal target phase

---

# 122. QUALITY REVIEW CADENCE

After each meaningful F1 slice:

- inspect UI
- inspect responsive
- inspect accessibility
- inspect diff
- run static checks

Do not wait until 40 files changed to review.

---

# 123. VISUAL REGRESSION EVIDENCE

Prefer screenshots at:

- 390
- 768
- 1440

for every major screen slice.

Full matrix before phase freeze.

---

# 124. DECISION ESCALATION

Work must stop and ask/report when:

- docs materially conflict
- municipal fact required but unknown
- domain rule missing
- backend contract missing
- permission ambiguous
- security risk introduced
- design pattern would diverge from canonical system

Do not silently invent.

---

# 125. PROVISIONAL VS FROZEN

Every decision should be one of:

- FROZEN
- IMPLEMENTED
- PROVISIONAL
- REQUIRES VALIDATION
- DEFERRED

Do not blur them.

---

# 126. CURRENT FROZEN DECISIONS

Frozen:

- F0 foundation architecture
- DM Sans global
- semantic token strategy
- shell separation
- public nav architecture
- citizen mobile nav
- responsive bands
- anti-AI-slop rules
- modular monolith target
- request vs case separation
- permission model direction
- F1 scope

---

# 127. CURRENT PROVISIONAL DECISIONS

Provisional:

- municipal brand palette
- exact municipal service categories
- actual departments
- actual service fees
- actual opening hours
- actual contact details
- actual funding programs
- exact SLA rules
- official emergency contacts

---

# 128. PRODUCTION FREEZE REQUIREMENTS

Before production:

- municipal content validation
- accessibility audit
- security review
- performance review
- browser QA
- responsive QA
- permission QA
- API contract validation
- test coverage on critical journeys
- operational monitoring
- deployment rollback plan

---

# 129. ACADEMIC TRACEABILITY

For final academic documentation, preserve:

- requirements
- actor/use-case model
- architecture
- wireframes
- design system
- domain rules
- test evidence
- screenshots
- deployment architecture
- security model
- limitations
- future work

This document helps bridge implementation to academic defense.

---

# 130. MASTER STARTUP PROTOCOL

Every Work session must begin with:

1. Read all five canonical authorities.
2. Confirm current authorized phase.
3. Confirm branch.
4. Confirm git status.
5. Confirm last baseline/commit.
6. Inspect only files relevant to the phase.
7. Produce a short phase-specific execution plan.
8. Do not code outside scope.
9. Run validation after each logical slice.
10. Stop at phase gate.

---

# 131. CANONICAL STARTUP PROMPT — F1

Copy the following prompt into ChatGPT Work.

---

## START PROMPT

You are now operating on Boane Conecta under five canonical authorities.

Read and treat as binding:

1. `docs/handoffs/BOANE_CONECTA_WORK_MASTER_HANDOFF_V1.md`
2. `docs/handoffs/BOANE_CONECTA_RESPONSIVE_WIREFRAME_ATLAS_V1.md`
3. `docs/handoffs/BOANE_CONECTA_DESIGN_UX_CONSTITUTION_V1.md`
4. `docs/handoffs/BOANE_CONECTA_OPERATING_GOVERNANCE_AND_STARTUP_SPEC_V1.md`
5. `docs/frontend/FRONTEND_F0_FOUNDATION.md`

Authority interpretation:

- Master Handoff → product, domain, architecture, security, roadmap
- Wireframe Atlas → screens, use cases, flows, viewport behavior
- UX Constitution → design system, interaction, refactor, anti-AI-slop, quality bar
- Operating/Governance Spec → actors, permissions, business rules, use-case registry, quality gates, traceability, startup protocol
- F0 Foundation → real implemented baseline and technical debt

Current phase authorization:

# F1 — PublicShell + Home V2 ONLY

F2 and later remain blocked.

Before any code change:

1. confirm repository:
   `F:\codebases777\BoaneConeta\repo`

2. confirm branch:
   `feat/frontend-v2-foundation`

3. run:
   - `git branch --show-current`
   - `git status`
   - `git log -1 --oneline`

4. inspect the F0 implementation and current F1-relevant files only.

5. produce a concise F1 implementation plan mapped to:
   - screen
   - use case
   - actor
   - responsive behavior
   - data boundary
   - accessibility
   - quality gate

Then execute F1 incrementally.

Implementation order:

1. PublicShell review
2. PublicHeader IA
3. mobile public navigation
4. PublicFooter
5. Home route composition
6. HomeHero
7. HomeSearch
8. QuickTasks
9. ActiveAlerts
10. FeaturedServices
11. MobilityOverview
12. OpportunitiesOverview
13. LocalUpdates
14. ProjectsOverview
15. TransparencyLinks
16. EssentialContacts
17. route-level public code splitting where appropriate
18. visual QA
19. responsive QA
20. accessibility QA
21. build/lint/test/tsc/diff-check
22. documentation
23. STOP

Rules:

- do not implement F2
- do not modify backend
- do not invent municipal facts
- do not create generic SaaS/card-grid design
- do not use decorative glass/glow/gradient systems
- do not silently change routes
- do not add role-name conditionals
- do not bypass lint/type rules
- do not push
- do not merge
- do not perform destructive git operations

Design target:

Modern Civic Digital Service.

The Home must answer:

1. What service do I need?
2. How do I start?
3. How do I track?
4. How do I book?
5. How do I report a problem?
6. Are there active alerts?
7. Where can I find municipal information?

Public Home section grammar must be intentionally varied:

- Quick Tasks → action list
- Alerts → alert region
- Services → structured service list/grid hybrid
- Local Info → contextual information
- Opportunities → program/opportunity summary
- News/Events → editorial layout
- Projects → development summary
- Transparency → indexed links
- Contacts → only validated/configured data

Do not render every section as heading + subtitle + 3 rounded cards.

Responsive validation required:

- 320
- 375
- 390
- 430
- 768
- 1024
- 1280
- 1440
- 1920
- 200% zoom
- keyboard only
- reduced motion

At F1 completion return:

1. files changed
2. files added
3. files removed
4. route changes
5. component architecture
6. data adapters/hooks
7. use cases implemented
8. permission implications
9. responsive decisions
10. accessibility decisions
11. design decisions
12. anti-AI-slop rules applied
13. legacy compatibility retained
14. bundle impact
15. lint result
16. build result
17. test result
18. TypeScript result
19. `git diff --check`
20. git status
21. viewport QA evidence
22. remaining risks
23. recommended commit split
24. explicit confirmation that F2 was NOT started

Do not call F1 complete until all gates pass.

---

# 132. FINAL OPERATING PRINCIPLE

The implementation must not merely be visually impressive.

It must be:

- domain-correct
- permission-safe
- traceable
- accessible
- responsive
- secure
- maintainable
- operationally useful
- visually disciplined
- content-trustworthy

The project should withstand review by:

- product designer
- frontend architect
- backend architect
- accessibility specialist
- security reviewer
- municipal stakeholder
- academic evaluator

without relying on “AI generated” shortcuts.

---

**END — BOANE CONECTA OPERATING, GOVERNANCE & STARTUP SPEC V1**
