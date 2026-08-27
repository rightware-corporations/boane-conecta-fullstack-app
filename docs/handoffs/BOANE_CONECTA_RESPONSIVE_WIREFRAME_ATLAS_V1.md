# BOANE CONECTA — RESPONSIVE WIREFRAME ATLAS V1

**Status:** Canonical conceptual wireframe and responsive engineering handoff
**Project:** Boane Conecta
**Repository:** `F:\codebases777\BoaneConeta\repo`
**Frontend branch:** `feat/frontend-v2-foundation`
**Foundation dependency:** F0 complete
**Purpose:** provide a complete screen, viewport, use-case and responsive implementation map for ChatGPT Work and frontend engineering.

---

# 0. HOW TO USE THIS DOCUMENT

This document is not a visual moodboard.

It is a **responsive product engineering specification** that defines:

- which screens exist;
- which use cases each screen serves;
- which shell owns each screen;
- which canonical pattern each screen uses;
- how each screen behaves at every viewport family;
- what is visible, moved, collapsed, deferred or replaced;
- what actions exist;
- what states must be supported;
- what permissions affect the screen;
- what data boundaries are expected;
- what is intentionally provisional;
- which screens depend on onsite municipal validation.

This document must be used together with:

- `BOANE_CONECTA_WORK_MASTER_HANDOFF_V1.md`
- `FRONTEND_F0_FOUNDATION.md`

If a future implementation conflicts with this document, stop and review the product decision before inventing a new behavior.

---

# 1. RESPONSIVE VIEWPORT MODEL

## 1.1 Canonical viewport families

| Family | Width | Primary usage |
|---|---:|---|
| XS | `< 375` | minimum mobile |
| SM | `375–479` | common smartphone |
| MD | `480–767` | large phone / compact tablet |
| TB | `768–1023` | tablet |
| LG | `1024–1279` | laptop / landscape tablet |
| XL | `1280–1439` | standard desktop |
| 2XL | `1440–1919` | wide desktop |
| 3XL | `>= 1920` | widescreen |

Required QA widths:

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
- keyboard-only
- reduced motion

---

# 2. RESPONSIVE ENGINEERING RULES

## 2.1 Global gutters

- `< 480`: 16 px
- `480+`: 20 px
- `768+`: 24 px
- `1024+`: 32 px
- large desktop: up to 48 px when useful

## 2.2 Containers

- Public max: 1280 px
- Citizen max: 1280 px
- Admin max: 1440 px
- Executive max: 1440 px
- Reading max: 720–760 px
- Forms: 640–800 px

## 2.3 Grids

- mobile: 4 columns
- tablet: 8 columns
- desktop: 12 columns

## 2.4 Mobile-first behavior

Mobile is not a smaller desktop.

On mobile:

- sidebars become bottom navigation or drawer;
- table rows become record lists where practical;
- action rails become bottom/sticky actions;
- right-side metadata panels move below the primary task;
- long forms become one-column;
- secondary filters move to sheets;
- sticky page actions may appear at the bottom;
- dense admin workflows remain supported but are simplified for quick actions;
- high-risk staff actions may remain desktop-preferred.

---

# 3. CANONICAL SHELL WIREFRAMES

# 3.1 PUBLIC SHELL

## Use cases

- UC-PUB-001 Navigate municipal information
- UC-PUB-002 Search services/information
- UC-PUB-003 Enter citizen portal
- UC-PUB-004 View public alert
- UC-PUB-005 Access transparency
- UC-PUB-006 Read news/events
- UC-PUB-007 Discover development programs

## XS / SM

```text
┌─────────────────────────────┐
│ [Logo]        [Entrar] [☰] │
├─────────────────────────────┤
│ SYSTEM ALERT if active      │
├─────────────────────────────┤
│                             │
│ MAIN CONTENT                │
│                             │
├─────────────────────────────┤
│ FOOTER                      │
└─────────────────────────────┘
```

Rules:
- no full desktop nav;
- menu opens full-height or large sheet;
- search can be visible in home hero and menu;
- no duplicated admin entry;
- essential alert can appear above header or below depending severity;
- 44 px touch targets.

## MD / TB

```text
┌──────────────────────────────────────┐
│ [Logo]           [Search] [Entrar] ☰ │
├──────────────────────────────────────┤
│ MAIN                                 │
├──────────────────────────────────────┤
│ FOOTER                               │
└──────────────────────────────────────┘
```

## LG+

```text
┌──────────────────────────────────────────────────────────────┐
│ LOGO   Serviços Município Viver Desenvolvimento Transparência│
│        Notícias        [Search]       [Área do Munícipe]     │
├──────────────────────────────────────────────────────────────┤
│ SYSTEM ALERT REGION                                          │
├──────────────────────────────────────────────────────────────┤
│ MAIN CONTENT                                                 │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘
```

---

# 3.2 CITIZEN SHELL

## Use cases

- UC-CIT-001 View personal overview
- UC-CIT-002 Start request
- UC-CIT-003 Track requests
- UC-CIT-004 Manage documents
- UC-CIT-005 Manage appointments
- UC-CIT-006 View payments
- UC-CIT-007 View alerts/notifications
- UC-CIT-008 Manage profile
- UC-CIT-009 Submit complaint/incident
- UC-CIT-010 Apply to funding/programs

## XS / SM / MD

```text
┌─────────────────────────────┐
│ [Boane Conecta]     [Bell]  │
├─────────────────────────────┤
│ PAGE HEADER                 │
│                             │
│ MAIN CONTENT                │
│                             │
├─────────────────────────────┤
│ Início Pedidos Serviços     │
│ Alertas Conta               │
└─────────────────────────────┘
```

Rules:
- bottom navigation fixed/safe-area-aware;
- no permanent sidebar;
- secondary sections via page-level menu/overflow;
- critical current action appears above historical content.

## TB

```text
┌──────────────────────────────────────┐
│ [☰] Page title           [Bell][Me] │
├──────────────────────────────────────┤
│ MAIN                                 │
│                                      │
└──────────────────────────────────────┘
```

Navigation uses drawer or compact rail.

## LG+

```text
┌──────────────┬───────────────────────────────────────────────┐
│ SIDEBAR      │ HEADER                                        │
│              ├───────────────────────────────────────────────┤
│ Início       │ MAIN                                          │
│ Novo pedido  │                                               │
│ Pedidos      │                                               │
│ Documentos   │                                               │
│ Agenda       │                                               │
│ Pagamentos   │                                               │
│ ...          │                                               │
└──────────────┴───────────────────────────────────────────────┘
```

