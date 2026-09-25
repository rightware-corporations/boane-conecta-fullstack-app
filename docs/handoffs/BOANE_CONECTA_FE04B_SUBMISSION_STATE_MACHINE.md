# BOANE CONECTA — FE-04b S06/S07, estados e recuperação

Base: PR #9 `813ebe3f01530d22f425b876f4434fdff9e008cf`. Dependências PR #4–#9. O cliente não usa o POST legado `/api/v1/citizen/requests`.

| Estado | Entrada | Acção disponível | Saída |
|---|---|---|---|
| preparing | Entrada de S05 com validação e aceitação; GET próprio e definição fixada, ETag inalterado | Botão de envio explícito | sending, conflict |
| sending | Intenção persistida antes de POST | Nenhum segundo POST | submitted, checking |
| checking | GET próprio após timeout/401/409 ou reload | Aguardar a resposta | submitted, unknown, conflict |
| unknown | GET ainda não confirma commit, ETag preservado e draft editável | Consultar novamente; repetição manual da mesma key/If-Match/payload | checking, sending |
| submitted | POST 201/200 ou GET de draft SUBMITTED seguido de GET de pedido próprio | S07 reconstrói GETs no reload | Terminal |
| conflict | ETag/declaração/expiração/status incompatível ou 409 | Consultar estado; voltar à revisão somente sem intenção pendente | checking, preparing |

### Contrato de intenção

`sessionStorage` por aba, chave `boane:request-submit:v1:{accountId}:{draftId}`. Conteúdo: `{key,draftId,accountId,etag,declarationVersion,schemaChecksum,createdAt}`. `key` é UUID v4 criptograficamente aleatório. Criar somente após GET prévio e antes de enviar; se storage falhar, bloquear POST. Ao reler conteúdo corrompido, bloquear nova intenção. A intenção persiste após reload e sessão expirada, limpa só após GET comprovado em S07 ou logout explícito. Outra aba tem storage independente; a unicidade do request por source draft e lock/idempotência no backend impede dois pedidos a partir do mesmo draft, mas o cliente não oferece recuperação partilhada entre abas. Não há GET específico da chave: depois de 7 dias de retenção do registo backend, resolver manualmente antes de tentar de novo. Privacidade: UUID/ETag/metadados da declaração continuam acessíveis a scripts da mesma origem; XSS é um risco herdado, assim como tokens em localStorage.

### Ecrã de confirmação

GET `/citizen/request-drafts/{draftId}` exige dono e status SUBMITTED com `submittedRequestId`; GET `/citizen/requests/{id}` exige o mesmo dono. Só mostra ID, referência, estado e data do detalhe. Em 401/403/404 ou indisponibilidade, apresenta falha de consulta e permite voltar à resolução. O backend aplica `@PreAuthorize(CITIZEN)` e lookup por proprietário; guards React não são prova de isolamento.

### Critérios pendentes de homologação

Executar em QA real com Citizen A/B descartáveis: duas abas com chaves diferentes, retry após commit, 401 real, scanner pendente, ETag alterado, pedido alheio 404, staff 403 e leitura após logout/login. Navegar por teclado e testar reflow/zoom 200%. Não afirmar PASS com mocks.
