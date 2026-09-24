# BOANE CONECTA — plano incremental FE-03 / FE-04

**Origem:** WF-01 em `feat/wf01-screen-architecture` desde CR-01 `05ffd40`; `main` e PRs #4/#5 não foram alteradas. Estes passos são futuras implementações, não resultados já aprovados. Fontes de autoridade: [contrato CR-01](BOANE_CONECTA_CR01_REQUEST_CONTRACT.md), [ERD](BOANE_CONECTA_CR01_REQUEST_ERD.md), [atlas WF-01](BOANE_CONECTA_WF01_SCREEN_ATLAS.md), [componentes](BOANE_CONECTA_WF01_COMPONENT_CONTRACTS.md), [erros](BOANE_CONECTA_WF01_STATES_AND_ERRORS.md) e [responsividade](BOANE_CONECTA_WF01_RESPONSIVE_ACCESSIBILITY.md).

## Bloqueio de contrato identificado C1

`RequestDraftResponse` devolve `serviceVersionId` e `formVersionId`, mas **não** schema/eligibility/documentRequirements/declaração da versão fixada. `GET /api/v1/citizen/services/{serviceId}/request-definition` devolve apenas a versão publicada actual. Quando há publicação posterior, S02–S05 e S08 não conseguem renderizar ou validar a versão antiga com segurança; não usar a nova. A leitura de versão fixada para um draft do próprio cidadão é pré-requisito de FE-04 para retoma plena. Resolver num PR pequeno e testado, idealmente `GET /api/v1/citizen/request-drafts/{draftId}/definition` com lookup por proprietário, disponibilizando `RequestDefinitionVersionResponse` da versão fixada; garantir declaração e checksum da versão antiga e 404 para outro proprietário. Rever contrato de acesso de draft `SUBMITTED`/`EXPIRED` com produto. Não ampliar endpoint administrativo nem revelar versões não publicadas a outro cidadão. Se decisão de produto impedir retoma antiga, definir política explícita de leitura/abandono e mensagem antes do FE-04; sem migração automática.

Outras decisões a fechar: C2 formato suficiente de `eligibility`/`visibleWhen`/`ADDRESS` para UI acessível; C3 armazenamento mínimo e prazo de retenção de intenção de submit (ameaça XSS da persistência de tokens actual); C4 destino da lista de rascunhos no dashboard; C5 distinção UX `SUBMITTING` persistente e eventual resultado incerto após TTL da idempotência. Estas decisões não autorizam inventar conteúdo municipal.

## Sequência recomendada

| Fase | Entrega isolada | Implementação/testes mínimos | Saída |
| --- | --- | --- | --- |
| FE-03a | Rota/transportes e S01/S08 | Branch desde WF-01 aprovado; `requestWithMetadata` preserva ETag/status; schemas DTO tipados; rotas literais e UUID; whitelist FE-01; S01 GET definição e POST create/resume; S08 GET lista/GET individual; testes navegação 401/403/404, 201 retomado, sem loops. | Utilizador inicia e vê os próprios drafts; versão antiga rotulada indisponível. |
| FE-03b | S02/S03 com versionamento | Renderer exaustivo dos 11 tipos, regras condicionais com forma real; elegibilidade; PATCH parcial; reconciliação 409; testes dos tipos, `CLEAR_ON_HIDE`, confirmação 200+ETag, duas abas e regresso após login. | Respostas guardadas no backend sem perda silenciosa; sem promessa de autosave não implementado. |
| FE-04a | C1 e S04/S05 | Endpoint protegido de versão fixada após aprovação do contrato; QA isolada da versão antiga; upload/scan/link, GET links, PUT/DELETE com ETag; validação e resumo de erros; testes scanner e dono A/B. | Retoma antiga segura e revisão de versão correcta; sem submit ainda. |
| FE-04b | S06/S07 | Intenção única, payload/If-Match imutáveis, resolver timeout por GET, replay mesma key, reauth sem replay de escrita, confirmação por GET. Testes de timeout, concorrência, idempotência, 201/200 e refresh; nenhum uso de POST legado. | Pedido confirmado com ID e referência reais; E2E QA por jornada ainda necessário. |

Gates em cada PR que mude frontend: `npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build` em `frontend/`, mais workflow CI verde no HEAD. Se backend mudar: Java 21 `mvn verify` em `backend/`, integração PostgreSQL 16/Testcontainers e migrations V1–V19. QA de jornada autenticada apenas com contas descartáveis: Citizen A e B, anónimo e staff sem acesso; scanner, conflito, expiração, 200% zoom/320px, teclado e leitores de ecrã. Testes E2E são **NOT RUN** em WF-01.

## Primeiros passos exactos de FE-03

1. Confirmar HEAD de WF-01 e CR-01/FE-01; criar branch `feat/fe03-request-journey-foundation` a partir do **commit final de WF-01 aprovado**; basear PR na branch WF-01 enquanto dependências estão em Draft, sem merge da `main`.
2. Ler os seis documentos WF-01, CR-01 REST e ERD; levantar DTOs/controller no HEAD actual. Fechar C2 antes de implementar campos cuja forma de dados ainda não suporta renderização segura.
3. Implementar só FE-03a primeiro: contrato HTTP com headers, tipos, rotas e guards, S01 e S08. Remover link quebrado `/municipe/pedidos/rascunhos/:id` no dashboard mediante resolvedor GET, sem reescrever `/municipe/pedidos/:id`.
4. Testar navegação, 201 create/resume, owner isolation por API e retorno após login; publicar PR Draft com CI, pedir revisão. Prosseguir FE-03b em alteração separada; FE-04 depende de C1.

## Evidências e limites WF-01

Documentação, protótipo conceptual e validação de estrutura/dimensões não são implementação FE nem homologação. Sem acesso a QA com dados publicados e contas autorizadas, os fluxos reais autenticados e E2E permanecem pendentes. Ver checklist de Work 03.
