# BOANE CONECTA — Master Completion Checklist, WORK 07 / FE-04b

Base: PR #9 `813ebe3f01530d22f425b876f4434fdff9e008cf`; branch isolada `feat/fe04b-idempotent-submission`. Este documento é uma fotografia de implementação; verificar o relatório de entrega para SHA e CI final.

- [x] S06: GET prévio do draft e definição fixada, aceite S05, ETag, checksum, expiração e versionamento; POST idempotente somente após acção explícita.
- [x] Intenção única por draft/conta/aba; chave crypto UUID persistida antes de POST; nenhum retry automático de mutações.
- [x] Estados `preparing`, `sending`, `unknown`, `checking`, `submitted`, `conflict`; consulta após resultado incerto, retry manual com key/payload/If-Match preservados.
- [x] S07: confirmação durável por GET de draft submetido e GET de pedido próprio, mostrando somente os quatro campos autorizados.
- [x] S05 liga à submissão apenas após validação/aceitação; resolver rascunho SUBMITTED liga à confirmação. Rotas CITIZEN e retorno pós-login limitado.
- [x] Contratos REST, estados e segurança actualizados; testes frontend para HTTP 201/200, timeout, reload, 401, 409, dupla acção, 404 e rotas.
- [x] CI frontend do commit de implementação `8a1289aa1457118550c1acc472620c1116d6f110`: run [36163320517](https://github.com/rightware-corporations/boane-conecta-fullstack-app/actions/runs/36163320517) PASS (npm ci, lint, TypeScript, testes, build). O estado do HEAD documental final é registado no relatório de entrega.
- [ ] QA autenticada integrada Citizen A/B e staff, 401/403 reais, concorrência entre abas, scanner, acessibilidade e browser: NOT RUN sem ambiente autorizado/contas descartáveis.
- [ ] Revisão humana e homologação das PRs encadeadas; nenhuma PR fundida automaticamente.