---

# 3.3 ADMIN SHELL

## Use cases

- UC-ADM-001 View operational priorities
- UC-ADM-002 Triage case
- UC-ADM-003 Assign/reassign case
- UC-ADM-004 Process case
- UC-ADM-005 Request more information
- UC-ADM-006 Approve/reject
- UC-ADM-007 Manage queue
- UC-ADM-008 Manage appointments
- UC-ADM-009 Reconcile payments
- UC-ADM-010 Manage public content
- UC-ADM-011 Manage programs
- UC-ADM-012 View reports
- UC-ADM-013 Manage users/permissions

## XS / SM

Admin mobile is a quick-action workspace, not the primary full processing environment.

```text
┌─────────────────────────────┐
│ [☰] Processos      [Search] │
├─────────────────────────────┤
│ FILTER CHIPS / VIEW         │
├─────────────────────────────┤
│ RECORD LIST                 │
│ Ref                         │
│ Service                     │
│ Status                      │
│ SLA                         │
│ [Open]                      │
│                             │
├─────────────────────────────┤
│ Optional quick nav          │
└─────────────────────────────┘
```

## TB

Drawer + compact work area.

## LG+

```text
┌────────────────┬──────────────────────────────────────────────┐
│ ADMIN SIDEBAR  │ CONTEXT HEADER                               │
│                ├──────────────────────────────────────────────┤
│ Hoje           │ MAIN WORKSPACE                               │
│ Atendimento    │                                              │
│ Processos      │                                              │
│ Programas      │                                              │
│ Protocolo      │                                              │
│ Comunicação    │                                              │
│ Gestão         │                                              │
│ Análise        │                                              │
└────────────────┴──────────────────────────────────────────────┘
```

---

# 3.4 EXECUTIVE SHELL

## Use cases

- UC-EXE-001 View critical exceptions
- UC-EXE-002 Review decision items
- UC-EXE-003 View executive agenda
- UC-EXE-004 Review project/program health
- UC-EXE-005 View institutional reports
- UC-EXE-006 Review audiences/protocol

## Mobile

```text
┌─────────────────────────────┐
│ Executive       [Bell][Me]  │
├─────────────────────────────┤
│ REQUIRES ATTENTION          │
│ 3 critical items            │
│                             │
│ TODAY                       │
│ 09:00 ...                   │
│ 11:30 ...                   │
│                             │
│ DECISIONS                   │
│ ...                         │
└─────────────────────────────┘
```

## Desktop

```text
┌──────────────┬───────────────────────────────────────────────┐
│ EXEC NAV     │ VISÃO GERAL                                   │
│              │                                               │
│ Overview     │ REQUIRES ATTENTION                            │
│ Indicators   │                                               │
│ Projects     │ SERVICE HEALTH                                │
│ Programs     │                                               │
│ Audiences    │ PROJECTS / PROGRAMS                           │
│ Agenda       │                                               │
│ Reports      │ TODAY                                         │
└──────────────┴───────────────────────────────────────────────┘
```

---

# 4. PUBLIC HOME V2

## Use cases

- UC-PUB-HOME-001 Find a service
- UC-PUB-HOME-002 Track a request
- UC-PUB-HOME-003 Book appointment
- UC-PUB-HOME-004 Report a problem
- UC-PUB-HOME-005 View active alerts
- UC-PUB-HOME-006 Browse featured services
- UC-PUB-HOME-007 Find opportunities
- UC-PUB-HOME-008 Read news/events
- UC-PUB-HOME-009 View projects
- UC-PUB-HOME-010 Access transparency
- UC-PUB-HOME-011 Find validated contacts

## XS / SM

```text
┌─────────────────────────────┐
│ HEADER                      │
├─────────────────────────────┤
│ Serviços municipais mais   │
│ simples e próximos de si.  │
│                             │
│ [Search...................] │
│                             │
│ Solicitar serviço       →  │
│ Consultar pedido        →  │
│ Agendar atendimento     →  │
│ Reportar problema       →  │
├─────────────────────────────┤
│ ACTIVE ALERTS (conditional) │
├─────────────────────────────┤
│ SERVIÇOS EM DESTAQUE        │
│ Service row             →  │
│ Service row             →  │
├─────────────────────────────┤
│ MOBILIDADE / INFO LOCAL     │
├─────────────────────────────┤
│ OPORTUNIDADES               │
├─────────────────────────────┤
│ NOTÍCIAS                    │
│ Event                       │
│ News                        │
├─────────────────────────────┤
│ PROJECTOS                   │
├─────────────────────────────┤
│ TRANSPARÊNCIA               │
├─────────────────────────────┤
│ CONTACTOS if validated      │
├─────────────────────────────┤
│ FOOTER                      │
└─────────────────────────────┘
```

## TB

```text
┌─────────────────────────────────────────────┐
│ HERO / SEARCH                               │
│                                             │
│ [ Search ................................ ] │
├─────────────────────────────────────────────┤
│ QUICK TASKS 2 x 2                           │
├─────────────────────────────────────────────┤
│ ALERTS                                      │
├─────────────────────────────────────────────┤
│ FEATURED SERVICES 2 cols                    │
├─────────────────────────────────────────────┤
│ OPPORTUNITIES | LOCAL INFO                  │
├─────────────────────────────────────────────┤
│ NEWS / EVENTS 2 cols                        │
├─────────────────────────────────────────────┤
│ PROJECTS                                    │
├─────────────────────────────────────────────┤
│ TRANSPARENCY                                │
└─────────────────────────────────────────────┘
```

## LG+

```text
┌──────────────────────────────────────────────────────────────┐
│ HERO                                                         │
│ Services municipal...                                        │
│ [ Search service, document or information................. ] │
│                                                              │
│ Quick links: Start | Track | Book | Report                   │
├──────────────────────────────────────────────────────────────┤
│ ACTIVE ALERTS                                                 │
├──────────────────────────────────────────────────────────────┤
│ FEATURED SERVICES                                             │
│ List / structured 3-column content                           │
├──────────────────────────────────────────────────────────────┤
│ LOCAL INFO                         OPPORTUNITIES               │
├──────────────────────────────────────────────────────────────┤
│ NEWS / EVENTS editorial composition                          │
├──────────────────────────────────────────────────────────────┤
│ PROJECTS & DEVELOPMENT                                       │
├──────────────────────────────────────────────────────────────┤
│ TRANSPARENCY LINKS                                            │
├──────────────────────────────────────────────────────────────┤
│ ESSENTIAL CONTACTS only if validated                         │
└──────────────────────────────────────────────────────────────┘
```

