# BOANE CONECTA — PROJECT STATUS AND CONTINUATION HANDOFF V1.1

**Data de consolidação:** 2026-08-29
**Objetivo:** preservar o contexto técnico, funcional, visual, backend, mobile e operacional necessário para continuar o projeto noutro ChatGPT Work sem perder decisões, limites, proveniência ou evidências.
**Estado global:** F0–F5 têm implementação material; F5 está funcionalmente avançado e tecnicamente testado, mas a auditoria visual completa continua pendente. F6 não foi iniciado.
**Regra de continuação:** não iniciar F6 nem alterar contratos F0–F5 antes de concluir a auditoria integrada descrita neste documento.

**Revisão V1.1:** consolida as novas autoridades backend/mobile, corrige a referência canónica da F5, registra a proveniência exata das 23 decisões A/B/C/D da F5 e atualiza o prompt de continuidade para obrigar a leitura do conjunto técnico completo.

---

## 1. Resumo executivo

O Boane Conecta evoluiu de um baseline recuperado, com frontend React/Vite parcialmente ligado a Supabase e backend Spring pouco operacional, para uma base fullstack modular com:

- fundação semântica e responsiva do frontend;
- PublicShell e Home V2 orientada a serviços;
- catálogo e detalhe de serviços;
- fundação backend para pedidos guiados, documentos seguros e submissão idempotente;
- portal autenticado do munícipe;
- agendamentos, check-in, filas digitais, operação por balcão, configuração e projeção pública;
- 19 migrações Flyway;
- controlos de ownership, escopo operacional, concorrência, idempotência e minimização de dados;
- testes frontend e backend, CI Java 21 e documentação de arquitetura/UX.

O código atual está na branch `feat/fullstack-f5-appointments-queue`, baseada em `master` no commit `4ff50eb6359328589eea6be2cf3e4b72b1a70364`. O HEAD local é `a8589f82258bd18343921de3e3e5e8199995edad`.

Não houve merge para `master`. F6 não foi iniciado. A preview visual publicada é uma cópia isolada, privada e não ligada a um backend público persistente.

---

## 2. Fontes canónicas e ordem de autoridade

As decisões devem ser interpretadas pela combinação das autoridades abaixo, sem substituir wireframes, regras de domínio ou decisões de segurança por padrões genéricos.

### 2.1 Produto, UX e governação

1. `docs/handoffs/BOANE_CONECTA_WORK_MASTER_HANDOFF_V1.md`
2. `docs/handoffs/BOANE_CONECTA_RESPONSIVE_WIREFRAME_ATLAS_V1.md`
3. `docs/handoffs/BOANE_CONECTA_DESIGN_UX_CONSTITUTION_V1.md`
4. `docs/handoffs/BOANE_CONECTA_OPERATING_GOVERNANCE_AND_STARTUP_SPEC_V1.md`

### 2.2 Backend e infraestrutura

5. `docs/backend/BOANE_CONECTA_BACKEND_ENGINEERING_CONSTITUTION_V1.md`
   - regras não negociáveis de engenharia backend, domínio, API, segurança, dados, transações, idempotência, observabilidade, deploy e operação;
6. `docs/backend/BOANE_CONECTA_BACKEND_ARCHITECTURE_INFRASTRUCTURE_OPERATIONS_ATLAS_V1.md`
   - bounded contexts, trust zones, runtime topology, storage, Redis, networking, edge, containers, CI/CD, backups e recovery;
7. `docs/handoffs/BOANE_CONECTA_BACKEND_MOBILE_MASTER_IMPLEMENTATION_HANDOFF_V1.md`
   - ponte operacional entre produto, frontend, backend, infraestrutura, mobile e implementação por fases.

### 2.3 Mobile

8. `docs/mobile/BOANE_CONECTA_CITIZEN_MOBILE_REACT_NATIVE_ARCHITECTURE_SPEC_V1.md`
   - arquitetura futura da app React Native do munícipe, push, câmera, QR, secure storage, deep links, offline, permissões e compatibilidade de API.

### 2.4 Autoridade específica de F5

9. `docs/handoffs/BOANE_CONECTA_F5_APPOINTMENTS_QUEUE_ENGINEERING_SPEC_V1.md`
   - autoridade específica de F5;
   - deve corresponder à versão corrigida do spec, sem sufixos `CORRECTED`, `FINAL` ou similares no nome canónico;
   - apenas as 23 perguntas A/B/C/D representam escolhas explícitas do utilizador;
   - recomendações sem opções permanecem técnicas/provisionais, salvo quando outra autoridade canónica as torna obrigatórias.

### 2.5 Estado implementado por fase

10. `docs/frontend/FRONTEND_F0_FOUNDATION.md`
11. `docs/frontend/FRONTEND_F1_PUBLIC_HOME.md`
12. `docs/frontend/FRONTEND_F2_SERVICE_CATALOG.md`
13. `docs/backend/BACKEND_F3_REQUEST_FOUNDATION_IMPLEMENTATION.md`
14. `docs/frontend/FRONTEND_F4_CITIZEN_PORTAL.md`
15. `docs/frontend/FRONTEND_F5_APPOINTMENTS_QUEUE.md`
16. ADRs em `docs/architecture/`.

### 2.6 Ordem de precedência em conflito

