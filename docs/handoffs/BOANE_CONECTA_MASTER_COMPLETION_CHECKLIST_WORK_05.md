# BOANE CONECTA — Master Completion Checklist, WORK 05 / FE-03b

**Base:** FE-03a PR #7 `c040816c53d35ff2caaa51efb5d528c1e7f6cb5a`; cadeia #4 → #5 → #6 → #7 → FE-03b. Não modificar main nem fundir PRs. Documentos CR-01, WF-01 e relatório FE-03a continuam fonte de contexto.

## Implementação

- [x] Confirmar HEADs, ler contratos e auditar validators/controller/DTO; documentar C2 em `BOANE_CONECTA_FE03B_SCHEMA_CONTRACT_C2.md`.
- [x] S02/S03 sob rotas CITIZEN; validar UUID e `stepKey`; definição publicada só se ambos IDs coincidem com as versões fixadas.
- [x] S02 perguntas publicadas com labels/opções suficientes; PUT If-Match; usar resultado real de elegibilidade e alertas; impedir avanço após inelegibilidade.
- [x] S03 renderer tipado para tipos com contrato publicável, ordem do schema, campos condicionais, save manual PATCH somente da etapa, ETag confirmado.
- [x] Em 409 preservar edição local; consultar draft actual e exigir decisão manual. Em 401/timeout não repetir PUT/PATCH.
- [x] Backend limita PATCH e CLEAR_ON_HIDE à etapa activa, rejeitando chave de etapa alheia, com teste.
- [x] `ADDRESS` sem estrutura e elegibilidade sem label/opções bloqueados de forma honesta; não usar JSON fabricado nem critérios municipais inventados.
- [ ] Definir e validar contrato de `ADDRESS` para permitir edição acessível; validar também opções/visibilidade/perguntas ao publicar. Condição de completude dos onze tipos.
- [ ] Resolver C1 antes de retoma de versão antiga (FE-04a): endpoint protegido para definição fixada.

## Gates

- [x] Instalação reprodutível `npm ci`, lint, TypeScript, frontend 212/212 testes em 35 ficheiros, build e diff check local PASS; logs no handoff de entrega.
- [ ] Java 21/Maven e backend PostgreSQL/migrations em CI no HEAD remoto; Java local é 17 e Maven não está instalado.
- [ ] CI frontend no HEAD remoto final.
- [ ] QA autenticada com Citizen A/B e verificação browser responsivo/teclado/zoom 200%: NOT RUN enquanto não houver ambiente/contas.

**Conclusão prudente:** FE-03b não é produção pronta; S02/S03 permanecem parcialmente bloqueados pelas definições cuja forma não possui contrato suficiente. Não iniciar FE-04 automaticamente.