---

# 5. GLOBAL PUBLIC SEARCH

## Use cases

- UC-SEARCH-001 Search service
- UC-SEARCH-002 Search news
- UC-SEARCH-003 Search communiqué
- UC-SEARCH-004 Search project
- UC-SEARCH-005 Search public document
- UC-SEARCH-006 Search funding call

## Mobile

```text
Search

[ Query.................... ]

Suggested:
Services
News
Projects

Results

SERVICES (3)
...
NEWS (2)
...
```

## Desktop

```text
Search municipal information

[ Query ................................................. ]

Filters:
All | Services | News | Projects | Programs | Documents

RESULT GROUPS
```

Search respects visibility/public status.

---

# 6. SERVICE CATALOG

## Use cases

- UC-SVC-001 Browse services
- UC-SVC-002 Search service
- UC-SVC-003 Filter by category
- UC-SVC-004 Filter by channel
- UC-SVC-005 Filter by audience
- UC-SVC-006 View unavailable/suspended service
- UC-SVC-007 Open service detail

## XS / SM

```text
Serviços

[Search...................]

[Categorias] [Filtros]

Resultados: 24

Service title
Short description
Online · Presencial
Fee/time if relevant
→

---------------------

Service title
...
```

Filter buttons open bottom sheets.

## TB

```text
Serviços

[Search................................]

[Categories horizontal / dropdown]
[Filters]

Results grid/list 2 cols where useful
```

## LG+

```text
Breadcrumb
Serviços

[Search...................................................]

┌──────────────────┬───────────────────────────────────────────┐
│ FILTERS          │ RESULTS                                   │
│ Category         │ Service                                   │
│ Channel          │ description                               │
│ Audience         │ channels · fee · duration                 │
│ Availability     │ ----------------------------------------- │
│                  │ Service                                   │
└──────────────────┴───────────────────────────────────────────┘
```

---

# 7. SERVICE DETAIL

## Use cases

- UC-SVC-DET-001 Understand service
- UC-SVC-DET-002 Review eligibility
- UC-SVC-DET-003 Review requirements
- UC-SVC-DET-004 Review required documents
- UC-SVC-DET-005 Review fee
- UC-SVC-DET-006 Review duration
- UC-SVC-DET-007 Start online request
- UC-SVC-DET-008 Book appointment
- UC-SVC-DET-009 View suspension/unavailability

## Mobile

```text
Service title
Short description

Availability
Fee
Time
Channels

[Start request]
[Book appointment]

ABOUT
...

REQUIREMENTS
...

DOCUMENTS
...

PROCESS
1...
2...
3...

LOCATIONS
...

FAQ
...
```

Practical metadata and CTA before long explanatory content.

## Desktop

```text
Breadcrumb

SERVICE TITLE
description

┌────────────────────────────────┬─────────────────────────────┐
│ ABOUT                          │ AVAILABILITY                │
│ REQUIREMENTS                   │ FEE                         │
│ DOCUMENTS                      │ TIME                        │
│ PROCESS                        │ CHANNEL                     │
│ LOCATIONS                      │                             │
│ LEGAL REFS                     │ [Start request]             │
│ FAQ                            │ [Book appointment]          │
└────────────────────────────────┴─────────────────────────────┘
```

---

# 8. AUTHENTICATION

## Screens

- Login
- Registration
- Forgot password
- Reset password
- Reauthentication
- Optional MFA challenge later
- Session expired

## Use cases

- UC-AUTH-001 Login
- UC-AUTH-002 Register citizen
- UC-AUTH-003 Recover account
- UC-AUTH-004 Reauthenticate critical action
- UC-AUTH-005 Resume interrupted journey

## Mobile

```text
[Logo]

Entrar

Email / phone
[...................]

Password
[...................]

[Entrar]

Forgot password

No account?
[Create account]
```

## Desktop

```text
┌───────────────────────────┬───────────────────────────────┐
│ Institutional / service   │ LOGIN                         │
│ context                   │                               │
│                           │ fields                        │
│                           │                               │
└───────────────────────────┴───────────────────────────────┘
```

Avoid decorative half-screen marketing art unless real/validated imagery exists.

---

# 9. GUIDED REQUEST FORM

## Use cases

- UC-REQ-001 Start draft
- UC-REQ-002 Complete eligibility
- UC-REQ-003 Fill dynamic fields
- UC-REQ-004 Save draft
- UC-REQ-005 Upload documents
- UC-REQ-006 Review
- UC-REQ-007 Submit
- UC-REQ-008 Recover after session expiry
- UC-REQ-009 Resolve validation errors

## Mobile

```text
Service name

Step 2 of 5
██████░░░░

PERSONAL DETAILS

Label
[input]

Label
[input]

Help text

Autosave: Guardado

[Back]              [Continue]
```

Bottom action can become sticky if long.

## Tablet

Form max 640–720 with progress.

## Desktop

```text
Service name                  Step 2 of 5

┌─────────────────────────────────────────────────────────────┐
│ FORM 640–800                                                │
│                                                             │
│ Section title                                               │
│ field                                                       │
│ field                                                       │
│                                                             │
│ Autosave: Guardado                                          │
│                                                             │
│ [Back]                                      [Continue]      │
└─────────────────────────────────────────────────────────────┘
```

No side decoration necessary.

---

# 10. DOCUMENT UPLOAD STEP

## Use cases

- UC-DOC-001 Upload document
- UC-DOC-002 Replace document
- UC-DOC-003 View validation status
- UC-DOC-004 Resolve rejected document

## Mobile

```text
Documents

Identity document
Required

[Choose file / Camera]

uploading...
██████████

Status: Received

-----------------------

Proof of residence
Conditional

[Upload]
```

## Desktop

Structured rows:

```text
Document            Required    Status        Action
Identity            Yes         Valid         Replace
Proof...             Yes         Missing       Upload
```

---

# 11. REQUEST REVIEW

## Use cases

- UC-REQ-REV-001 Review answers
- UC-REQ-REV-002 Edit section
- UC-REQ-REV-003 Review documents
- UC-REQ-REV-004 Confirm declaration
- UC-REQ-REV-005 Submit

## Mobile

```text
Review request

Personal details
Name ...
Address ...
[Edit]

Documents
2 valid
[Review]

Declaration
[ ] I confirm...

[Submit request]
```

## Desktop

2-column summary only if helpful; otherwise reading-width.

---

# 12. REQUEST CONFIRMATION

## Use cases

