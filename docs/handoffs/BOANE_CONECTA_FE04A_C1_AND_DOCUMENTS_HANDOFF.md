# BOANE CONECTA — WORK 06 / FE-04a: handoff técnico

Data: 2026-09-25. Base FE-03b PR #8 `694b67e9191167b5b2eac1551b20e1ada65d1eca`; destino de PR `feat/fe03b-dynamic-form`. Cadeia de dependências PR #4 → #5 → #6 → #7 → #8 → FE-04a. `main` verificada em `3b47e1b3609fc8b78ac73c9867d79f3c07255d91` no início, não modificada.

## Entregue no código

- C1: GET owner-scoped `/api/v1/citizen/request-drafts/{draftId}/definition` lê a versão persistida, inclusive RETIRED, preservando schema/elegibilidade/documentos/declaração/checksum. S02/S03/S08 utilizam esta leitura e comparam os três IDs.
- ADDRESS: componentes genéricos publicados `addressFields`; renderer com rótulos/fieldset; PATCH restringe propriedades; validação final verifica os componentes. Publicação reforça opções, condições, perguntas e MIME. Definições antigas sem subcampos não são reinterpretadas.
- S04: rota CITIZEN, upload separado da validação de scanner e associação; lista de documentos próprios, apenas `VALID` candidato, liga/desliga com ETag; depois de timeout/401/409 exige consulta.
- S05: resumo das respostas, elegibilidade e documentos da versão fixada; `/validate` com If-Match e erros detalhados; declaração integral desmarcada inicialmente, apenas habilitada após `valid=true`. Não existe submissão nesta entrega.
- Transporte: multipart FormData sem Content-Type artificial; POST/PUT/DELETE não são repetidos automaticamente após 401. Rotas pós-login continuam fechadas a UUID e destinos CITIZEN.

## Limites e próximos passos

- A autorização por proprietário é aplicada no backend; unit test cobre 404 sem consultar definição alheia. Testes integrados com duas contas descartáveis, anónimo e staff, incluindo 401/403, dependem de QA autorizada e não foram executados aqui.
- Maven não instalado localmente (Java 17); `mvn verify` e PostgreSQL devem ser verificados por GitHub Actions. Não classificar CI como PASS antes de execução concluída.
- E2E: Citizen A inicia draft, Citizen B não consegue ler definição nem documentos; publicar nova versão e retomar draft antigo preservando checksum; scan pendente/rejeitado/VALID; upload timeout; associação 409; validação com campo/requisito em falta; edição invalida aceitação; teclado, foco, 320–1920px e zoom 200%. **Preparados, NOT RUN**.
- Risco residual: aceitação é local; FE-04b deve repassar declaração/versão/checksum e garantir verificação server-side no momento da submissão. O risco de armazenamento de tokens em localStorage herdado de FE-01 persiste. Não iniciar FE-04b automaticamente.
