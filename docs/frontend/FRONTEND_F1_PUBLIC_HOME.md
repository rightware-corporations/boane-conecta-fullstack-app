# Boane Conecta Frontend V2 — F1 PublicShell + Home V2

Status: implemented; phase freeze pending viewport screenshot evidence
Branch: `feat/frontend-v2-foundation`
Baseline: `4ff50eb6359328589eea6be2cf3e4b72b1a70364`
Authorized scope: F1 only

## Canonical authority

F1 was implemented against:

1. `BOANE_CONECTA_WORK_MASTER_HANDOFF_V1.md`
2. `BOANE_CONECTA_RESPONSIVE_WIREFRAME_ATLAS_V1.md`
3. `BOANE_CONECTA_DESIGN_UX_CONSTITUTION_V1.md`
4. `BOANE_CONECTA_OPERATING_GOVERNANCE_AND_STARTUP_SPEC_V1.md`
5. `FRONTEND_F0_FOUNDATION.md`

No F2 screen was started.

## Traceability

| Surface | Use cases | Actor | Data/route boundary |
|---|---|---|---|
| PublicShell | UC-PUB-001–007 | Public Visitor | Existing public routes only |
| Home hero/search | UC-PUB-HOME-001 | Public Visitor | `/servicos?search=...` |
| Quick tasks | UC-PUB-HOME-002–004 | Public Visitor | Existing request, appointment and complaint routes |
| Active alerts | UC-PUB-HOME-005 | Public Visitor | Provisional empty adapter until a public backend contract exists |
| Featured services | UC-PUB-HOME-006 | Public Visitor | `GET /api/v1/public/services` |
| Opportunities | UC-PUB-HOME-007 | Public Visitor | Provisional empty adapter until a public backend contract exists |
| Local updates | UC-PUB-HOME-008 | Public Visitor | Provisional empty adapter until a public backend contract exists |
| Projects | UC-PUB-HOME-009 | Public Visitor | Provisional empty adapter until a public backend contract exists |
| Transparency | UC-PUB-HOME-010 | Public Visitor | Existing public information routes |
| Contacts | UC-PUB-HOME-011 | Public Visitor | Validated `VITE_MUNICIPAL_*` configuration only |

## Component architecture

```text
PublicShell
├── PublicHeader
│   ├── BrandMark
│   ├── publicNavigation
│   └── responsive Radix Sheet
├── SystemAlertRegion
├── PublicHome
│   ├── HomeHero
│   │   └── HomeSearch
│   ├── QuickTasks
│   ├── ActiveAlerts
│   ├── FeaturedServices
│   ├── MobilityOverview
│   ├── OpportunitiesOverview
│   ├── LocalUpdates
│   ├── ProjectsOverview
│   ├── TransparencyLinks
│   └── EssentialContacts
└── PublicFooter
```

Transport, server state and presentation remain separate:

```text
public-home.api
→ public-home.queries (TanStack Query)
→ section components
→ PublicHome composition
```

## Responsive decisions

- Base/XS: compact brand, citizen entry, menu trigger, single-column hero search and vertical task list.
- 480–767: search action becomes inline and spacing increases without forcing multi-column content.
- 768–1023: quick tasks use a deliberate 2 × 2 layout; footer and eligible sections use two columns.
- 1024+: frozen public navigation is visible; Home uses bounded 12-column-compatible composition.
- 1920+: `Container` maintains the canonical 1280 px public maximum.
- Reading text remains bounded; no hero photography or wallpaper increases LCP.

## Accessibility decisions

- Existing skip link and `main#main-content` retained.
- Header navigation has an accessible name and `aria-current`.
- Mobile menu uses Radix Dialog semantics for focus trap, Escape and focus return.
- Search has an explicit label and native search landmark.
- Touch controls use at least the canonical 44 px practical target.
- Status/error presentation uses text and icons, not color alone.
- Reduced-motion behavior remains governed by F0 global rules.
- Tests cover Escape/focus return, public IA and search routing.

## Visual and anti-pattern decisions

- Removed the legacy glass-on-scroll public header behavior.
- Removed the utility top bar and any prominent administrative entry.
- Replaced dropdown-heavy legacy IA with the frozen public IA.
- Replaced the old repeated promotional card composition.
- Hero is text-first and uses one solid semantic surface, without gradient, glow or stock/AI imagery.
- Quick tasks are action rows; alerts are an alert region; services are structured rows; updates are editorial; projects are a numbered development list; transparency is an index.
- Cards are not the default page grammar.
- No statistics, testimonials, contacts, services or municipal facts were fabricated.

## Data and content integrity

The current backend exposes the public services contract only. F1 therefore uses the real `/public/services` response and maps it through a feature adapter.

Alerts, opportunities, news and projects have no current public backend controller. Their F1 adapters return no records and their optional sections remain hidden. This is intentional: legacy frontend fixtures/endpoints are not presented as validated municipal truth. The loading/error/partial UI contracts remain implemented for later connection to authoritative endpoints.

## Routing and bundle

- Existing route paths remain unchanged.
- Home search query is consumed by the existing `/servicos` page without redesigning the F2 catalog.
- All page modules now use `React.lazy` route-level splitting.
- Latest production build has no 500 kB chunk warning.
- Main application chunk: approximately 331.5 kB raw / 106.4 kB gzip.
- Home route chunk: approximately 26.5 kB raw / 6.8 kB gzip.

## Compatibility

- `components/layout/Header.tsx` and `Footer.tsx` remain as compatibility re-exports.
- `LogoImage` remains available as a compatibility alias for `BrandMark`, preserving citizen/admin consumers.
- Existing routes and backend files were not changed.
- Two F0 TypeScript gate defects were repaired without redesigning out-of-scope screens: `Noticias` now calls the existing typed news service; `AdminPedidos` supplies the required `AdminLayout` title.

## Automated validation

- ESLint: pass.
- TypeScript: pass with `tsc -p tsconfig.app.json --noEmit`.
- Vitest: 11 tests pass across 6 files.
- Production build: pass.
- `git diff --check`: pass.
- Backend diff: zero.

## Viewport evidence status

The local Vite application starts successfully on `127.0.0.1:8080`. The available remote browser rejected access to the local server with `ERR_BLOCKED_BY_CLIENT`, so screenshot evidence for 320, 375, 390, 430, 768, 1024, 1280, 1440 and 1920 px could not be captured in this environment.

The responsive code, DOM composition and interaction tests are complete, but the F1 phase must not be called frozen until browser screenshots, 200% zoom and the full keyboard walkthrough are recorded.

## Known risks and next gate

- Public content domains beyond services still require authoritative backend contracts.
- Municipal palette and contact details remain provisional/validation-dependent.
- Existing non-F1 public screens retain legacy visual language.
- Full visual regression evidence remains pending because of the browser connectivity limitation above.

Recommended commit split after visual review:

1. `docs(frontend): add canonical operating governance authority`
2. `feat(frontend): refine public shell and navigation`
3. `feat(frontend): implement home v2 service-first composition`
4. `perf(frontend): introduce route-level code splitting`
5. `test(frontend): cover public shell and home contracts`
6. `docs(frontend): document f1 implementation and qa`

Do not start F2 until F1 viewport evidence is reviewed and the phase is explicitly authorized.