- UC-REQ-CNF-001 See reference
- UC-REQ-CNF-002 Copy reference
- UC-REQ-CNF-003 View next steps
- UC-REQ-CNF-004 Open request

## All viewports

```text
Request submitted

Reference
BC-REQ-2026-00182 [Copy]

Submitted
date / time

What happens next
...

[View request]
[Back to services]
```

No confetti.

---

# 13. CITIZEN DASHBOARD

## Use cases

- UC-CIT-HOME-001 See required actions
- UC-CIT-HOME-002 Continue draft
- UC-CIT-HOME-003 Track active request
- UC-CIT-HOME-004 View upcoming appointment
- UC-CIT-HOME-005 View pending payment
- UC-CIT-HOME-006 Read notification

## Mobile

```text
Bom dia

AÇÃO NECESSÁRIA
Request BC-...
Document required
[Respond]

YOUR REQUESTS
...

NEXT APPOINTMENT
...

NOTIFICATIONS
...
```

## Desktop

```text
Início

ACTION REQUIRED
┌────────────────────────────────────────────────────────────┐
│ ...                                                        │
└────────────────────────────────────────────────────────────┘

┌──────────────────────────────┬─────────────────────────────┐
│ ACTIVE REQUESTS              │ NEXT APPOINTMENT            │
│                              │                             │
├──────────────────────────────┼─────────────────────────────┤
│ PAYMENTS                     │ NOTIFICATIONS               │
└──────────────────────────────┴─────────────────────────────┘
```

No generic KPI cards.

---

# 14. CITIZEN REQUEST LIST

## Use cases

- UC-CIT-REQ-001 View requests
- UC-CIT-REQ-002 Search/filter requests
- UC-CIT-REQ-003 Resume draft
- UC-CIT-REQ-004 Open request

## Mobile

Record list:
reference / service / friendly status / date / next action.

## Desktop

Table or structured list.

---

# 15. CITIZEN REQUEST DETAIL

## Use cases

- UC-CIT-REQD-001 Track current status
- UC-CIT-REQD-002 See next action
- UC-CIT-REQD-003 Respond to information request
- UC-CIT-REQD-004 View documents
- UC-CIT-REQD-005 View messages
- UC-CIT-REQD-006 View simplified timeline
- UC-CIT-REQD-007 Pay obligation

## Mobile

```text
BC-REQ-...
Service name

ACTION REQUIRED
Provide missing document
[Respond]

Status
Em análise

Submitted
...

Documents
...

Messages
...

Timeline
...
```

## Desktop

```text
REQUEST REF

┌────────────────────────────────┬─────────────────────────────┐
│ ACTION / MAIN                  │ SUMMARY                     │
│ Data                           │ Status                      │
│ Documents                      │ Service                     │
│ Messages                       │ Dates                       │
│ Timeline                       │ Payment                     │
└────────────────────────────────┴─────────────────────────────┘
```

---

# 16. CITIZEN DOCUMENTS

## Use cases

- UC-CIT-DOC-001 View stored docs
- UC-CIT-DOC-002 Upload new version
- UC-CIT-DOC-003 See expiry/validation
- UC-CIT-DOC-004 Reuse document

Mobile uses list rows.

Desktop can use table.

States:
- pending
- valid
- invalid
- expired
- quarantined
- replaced

Quarantined must be phrased safely for citizen.

---

# 17. APPOINTMENT BOOKING

## Use cases

- UC-APT-001 Choose location
- UC-APT-002 Choose date
- UC-APT-003 Choose slot
- UC-APT-004 Confirm
- UC-APT-005 Reschedule
- UC-APT-006 Cancel

## Mobile

```text
Book appointment

1 Location
[Selected location]

2 Date
[<] August [>]
calendar

3 Time
[09:00] [09:30]
[10:00] [10:30]

[Continue]
```

## Desktop

```text
┌──────────────────────────┬──────────────────────────────────┐
│ LOCATION / DATE          │ AVAILABLE TIMES                  │
│ calendar                 │ slots                            │
└──────────────────────────┴──────────────────────────────────┘
```

Slot state:
- available
- selected
- held
- unavailable

Never color-only.

---

# 18. APPOINTMENT CONFIRMATION

```text
Appointment confirmed

Service
Location
Date
Time

Check-in information
...

[Add reminder]
[View appointment]
```

---

# 19. CHECK-IN

## Use cases

- UC-CHK-001 Check in by QR
- UC-CHK-002 Check in by code
- UC-CHK-003 Staff assisted check-in

## Mobile

```text
Check in

[Scan QR]

or

Enter location code
[______]

[Continue]
```

Camera permission denial must offer manual fallback.

---

# 20. DIGITAL QUEUE TICKET

## Use cases

- UC-QUE-CIT-001 View ticket
- UC-QUE-CIT-002 See called state
- UC-QUE-CIT-003 See queue estimate
- UC-QUE-CIT-004 Receive near-turn notification

## Mobile

```text
YOUR TICKET

B-042

WAITING

People ahead
8

Estimated
20–35 min

Last update
10:24

Stay nearby
```

## Desktop citizen portal

Same content centered; no need for dense dashboard.

---

# 21. CITIZEN PAYMENTS

## Use cases

- UC-PAY-CIT-001 View obligation
- UC-PAY-CIT-002 Start payment
- UC-PAY-CIT-003 View pending status
- UC-PAY-CIT-004 View confirmed payment
- UC-PAY-CIT-005 Download receipt

## Mobile

```text
Payment required

Service
Request ref

Amount
MZN ...

Method
...

[Pay]

Payment status
...
```

## Desktop

Summary + payment action in bounded content.

---

# 22. CITIZEN NOTIFICATIONS

## Use cases

- UC-NOT-CIT-001 View notifications
- UC-NOT-CIT-002 Mark read
- UC-NOT-CIT-003 Open deep link
- UC-NOT-CIT-004 Manage preferences

Mobile: chronological list.

Desktop: 8/4 list + preferences filter if needed.

---

# 23. COMPLAINT / INCIDENT SUBMISSION

## Use cases

- UC-CMP-001 Submit complaint
- UC-CMP-002 Report incident
- UC-CMP-003 Add location/photo if supported
- UC-CMP-004 Track complaint
- UC-CMP-005 Anonymous/public intake if policy allows

Uses Guided Form pattern.

No municipal categories invented until validated.

---

# 24. ADMIN OPERATIONS HOME

## Use cases

- UC-OPS-001 See urgent backlog
- UC-OPS-002 See unassigned work
- UC-OPS-003 See SLA risk
- UC-OPS-004 Open saved view
- UC-OPS-005 See current queue/appointment operational signal