1. invariantes legais, de segurança, privacidade, integridade de dados e domínio;
2. decisão explícita mais recente aprovada, desde que permaneça dentro desses invariantes;
3. Master Handoff;
4. Operating Governance;
5. especificação específica da fase;
6. Backend Engineering Constitution;
7. Backend Architecture / Infrastructure / Operations Atlas;
8. Design & UX Constitution e Wireframe Atlas;
9. Mobile Architecture Spec para contratos/implicações mobile;
10. estado implementado observado.

Conflitos materiais não devem ser resolvidos silenciosamente. Devem ser registrados como ADR, bloqueio ou pedido de decisão.

### Princípio central de qualidade

> Premium não significa decoração. Premium significa coerência, tipografia, spacing, interação, responsividade, acessibilidade, performance e ausência de estados acidentais.

Continuam proibidos como atalhos visuais:

- “AI slop” e composição genérica de template;
- cards enormes sem função;
- gradientes SaaS, glow e glassmorphism gratuito;
- métricas decorativas;
- tipografia inconsistente;
- espaçamento arbitrário;
- layouts copiados sem relação com Boane;
- imagens geradas por IA apresentadas como realidade municipal;
- factos, números, contactos, pessoas ou serviços municipais inventados.

---

## 3. Identidade do repositório e Git

| Campo | Estado verificado |
|---|---|
| Repositório | `rightware-corporations/boane-conecta-fullstack-app` |
| Remote | `https://github.com/rightware-corporations/boane-conecta-fullstack-app.git` |
| Branch atual | `feat/fullstack-f5-appointments-queue` |
| Base em `master` | `4ff50eb6359328589eea6be2cf3e4b72b1a70364` |
| HEAD local | `a8589f82258bd18343921de3e3e5e8199995edad` |
| Working tree | limpa em 2026-08-29 |
| Pull request conhecida | PR #3 |
| URL da PR | `https://github.com/rightware-corporations/boane-conecta-fullstack-app/pull/3` |
| Último CI backend previamente verificado | sucesso |
| URL do CI conhecido | `https://github.com/rightware-corporations/boane-conecta-fullstack-app/actions/runs/33243479333` |
| `master` | não modificado por este trabalho |
| force push | não executado |
| merge | não executado |

### Observação sobre SHAs locais e remotos

O ambiente Work publicou a branch através de um transporte que gerou SHAs remotos equivalentes, mas diferentes dos SHAs locais. O estado funcional foi preservado. O último SHA remoto conhecido correspondente ao HEAD local era `378fc31a7539fd086e1268e4c3a0c1c07c7f0cb0`. Antes de qualquer merge, comparar árvores e não assumir igualdade textual de SHA.

### Dimensão do delta desde `master`

- 347 ficheiros alterados;
- aproximadamente 25.119 inserções e 3.215 remoções;
- 128 ficheiros frontend afetados;
- 201 ficheiros backend afetados;
- 14 ficheiros de documentação afetados;
- 4 ficheiros de infraestrutura/raiz afetados.

---

## 4. Matriz de fases

| Fase | Escopo canónico | Estado | Evidência principal | Bloqueio atual |
|---|---|---|---|---|
| F0 | Fundação semântica, tokens, primitives e shells | Implementada | `FRONTEND_F0_FOUNDATION.md` | dívida visual legada fora das superfícies migradas |
| F1 | PublicShell + Home V2 | Implementada | `FRONTEND_F1_PUBLIC_HOME.md` | screenshots completos e validação de identidade municipal |
| F2 | Catálogo + detalhe de serviço | Implementada | `FRONTEND_F2_SERVICE_CATALOG.md` | screenshots completos; ampliar dados oficiais do backend |
| F3 | Pedido guiado + documentos + review + confirmação + detalhe | Backend foundation implementada | `BACKEND_F3_REQUEST_FOUNDATION_IMPLEMENTATION.md` | frontend guiado completo não está documentado como fase concluída; auditoria E2E necessária |
| F4 | Portal do munícipe | Implementada materialmente | `FRONTEND_F4_CITIZEN_PORTAL.md` | QA visual, integração E2E e revisão de estados extremos |
| F5 | Agendamentos + check-in + filas | Implementada materialmente | `FRONTEND_F5_APPOINTMENTS_QUEUE.md` + spec F5 | QA visual/E2E e validação operacional em infraestrutura integrada |
| F6 | AdminShell + Operations Home + Work Queue + Case Workspace | **Não iniciada** | Atlas §68 | bloqueada até auditoria F0–F5 e autorização explícita |
| F7 | Finanças + comunicação | Não iniciada | Atlas §68 | depende de F6 e contratos financeiros/editoriais |
| F8 | Protocolo + financiamento | Não iniciada | Atlas §68 | depende de domínios e permissões próprios |
| F9 | Executivo + reporting + transparência | Não iniciada | Atlas §68 | depende de dados governados e maturidade dos domínios anteriores |

---

## 5. F0 — Fundação frontend

### Entregue

- React 18, TypeScript, Vite e Tailwind preservados;
- DM Sans como tipografia global;
- tokens semânticos para superfícies, marca, sucesso, aviso, perigo e informação;
- escalas canónicas de spacing, radius, shadow e motion;
- breakpoints e containers municipais responsivos;
- primitives `Container`, `Section`, `Stack`, `Inline`, `Grid` e `Split`;
- variantes coerentes de button, input e status;
- `PublicShell`, `CitizenShell`, `AdminShell` e `ExecutiveShell` como fronteiras arquiteturais;
- skip links, foco visível, `main#main-content`, alert region e reduced motion;
- redução da dívida ESLint do baseline;
- estratégia incremental sem big-bang folder move.

