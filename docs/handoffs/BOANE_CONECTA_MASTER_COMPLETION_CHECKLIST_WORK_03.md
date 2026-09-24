# BOANE CONECTA — Master Completion Checklist, WORK 03 (WF-01)

**Dependência:** `main@3b47e1b`, FE-01 `b4dcf67` (PR #4 Draft), CR-01 `05ffd40` (PR #5 Draft). Esta checklist acrescenta o desenho WF-01 à [checklist CR-01](BOANE_CONECTA_MASTER_COMPLETION_CHECKLIST_WORK_02.md), sem converter tarefas FE ou homologação em feitas. HEAD final e provas de CI/visual constam do relatório de entrega da branch ou do histórico Git; não assumir aprovações futuras.

## Preservação e auditoria

- [x] Confirmar HEADs de `main`, FE-01/PR #4 e CR-01/PR #5 antes de trabalhar; não efectuar merge.
- [x] Ler contrato REST, ERD, preparação de ecrãs, mapa de jornadas e inventário RBAC de CR-01.
- [x] Criar branch isolada `feat/wf01-screen-architecture` desde CR-01, sem editar `main`.
- [x] Auditar `App.tsx`, shells público/citizen, `index.css`, design constitution, atlas responsivo, `auth-navigation.ts`, `api.ts`, dashboard e pedidos existentes.

## Especificação WF-01

- [x] [S01–S08 atlas](BOANE_CONECTA_WF01_SCREEN_ATLAS.md): hierarquia, API, ações, persistência, estado de erro e foco.
- [x] [Navegação](BOANE_CONECTA_WF01_NAVIGATION_MAP.md): rascunhos separados da rota de pedidos submetidos, guards e regresso após login.
- [x] [Contratos TypeScript](BOANE_CONECTA_WF01_COMPONENT_CONTRACTS.md): shell, campos, scanner, validação, submissão e metadata ETag.
- [x] [Estados e erros](BOANE_CONECTA_WF01_STATES_AND_ERRORS.md): 409, scanner rejeitado, expiração, definição incompatível e resultado desconhecido sem duplicação silenciosa.
- [x] [Responsividade/acessibilidade](BOANE_CONECTA_WF01_RESPONSIVE_ACCESSIBILITY.md): wireframes dos oito ecrãs e metas para nove larguras/200%.
- [x] [Plano FE-03/FE-04](BOANE_CONECTA_FE03_FE04_IMPLEMENTATION_PLAN.md) por PRs menores.
- [x] Protótipo HTML e SVG de nove larguras como **wireframes conceptuais**; links locais e cobertura S01–S08 verificados por script documental.
- [ ] Capturas renderizadas de browser nas nove larguras e a 200%: NOT RUN (binário Chromium referenciado pelo Playwright inexistente neste ambiente). Esquema SVG não substitui teste visual.
- [ ] Aprovar contrato C1 de leitura da definição fixada em draft antigo para retoma plena; implementar e testar na fase FE-04a.
- [ ] Decidir C2–C5 (forma do schema/renderização, persistência mínima de intenção, link dashboard, SUBMITTING prolongado).

## Implementação ainda por realizar

- [ ] Implementar rotas, componentes e endpoints frontend de S01–S08; esta branch contém só especificação/protótipo documental.
- [ ] Ajustar `CitizenLayout` para título longo da jornada, `auth-navigation.ts` e link de rascunhos no dashboard.
- [ ] Expor headers ETag/status no cliente HTTP sem reexecução automática de mutações.
- [ ] FE-03a S01/S08; FE-03b S02/S03; FE-04a C1/S04/S05; FE-04b S06/S07, com PRs e testes próprios.

## Gates e homologação

- [ ] CI da **futura implementação** frontend no HEAD FE-03/FE-04; CI histórico FE-01/CR-01 não valida novo código.
- [ ] QA funcional com dados municipais publicados e contas descartáveis Citizen A/B; 401/403/404, 409, scanner, expiração, timeout/idempotência.
- [ ] E2E browser autenticado, WCAG, foco/teclado e zoom a 200% no produto implementado; protótipo não substitui homologação.
- [ ] QA de PostgreSQL/backend se C1 introduzir código; preservar migrações.

**Estado:** especificação documentada, C1 bloqueia a retoma plena de drafts de versão antiga; FE-03a pode começar sem antecipar este contrato. Registar PASS/FAIL/NOT RUN da validação conceptual na entrega WF-01; não declarar `production-ready`.