## Mobile

```text
Hoje

Requires attention
12 cases

SLA overdue
4

Unassigned
8

[Open queue]
```

## Desktop

```text
VISÃO OPERACIONAL

REQUIRES ATTENTION
- 4 SLA overdue
- 8 unassigned
- 3 citizen actions received

MY WORK
...

QUEUE / APPOINTMENTS
...

RECENT OPERATIONAL EVENTS
...
```

Not a KPI wall.

---

# 25. STAFF WORK QUEUE

## Use cases

- UC-CASE-001 Search cases
- UC-CASE-002 Filter cases
- UC-CASE-003 Use saved views
- UC-CASE-004 Assign
- UC-CASE-005 Bulk assign/reprioritize where allowed
- UC-CASE-006 Open case

## Mobile

Record list.

```text
Processos
[Search]
[View: Assigned to me]
[Filters]

BC-REQ-0182
Service
Citizen
IN REVIEW
SLA today
[Open]
```

## Desktop

```text
Processos

[Search................................]

Saved views: Mine | Unassigned | Triage | SLA Today | Overdue

Filters...

Ref      Service       Citizen      State       SLA      Assignee
...
```

---

# 26. CASE WORKSPACE

## Use cases

- UC-CASE-DET-001 Review case
- UC-CASE-DET-002 Review request data
- UC-CASE-DET-003 Validate document
- UC-CASE-DET-004 Add internal note
- UC-CASE-DET-005 Message citizen
- UC-CASE-DET-006 Request information
- UC-CASE-DET-007 Assign/reassign
- UC-CASE-DET-008 Send for approval
- UC-CASE-DET-009 Approve/reject
- UC-CASE-DET-010 Complete case
- UC-CASE-DET-011 View operational timeline

## Mobile

Quick review:

```text
BC-REQ-0182

ACTION REQUIRED
Review new citizen response

[Review]
[More]

Applicant
Service
SLA

Request data
Documents
Messages
Timeline
```

High-risk decisions may require larger-screen or explicit confirmation.

## TB

Single column with collapsible context.

## LG+

```text
CASE REF / SERVICE / STATUS

ACTION REQUIRED
Review request and decide next action.

[Request info] [Send for approval] [Reject] [More]

┌────────────────────────────────┬─────────────────────────────┐
│ REQUEST DATA                   │ APPLICANT                   │
│ DOCUMENTS                      │ SERVICE                     │
│ CITIZEN MESSAGES               │ DEPARTMENT                  │
│ INTERNAL NOTES                 │ ASSIGNEE                    │
│ OPERATIONAL TIMELINE           │ SLA / DATES                 │
└────────────────────────────────┴─────────────────────────────┘
```

---

# 27. DOCUMENT REVIEW WORKSPACE

## Use cases

- UC-DOC-ADM-001 View safe preview
- UC-DOC-ADM-002 Validate
- UC-DOC-ADM-003 Reject with reason
- UC-DOC-ADM-004 Compare versions
- UC-DOC-ADM-005 Download if authorized

Desktop:

```text
┌──────────────────────────────────┬───────────────────────────┐
│ DOCUMENT PREVIEW                 │ META                      │
│                                  │ Type                      │
│                                  │ Version                   │
│                                  │ Status                    │
│                                  │                           │
│                                  │ [Validate]                │
│                                  │ [Reject]                  │
└──────────────────────────────────┴───────────────────────────┘
```

Mobile:
metadata first, preview link/fullscreen.

---

# 28. APPOINTMENT ADMIN CALENDAR

## Use cases

- UC-APT-ADM-001 View appointments
- UC-APT-ADM-002 Filter by service/location/resource
- UC-APT-ADM-003 Reschedule
- UC-APT-ADM-004 Cancel
- UC-APT-ADM-005 View capacity

Mobile:
agenda list preferred.

Tablet:
day agenda / compact calendar.

Desktop:
calendar + contextual panel.

---

# 29. STAFF QUEUE CONSOLE

## Use cases

- UC-QUE-ADM-001 Open desk
- UC-QUE-ADM-002 Call next
- UC-QUE-ADM-003 Recall
- UC-QUE-ADM-004 Start service
- UC-QUE-ADM-005 Complete
- UC-QUE-ADM-006 Transfer
- UC-QUE-ADM-007 Mark no-show

## Mobile

```text
Desk 03
OPEN

Serving
B-038

Waiting
12

[Complete]
[Transfer]

[Call next]
```

## Desktop

```text
QUEUE — LOCATION

DESK STATUS       CURRENT TICKET          WAITING LIST
Open              B-038                   B-039
                  Citizen info scoped      B-040
[Pause]           [Complete][Transfer]     B-041

[CALL NEXT]
```

---

# 30. PAYMENT OPERATIONS

## Use cases

- UC-PAY-ADM-001 View payment
- UC-PAY-ADM-002 Confirm manual payment
- UC-PAY-ADM-003 Reconcile
- UC-PAY-ADM-004 Resolve mismatch
- UC-PAY-ADM-005 Process reversal/refund with authorization
- UC-PAY-ADM-006 View receipt

Mobile:
exception list only.

Desktop:
exception-driven table + workspace.

```text
RECONCILIATION

Saved views:
Unmatched | Mismatch | Possible Duplicate | Manual Review

Ref     Obligation    Amount    Provider    State
...
```

---

# 31. CONTENT MANAGEMENT — NEWS

## Use cases

- UC-CMS-001 Create draft
- UC-CMS-002 Edit
- UC-CMS-003 Review
- UC-CMS-004 Approve
- UC-CMS-005 Schedule
- UC-CMS-006 Publish
- UC-CMS-007 Unpublish
- UC-CMS-008 Archive

Mobile:
light review only.

Desktop:
editor + metadata panel.

```text
ARTICLE EDITOR

Title
Summary
Body
Media

┌───────────────────────────────┬──────────────────────────────┐
│ EDITOR                        │ STATUS                       │
│                               │ Author                       │
│                               │ Schedule                     │
│                               │ SEO                          │
│                               │ [Submit review]              │
└───────────────────────────────┴──────────────────────────────┘
```

---

# 32. OFFICIAL COMMUNIQUÉ

Distinct from news.

Use cases:
- UC-COM-001 Draft communiqué
- UC-COM-002 Approve
- UC-COM-003 Publish
- UC-COM-004 Supersede
- UC-COM-005 Attach official document

Metadata may include:
reference number, issuer, subject, effective date, validity, PDF.