### Restrições ainda válidas

- a paleta continua provisória até validação municipal;
- conteúdo municipal hard-coded legado não deve ser tratado como oficial;
- aliases de compatibilidade devem ser removidos apenas após migração de consumidores;
- screens antigas ainda podem carregar linguagem visual pré-constituição.

---

## 6. F1 — PublicShell e Home V2

### Entregue

- IA pública simplificada e orientada ao munícipe;
- header sem entrada administrativa proeminente;
- menu móvel com semântica Radix, Escape e retorno de foco;
- hero textual e pesquisa encaminhada para `/servicos?search=...`;
- tarefas rápidas, serviços em destaque, mobilidade, oportunidades, atualizações, projetos, transparência e contactos como tipos composicionais distintos;
- route-level code splitting;
- conteúdo opcional ocultado quando não existe contrato oficial;
- ausência deliberada de estatísticas, contactos ou factos fabricados.

### Dados reais vs lacunas

- serviços públicos usam contrato backend real;
- alertas, oportunidades, notícias e projetos ainda precisam de contratos públicos oficiais completos;
- contactos dependem de `VITE_MUNICIPAL_*` validado;
- fotografias atuais do repositório não constituem, por si, uma biblioteca municipal validada.

### Gate pendente

- evidência por screenshots em 320, 375/390, 430, 768, 1024, 1280, 1440 e 1920 px;
- zoom a 200%;
- percurso apenas com teclado;
- confirmação visual com identidade local real de Boane.

---

## 7. F2 — Catálogo e detalhe de serviços

### Entregue

- pesquisa accent-insensitive;
- filtros por categoria, canal, audiência e disponibilidade;
- estado de filtros na URL;
- filtros móveis em sheets acessíveis;
- rail persistente de filtros no desktop;
- detalhe com elegibilidade, requisitos, documentos, taxa, duração e CTAs condicionais;
- serviços suspensos permanecem legíveis sem ações transacionais inválidas;
- DTO de transporte, normalização, filtros e apresentação separados;
- remoção do catálogo antigo baseado em cards genéricos e modal de pagamento.

### Lacunas de contrato

O backend público atual não oferece todos os campos futuros já suportados pelo adapter, incluindo canal, audiência, documentos, processo, localização, referências legais, FAQ, keywords e synonyms. O frontend não inventa esses valores.

---

## 8. F3 — Fundação backend de pedidos e documentos

### Entregue

- definições e versões imutáveis de serviço/formulário;
- drafts com TTL de 90 dias e ETag;
- respostas incrementais e elegibilidade condicional;
- concorrência otimista via `If-Match`;
- uploads em quarentena;
- deteção de assinatura real do ficheiro;
- ClamAV e fail-closed;
- armazenamento S3/MinIO por adapter;
- versões imutáveis de documentos;
- validação estruturada;
- submissão atómica;
- snapshots de respostas, documentos, declaração e schema;
- idempotência por chave + fingerprint;
- outbox transacional;
- projeção segura do pedido para o munícipe;
- correlation IDs, retention worker e health/Prometheus.

### Invariantes críticas

- identidade do munícipe vem sempre do principal autenticado;
- prioridade F3 é server-owned `NORMAL`;
- um draft produz no máximo um pedido submetido;
- só documentos `VALID` podem entrar na submissão;
- reuse da mesma idempotency key com payload diferente gera conflito;
- comentários internos, identidades de staff e metadados administrativos não entram na projeção citizen-safe.

### Estado de integração

A base backend está implementada. Antes de declarar F3 fullstack congelada, é necessário confirmar, por testes E2E reais, o percurso definição → draft → respostas → documentos → validação → review → submissão → detalhe.

---

## 9. F4 — Portal do munícipe

### Entregue

- CitizenShell desktop e navegação móvel canónica;
- home orientada a ações;
- lista e detalhe citizen-safe de pedidos;
- documentos autenticados;
- notificações e comandos de leitura;
- perfil seguro;
- ownership derivado no backend;
- UI não envia `citizenId`;
- estados loading, empty e error nas superfícies migradas.

### Navegação móvel canónica

1. Início;
2. Pedidos;
3. Serviços;
4. Alertas;
5. Conta.

### Pendente

- walkthrough visual em todos os breakpoints;
- teste de sessão expirada e refresh concorrente;
- downloads/uploads reais contra infraestrutura local integrada;
- estados offline/stale/partial;
- conteúdo longo, nomes longos e zoom a 200%.

---

## 10. F5 — Agendamentos, check-in e filas

### Superfícies entregues

- disponibilidade de agendamento;
- hold temporário;
- confirmação;
- detalhe, cancelamento e reagendamento;
- check-in manual autenticado;
- leitura QR baseada em consentimento;
- ticket digital do munícipe;
- console de staff;
- seleção de fila e balcão;
- chamada, rechamada, início, conclusão, no-show e transferência;
- display público PII-safe;
- agenda administrativa;
- check-in assistido;
- configuração de filas e balcões;
- regras de agenda, capacidade e materialização explícita de slots;
- gestão de operadores com escopo explícito por fila.

