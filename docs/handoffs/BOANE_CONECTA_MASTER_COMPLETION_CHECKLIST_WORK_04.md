# BOANE CONECTA — Master Completion Checklist, WORK 04 (FE-03a)

**Dependências:** FE-01 PR #4 → CR-01 PR #5 → WF-01 PR #6 → FE-03a. Base remota WF-01 `94ff14222f4e8efbc419e2d1143476b2a4e05ab9`. Preservar as [checklists de CR-01](BOANE_CONECTA_MASTER_COMPLETION_CHECKLIST_WORK_02.md) e [WF-01](BOANE_CONECTA_MASTER_COMPLETION_CHECKLIST_WORK_03.md). As conclusões abaixo dizem respeito apenas a S01/S08; não são homologação municipal.

## Continuidade e código

- [x] Confirmar HEADs e PRs #4/#5/#6 antes da branch FE-03a; trabalhar isoladamente, sem merge/force push.
- [x] Ler contrato REST/ERD CR-01 e os seis documentos WF-01; comparar com DTOs/controller/frontend reais.
- [x] `api.getWithMetadata`/`postWithMetadata`: corpo, status, ETag exactamente como no header; reutiliza refresh FE-01, GET com um retry e POST sem replay automático.
- [x] Tipar `RequestDefinition`, `RequestDraft` e validar UUID em serviços e parâmetros das rotas novas.
- [x] Adicionar S01 `/municipe/pedidos/iniciar/:serviceId`: definição citizen publicada, `onlineSubmissionEnabled`, POST `resumeExisting:true`, resultado 201, recuperação por lista própria após resultado desconhecido.
- [x] Adicionar S08 `/municipe/pedidos/rascunhos` e `/municipe/pedidos/rascunhos/:draftId`: lista própria, GET individual, comparação das duas versões fixadas, 404 genérico e continuação honestamente pendente.
- [x] Manter `/municipe/pedidos/:id` apenas para pedido submetido; autenticação CITIZEN/guards e lista fechada de retorno após login.
- [x] Corrigir entrada pública da ficha de serviço, ligação de rascunhos no dashboard, títulos longos apenas no layout da jornada, foco após navegação e remount por conta.
- [x] Evitar taxas/prazos/requisitos criados pelo cliente e não navegar para S02–S07 ainda ausentes.

## Gates desta implementação

- [x] Testes de transporte, serviço, componente, guards e rotas acrescentados (incluem 201 de retoma, lista vazia, UUID, 401, timeout, 404, definição incompatível, ETag/status e segurança da rota).
- [x] `npm ci`, lint, `tsc --noEmit`, `npm test`, build e `git diff --check` executados localmente; valores exactos no relatório FE-03a entregue com a PR.
- [ ] CI frontend verde **no HEAD remoto final**: verificar workflow após publicar a PR Draft; não confundir criação do workflow com resultado PASS.
- [ ] QA autenticada em ambiente autorizado com Citizen A/B; isolamento de proprietário continua por comprovar em integração real.
- [ ] Capturas browser, teclado, reflow a 320px e zoom 200% no frontend funcional: NOT RUN nesta execução se ambiente de browser indisponível.

## Próximos trabalhos, não iniciados

- [ ] Resolver CR-01/WF-01 C1: leitura da definição da versão fixada para draft antigo; não migrar respostas silenciosamente.
- [ ] FE-03b S02/S03: campos, elegibilidade, saves com If-Match e 409; requer contrato de schema UI validado.
- [ ] FE-04a/b S04–S07: scanner, revisão, submissão idempotente e confirmação; com testes e QA próprios.
- [ ] QA integrada de jornadas reais com dados municipais publicados, contas descartáveis e políticas de acesso comprovadas.

**Regra de aceitação:** CI no HEAD publicado e revisão da PR permitem avaliar FE-03a para review; não declarar produção pronta nem FE-01/CR-01/WF-01 mergeados por inferência.