Do not invent formatting rules before validation.

---

# 33. ALERT MANAGEMENT

## Use cases

- UC-ALT-001 Create alert
- UC-ALT-002 Approve alert
- UC-ALT-003 Publish alert
- UC-ALT-004 Update alert
- UC-ALT-005 Resolve alert
- UC-ALT-006 Target territory
- UC-ALT-007 Reauthenticate emergency publication

## Mobile

Review/resolve can be supported.

## Desktop

```text
ALERT

Severity
[INFO | ADVISORY | WARNING | EMERGENCY]

Title
Message
Instructions
Affected area
Start / expiry

[Save draft]
[Submit approval]
[Publish]
```

Emergency action requires stronger confirmation/permissions.

---

# 34. EVENT MANAGEMENT

Use cases:
- create;
- update;
- publish;
- cancel;
- classify public/internal/private where applicable.

Public events and executive agenda events are different views/contracts.

---

# 35. PROTOCOL INBOX

## Use cases

- UC-PRO-001 Receive request
- UC-PRO-002 Triage
- UC-PRO-003 Classify
- UC-PRO-004 Assign destination
- UC-PRO-005 Set priority
- UC-PRO-006 Forward
- UC-PRO-007 Request more info
- UC-PRO-008 Decide
- UC-PRO-009 Schedule after acceptance

## Mobile

Record list for quick triage.

## Desktop

```text
PROTOCOLO

[Search...................................]

Views:
Received today | Triage | Cabinet | Awaiting | Due soon

Filters...

Ref       Type         Sender         State        Destination
...
```

---

# 36. PROTOCOL WORKSPACE

## Desktop

```text
PR-2026-00182
Audience Request

ACTION
Needs triage

[Forward] [Request info] [Decline] [...]

┌────────────────────────────────┬─────────────────────────────┐
│ REQUEST                        │ SENDER                      │
│ ATTACHMENTS                    │ TYPE                        │
│ NOTES                          │ DESTINATION                 │
│ HISTORY                        │ PRIORITY                    │
│                                │ DEADLINE                    │
└────────────────────────────────┴─────────────────────────────┘
```

Mobile:
single column, action-first.

---

# 37. EXECUTIVE AGENDA

## Use cases

- UC-EXE-AGD-001 View today
- UC-EXE-AGD-002 View private/public event
- UC-EXE-AGD-003 Open dossier
- UC-EXE-AGD-004 Review preparation status
- UC-EXE-AGD-005 Reschedule/cancel if authorized

## Mobile

```text
Agenda

TODAY

09:00
Internal meeting
PRIVATE

10:30
Audience — Org X
PRIVATE
[Dossier ready]

14:00
Public event
PUBLIC
```

## Desktop

Day/week agenda + preparation panel.

---

# 38. MEETING DOSSIER

Use cases:
- view participants;
- agenda;
- brief;
- documents;
- protocol history;
- action items.

Mobile:
reading-first.

Desktop:
main dossier + context.

---

# 39. FUNDING PROGRAM CATALOG

## Public use cases

- UC-FUN-PUB-001 Browse programs
- UC-FUN-PUB-002 View open call
- UC-FUN-PUB-003 Check deadline
- UC-FUN-PUB-004 Start eligibility
- UC-FUN-PUB-005 Apply

Mobile: list.

Desktop: catalog.

Exact deadlines must be visible.

---

# 40. FUNDING CALL DETAIL

```text
CALL TITLE

Open
Deadline: exact date/time

Who can apply
Funding range
Eligibility
Required documents
Evaluation overview

[Check eligibility]
[Apply]
```

No invented funding criteria.

---

# 41. ELIGIBILITY CHECKER

Use cases:
- answer rules;
- receive preliminary indication;
- understand that final eligibility is not guaranteed.

Guided Form pattern.

---

# 42. FUNDING APPLICATION

Same guided form engine, specialized sections:

- applicant;
- project;
- objectives;
- beneficiaries;
- budget;
- attachments;
- declarations;
- review.

Budget uses structured line items.

---

# 43. FUNDING REVIEW QUEUE

## Use cases

- eligibility review;
- assign reviewers;
- evaluation;
- committee readiness;
- decision.

Desktop table/list.

---

# 44. FUNDING EVALUATION WORKSPACE

## Use cases

- UC-FUN-EVL-001 Declare conflict
- UC-FUN-EVL-002 Review application
- UC-FUN-EVL-003 Score criteria
- UC-FUN-EVL-004 Add rationale
- UC-FUN-EVL-005 Submit evaluation

Desktop:

```text
APPLICATION FD-...

Conflict declaration
[No conflict] [Declare conflict]

┌───────────────────────────────┬──────────────────────────────┐
│ APPLICATION                   │ EVALUATION                   │
│ sections                      │ criterion 1 score            │
│ docs                          │ criterion 2 score            │
│ budget                        │ rationale                    │
└───────────────────────────────┴──────────────────────────────┘
```

Mobile:
review reading supported; full evaluation desktop-preferred.

---

# 45. COMMITTEE DECISION

Use cases:
- review aggregated evaluations;
- record decision;
- set approved amount;
- rationale;
- waitlist;
- reject;
- formal freeze.

No AI automatic decision.

---

# 46. FUNDING MONITORING

Screens:
- award detail;
- agreement;
- disbursement;
- milestone;
- monitoring report;
- site inspection;
- closeout.

Desktop record/workspace patterns.

Mobile supports field monitoring and evidence upload later.

---

# 47. PROJECTS MANAGEMENT

## Public

Project detail only approved public fields.

## Admin

Use cases:
- create project;
- update progress;
- milestones;
- documents;
- risks;
- public visibility;
- reporting.

Do not invent progress methodology.

---

# 48. EXECUTIVE DASHBOARD

## Use cases

- UC-EXE-DASH-001 View exceptions
- UC-EXE-DASH-002 Review service health
- UC-EXE-DASH-003 Review backlog/SLA
- UC-EXE-DASH-004 Review projects/programs
- UC-EXE-DASH-005 Review finance signal
- UC-EXE-DASH-006 Review protocol
- UC-EXE-DASH-007 View today agenda

## Mobile

Priority cards are allowed only as actionable exception summaries.

```text
Requires attention

SLA critical
3

Projects at risk
2

Programs awaiting decision
1

Follow-ups overdue
7

Today
...
```

## Desktop