### Invariantes de negócio

- hold é temporário e separado do appointment confirmado;
- capacidade é decidida sob locking de base de dados;
- regras nascem em `DRAFT`;
- regra ativa não é editada diretamente;
- transições são limitadas e `RETIRED` é terminal;
- serviço e departamento têm de corresponder;
- overlaps por serviço/local/dia são rejeitados;
- materialização é bounded, determinística e não duplica slots;
- timezone operacional é `Africa/Maputo`;
- queue ticket e service session formam histórico operacional autoritativo.

### Segurança corrigida na auditoria mais recente

- mutations legadas de appointment foram removidas;
- disponibilidade normaliza location em uppercase;
- agenda administrativa é filtrada por queues autorizadas;
- cada operador requer `QueueStaffScope` explícito;
- snapshots, desks, calls, transfers e assisted check-in verificam escopo;
- transferência exige acesso à queue de origem e destino;
- remoção de escopo bloqueia operações subsequentes;
- public display não expõe identidade do munícipe;
- `If-Match` protege configuração mutável;
- idempotency keys protegem comandos retry-sensitive.

### Commits finais locais de hardening

- `f077538` — remover mutations legadas de agendamento;
- `a3c9bc2` — impor escopos explícitos de staff por fila;
- `3f9be39` — gerir operadores scoped no frontend;
- `d865110` — normalizar localização da disponibilidade;
- `a8589f8` — limitar acesso à agenda administrativa.

### Proveniência das decisões F5

A matriz de decisões F5 deve ser lida exclusivamente pela versão canónica corrigida de `BOANE_CONECTA_F5_APPOINTMENTS_QUEUE_ENGINEERING_SPEC_V1.md`.

Sequência original de respostas às perguntas com opções:

```text
BCDBBBBBBCCCBCCCBCCBBBB
```

Sequência canónica resolvida após o esclarecimento da 12.ª decisão:

```text
BCDBBBBBBCCBBCCCBCCBBBB
```

Interpretação correta:

- apenas as **23 perguntas que possuíam alternativas A/B/C/D** pertencem a esta sequência;
- a 12.ª resposta foi posteriormente esclarecida explicitamente como **B — QR/check-in token de uso único / consumível**;
- pontos apresentados apenas como recomendações, regras, invariantes ou defaults não são atribuídos ao utilizador como escolhas explícitas;
- recomendações técnicas continuam aplicáveis apenas quando necessárias para preservar segurança/domínio, quando já constam noutra autoridade canónica, ou quando forem posteriormente aprovadas.

Esta regra de proveniência é obrigatória para qualquer agente que retome F5.

### Pendente antes de freeze

- E2E com PostgreSQL, backend, frontend, MinIO e ClamAV ativos;
- matriz de autorização por role e queue scope;
- concorrência real com múltiplos operadores;
- câmera/QR em dispositivo suportado;
- acessibilidade e screenshots em todos os viewports;
- teste de legibilidade do display público à distância;
- degradação de rede, retry, stale version e idempotent replay;
- observabilidade de filas, falhas e tempos operacionais.

---

## 11. Backend — estado transversal

### Arquitetura preservada

- modular monolith;
- Java 21;
- Spring Boot;
- Spring Security;
- PostgreSQL;
- Flyway;
- JPA/Hibernate;
- JWT bearer + refresh rotation;
- BCrypt;
- REST DTOs, service layer e repositories;
- Docker Compose para dependências locais.

### Autoridades backend adicionadas na consolidação V1.1

- `BOANE_CONECTA_BACKEND_ENGINEERING_CONSTITUTION_V1.md`;
- `BOANE_CONECTA_BACKEND_ARCHITECTURE_INFRASTRUCTURE_OPERATIONS_ATLAS_V1.md`;
- `BOANE_CONECTA_BACKEND_MOBILE_MASTER_IMPLEMENTATION_HANDOFF_V1.md`.

Estas autoridades definem o **quality bar, a arquitetura alvo e os gates operacionais**. Elas não significam que toda a infraestrutura descrita já esteja implementada.

### Inventário atual

| Item | Quantidade observada |
|---|---:|
| Controllers `@RestController` | 34 |
| Services `@Service` | 32 |
| Repositories JPA/CRUD | 37 |
| Ficheiros de teste Java | 25 |
| Migrações Flyway | 19 |

### Migrações acrescentadas desde a base

- V9: definições versionadas de pedidos;
- V10: drafts;
- V11: versões seguras de documentos e links;
- V12: submissão atómica e idempotente;
- V13: contexto seguro de notificações;
- V14: holds, check-in e filas;
- V15: auditoria de lifecycle de appointment;
- V16: check-in seguro e sequência de fila;
- V17: operações e eventos de fila;
- V18: invariantes de configuração;
- V19: escopos de staff por fila.

### Qualidade backend

- CI Java 21 previamente verificado com sucesso para o HEAD remoto equivalente;
- suite inclui testes unitários, integração, Testcontainers/Flyway e concorrência PostgreSQL;
- o ambiente atual não possui o comando `mvn`, portanto o backend não foi reexecutado localmente durante esta consolidação;
- essa ausência local não invalida o CI verificado, mas deve constar como limitação de evidência desta sessão.

---

