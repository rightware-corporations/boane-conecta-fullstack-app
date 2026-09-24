# WF-01 — mapa de navegação e invariantes

**Branch:** `feat/wf01-screen-architecture` a partir de `feat/cr01-contract-resolution@05ffd40`; dependência em cadeia FE-01 → CR-01 → WF-01. Nenhuma rota abaixo foi adicionada ao React Router neste trabalho.

| Entrada | Destino | Condição |
| --- | --- | --- |
| `/servicos/:slug` | `/municipe/pedidos/iniciar/:serviceId` (S01) | ID vem da ficha pública publicada; ficha não promete tramitação online. |
| `/municipe` ou `/municipe/pedidos` | `/municipe/pedidos/rascunhos` (S08) | Rascunhos são entidade separada dos pedidos submetidos. Corrigir link actual do dashboard para S08. |
| S01 | S02 após POST de draft | Mesmo que 201 represente retoma; guardar ID e ETag devolvidos. |
| S02 | S03 `?step=<stepKey>` | `eligible=true`; chave de etapa válida da definição fixada. |
| S03 | Próximo step S03 ou S04 | PATCH concluído com ETag novo; `stepKey` vem do schema fixado. |
| S04 | S05 | Documentos requeridos ligados e `VALID` ou deixar `/validate` mostrar falhas explícitas. |
| S05 | S03/S04 para corrigir; S06 para enviar | Validação actual `valid=true`, aceitação explícita e versão da declaração fixada. |
| S06 | S07 | 201/200 ou estado `SUBMITTED` comprovado por GET; nunca apenas timeout. |
| S07 | `/municipe/pedidos/:requestId` | `requestId` de resposta autorizada ou draft `SUBMITTED`; rota existente só para pedido submetido. |
| S08 | S02/S03/S04/S05, ou S06/S07 se já submetido | GET individual valida proprietário, versão e estado; encaminhar pelo estado conhecido, não por URL armazenada no navegador. |

## Desambiguação das rotas

Implementar rotas literais e com prefixo longo em `App.tsx` antes de `/municipe/pedidos/:id`. React Router v6 atribui prioridade estrutural a segmentos estáticos, mas a ordem explícita comunica a intenção e evita futuras regressões. Rejeitar `/municipe/pedidos/rascunhos/:draftId` sem etapa (link existente no dashboard) via resolução da etapa após GET; não permitir que `rascunhos` ou `iniciar` sejam interpretados como ID de pedido. Validar `:serviceId`, `:draftId`, `:requestId` como UUID antes das consultas e não transformar uma resposta 404 numa redireção para `:id`.

Em FE-03 estender `frontend/src/lib/auth-navigation.ts` com lista fechada de rotas citizen S01–S08, aceitando apenas parâmetros UUID e `stepKey` de schema validado **após** login; para query string, permitir só `step`, codificação normal e sem URL absoluta, slash codificado ou caracteres de controlo. Acrescentar testes de retorno ao destino, papel staff, IDs inválidos e origem externa. FE-01 já limita o regresso, mas não reconhece os caminhos profundos dos rascunhos. Uma rota desconhecida vai para o fallback citizen, nunca para um endereço externo. `ProtectedRoute` deve mostrar recuperação de sessão; `RoleGuard` deve negar qualquer utilizador sem papel `municipe`; a autorização final continua no backend por proprietário.

## Estados de navegação e persistência

| Situação | Próximo destino / política |
| --- | --- |
| Reload de S02–S05 | GET do draft e ETag; obter definição da versão fixada; se não acessível, estado incompatível sem reconstrução de campos. |
| Clique anterior após escrita | ETag corrente; recolher dados não guardados antes de abandonar; não repetir mutação em segundo plano. |
| Logout ou troca de conta | Apagar cache de draft, conteúdo de formulário, chave de submissão e dados pessoais mantidos em memória; revalidar proprietário no servidor ao regressar. |
| Sessão expirada durante GET | Refresh da camada FE-01 uma vez ou login; rota de retorno sanitizada. |
| Sessão expirada durante POST/PUT/PATCH/DELETE | Cliente FE-01 não repete escritas depois do refresh; estado não confirmado, voltar por GET após reautenticação; manter mesma intenção de submit, nunca criar outra key automaticamente. |
| Draft `EXPIRED`/`ABANDONED` | Página de indisponibilidade com caminho para lista/catálogo; não escrever nele. |
| Draft `SUBMITTED` | Ir para S07 somente se GET próprio confirmar request; caso contrário S06 para resolução. |

**Invariante principal:** apenas o submit da versão fixada do draft através de `POST /api/v1/citizen/request-drafts/{draftId}/submit`. `POST /api/v1/citizen/requests` é legado e não integra o wizard. S08 usa `GET /api/v1/citizen/request-drafts` adicionado em CR-01. Especificação de estados excepcionais em [STATES_AND_ERRORS](BOANE_CONECTA_WF01_STATES_AND_ERRORS.md).
