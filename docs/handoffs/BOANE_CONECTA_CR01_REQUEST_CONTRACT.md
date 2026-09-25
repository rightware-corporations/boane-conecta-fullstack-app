# CR-01 — contrato real da jornada de pedidos municipais

**Base de leitura:** `backend/src/main/java/mz/gov/boaneconecta/{municipalservices/forms,requests,documents}`, `SecurityConfig`, `GlobalExceptionHandler`, migrations V4 e V9–V12. Branch depende de FE-01 `b4dcf67`; este documento descreve código, não garante que haja dados municipais publicados em QA. Envelope: `ApiResponse<T> {success,message,data,errors}`. Token `Bearer` para endpoints citizen/admin; não acrescentar dados ou critérios municipais por inferência.

## Publicação e versão

- Catálogo público `GET /api/v1/public/services[/{slug}]` mostra somente serviços `PUBLISHED`; uma ficha não garante disponibilidade de submissão digital.
- `GET /api/v1/citizen/services/{serviceId}/request-definition` devolve `RequestDefinitionVersionResponse` com IDs/versões de serviço e formulário, `schema`, `eligibility`, `documentRequirements`, `declarationVersion/text`, checksum, `onlineSubmissionEnabled`. Só há um formulário `PUBLISHED` por definição e uma service version `PUBLISHED` por serviço (índices parciais V9); após este ramo, o serviço de catálogo também tem de estar `PUBLISHED`.
- Só ADMIN/SUPER_ADMIN criam `POST /api/v1/admin/services/{serviceId}/request-definitions/versions` e publicam `POST .../versions/{versionId}/publish`. O serviço valida schema/eligibility/documentos, retira as versões anteriores de publicação e publica o par service/form. A versão fica imutável para drafts antigos por FK; não editar JSON de versões já referenciadas.
- Não existe endpoint público para adquirir uma definição anónima; S01 mostra catálogo público e autentica antes de obter a definição citizen. Serviço sem definição/online/submissão → 404/indisponível honesto.

## Contratos REST citizen

| Operação | Pedido | Resposta e estado |
| --- | --- | --- |
| `POST /api/v1/citizen/request-drafts` | `{serviceId, resumeExisting?:boolean}`; default true | 201 com `RequestDraftResponse` e `ETag: "<version>"`; encontra draft do próprio utilizador para serviço/form version atual se retomável; caso contrário cria com versões fixadas, primeiro `currentStepKey`, expiração por TTL 90d default. Mesmo ao retomar, devolve 201; cliente deve tratar como pronto, não como prova de criação nova. |
| `GET /api/v1/citizen/request-drafts` | Sem parâmetros | 200 lista de `IN_PROGRESS`/`READY_FOR_REVIEW` do proprietário, não expirados, ordenados por `updatedAt DESC`. **Adicionado em CR-01** para S08, reutilizando query existente; não retorna drafts de outro cidadão. |
| `GET /api/v1/citizen/request-drafts/{draftId}` | ID UUID próprio | 200 + ETag; mostra `status`, `currentStepKey`, answers, eligibility, versões, `expiresAt`, `submittedRequestId`. Outro dono/inexistente → 404. Pode retornar expirado/submetido para resolver estado; não implica editabilidade. |
| `PUT /{draftId}/eligibility` | `If-Match: "<version>"`; `{answers: object}` | 200 draft/ETag; avaliação gera `eligible`, `blockingReasons`, `advisories` a partir de regras publicadas; não inventar perguntas. |
| `PATCH /{draftId}/answers` | If-Match; `{stepKey,answers: object}` | 200 draft/ETag; merge parcial por keys do schema, tipos verificados e `CLEAR_ON_HIDE`. Atualiza `currentStepKey`; cliente só considera sucesso ao obter novo ETag. |
| `POST /api/v1/citizen/documents` | multipart conforme `CitizenDocumentController` | Devolve documento em estado de scanner; usar lista/get para verificar `VALID` antes de anexar. MinIO/ClamAV são parte do backend existente. |
| `PUT /{draftId}/documents/{requirementKey}` | If-Match; `{documentId}` | 200 `DraftDocumentMutationResponse` + ETag; exige documento próprio `VALID`, MIME e tamanho aceites no requisito publicado; substitui ligação ativa da mesma key. DELETE mesmo caminho+If-Match desanexa. GET `/{draftId}/documents` lista anexos ativos. |
| `POST /{draftId}/validate` | If-Match | 200 `DraftValidationResponse` com `valid`, `fieldErrors`, `documentErrors`, `globalErrors` e draft/ETag; se válido marca `READY_FOR_REVIEW`. Valida campos obrigatórios/condicionais, documento `VALID`, elegibilidade. Não equivale a submissão. |
| `POST /{draftId}/submit` | If-Match; `Idempotency-Key` não vazio até 200 caracteres; `{declarationVersion,declarationAccepted:true}` | 201 primeira submissão, 200 replay; `RequestSubmissionResponse {requestId,reference,status,submittedAt,replayed}`. A declaração deve corresponder à versão fixada; valida novamente; numa transação cria snapshot, `citizen_requests`, documento links, histórico, outbox e completa registro idempotente. |
| `GET /api/v1/citizen/requests[/{requestId}]` | Bearer CITIZEN | Lista/detalhe do proprietário com referência/status/linha temporal/documentos seguros. GET draft após timeout: se `SUBMITTED`, seguir `submittedRequestId` para detalhe; se incerto, repetir **o mesmo** submit com a mesma key/payload, nunca uma key nova automaticamente. |