## 12. Frontend — estado transversal

### Arquitetura

- React 18 + TypeScript + Vite;
- TanStack Query para server state nas features migradas;
- React Router com lazy routes;
- Tailwind + Radix/shadcn primitives;
- shells separados por contexto;
- adapters de API tipados;
- design system semântico;
- UI pública, citizen e operacional com densidades distintas.

### Qualidade executada em 2026-08-29

| Gate | Resultado |
|---|---|
| `npm run lint` | PASS |
| `npx tsc -p tsconfig.app.json --noEmit` | PASS |
| `npm run test` | PASS — 43 testes, 16 ficheiros |
| `npm run build` | PASS |
| Vite modules transformed | 2.233 |
| main JS chunk | ~333,66 kB raw / 107,02 kB gzip |
| CSS principal | ~102,18 kB raw / 16,97 kB gzip |
| `git diff --check` | PASS |
| working tree após gates | limpa |

### Avisos não bloqueantes

- warnings de future flags do React Router v7 durante testes;
- base `caniuse-lite` desatualizada;
- npm avisa que `http-proxy` deixará de ser configuração reconhecida numa versão major futura;
- estes avisos devem ser tratados numa tarefa de manutenção isolada, sem misturar com redesign.

---

## 13. Segurança, privacidade e confiabilidade

### Controlos implementados

- autenticação e roles no backend;
- ownership derivado do principal;
- ausência de IDs de munícipe confiados ao frontend;
- DTOs citizen-safe;
- PII minimizada no display público;
- escopo explícito de operador por queue;
- optimistic concurrency via ETag/`If-Match`;
- pessimistic/database locking onde capacidade é partilhada;
- idempotência em submissões e operações retry-sensitive;
- quarantine + malware scanning;
- validação por assinatura de ficheiro;
- audit fields e queue events;
- correlation IDs;
- outbox transacional;
- retenção programada.

### Riscos a fechar

- executar threat model formal por fluxo F3–F5;
- testar revogação de role/scope durante sessões ativas;
- validar rate limits em auth, uploads, check-in e displays públicos;
- confirmar política de segredo/rotation em produção;
- validar CORS e cookies/tokens no domínio definitivo;
- configurar buckets, lifecycle, backups e disaster recovery;
- confirmar logs sem PII, QR secrets ou tokens;
- testar payloads extremos, race conditions e replay hostil;
- validar headers de segurança e política CSP;
- executar dependency/SAST/secret scan antes de merge.

---

## 13A. Mobile — estado e implicações transversais

A aplicação React Native do munícipe ainda não deve ser tratada como fase implementada neste handoff.

Autoridade canónica:

`docs/mobile/BOANE_CONECTA_CITIZEN_MOBILE_REACT_NATIVE_ARCHITECTURE_SPEC_V1.md`

### Implicações que já afetam backend/web

- contratos de API devem manter compatibilidade com clientes mobile que podem permanecer instalados por meses;
- push é canal de aviso e nunca fonte autoritativa de estado;
- câmera/QR devem possuir fallback manual;
- tokens mobile devem usar secure storage e nunca AsyncStorage em texto simples;
- deep links não concedem autorização;
- critical commands devem suportar recuperação após timeout por idempotência/status;
- backend não deve depender de browser-only behavior não documentado;
- GPS/background location não devem ser requisito para check-in;
- dados sensíveis em notificações de lock screen devem ser minimizados.

### Estado

- arquitetura/documentação: preparada;
- implementação React Native: não iniciada neste handoff;
- autorização de execução mobile: futura e separada;
- F5 foi desenhada para ser consumível por mobile sem criar um segundo backend de regras de negócio.

---

## 14. Acessibilidade e QA visual

### Base implementada

- skip links;
- foco visível;
- semântica de headings e landmarks;
- labels e erros associados;
- estados não dependentes apenas de cor;
- target sizes práticos;
- sheets/dialogs com foco e Escape;
- reduced motion;
- inputs móveis com 16 px;
- navegação citizen móvel;
- composição responsiva por contexto.

### Preview isolada

Foi publicada uma cópia privada para inspeção visual:

`https://boane-conecta-f5-qa.rightware.chatgpt.site`

Limitações:

- é uma cópia isolada, não produção canónica;
- não está ligada a um backend público persistente;
- rotas protegidas e operações fullstack podem não funcionar nessa URL;
- o browser automatizado interno bloqueou a preview local com `ERR_BLOCKED_BY_CLIENT`;
- portanto, a publicação prova build/deploy, mas não substitui screenshot QA nem E2E.

### Matriz de QA ainda obrigatória

- 320 px;
- 375/390 px;
- 430 px;
- 768 px;
- 1024 px;
- 1280 px;
- 1440 px;
- 1920 px;
- zoom a 200%;
- teclado apenas;
- reduced motion;
- touch/câmara em dispositivo real;
- textos longos e localização pt-MZ;
- loading, empty, error, partial, offline e stale;
- contraste WCAG e foco;
- ausência de overflow horizontal.

---

## 15. Identidade visual de Boane — próximo estudo

O projeto pode e deve ganhar uma identidade local mais forte, mas esse trabalho deve ser evidence-led e não uma decoração inventada.

### Fotografias de posts do Facebook podem ajudar

