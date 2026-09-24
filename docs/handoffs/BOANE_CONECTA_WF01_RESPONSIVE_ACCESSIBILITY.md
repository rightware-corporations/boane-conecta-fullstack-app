# WF-01 — wireframes, medidas e acessibilidade

**Referências:** `BOANE_CONECTA_DESIGN_UX_CONSTITUTION_V1.md`, `BOANE_CONECTA_RESPONSIVE_WIREFRAME_ATLAS_V1.md`, `frontend/src/index.css`, `CitizenShell.tsx`, `CitizenLayout.tsx`. Isto é especificação visual; os oito ecrãs do wizard ainda não existem na aplicação. [Protótipo autónomo](wf01-assets/wireframes.html) e capturas de projecto em `wf01-assets/` não representam QA de produção nem dados municipais reais.

## Wireframe funcional por ecrã

| Ecrã | Ordem vertical a 320–430px | Composição a 768–1920px |
| --- | --- | --- |
| S01 | cabeçalho do serviço → disponibilidade real → descrição publicada → iniciar/retomar → ver rascunhos | leitura centrada, metadados publicados adjacentes apenas se há dados; ação ao lado do conteúdo em viewport amplo. |
| S02 | título → progresso → perguntas publicadas → resultado → verificar/voltar | coluna de perguntas até 720px, motivos junto do resultado, sem grid de cartões. |
| S03 | título e etapa textual → aviso de guarda → campos do step → ajuda/erros → guardar/continuar | formulário 640–800px, um campo por linha salvo grupo semântico; progresso sem barra percentual fabricada. |
| S04 | título → requisito → selecionar ficheiro → estado scanner → próximo requisito → avançar | linhas de requisitos com coluna estado/ação, leitura principal até 800px; não tabela deslizante no móvel. |
| S05 | título → resumo de elegibilidade/etapas/anexos → declaração → checkbox → verificar → avançar | resumo em secções com divisas, máximo 800px; links “Editar” alinhados ao título. |
| S06 | título → progresso de resolução → resultado confirmado/incerto → consultar novamente | conteúdo centrado e curto; sem falso recibo ou botão “Enviar de novo” com key nova. |
| S07 | título → referência real → data/estado real → abrir pedido → voltar | confirmação em coluna de leitura, referência quebra linha quando necessário. |
| S08 | título → listagem própria ou vazio → cada linha com estado/expiração → continuar | lista de linhas, não grade de cartões; ordem por `updatedAt` da API. |

## Larguras de referência e geometria proposta

O protótipo acompanha os breakpoints efectivos de `CitizenShell`: abaixo de `tb` há navegação inferior; de 768px em diante sidebar 256px. Calcula-se área útil = largura − sidebar − 2×gutter; cap do conteúdo citizen 1280px, formulário 720px. Números abaixo são **metas de layout**, não medições do wizard real.

| Viewport | Shell | Gutter | Área útil máxima (px) | Formulário (px) | Organização |
| ---: | --- | ---: | ---: | ---: | --- |
| 320 | nav inferior | 16 | 288 | 288 | uma coluna; ações em pilha, texto quebra; mínimo 44px. |
| 375 | nav inferior | 16 | 343 | 343 | uma coluna, status acima das ações. |
| 390 | nav inferior | 16 | 358 | 358 | uma coluna, scroll vertical. |
| 430 | nav inferior | 16 | 398 | 398 | uma coluna, sem menu lateral. |
| 768 | sidebar 256 | 24 | 464 | 464 | uma coluna de leitura; evitar painel lateral da etapa. |
| 1024 | sidebar 256 | 32 | 704 | 704 | uma coluna, títulos com quebra. |
| 1280 | sidebar 256 | 32 | 960 | 720 | centralizar tarefa, espaço lateral livre. |
| 1440 | sidebar 256 | 32 | 1120 | 720 | centralizar tarefa; sem esticar inputs. |
| 1920 | sidebar 256 | 32 | 1280 (cap) | 720 | centralizar e limitar comprimento de linha. |

O [esquema vectorial de nove larguras](wf01-assets/viewport-schematics.svg) mostra estas proporções planeadas; o [protótipo HTML](wf01-assets/wireframes.html) tem parâmetros `?screen=S01`…`S08`. O Chromium disponível pela dependência Playwright apontou para binário inexistente na tentativa de renderização local; portanto **não há capturas de browser nem reflow medido**. Verificar browser real do produto ao implementar: scrollbar horizontal 0 a 320px e a 200% zoom, inclusive teclado móvel e texto longo vindo de definição real. O HTML conceptual não comprova comportamento da aplicação.

## Teclado, foco e leitores de ecrã

1. Tab percorre skip link → navegação → título/aviso → campos por ordem do schema → erro/ajuda associados → ação primária; Shift+Tab inverte sem armadilha. Foco visível com `ring` do tema e contraste verificado no browser final; não usar só cor ou ícone para erro/status.
2. Ao mudar de etapa, focar `#main-content` ou H1; ao falhar validação, focar `ValidationSummary` e permitir âncoras que foquem campos concretos. Após salvar, anunciar “Guardado” em região `aria-live=polite`; 409, documento rejeitado e erro global em `role=alert` sem interrupções repetidas pelo polling.
3. Checkbox de declaração inicialmente desmarcada, texto legível e versão correcta; input file com nome do requisito. `disabled` explica motivo em texto próximo; o utilizador deve conseguir consultar o estado e voltar mesmo com submit bloqueado.
4. Reflow a 200%: sem perda de conteúdo/acções nem scroll horizontal da página a viewport equivalente 320px; evitar `truncate` para título de serviço, erro, valor e referência. `CitizenLayout` actual trunca H1/subtítulo: FE-03 terá de adaptar cabeçalho da jornada para quebrar linhas sem alterar globalmente outros ecrãs.
5. Nav inferior fixa do `CitizenShell` usa `pb-20`; área de ações da jornada deve respeitar esse espaço e safe area; não sobrepor teclado virtual, avisos ou botão. Em 768px a sidebar não deve roubar espaço ao formulário além dos 256px previstos.
6. Movimento reduzido: sem transições necessárias para compreender progresso/erro. Loading tem texto, não apenas spinner. Capturas não contêm PII, tokens, valores de formulários ou alegados serviços municipais.

**Estado da evidência:** verificações quantitativas do protótipo e screenshots, quando executadas, são registadas no plano e na checklist; QA com utilizadores, browser real autenticado, WCAG auditada e E2E continuam NOT RUN neste Work 03.