```text
VISÃO GERAL

REQUIRES ATTENTION
3 SLA critical
2 projects at risk
1 program pending decision
7 follow-ups overdue

SERVICE HEALTH
--------------------------------

PROJECTS / PROGRAMS
--------------------------------

FINANCE
--------------------------------

PROTOCOL
--------------------------------

TODAY'S AGENDA
--------------------------------
```

No KPI wall.

---

# 49. REPORTING CENTER

## Use cases

- UC-REP-001 Select report
- UC-REP-002 Configure filters
- UC-REP-003 Run
- UC-REP-004 View result
- UC-REP-005 Export
- UC-REP-006 View snapshot
- UC-REP-007 View public-approved report

Mobile:
browse/history.

Desktop:
definition + filters + result.

Export obeys permissions/classification.

---

# 50. PUBLIC TRANSPARENCY HOME

## Use cases

- UC-TRN-001 Browse plans
- UC-TRN-002 Browse budget
- UC-TRN-003 Browse reports
- UC-TRN-004 Browse projects
- UC-TRN-005 Browse programs
- UC-TRN-006 Browse procurement
- UC-TRN-007 Browse deliberations
- UC-TRN-008 Browse public documents
- UC-TRN-009 Browse indicators

## Mobile

```text
Transparência Municipal

[Search public documents]

Planos & Estratégias →
Orçamento →
Relatórios →
Projectos →
Programas →
Concursos →
Deliberações →
Documentos →
Indicadores →
```

## Desktop

Structured category index + latest approved public material.

---

# 51. PUBLIC DOCUMENT LIBRARY

Mobile:
search + filter sheet + list rows.

Desktop:
search + left filters + result table/list.

Metadata:
title, category, published date, version/current/superseded.

---

# 52. PUBLIC NEWS LIST

Editorial list.

Mobile:
headline, date, summary.

Desktop:
featured + chronological list.

Avoid generic 3-card repetition.

---

# 53. NEWS DETAIL

Reading-width 720–760.

Desktop can have restrained aside for related content.

No huge hero unless validated editorial image exists.

---

# 54. EVENTS PUBLIC

Mobile:
agenda list.

Desktop:
date-based list; calendar only if useful.

---

# 55. SYSTEM STATE SCREENS

Every shell requires:

- Loading
- Empty
- Partial
- Error
- Offline
- Stale
- Forbidden
- Reauth required
- Maintenance if applicable
- 404
- 500-like friendly error

## Mobile example

```text
Could not load requests

Your connection may be unavailable.

[Try again]
```

No raw technical strings.

---

# 56. RESPONSIVE COMPONENT BEHAVIOR MATRIX

| Component | Mobile | Tablet | Desktop |
|---|---|---|---|
| Public nav | menu sheet | menu / compact | full nav |
| Citizen nav | bottom nav | drawer/rail | sidebar |
| Admin nav | drawer | drawer/rail | sidebar |
| Executive nav | compact/menu | rail | sidebar |
| Filters | bottom sheet | sheet/popover | side panel |
| Table | record list | list/table | table |
| Metadata aside | below content | below/right | right column |
| Form | one col | one col | bounded one col |
| Dialog | full/sheet for long | modal/sheet | modal/side sheet |
| Action bar | sticky bottom if needed | inline/sticky | inline/top |
| Calendar | agenda/compact | calendar | full |
| Charts | summary + details | chart | chart + table |
| Search | full width | full | full/inline |

---

# 57. RESPONSIVE SCREEN DENSITY MATRIX

| Surface | Mobile | Tablet | Desktop |
|---|---|---|---|
| Public | comfortable | comfortable | comfortable |
| Citizen | standard | standard | standard |
| Admin | compact list | medium compact | compact |
| Executive | selective | selective | selective |

---

# 58. CASE USE-CASE MAP

## Citizen service request

```text
UC-SVC-DET-007 Start request
→ UC-REQ-001 Start draft
→ UC-REQ-002 Eligibility
→ UC-REQ-003 Dynamic fields
→ UC-REQ-005 Documents
→ UC-REQ-REV-001 Review
→ UC-REQ-007 Submit
→ UC-REQ-CNF-001 Confirmation
→ UC-CIT-REQD-001 Track
```

## Staff processing

```text
UC-CASE-001 Search
→ UC-CASE-006 Open case
→ UC-CASE-DET-001 Review
→ UC-CASE-DET-003 Document validation
→ UC-CASE-DET-006 Request info
→ citizen responds
→ UC-CASE-DET-008 Send for approval
→ UC-CASE-DET-009 Approve/reject
→ UC-CASE-DET-010 Complete
```

## Appointment / queue

```text
UC-APT-001 Location
→ UC-APT-002 Date
→ UC-APT-003 Slot
→ UC-APT-004 Confirm
→ UC-CHK-001 Check in
→ UC-QUE-CIT-001 Ticket
→ UC-QUE-ADM-002 Call next
→ service session
→ complete
```

## Funding

```text
UC-FUN-PUB-002 Open call
→ UC-FUN-PUB-004 Eligibility
→ application
→ eligibility review
→ evaluator
→ conflict declaration
→ scoring
→ committee
→ award/agreement
→ monitoring
```

## Protocol

```text
public request
→ UC-PRO-001 Receive
→ UC-PRO-002 Triage
→ UC-PRO-004 Destination
→ review
→ decision
→ scheduling
→ executive agenda
→ dossier
→ meeting
→ follow-up
```

---

# 59. PERMISSION EFFECTS ON WIREFRAMES

Frontend visibility must not be driven only by role names.

Target model:

```text
ROLE + CAPABILITY + RESOURCE + SCOPE + CONTEXT
```

Examples:

- without `cases.assign`: assignment control hidden/disabled appropriately;
- without `cases.approve`: approval action absent;
- without `payments.reconcile`: reconciliation actions absent;
- without `alerts.publish`: publish action absent;
- without `funding.evaluate`: evaluation controls absent;
- without document access: metadata may exist but preview/download unavailable.

API can return `availableActions`.

---

# 60. STATE EFFECTS ON WIREFRAMES

Every detail screen must render action according to state.

Examples:

## Case

`ACTION_REQUIRED`
→ citizen sees required response;
→ staff may be waiting.

`READY_FOR_APPROVAL`
→ eligible staff sees approval actions.

`COMPLETED`
→ mutation actions removed; historical state.

## Appointment

`HELD`
→ countdown/confirmation state.

`CONFIRMED`
→ details + check-in instruction.

`CALLED`
→ prominent immediate call state.

## Payment

`PENDING`
→ pay/check status.

`PROCESSING`
→ status verification, not duplicate payment.

`CONFIRMED`
→ receipt.

`FAILED`
→ safe retry.

