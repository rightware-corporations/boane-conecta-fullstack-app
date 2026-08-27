# Boane Conecta Frontend V2 — F2 Service Catalog + Service Detail

Status: implementation complete; viewport screenshot evidence pending
Branch: `feat/frontend-v2-foundation`
F2 base: `ea2b854ba8b70e9fc8b7c33a77d3b63f04eebe73`
Authorized scope: F2 only

## Canonical authority

F2 was implemented against the combined authority of:

1. `BOANE_CONECTA_WORK_MASTER_HANDOFF_V1.md`
2. `BOANE_CONECTA_RESPONSIVE_WIREFRAME_ATLAS_V1.md`
3. `BOANE_CONECTA_DESIGN_UX_CONSTITUTION_V1.md`
4. `BOANE_CONECTA_OPERATING_GOVERNANCE_AND_STARTUP_SPEC_V1.md`
5. `FRONTEND_F0_FOUNDATION.md`
6. `FRONTEND_F1_PUBLIC_HOME.md`

The explicit user authorization for F2 superseded the previous F1 stop gate for this phase only. F3 remains blocked.

## Implemented scope

### Service Catalog V2

- UC-SVC-001 browse services
- UC-SVC-002 search service
- UC-SVC-003 filter by category
- UC-SVC-004 filter by channel
- UC-SVC-005 filter by audience
- UC-SVC-006 view unavailable or suspended service
- UC-SVC-007 open service detail

The catalog uses `/servicos` and stores `search`, `category`, `channel`, `audience`, and `availability` in the URL. Search is accent-insensitive and supports names, descriptions, categories, keywords, and synonyms when supplied by the API.

### Service Detail V2

- UC-SVC-DET-001 understand service
- UC-SVC-DET-002 review eligibility
- UC-SVC-DET-003 review requirements
- UC-SVC-DET-004 review required documents
- UC-SVC-DET-005 review fee
- UC-SVC-DET-006 review duration
- UC-SVC-DET-007 start online request when the channel is explicitly published
- UC-SVC-DET-008 book appointment when in-person service is explicitly published
- UC-SVC-DET-009 view suspension or unavailability

Service detail uses `/servicos/:slug` and the existing backend endpoint `GET /api/v1/public/services/{slug}`.

## Architecture

```text
pages/Servicos
→ ServiceCatalogPage
→ serviceCatalogQuery
→ service-catalog.api
→ GET /public/services

pages/ServicoDetalhe
→ ServiceDetailPage
→ serviceDetailQuery(slug)
→ service-catalog.api
→ GET /public/services/{slug}
```

Transport DTOs, normalized domain types, URL filtering, presentation, and route pages remain separate.

## Responsive behavior

- 320–767: single-column results; search first; category and advanced filters open bottom sheets; practical detail summary precedes long content.
- 768–1023: bounded search and list layout; filters remain in touch-friendly sheets; result rows exploit additional width without becoming generic cards.
- 1024+: persistent 240 px filter rail plus result region; detail uses an 8/4-style main-summary split with sticky practical summary.
- 1280–1920+: public container remains capped at 1280 px; reading content does not stretch indefinitely.
- Touch controls use a practical minimum of 44 px.
- No intentional horizontal scrolling is introduced.

## Accessibility

- Heading hierarchy and breadcrumb landmarks are explicit.
- Search has a search landmark and associated label.
- Filter state uses buttons with `aria-pressed`.
- Mobile sheets use Radix Dialog focus trap, Escape handling, and focus return.
- Result changes use `aria-live`; loading uses `aria-busy`.
- Service rows are keyboard-focusable links with descriptive accessible names.
- Availability is communicated with text and status styling, not color alone.
- Suspended services remain readable while transaction actions are removed.
- Existing skip link, reduced-motion rules, and global focus treatment remain intact.

## Data integrity

The current backend publishes:

- service identity, title, slug, and description;
- department name;
- processing time;
- status;
- requirements;
- fees.

It does not currently publish channel, audience, document, process, location, legal-reference, FAQ, keyword, or synonym fields. The F2 adapter supports these fields when added to the public contract, but the UI does not invent them. Missing official information is stated plainly.

The current backend public list returns published services only. The frontend still implements suspended and unavailable presentation for forward-compatible public responses, without modifying the backend.

## Legacy migration

The old generic three-column card catalog and modal/payment interaction were removed from the active implementation. These unused legacy components were deleted:

- `ServiceCard`
- `ServiceCategoryFilter`
- `ServiceDetailModal`
- `ServicePaymentDialog`

No backend file was modified.

## Automated validation

- ESLint: pass with zero errors or warnings.
- TypeScript: pass with `tsc -p tsconfig.app.json --noEmit`.
- Vitest: 23 tests pass across 10 files.
- Production build: pass.
- Catalog route chunk: approximately 13.1 kB raw / 4.3 kB gzip.
- Detail route chunk: approximately 8.6 kB raw / 2.7 kB gzip.
- `git diff --check`: pass.
- Backend diff: zero.

Tests cover:

- DTO normalization and safe missing metadata;
- future channel/audience metadata;
- suspended service visibility;
- list and slug endpoint contracts;
- accent-insensitive search and synonyms;
- combined filters;
- fee formatting;
- URL search restoration;
- detail route links;
- mobile filter sheet, URL state, Escape, and focus return;
- conditional transaction CTAs;
- missing official information.

## Viewport evidence status

The production build and responsive implementation are complete. The cloud browser still rejects the sandbox loopback server with `ERR_BLOCKED_BY_CLIENT`, so screenshot evidence for 320, 375, 390, 430, 768, 1024, 1280, 1440, and 1920 px cannot be captured inside this environment.

F2 code and automated QA are complete. The phase must not be described as visually frozen until those screenshots, a 200% zoom walkthrough, and a full keyboard walkthrough are recorded on a browser that can reach the application.

## Phase boundary

F3 was not implemented. The guided request flow, document upload, review, submission, confirmation, and citizen request detail remain outside this phase.
