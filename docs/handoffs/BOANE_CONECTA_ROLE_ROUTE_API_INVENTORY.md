# BOANE CONECTA — inventário de papéis, rotas e APIs (CR-01)

**Base:** FE-01 `b4dcf67750dddf6833e4fa481bc5c9613572cb73`; ramo `feat/cr01-contract-resolution`. Fonte: `SecurityConfig`, controllers e `@PreAuthorize`, serviços, `frontend/src/App.tsx`, `auth.service.ts`, `useAuth.tsx` e migrations V2/V7. Isto é inventário de código; autorizações em QA ainda não foram homologadas. Se um utilizador tiver vários papéis, Spring aplica a união de autoridades, enquanto o frontend escolhe um papel por precedência (`SUPER_ADMIN`, `ADMIN`, `MANAGER`, `EMPLOYEE`, `EDITOR`, `CITIZEN`); essa diferença exige teste de contas multipapel.

## Regra de autorização efetiva

`SecurityConfig` permite `GET /api/v1/health`, `GET /api/v1/public/**`, `POST /api/v1/public/complaints` e `POST /api/v1/auth/{login,register,refresh}`. `/api/v1/citizen/**` exige `CITIZEN`; `/api/v1/admin/**` exige um de `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `EDITOR`, `EMPLOYEE`. Os métodos de controller podem restringir mais. `/auth/me`, `/auth/logout` e `/auth/change-password` exigem autenticação. Ausência de token → 401; papel sem autorização → 403; recursos citizen alheios são procurados por ID **e proprietário** e devolvem 404, quando o serviço aplica essa consulta. Os nomes em `permissionsByRole` no frontend são rótulos de apresentação, não uma política backend: as entidades `permissions`/`role_permissions` existem (V2), mas a restrição HTTP encontrada usa papéis e verificações de serviço, não aqueles rótulos de UI.

| Papel backend | Frontend | Ecrãs presentes/estado | Contrato permitido e limites concretos |
| --- | --- | --- | --- |
| `CITIZEN` | `municipe` | `/municipe`, `/perfil`, `/pedidos`, `/pedidos/:id`, `/documentos`, `/agendamentos`, `/notificacoes` com UI; `/licencas`, `/pagamentos` exigem auditoria funcional; wizard S01–S08 inexistente | `/citizen/**` e endpoints públicos; nunca `/admin/**`; documentos, pedidos e drafts verificam propriedade no serviço; registo público cria somente CITIZEN. |
| `EMPLOYEE` | `funcionario` | `/admin` e `/admin/filas`, `/agenda`; `/admin/pedidos` é placeholder; outras rotas negadas em App | Requests: lista/detalhe/status, **sem atribuir**; documentos: leitura/download, **sem mudar status**; agenda/check-in, queue operations sujeitas a scope; relatórios GET, reclamações/pagamentos leitura e atualizações de status conforme controller. Não gere serviços, definições, configuração de filas ou utilizadores. |
| `MANAGER` | `gestor` | `/admin`, `/filas`, `/agenda`, `/servicos` leitura, `/projectos` placeholder; `/admin/pedidos` **negado na UI** apesar de API permitir | Requests lista/detalhe/atribuição/status; serviços leitura; documentos leitura/status; relatórios; queixas/pagamentos; queue operations com scope; sem CRUD serviços/definições/config filas. Divergência FE: falta rota de trabalho de pedidos para MANAGER. |
| `EDITOR` | `editor` | `/admin` e `/admin/noticias` placeholder; dashboard comum pode chamar APIs não permitidas | Prefixo `/admin/**` passa no filtro, mas controllers de requests, serviços, documentos, relatórios, agenda, filas e demais módulos examinados não incluem EDITOR. `/admin/notifications` tem apenas filtro de prefixo; não equivale a CMS. Sem API backend de gestão de notícias encontrada. Divergência: UI de notícias sem contrato e dashboard potencial 403. |
| `ADMIN` | `admin` | `/admin`, `/noticias` placeholder, `/servicos` UI integrada, `/utilizadores` placeholder, `/pedidos` placeholder, `/filas`, `/agenda`, `/filas/configuracao` | Serviços CRUD exceto arquivar; definição draft/publish; requests/atribuição/status; departamentos/distritos; config filas/staff scopes; documentos/status; agenda; relatórios; **nenhum endpoint de provisionamento de utilizadores foi encontrado**. |
| `SUPER_ADMIN` | `super_admin` | Mesmas rotas admin incluindo `/utilizadores` placeholder | Mesmas ações de ADMIN; só SUPER_ADMIN arquiva serviço (`DELETE /admin/services/{id}`). Não foi encontrada API de provisionamento seguro de staff/SUPER_ADMIN. Não inventar bootstrap. |

Rotas públicas existentes no App: `/`, `/sobre`, `/servicos`, `/servicos/:slug`, `/contactos`, `/noticias`, `/reclamacoes`, `/faq`, `/pelouros`, `/distritos`, `/plano-desenvolvimento`, `/projetos`, `/tributos`, `/noticias/:id`, `/galeria`, `/concursos`, `/doacoes`, `/servicos/pedidos` (consulta pública não simulada), `/documentos`, `/avisos`, `/filas/:queueId/display`, `/auth`. Apenas conteúdo correspondente a endpoints públicos verificados pode ser apresentado como dado real; a existência de uma página não comprova API de escrita. Anónimo em rota privada é enviado para `/auth`; papéis não permitidos vêem `Acesso Negado`; definição indisponível devolve 404.

## Endpoints por domínio e limites de papel

| Domínio / rotas HTTP | Autorização nos controllers + serviço | Estado UI |
| --- | --- | --- |
| `GET /public/services`, `GET /public/services/{slug}` | Anónimo; catálogo só `MunicipalServiceStatus.PUBLISHED` | Catálogo integrado; iniciar pedido ainda não existe. |
| `POST /auth/register`; login/refresh/logout/me | Registo cria CITIZEN; logout/me autenticados; rotação refresh no serviço | Login/guards FE-01; QA real diferida. |
| `GET /citizen/services/{id}/request-definition`; `POST /citizen/request-drafts`; `GET /citizen/request-drafts[/{id}]`; PATCH answers; PUT eligibility/documents; POST validate/submit | CITIZEN; acesso a draft por proprietário; `If-Match` nas mutações; `Idempotency-Key` em submit; definição só para serviço PUBLISHED com form/version PUBLISHED e online | S01–S08 não implementados. `GET` coleção introduzido neste ramo. |
| `POST /citizen/documents`, GET/list/download, DELETE, links de request | CITIZEN e propriedade no serviço; VALID antes de anexar draft; upload usa MinIO/ClamAV | `/municipe/documentos` existe, integração final de wizard pendente. |
| `GET /citizen/requests[/{id}]`; `POST /citizen/requests` legado | CITIZEN e proprietário em GET; POST legado está marcado Deprecation/Sunset e não é a submissão do wizard | Lista/detalhe existem; impedir novo wizard de usar POST legado. |
| `GET /admin/requests[/{id}]`, PATCH assign/status | SUPER_ADMIN, ADMIN, MANAGER, EMPLOYEE para GET/status; **sem EMPLOYEE** no assign | `/admin/pedidos` placeholder; UI MANAGER não inclui essa rota. Serviço lista global e status não verificam assignment/scope. |
| `GET /admin/services` e requisitos/taxas | SUPER_ADMIN, ADMIN, MANAGER | `/admin/servicos` integrada; mutações apenas ADMIN/SUPER_ADMIN. |
| `POST /admin/services/{id}/request-definitions/versions[/{versionId}/publish]` | ADMIN/SUPER_ADMIN | Builder/publishing frontend não implementado. |
| `DELETE /admin/services/{id}` | SUPER_ADMIN apenas, arquiva serviço | UI requer validação de ações. |
| `/admin/departments`, `/admin/districts`, `/admin/appointment-schedule-rules`, `/admin/queues` config | ADMIN/SUPER_ADMIN | Filas/config têm fundação F5; respetivos controles por método. |
| `/admin/queues/snapshots` e operações em desks/tickets/sessions | SUPER_ADMIN, ADMIN, MANAGER, EMPLOYEE + scope de staff em serviço | `/admin/filas` tem F5; operação real QA por jornada pendente. |
| `/citizen/appointments`, `/citizen/appointment-holds`; `/admin/appointments` | CITIZEN para próprios; ADMIN/SUPER_ADMIN materializam slots, MANAGER/EMPLOYEE leitura/check-in | Ecrãs F5 existem; QA final por jornada. |
| `/admin/documents`, `/admin/complaints`, `/admin/payments` | SUPER_ADMIN/ADMIN/MANAGER/EMPLOYEE leitura; alterações de status só subconjunto conforme controller | Ecrãs relevantes podem estar ausentes; não anunciar Work Queue funcional. |
| `/admin/reports/*` | SUPER_ADMIN/ADMIN/MANAGER/EMPLOYEE; EDITOR excluído | Dashboard comum precisa estado 403 adequado para EDITOR. |
| `/admin/notifications` | Papel interno do prefixo; sem `@PreAuthorize` mais restritivo encontrado | Não é contrato de CMS nem de provisionamento. |

## Divergências para resolução posterior

1. `MANAGER` pode processar pedidos pelo backend, mas `/admin/pedidos` está negada no frontend; `EMPLOYEE` vê placeholder em vez de Work Queue. Corrigir com Work Queue quando a jornada staff estiver pronta, sem ampliar permissões backend.
2. `EDITOR` entra no dashboard `/admin`, mas relatórios e os principais endpoints internos rejeitam EDITOR; `/admin/noticias` é placeholder sem controller de CMS encontrado. Exibir estado honesto, sem inventar permissões.
3. `/admin/utilizadores` é placeholder sem API de provisionamento encontrada. Plano de seis contas QA depende de provisionamento autorizado já existente.
4. A configuração de `permissionsByRole` não expressa a matriz de `@PreAuthorize` em tempo real. UI precisa esconder ações proibidas por contrato, mas backend continua autoridade.
5. Status/atribuição de requests são globais para os papéis autorizados pelo controller; exigência de escopo por funcionário precisa de decisão de produto e prova de contrato antes de prometer "apenas atribuídos".
