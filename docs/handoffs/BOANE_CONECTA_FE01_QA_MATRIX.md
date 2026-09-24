# FE-01 — matriz de homologação (WORK 01C)

Estado inicial: PR #4 Draft, `main@3b47e1b`, FE-01 `477c46e`, 24/09/2026. Esta matriz foi preparada antes das alterações WORK 01C. PASS requer execução e evidência; testes locais simulados não provam o backend QA.

| Actor | Cenário e expectativa | Método | Estado inicial |
| --- | --- | --- | --- |
| Anónimo | Saúde/catálogo públicos 200; `/auth/me`, `/citizen/**`, `/admin/**` 401; rota privada React leva a `/auth` | HTTP QA e browser | BLOCKED: QA Windows inacessível daqui |
| CITIZEN A | Login, `/auth/me`, dashboard/rotas próprias, refresh rotativo, reload, logout; sessão terminada; rota admin 403 | Contas descartáveis e HTTP/browser | BLOCKED: conta QA indisponível |
| CITIZEN B | Mesmos fluxos; acesso a objeto de A deve ser 403/404 sem dados; acesso de A a objeto B também | IDs de objetos descartáveis próprios | BLOCKED: duas contas e fixtures indisponíveis |
| SUPER_ADMIN | Login e `/admin`; rota citizen 403, conteúdo privado de citizen ausente | Conta QA provisionada existente | BLOCKED: conta indisponível; sem provisionamento novo |
| Staff (papel real) | Operações correspondentes ao papel; citizen 403; outras operações internas segundo método/controller | Conta QA existente, endpoints reais | BLOCKED: conta/papel indisponível |
| Sessão | Access inválido/expirado 401; refresh inválido/revogado 401; refresh válido roda token; uso antigo rejeitado; sem ciclo infinito | HTTP + testes cliente | Parcial: testes integração no código; runtime QA pendente |
| Mutações | 401 pode provocar refresh mas POST/PUT/PATCH/DELETE/upload não devem ser repetidos automaticamente | Teste de regressão mock fetch | Por corrigir/testar |
| Navegação | Retorno após login só para rota permitida ao papel; URL externa/encodificada rejeitada | Testes roteados e browser | Parcial: testes locais; browser pendente |
| Acessibilidade | Tab/Shift+Tab, foco visível, erro anunciado, mobile/zoom 200%, sem dados privados em screenshots | Browser QA com dados descartáveis | BLOCKED: ambiente browser QA indisponível |

Pré-requisitos: preflight da QA Windows sem tocar em `suitup-postgres`; API em `127.0.0.1:18080`; quatro perfis existentes de QA e duas contas citizen descartáveis; autorização de escrita para criação de fixtures; URL do frontend QA; execução dos scripts por etapas. Não inserir tokens/senhas em ficheiros ou logs. Não limpar dados existentes nem volumes.