O utilizador poderá fornecer screenshots ou fotografias de posts oficiais/relevantes. Esses materiais devem ser usados para extrair sinais visuais, não para copiar layouts do Facebook.

### O que analisar nas imagens

- cores recorrentes em comunicações municipais;
- uso e variantes do brasão/logótipo;
- tipografia institucional observável;
- padrões de enquadramento fotográfico;
- arquitetura, paisagem, mobilidade, mercados, serviços e vida comunitária;
- vestuário, materiais, sinalética e contexto territorial;
- tom editorial;
- composição de comunicados e avisos;
- contraste entre identidade oficial e linguagem popular/local.

### Regras de proveniência

- preferir posts de páginas oficiais verificáveis;
- guardar URL, data, autor/página e contexto de cada referência;
- não assumir que uma cor recorrente num post é oficialmente normativa;
- não reutilizar fotografias sem confirmar direitos/licença/autorização;
- não inferir atributos sensíveis de pessoas retratadas;
- desfocar/remover PII quando a imagem for apenas referência de design;
- não usar imagem de IA como fotografia documental de Boane.

### Entregáveis recomendados para a identidade

1. inventário visual referenciado;
2. moodboard factual de Boane;
3. matriz “observado / inferido / validado / proibido”;
4. proposta de paleta semântica com contrastes medidos;
5. regras fotográficas e crops responsivos;
6. sistema de grafismos inspirado em sinais locais verificáveis;
7. atualização controlada dos tokens;
8. protótipos de Home, serviço, citizen e operações;
9. revisão com screenshots canónicos;
10. ADR de identidade visual aprovada.

### O que não fazer

- recolorir toda a UI a partir de uma única fotografia;
- transformar motivos culturais em ornamento superficial;
- usar filtros pesados que reduzam autenticidade;
- substituir densidade operacional por grandes fotografias;
- fazer um redesign big-bang antes da auditoria funcional;
- introduzir imagem sem alt text, provenance e fallback.

---

## 16. Checklist em camadas: prioridade, dependência e bloqueio

### Camada P0 — Preservação e verdade do estado

- [x] branch F5 preservada;
- [x] `master` não alterado;
- [x] working tree limpa;
- [x] documentação canónica de produto/UX presente;
- [x] autoridades backend/mobile V1.1 presentes nos paths canónicos;
- [x] F5 Spec canónica comparada com a versão corrigida; conteúdo materialmente equivalente e nome estável preservado;
- [x] frontend lint/TS/test/build passam;
- [x] CI backend conhecido passa;
- [ ] confirmar a equivalência árvore local/remota antes de merge;
- [ ] atualizar PR com relatório final de auditoria.

**Bloqueia:** qualquer merge ou início de F6.

### Camada P1 — Ambiente fullstack reproduzível

- [ ] Java 21 e Maven/Maven Wrapper disponíveis;
- [ ] PostgreSQL 16 ativo;
- [ ] MinIO ativo com buckets e políticas corretas;
- [ ] ClamAV ativo;
- [ ] backend com Flyway V1–V19 aplicado;
- [ ] frontend apontado para backend integrado;
- [ ] seeds mínimos e seguros para cenários de teste;
- [ ] utilizadores/roles/scopes de QA documentados sem expor segredos.

**Depende de:** P0.
**Bloqueia:** E2E F3–F5 e QA visual autenticada.

### Camada P2 — Auditoria backend e segurança

- [ ] reexecutar `mvn verify` localmente;
- [ ] validar migração do zero e upgrade de base existente;
- [ ] matriz de autorização por endpoint;
- [ ] ownership tests negativos;
- [ ] queue-scope tests negativos;
- [ ] idempotency/replay tests;
- [ ] concurrency/load tests;
- [ ] upload/malware/storage failure tests;
- [ ] SAST, dependency scan e secret scan;
- [ ] review de logs, PII e headers.

**Depende de:** P1.
**Bloqueia:** freeze backend F5.

### Camada P3 — Auditoria frontend e UX

- [ ] inventário screen-by-screen do que é canónico vs legado;
- [ ] screenshots em todos os viewports;
- [ ] teclado, foco, Escape e focus return;
- [ ] 200% zoom;
- [ ] contraste;
- [ ] estados loading/empty/error/partial/offline/stale;
- [ ] textos extremos;
- [ ] route guards e sessão expirada;
- [ ] QR/câmara com consentimento;
- [ ] display público à distância.

**Depende de:** P1 para rotas protegidas; parte pública pode começar antes.
**Bloqueia:** freeze visual F0–F5.

### Camada P4 — Auditoria E2E por lógica de negócio

- [ ] F3: definição → draft → documento → validação → submissão → detalhe;
- [ ] F4: login → dashboard → pedidos → documentos → notificações → perfil;
- [ ] F5: disponibilidade → hold → confirmação → check-in → ticket → atendimento;
- [ ] F5 admin: rule → activation → materialization → agenda;
- [ ] F5 staff: scope → desk → call → service → complete/no-show/transfer;
- [ ] revogação de scope no meio do fluxo;
- [ ] stale ETag e duplicate idempotency key;
- [ ] capacity race e simultaneous calls.

**Depende de:** P1–P3.
**Bloqueia:** aceite funcional e merge.

### Camada P5 — Identidade visual e conteúdo municipal

