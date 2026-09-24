# BOANE CONECTA — Master Completion Checklist, WORK 02 (CR-01)

**Base técnica:** FE-01 `b4dcf67750dddf6833e4fa481bc5c9613572cb73`; PR #4 Draft; `main@3b47e1b3609fc8b78ac73c9867d79f3c07255d91`. Este checklist acompanha a implementação CR-01. O handoff anterior e a matriz FE-01 são preservados; não declarar FE-01 homologado só porque o CI passou.

## Git, autoridade e gates

- [x] Verificar `main`, PR #4 e branches antes de criar `feat/cr01-contract-resolution` desde FE-01.
- [x] Preservar FE-01, `main`, branches divergentes e worktree original; nenhum merge/reset/force push.
- [x] FE-01 frontend CI `success` no run #2; homologação manual por jornadas finais pendente.
- [ ] CR-01 CI backend no HEAD final — preencher apenas após run completo.
- [ ] PostgreSQL migrations V1–V19 na QA isolada — NOT RUN neste ambiente até teste real.

## CR-01 contrato e fundação

- [x] Auditar migrations V4/V9–V12, entidades, DTOs, controllers, services, repositories, segurança e testes relevantes.
- [x] Matriz RBAC dos seis papéis por método/serviço e diferenças frontend/backend.
- [x] Publicação de par de versões service/form, pin em draft, elegibilidade, respostas com ETag, documentos com scan, validação, declaração, submit idempotente, snapshot, histórico e outbox identificados.
- [x] Documentar REST real, resolver após timeout e ERD, sem criar segundo domínio de pedidos.
- [x] Acrescentar GET de drafts próprios retomáveis para S08 usando repositório/índice existentes, com teste.
- [x] Não expor definição digital quando serviço de catálogo não está `PUBLISHED`, com teste.
- [ ] Provar os dois testes novos com Java 21/Maven em CI e rever resultados.
- [ ] Decidir política de draft antigo quando a definição publicada muda; não migrar respostas implicitamente.
- [ ] Definir transições de estado/atribuição/escopo staff com autoridade de domínio antes de Work Queue funcional.
- [ ] Avaliar consistência de version numbers sob publicação concorrente e contrato de indisponibilidade/expiração em integração PostgreSQL.

## Jornada e frontend posterior

- [x] Mapear CITIZEN/EMPLOYEE/MANAGER/EDITOR/ADMIN/SUPER_ADMIN, com agendamentos/filas F5.
- [x] Especificar S01–S08, rotas propostas, contratos, estados e proteção.
- [ ] Implementar wizard FE-03/FE-04 por blocos após contratos aprovados; não gerado em CR-01.
- [ ] Substituir `/admin/pedidos` placeholder e alinhar acesso MANAGER com API autorizada.
- [ ] Dar ao EDITOR landing honesta; não mostrar dados de relatórios sem permissão; definir API CMS antes de gerir notícias.
- [ ] Definir/provar provisionamento staff/SUPER_ADMIN por canal administrativo seguro; registo público só CITIZEN.

## QA final por jornada

- [ ] Contas QA descartáveis para CITIZEN A/B, EMPLOYEE, MANAGER, EDITOR, ADMIN, SUPER_ADMIN, sem mutação SQL não autorizada.
- [ ] CITIZEN: percurso positivo S01–S08, expiração/409/timeout/replay, documentos scanner e isolamento A/B.
- [ ] Cada staff: positivo permitido + negativos 401/403/404 por método e scope confirmado.
- [ ] Cada percurso: foco/teclado/mensagens acessíveis/reflow 200%; screenshots sem tokens/PII.
- [ ] FE-01 + CR-01 homologados juntos após jornadas reais; não efetuar merge automático da PR FE-01.