Todas as rotas de draft/submit são `@PreAuthorize(CITIZEN)` e usam lookup por proprietário. `If-Match` aceita o parser `VersionHeaderParser`; 409 para versão divergente, expiração, definição/declaração alterada e chave idempotente reutilizada com payload diferente; 400 para dados inválidos, 401 sem sessão, 403 papel errado, 404 ID inacessível/ausente. `GlobalExceptionHandler` fornece envelope de erro; erros detalhados de campos só em `/validate` no DTO estruturado. Não tratar 409 como sucesso.

## Resolver após timeout e concorrência

Persistir por draft a key de uma intenção de submit no cliente até resolver o resultado. Após falha de rede, `GET /request-drafts/{id}`: `SUBMITTED` + `submittedRequestId` → `GET /requests/{id}` e sucesso; ainda editável → retry da **mesma key** e declaração, ou mostrar estado pendente antes de tentar; 409 → recarregar draft/versão e reconciliar sem criar outro pedido. A tabela `idempotency_records` tem unicidade por `(citizen_user_id,operation,key_hash)` e estado `IN_PROGRESS/COMPLETED`; em transação concluída, replay devolve recurso existente; em operação concorrente 409. Não existe endpoint dedicado de consulta de idempotency key: usar draft/requests com lookup por proprietário. Não usar o `POST /api/v1/citizen/requests` legado (Deprecation/Sunset) para o wizard.

`@Version` no draft e ETag/If-Match protegem escritas concorrentes; em 409 o cliente mantém as respostas locais e oferece recarga/reconciliação, sem overwrite silencioso. Drafts `SUBMITTED`, `EXPIRED` ou `ABANDONED` não são editáveis. Reedição após `READY_FOR_REVIEW` regressa a `IN_PROGRESS`. A validação de documentos usa o status atual `VALID`; scanner `RECEIVED/SCANNING/REJECTED/EXPIRED` impede anexar/submeter. A política de retenção/TTL vem da configuração, não de um requisito municipal inventado.

## Lacunas comprovadas e decisões

1. Descoberta de drafts para S08 faltava apesar da query `findByCitizenUserAndStatusInOrderByUpdatedAtDesc` já existir: adicionada lista apenas de retomáveis/proprietário, sem migration.
2. A definição digital podia ser consultada se `MunicipalService.status=DRAFT`: bloqueada em `requirePublishedVersion`; não altera versões ou drafts históricos.
3. Nenhuma API de formulário público antes de login, nenhum builder FE, nenhuma Work Queue FE e nenhuma API de provisionamento staff. Permanecem escopo de implementação/decisão futuros.
4. `createOrResume` só retoma draft da **mesma versão atual**; drafts antigos continuam legíveis via GET mas não aparecem como retomados na nova criação. Política de migração/abandono quando a definição muda precisa de decisão do produto; não migrar JSON automaticamente.
5. Backend lista globalmente pedidos para papéis internos autorizados e aceita status sem matriz de transições explícita no serviço; definir scope/transições por decisão de domínio antes de expor processamento completo. Não atribuir permissão apenas pelo nome MANAGER/EMPLOYEE.

## FE-04a / C1: definição fixada e documentos (2026-09-25)

`GET /api/v1/citizen/request-drafts/{draftId}/definition` exige autenticação CITIZEN. O serviço primeiro procura o draft por ID **e proprietário**; para ausente ou alheio devolve o mesmo 404. Da relação persistida `draft.formVersion` devolve a versão histórica completa `RequestDefinitionVersionResponse` (incluindo status RETIRED, IDs de service/form, schema, elegibilidade, requisitos documentais, declarationVersion/Text, checksum e publishedAt), sem consultar a publicação actual. Confere ainda que a serviceVersion da formVersion e o serviço pertencem ao mesmo par fixado no draft. Anónimo: 401; outro papel: 403 por `@PreAuthorize`; validação integrada de 401/403/A-B continua dependente de ambiente de QA.

S04 associa documento apenas após `VALID` usando `PUT /{draftId}/documents/{requirementKey}` com `If-Match` e `{documentId}`; `POST /citizen/documents` é uma operação separada cujo 201 **não** significa validação antivírus. `GET /citizen/documents` e `GET /citizen/documents/{id}` consultam o estado; `DELETE /{draftId}/documents/{requirementKey}` remove só a associação. Upload incerto e link 409 exigem consulta antes de nova mutação. S05 usa `POST /{draftId}/validate` com `If-Match`, retorna erros por campo/requisito/global, draft e ETag; validação não submete o pedido. Aceitação da declaração é estado transitório no browser e deve ser repetida após qualquer alteração. FE-04b terá de reconfirmar checksum, declaração, ETag e validade na submissão.
