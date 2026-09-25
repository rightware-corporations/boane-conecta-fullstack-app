# FE-03b — C2: contrato confirmado e limites do schema

**Fonte executável:** `FormDefinitionValidator`, `DynamicAnswerValidator`, `EligibilityService`, `DraftValidationService`, `CitizenRequestDraftController`, DTOs de versão/draft. Conferido no HEAD FE-03a `c040816c...`. Não corresponde a dados municipais efectivamente publicados no ambiente QA.

## Forma que a API aceita

`RequestDefinitionVersionResponse.schema` é JSON object com `steps: [{key,title,fields:[{key,type,label,...}]}]`; step key e field key são únicos (field key global). Ordem do array é a ordem publicada. `eligibility` é array de rules JSON; `documentRequirements` é array. O backend de publicação exige chave/título dos steps e chave/tipo/label dos campos, mas não valida opções/condições/labels de elegibilidade nem estrutura de endereço. `GET /citizen/services/{serviceId}/request-definition` só serve a versão publicada actual. `GET /citizen/request-drafts/{id}` entrega IDs de versões fixadas e ETag `"<version>"`, mas não entrega schema fixado (C1).

| Tipo backend | Valor aceite em `PATCH answers` | Regra de UI FE-03b |
| --- | --- | --- |
| `SHORT_TEXT`, `LONG_TEXT`, `EMAIL`, `PHONE`, `DATE`, `SINGLE_SELECT` | JSON string ou null | Inputs nativos; select exige `options` publicadas com strings ou `{value:string,label:string}`. Backend valida apenas tipo, e no `/validate` valida email e `minLength`/`maxLength` de strings. |
| `INTEGER` | JSON inteiro ou null | Controlo numérico inteiro; não enviar representação string. |
| `DECIMAL` | JSON number ou null | Controlo numérico; não enviar string/NaN. |
| `MULTI_SELECT` | JSON array ou null | Checkboxes de opções publicadas; o backend não valida membros, a UI restringe às opções declaradas. |
| `BOOLEAN` | JSON boolean ou null | Selecção explícita Sim/Não (falso não equivale a omissão). |
| `ADDRESS` | JSON object ou null | **BLOCKED para edição.** O backend só verifica `isObject()`; não existe contrato de propriedades, labels nem obrigatoriedade de subcampos. O parser identifica o tipo, mas bloqueia a edição da etapa afectada e preserva o rascunho. Requer definição explícita de componentes de endereço publicada e validada no backend. |

A UI suporta apenas campos com labels válidos e opções rotuladas; schema insuficiente produz indisponibilidade honesta. `required` default false, `minLength`/`maxLength` apenas quando inteiros. `visibleWhen` é `{field: string,equals: JSON escalar}` e corresponde por igualdade JSON exacta ao valor da resposta. Ausência significa visível. `hiddenValuePolicy` assume `CLEAR_ON_HIDE` quando omitida; aceita `CLEAR_ON_HIDE` e `PRESERVE_ON_HIDE`. O backend limpa valor oculto na fusão da etapa editada. FE-03b restringe a fusão a chaves dessa etapa: uma escrita na etapa A não limpa nem sobrescreve valores de B. Valores ocultos de outras etapas podem permanecer armazenados até edição da própria etapa; a validação final ignora os campos invisíveis. Publicações com condições interetapas requerem política futura explícita de limpeza e revisão do snapshot.

`eligibility` backend contém `{key,operator?,expected?,required?,blocking?,failureMessage?}`. Operadores reais: `EQUALS`, `NOT_EQUALS`, `TRUTHY`, `IN`; `required` e `blocking` default true. Avaliação devolve `{eligible,blockingReasons,advisories}`. O backend não exige nem valida texto de pergunta. FE-03b só renderiza regra com `label` textual publicado; `TRUTHY` recebe escolha booleana explícita; restantes operadores exigem `expected` escalar (ou array escalar em `IN`) e `options` rotuladas. Regras sem essas propriedades são **BLOCKED** na etapa S02, sem inferir critérios da chave. O frontend nunca calcula elegibilidade como prova: só o resultado do `PUT /eligibility` 200+ETag pode habilitar avanço, salvo lista de regras vazia, que o backend não exige validar.

## Escrita e concorrência

`PUT /citizen/request-drafts/{id}/eligibility` envia `{answers: object}` e `PATCH /citizen/request-drafts/{id}/answers` envia `{stepKey,answers: object}`. Ambos usam `If-Match` exactamente como o ETag recebido; 200 com novo ETag e draft é a única confirmação. 409 conserva alterações locais e mostra valores locais/servidor para decisão explícita. 401/timeout não causam replay automático. `PATCH` inclui só keys editadas da etapa e visíveis; o backend rejeita keys de outra etapa (fix FE-03b). Nenhum autosave é anunciado. A sessão e a cache do frontend não substituem o lookup por proprietário do backend.

**C1 continua pendente:** se serviceVersionId ou formVersionId do draft diferir da definição publicada actual, S02/S03 recusam renderizar novo schema. O endpoint protegido de leitura da definição fixada foi adiado para FE-04a conforme plano aprovado. Sem C1 não é possível retomar plenamente versões antigas. **Não migrar respostas.**