- [ ] receber referências fotográficas/posts;
- [ ] validar origem e direitos;
- [ ] extrair sinais locais;
- [ ] separar observado, inferido e oficial;
- [ ] propor tokens/paleta;
- [ ] testar contraste;
- [ ] aplicar primeiro a um conjunto controlado de screens;
- [ ] screenshot review;
- [ ] ADR e aprovação.

**Pode correr em paralelo com:** partes de P2/P4.
**Não pode bloquear:** correções críticas de segurança.
**Bloqueia:** declaração de identidade visual municipal definitiva.

### Camada P6 — Decisão de merge

- [ ] todos os P0–P4 críticos encerrados;
- [ ] P5 aprovado ou explicitamente adiado como paleta provisória;
- [ ] PR revista;
- [ ] CI verde no SHA final;
- [ ] migrations/backups/rollback documentados;
- [ ] changelog e release notes;
- [ ] aprovação humana explícita;
- [ ] merge normal, sem force push.

### Camada P7 — Autorização de F6

- [ ] F0–F5 congelados com evidência;
- [ ] Case bounded context decidido por ADR;
- [ ] AdminShell e permissions mapeados;
- [ ] Operations Home orientada a perguntas reais;
- [ ] Work Queue e Case Workspace detalhados contra o Atlas;
- [ ] autorização explícita do utilizador.

**Estado atual:** bloqueada.

---

## 17. Dívida e riscos conhecidos

### Alta prioridade

- ausência de QA visual completa e autenticada;
- ambiente atual sem Maven;
- F3 precisa de prova fullstack E2E;
- identidade e conteúdo municipal ainda provisórios;
- alguns ecrãs públicos/admin legados mantêm linguagem anterior;
- preview isolada não valida backend.

### Média prioridade

- React Router future flags;
- browserslist desatualizado;
- alinhamento gradual de aliases/compatibilidade;
- revisão de bundle e caching por rotas;
- documentação de observabilidade e runbooks;
- automatização de screenshot regression.

### Baixa prioridade, mas deve ser rastreada

- remoção de componentes de compatibilidade não usados;
- escolha final entre lockfiles npm/Bun;
- limpeza de artefactos históricos Supabase apenas após migração comprovada;
- refinamento editorial e microcopy após validação municipal.

---

## 18. Sequência recomendada para a próxima sessão

1. abrir este relatório e todas as autoridades canónicas;
2. confirmar branch, HEAD, status e remote;
3. não iniciar F6;
4. instalar/usar Java 21 e Maven Wrapper;
5. levantar stack fullstack local;
6. executar gates frontend e backend;
7. executar matriz E2E F3–F5;
8. produzir screenshots canónicos;
9. classificar defeitos em segurança, lógica de negócio, acessibilidade, responsive e visual;
10. corrigir em commits pequenos e lógicos;
11. repetir gates;
12. receber e analisar referências visuais de Boane;
13. propor evolução de identidade como mudança separada e reversível;
14. atualizar documentação e PR;
15. pedir aprovação antes de merge ou F6.

---

## 19. Prompt de arranque para o próximo ChatGPT Work