---

# 61. LOADING / ERROR / EMPTY BY SCREEN TYPE

## Catalog

Loading:
skeleton rows.

Empty:
“No services match these filters.”

Error:
retry while preserving query/filter state.

## Detail

Partial:
metadata may load while related FAQ/news fails.

## Dashboard

Each region independent.

One failed widget does not blank whole page.

## Forms

Draft failure:
visible persistent warning.

Submission failure:
preserve local/server data and offer safe retry/status verification.

---

# 62. PERFORMANCE ENGINEERING BY VIEWPORT

Mobile:
- prioritize text and task actions;
- lazy-load below-fold media;
- avoid large hero image;
- compress images;
- avoid chart-heavy initial render.

Desktop:
- code split by route;
- deferred admin modules;
- load secondary panels on demand.

Target public metrics:

- LCP < 2.5s
- CLS < 0.1
- INP < 200ms

---

# 63. ACCESSIBILITY BY SCREEN TYPE

## Navigation

- skip link;
- aria-current;
- keyboard menu;
- escape closes sheets;
- focus return.

## Forms

- explicit labels;
- help/error association;
- error summary;
- focus first error;
- no placeholder-only labels.

## Status

- color + text/icon;
- meaningful accessible name.

## Tables

- semantic header associations;
- responsive alternate list if table becomes unusable.

## Charts

- summary and tabular alternative.

---

# 64. SCREEN INVENTORY — PUBLIC

1. Home
2. Global Search
3. Services Catalog
4. Service Detail
5. Municipality overview
6. Living in Boane
7. Development overview
8. News list
9. News detail
10. Communiqués list
11. Communiqué detail
12. Alerts list
13. Alert detail
14. Events list
15. Event detail
16. Opportunities / Programs list
17. Funding Call Detail
18. Eligibility Checker
19. Projects list
20. Project detail
21. Transparency home
22. Public document library
23. Public document detail/download
24. Contact/help if validated
25. Login
26. Register
27. Forgot password
28. Reset password
29. Public complaint/incident intake if approved
30. Public request tracking entry if supported

---

# 65. SCREEN INVENTORY — CITIZEN

1. Citizen Home
2. Service start
3. Request guided form
4. Documents step
5. Review
6. Confirmation
7. Requests list
8. Request detail
9. Citizen documents
10. Appointments list
11. Appointment booking
12. Appointment detail
13. Check-in
14. Digital queue ticket
15. Payments list
16. Payment detail
17. Receipt
18. Complaints list
19. Complaint detail
20. Incident submission
21. Programs
22. Funding application
23. Funding application detail
24. Protocol requests list
25. Protocol request form
26. Protocol request detail
27. Notifications
28. Alerts
29. Profile
30. Security/session
31. Preferences
32. Reauthentication
33. Session expired
34. Offline state

---

# 66. SCREEN INVENTORY — ADMIN/STAFF

1. Operations Home
2. Work Queue
3. Case Workspace
4. Document Review
5. Assignment dialog/sheet
6. Request Information dialog
7. Decision/Approval dialog
8. Appointment Calendar
9. Appointment detail
10. Queue Console
11. Service Session
12. Payments
13. Reconciliation Queue
14. Payment detail
15. News list
16. News Editor
17. Communiqués
18. Communiqué Editor
19. Alerts
20. Alert Editor
21. Events
22. Event Editor
23. Protocol Inbox
24. Protocol Workspace
25. Correspondence Registry
26. Invitations
27. Funding Programs
28. Funding Calls
29. Applications Queue
30. Funding Evaluation
31. Committee Decision
32. Awards
33. Agreements
34. Disbursement
35. Monitoring
36. Projects
37. Project Workspace
38. Reports
39. Audit
40. Service Management
41. Service Version Editor
42. Form Definition Editor
43. Organization Management
44. Users
45. Permissions
46. Business Calendar
47. SLA Policies
48. System Alerts / operational banners where needed

---

# 67. SCREEN INVENTORY — EXECUTIVE

1. Executive Overview
2. Indicators
3. Service Health
4. Projects
5. Project detail
6. Programs
7. Program detail
8. Audiences
9. Audience detail
10. Agenda
11. Meeting Dossier
12. Decision Queue
13. Reports
14. Report detail
15. Exception detail

---

# 68. IMPLEMENTATION PHASING

## F1
PublicShell + Home V2

## F2
Service Catalog + Service Detail

## F3
Guided Request + Documents + Review + Confirmation + Citizen Request Detail

## F4
Citizen Portal shell migration + Citizen Home + Requests + Documents + Notifications + Account

## F5
Appointments + Check-in + Queue

## F6
Admin shell migration + Operations Home + Work Queue + Case Workspace

## F7
Finance + Communication

## F8
Protocol + Funding

## F9
Executive + Reporting + Transparency

---

# 69. QA STOP GATE FOR EACH PHASE

Before phase completion:

- all target widths reviewed;
- no horizontal overflow except intentionally scrollable components;
- 200% zoom usable;
- keyboard path tested;
- touch targets valid;
- heading hierarchy valid;
- loading/empty/error included;
- no raw API errors;
- no fabricated municipal facts;
- permissions respected;
- build pass;
- lint pass;
- tests pass;
- TypeScript pass;
- `git diff --check` pass;
- no backend files changed unless phase explicitly includes backend.

---

# 70. FINAL DIRECTIVE TO CHATGPT WORK

Treat this file as the **canonical responsive screen atlas** for Boane Conecta.

Before implementing any screen:

1. identify its screen inventory entry;
2. identify its use cases;
3. identify its shell;
4. identify its pattern;
5. implement its mobile behavior first;
6. implement tablet adaptation;
7. implement desktop composition;
8. implement widescreen constraints;
9. implement loading/empty/error/partial states;
10. verify permissions and available actions;
11. verify no municipal facts were fabricated;
12. verify the phase authorization.

Do not invent a completely different navigation, card system, dashboard style or form behavior merely because the legacy frontend currently uses one.

Do not attempt to implement every screen at once.

This atlas exists so the redesign is coherent across phases.

---

# 71. DESIGN NORTH STAR

A user should be able to understand Boane Conecta from the structure alone, even before decoration.

The visual result must communicate:

- public trust;
- service clarity;
- municipal legitimacy;
- operational competence;
- citizen accessibility;
- responsive precision;
- consistent engineering.

The redesign is successful when every viewport feels intentionally designed rather than automatically stacked.

---

**END — BOANE CONECTA RESPONSIVE WIREFRAME ATLAS V1**
