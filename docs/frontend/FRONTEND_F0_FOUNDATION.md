# Boane Conecta Frontend V2 — F0 Foundation

Status: implemented on `feat/frontend-v2-foundation`
Baseline: `4ff50eb6359328589eea6be2cf3e4b72b1a70364`

## Repository audit

The frontend is a React 18, TypeScript, Vite and Tailwind application. Public, citizen and administrative screens already exist, but the baseline architecture is page-centric: routing and role guards are concentrated in `src/App.tsx`, pages contain substantial presentation/data composition, and layout conventions are split across legacy components.

The baseline had one public layout, one citizen layout and one administrative layout. It had no executive shell, no canonical layout primitives and no explicit design-system boundary. Global styling imposed Playfair headings, hidden scrollbars, decorative gradients/glass/glow, large elevation and page entrance animations. Route changes were wrapped in both `AnimatePresence` and `PageTransition`.

Baseline verification:

- `npm run build`: pass;
- `npm run test`: pass (1 test);
- `npm run lint`: 79 findings — 71 errors and 8 warnings.

The lint debt comprised explicit `any`, unsafe API error handling, empty interfaces, an invalid nullish expression, CommonJS `require()` in Tailwind and mixed Fast Refresh exports.

## Design tokens

Canonical semantic roles live in `src/index.css` and are mapped in `tailwind.config.ts`:

- surfaces: `canvas`, `surface`, `surface-subtle`, `surface-raised`, `surface-inverse`;
- brand: `primary`, `primary-hover`, `primary-subtle`;
- semantics: `success`, `warning`, `danger`, `info`;
- radii: 4, 6, 8, 12 and 16 px;
- shadows: `xs`, `sm`, `md`;
- motion: 140, 200 and 280 ms;
- spacing: 4, 8, 12, 16, 24, 32, 48, 64, 80 and 96 px.

The palette is provisional. It must not be described as the municipality's official identity until formally validated. Components consume roles rather than page-level hex values so validated colors can replace the provisional palette centrally.

DM Sans is the global typeface. `.font-institutional` is the only opt-in serif utility. The legacy `.font-display` alias now resolves to DM Sans.

## Responsive system

Canonical bands:

| Band | Width |
|---|---:|
| base | below 375 px |
| `xs` | 375 px |
| `xsm` | 480 px |
| `tb` | 768 px |
| `lg` | 1024 px |
| `xl` | 1280 px |
| `2xl` | 1440 px |
| `3xl` | 1920 px |

`xsm` and `tb` avoid changing the meaning of legacy `sm` and `md` classes during incremental migration. New primitives use the canonical bands. Required QA widths remain 320, 375/390, 430, 768, 1024, 1280, 1440 and 1920 px, plus 200% zoom and keyboard-only operation.

Gutters are 16 px by default, 20 px from 480 px, 24 px from 768 px, 32 px from 1024 px and may reach 48 px on large screens. Public/citizen content is bounded at 1280 px, administrative/executive content at 1440 px, reading content at 760 px and form content at 800 px.

## Layout primitives

`src/design-system/primitives/layout.tsx` provides:

- `Container`: bounded widths and canonical gutters;
- `Section`: vertical section rhythm;
- `Stack`: vertical grouping;
- `Inline`: horizontal/wrapping grouping;
- `Grid`: responsive content and 4/8/12-column foundations;
- `Split`: deliberate two-region layouts.

The API is intentionally small. Screen-specific layout remains in feature or shell components.

## Components and accessibility

- Buttons now expose canonical `primary`, `secondary`, `outline`, `ghost`, `danger` and `link` variants with `sm`, `md` and `lg` sizes.
- Legacy button aliases remain temporarily so current screens continue to compile; they are visually restrained and should not be used in new work.
- Inputs have visible focus/error/disabled/read-only states and 16 px mobile text.
- Existing form components associate labels, descriptions, errors and `aria-invalid`.
- `StatusDot`, `StatusText` and `StatusBadge` separate status presentation from domain severity; text accompanies color.
- Every shell includes a skip link, `main#main-content`, visible focus treatment and a polite system-alert region.
- Reduced-motion preferences disable non-essential animation and smooth scrolling.

## Shell boundaries

- `PublicShell`: public header, system alerts, main content and footer. The legacy `Layout` now delegates to this shell.
- `CitizenShell`: citizen-specific desktop sidebar/header plus the mobile navigation `Início`, `Pedidos`, `Serviços`, `Alertas`, `Conta`.
- `AdminShell`: task-oriented navigation and contextual operational header.
- `ExecutiveShell`: separate agenda/decision composition; it does not reuse the administrative sidebar contract.

Existing citizen and administrative screens still use their legacy layouts in F0. Migrating them is incremental screen work, not a big-bang folder move.

## Routing and authorization

Mandatory global route animations were removed. Framer Motion remains available for intentional disclosure, overlay and interaction feedback.

Existing `RoleGuard` routes remain unchanged for compatibility. No new role-name conditionals were introduced. Backend authorization remains authoritative; a future frontend policy layer should use capability, resource, scope and context rather than duplicating backend RBAC.

## Municipal content safety

Header/footer contact information now comes from optional `VITE_MUNICIPAL_*` variables. Empty values render no invented contact details. The variables are documented in `.env.example`.

Several legacy pages still contain hard-coded people, departments, contact details, projects and municipal facts. They are unverified legacy content and must be audited with an authoritative municipal source before production. F0 does not silently replace them or declare them official.

## Migration strategy and compatibility

1. Build new public screens on the design-system primitives and `PublicShell`.
2. Migrate public navigation and content modules in F1 without changing routes unexpectedly.
3. Adapt citizen pages to `CitizenShell`, then administrative pages to `AdminShell`.
4. Introduce executive routes only with validated product requirements and backend capabilities.
5. Remove legacy button, shadow, gradient, glass and breakpoint aliases after all consumers migrate.
6. Progressively move domain code into `features/`, routing/providers/config into `app/`, and reusable non-visual code into `shared/`.

## Known technical debt after F0

- production bundle is above Vite's 500 kB warning threshold and needs route-level code splitting;
- the test suite contains only one baseline example test;
- public header information architecture is still the legacy implementation and requires F1 migration to the approved top-level structure;
- legacy citizen/admin layouts have not yet adopted the new shells;
- unverified legacy municipal content remains outside header/footer;
- `PageTransition` remains as an unused compatibility component and can be removed after confirming no downstream imports;
- both npm and Bun lockfiles remain intentionally preserved.