```text
BOANE CONECTA — CONTINUAÇÃO CONTROLADA F0–F5 / HANDOFF V1.1

Antes de editar qualquer ficheiro, leia integralmente:

STATUS / ENTRADA
1. BOANE_CONECTA_PROJECT_STATUS_AND_CONTINUATION_HANDOFF_V1_1.md

PRODUTO / UX / GOVERNAÇÃO
2. docs/handoffs/BOANE_CONECTA_WORK_MASTER_HANDOFF_V1.md
3. docs/handoffs/BOANE_CONECTA_RESPONSIVE_WIREFRAME_ATLAS_V1.md
4. docs/handoffs/BOANE_CONECTA_DESIGN_UX_CONSTITUTION_V1.md
5. docs/handoffs/BOANE_CONECTA_OPERATING_GOVERNANCE_AND_STARTUP_SPEC_V1.md

BACKEND / INFRAESTRUTURA
6. docs/backend/BOANE_CONECTA_BACKEND_ENGINEERING_CONSTITUTION_V1.md
7. docs/backend/BOANE_CONECTA_BACKEND_ARCHITECTURE_INFRASTRUCTURE_OPERATIONS_ATLAS_V1.md
8. docs/handoffs/BOANE_CONECTA_BACKEND_MOBILE_MASTER_IMPLEMENTATION_HANDOFF_V1.md

MOBILE
9. docs/mobile/BOANE_CONECTA_CITIZEN_MOBILE_REACT_NATIVE_ARCHITECTURE_SPEC_V1.md

F5 PHASE AUTHORITY
10. docs/handoffs/BOANE_CONECTA_F5_APPOINTMENTS_QUEUE_ENGINEERING_SPEC_V1.md

IMPLEMENTED PHASE EVIDENCE
11. docs/frontend/FRONTEND_F0_FOUNDATION.md
12. docs/frontend/FRONTEND_F1_PUBLIC_HOME.md
13. docs/frontend/FRONTEND_F2_SERVICE_CATALOG.md
14. docs/backend/BACKEND_F3_REQUEST_FOUNDATION_IMPLEMENTATION.md
15. docs/frontend/FRONTEND_F4_CITIZEN_PORTAL.md
16. docs/frontend/FRONTEND_F5_APPOINTMENTS_QUEUE.md

Leia também ADRs relevantes em docs/architecture/.

Trate os documentos como autoridade combinada e use o relatório de status para distinguir decisão, recomendação, estado implementado, evidência, lacuna, bloqueio e risco.

IMPORTANTE — PROVENIÊNCIA F5:
A sequência original BCDBBBBBBCCCBCCCBCCBBBB corresponde somente às 23 perguntas F5 que possuíam alternativas A/B/C/D.
A 12.ª resposta original era C, mas foi posteriormente esclarecida como B: QR/check-in token de uso único.
A sequência canónica resolvida que deve orientar a implementação é BCDBBBBBBCCBBCCCBCCBBBB.
Não atribua ao utilizador recomendações técnicas que não foram perguntas com alternativas.
Invariantes de segurança/domínio continuam válidas independentemente dessa proveniência.

Repositório:
https://github.com/rightware-corporations/boane-conecta-fullstack-app.git

Branch:
feat/fullstack-f5-appointments-queue

HEAD local conhecido:
a8589f82258bd18343921de3e3e5e8199995edad

Antes de qualquer alteração:
- confirme repo identity, branch, HEAD, working tree e remotes;
- compare equivalência árvore local/remota antes de merge;
- confirme a presença/nome correto das novas autoridades backend/mobile;
- confirme que a F5 Spec canónica é a versão corrigida.

Objetivo imediato:
executar auditoria fullstack F0–F5, gates, ambiente reproduzível, E2E, segurança, autorização, concorrência, acessibilidade e screenshot QA; corrigir apenas defeitos comprovados em commits pequenos e lógicos.

Restrições:
- não iniciar F6;
- não fazer merge para master;
- não force-push;
- não redesenhar genericamente;
- não inventar conteúdo municipal;
- não enfraquecer ownership, RBAC, capabilities, queue scope, idempotência ou concorrência;
- não apresentar imagens AI como realidade de Boane;
- não substituir wireframes ou regras canónicas por padrões genéricos;
- não tratar push como autoridade;
- não introduzir browser-only assumptions que quebrem futuro cliente React Native;
- não introduzir GPS obrigatório no check-in;
- não alterar contratos F0–F5 sem defeito comprovado/ADR/decisão explícita.

Sequência operacional obrigatória:
P0 — preservar e verificar verdade do estado;
P1 — reproduzir ambiente fullstack;
P2 — backend/security audit;
P3 — frontend/UX/accessibility audit;
P4 — E2E por lógica de negócio;
P5 — identidade visual/conteúdo municipal separadamente;
P6 — merge somente após gates e aprovação;
P7 — F6 continua bloqueada até autorização explícita.

Depois da auditoria, aguarde referências fotográficas fornecidas pelo utilizador para um estudo separado de identidade visual de Boane, com provenance, direitos, contraste, tokenização e aprovação explícita.

Ao finalizar a auditoria:
- atualize este handoff e a PR;
- liste defects corrigidos e riscos remanescentes;
- anexe evidências de gates/E2E/screenshots;
- confirme CI verde no SHA final;
- aguarde aprovação humana antes de merge ou F6.
```

---

## 20. Critério de conclusão da etapa atual

Esta etapa de implementação não deve ser considerada totalmente concluída apenas porque build e testes unitários passam. O gate correto exige:

- autoridades canónicas backend/mobile presentes nos paths definidos;
- F5 Engineering Spec corrigida instalada sob o nome canónico;
- ambiente reproduzível;
- backend e frontend integrados;
- migrations verificadas;
- segurança e ownership testados negativamente;
- fluxos F3–F5 executados ponta a ponta;
- screenshots e acessibilidade validados;
- ausência de regressões de lógica de negócio;
- CI verde no SHA final;
- revisão humana;
- identidade municipal declarada provisória até validação.

Até esses pontos serem encerrados, a formulação correta é:

> **F0–F5 estão materialmente implementados e tecnicamente avançados; a consolidação final depende da auditoria integrada, visual, operacional e de segurança. F6 permanece bloqueada.**

---

## 21. Registo da revisão V1.1

Esta revisão torna o handoff autossuficiente entre sessões/Workspaces.

Alterações principais:

1. Backend Engineering Constitution adicionada à autoridade canónica;
2. Backend Architecture / Infrastructure / Operations Atlas adicionado;
3. Backend & Mobile Master Implementation Handoff adicionado;
4. Citizen Mobile React Native Architecture Spec adicionada;
5. F5 Engineering Spec corrigida definida como única autoridade F5 sob nome canónico estável;
6. proveniência das 23 respostas A/B/C/D explicitada;
7. 12.ª decisão F5 fixada como `B — QR/check-in token de uso único`;
8. recomendações sem alternativas deixaram de ser atribuídas ao utilizador como escolhas;
9. prompt de arranque expandido para ler todas as autoridades;
10. sequência de continuação atualizada para normalizar documentação antes da auditoria;
11. preparação mobile adicionada como requisito transversal sem declarar implementação React Native concluída.

**Regra documental:** não criar variantes `FINAL`, `FINAL2`, `CORRECTED` ou equivalentes dos documentos canónicos dentro do repositório. Uma correção aprovada substitui o ficheiro canónico mantendo o nome estável; o histórico fica no Git.

---

**END — BOANE CONECTA PROJECT STATUS AND CONTINUATION HANDOFF V1.1**
