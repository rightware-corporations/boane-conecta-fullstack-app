# WF-01 — arquitectura e contratos de componentes TypeScript

**Natureza:** interfaces de implementação propostas; nenhum tipo foi acrescentado ao frontend em WF-01. Conferir `backend/.../RequestDraftResponse.java`, `RequestDefinitionVersionResponse.java`, `DraftValidationResponse.java`, `DraftDocumentResponse.java`, `RequestSubmissionResponse.java` ao codificar. O JSON é envolvido por `ApiResponse<T>`. Não criar domínio paralelo.

```ts
type UUID = string; // validar formato à entrada de rotas e IDs da API
type ETag = string; // valor exacto da resposta HTTP, incluindo aspas: "7"
type DraftStatus = 'IN_PROGRESS' | 'READY_FOR_REVIEW' | 'SUBMITTING' | 'SUBMITTED' | 'EXPIRED' | 'ABANDONED';
type ScanStatus = 'RECEIVED' | 'SCANNING' | 'VALID' | 'REJECTED' | 'EXPIRED' | 'REPLACED' | 'ARCHIVED';
type Envelope<T> = { success: boolean; message: string; data: T; errors?: unknown };

interface Draft {
  id: UUID; serviceId: UUID; serviceVersionId: UUID; formVersionId: UUID;
  status: DraftStatus; currentStepKey: string; answers: Record<string, unknown>;
  eligibilityAnswers: Record<string, unknown>; eligibilityResult: {
    eligible: boolean; blockingReasons: string[]; advisories: string[];
  } | null;
  version: number; lastSavedAt: string | null; expiresAt: string;
  submittedRequestId: UUID | null; createdAt: string; updatedAt: string;
}
interface Definition {
  serviceId: UUID; serviceVersionId: UUID; formVersionId: UUID;
  status: 'PUBLISHED' | string; onlineSubmissionEnabled: boolean;
  schema: { steps: Array<{ key: string; title: string; fields: Field[] }> };
  eligibility: unknown[]; documentRequirements: Requirement[];
  declarationVersion: string; declarationText: string; schemaChecksum: string;
  serviceTitle: string; serviceDescription: string | null;
  processingTime: string | null;
}
type FieldType = 'SHORT_TEXT' | 'LONG_TEXT' | 'EMAIL' | 'PHONE' | 'DATE' |
  'SINGLE_SELECT' | 'INTEGER' | 'DECIMAL' | 'MULTI_SELECT' | 'BOOLEAN' | 'ADDRESS';
interface Field {
  key: string; type: FieldType; label: string; required?: boolean;
  helpText?: string; options?: unknown[]; visibleWhen?: unknown;
  hiddenValuePolicy?: 'CLEAR_ON_HIDE' | 'PRESERVE_ON_HIDE';
}
interface Requirement {
  key: string; title: string; acceptedMimeTypes: string[]; maxSizeBytes: number;
  required?: boolean;
}
interface ValidationIssue {
  stepKey: string | null; fieldKey: string | null;
  requirementKey: string | null; code: string; message: string;
}
interface Validation {
  valid: boolean; fieldErrors: ValidationIssue[];
  documentErrors: ValidationIssue[]; globalErrors: ValidationIssue[]; draft: Draft;
}
interface DraftDocument {
  linkId: UUID; requirementKey: string; documentId: UUID;
  title: string; originalFileName: string; detectedMimeType: string;
  fileSize: number; status: ScanStatus; attachedAt: string;
}
type DraftSnapshot = { draft: Draft; etag: ETag; definition: Definition | null };
type SaveState = 'idle' | 'editing' | 'saving' | 'saved' | 'unknown' | 'conflict';

interface RequestJourneyShellProps {
  stage: 'start' | 'eligibility' | 'form' | 'documents' | 'review' |
    'submit' | 'confirmation' | 'resume';
  serviceTitle?: string; progress?: { current: number; total: number };
  saveState?: SaveState; error?: string;
  children: React.ReactNode; actions?: React.ReactNode;
}
interface DraftStatusBannerProps { draft: Draft; saveState: SaveState; onRetryRead?: () => void }
interface FieldRendererProps {
  field: Field; value: unknown; error?: string; disabled: boolean;
  onChange(value: unknown): void;
}
interface DocumentScanStatusProps { status: ScanStatus; onRetryRead(): void }
interface ValidationSummaryProps { issues: ValidationIssue[]; focusTargetId(id: string): void }
interface DeclarationAcceptanceProps {
  version: string; text: string; checked: boolean; onChange(checked: boolean): void;
}
type SubmitIntent = {
  draftId: UUID; accountId: UUID; key: string; declarationVersion: string;
  declarationAccepted: true; ifMatch: ETag; createdAt: string;
};
interface SubmissionResolverProps {
  intent: SubmitIntent | null;
  phase: 'preparing' | 'sending' | 'unknown' | 'checking' | 'submitted' | 'conflict';
  onCheck(): void; onRetrySameIntent(): void;
}
```

`Definition` acima resume propriedades consumidas; DTO real também inclui `serviceVersion`, `formDefinitionId`, `formVersion`, `definitionKey`, `name`, `publishedAt`. O schema/eligibility JSON é parcialmente livre: validar shape da versão publicada antes de renderizar. O backend valida alguns campos (`key`, `type`, `label`, `steps`, `acceptedMimeTypes`, `maxSizeBytes`) mas não garante que opções, visibilidade ou perguntas de elegibilidade sejam suficientes para um formulário acessível; formatos não suportados → estado “definição indisponível” e diagnóstico para o editor, sem campo improvisado. `ADDRESS` exige alinhamento do valor aceito pelo validador backend; não subdividir sem contrato. `Definition` só é utilizável com draft se **ambos** `serviceVersionId` e `formVersionId` forem iguais. O endpoint actual `GET /citizen/services/{serviceId}/request-definition` só fornece versão publicada; não fornece versão antiga fixada, ver decisão pendente C1.

## Responsabilidades e limites

| Componente | Entrada e comportamento | Teclado / estado |
| --- | --- | --- |
| `RequestJourneyShell` | Compor `CitizenLayout`, único H1, contexto, progresso textual, alertas e área de ações. S01 antes de login pode estar no shell público; depois, citizen. | `main-content` focável após mudança de rota; no móvel respeitar nav inferior fixa, sem ocultar ações. |
| `DraftStatusBanner` / `DraftSaveState` | Estado `saved` só após 200+ETag; último `lastSavedAt` vem do draft. | `role=status` com anúncios moderados; conflito/erro `role=alert`. |
| `FieldRenderer` | Exaustividade `FieldType`; controlos existentes do design system; `name`/IDs estáveis por `field.key`. | `<label htmlFor>`, ajuda `aria-describedby`, erro `aria-invalid`, foco no primeiro erro; sem placeholder como rótulo. |
| `DocumentRequirementRow` | Provar MIME/tamanho localmente para feedback; backend decide aceitação; ligação separada do upload. | Input ficheiro rotulado; ações “substituir/remover” específicas; scanner anunciado sem alertas a cada poll. |
| `ValidationSummary` | Erros de `/validate` por `stepKey/fieldKey/requirementKey`, links internos para etapas; globais separados. | Foco no resumo após resposta inválida; link ao campo e não apenas scroll. |
| `DeclarationAcceptance` | Texto literal da versão fixada, checkbox desmarcada em cada nova intenção; bloquear ausência de texto. | Checkbox nativa, `label`, espaço ativa, versão identificada sem ocultar conteúdo. |
| `SubmissionResolver` | GET draft → GET request quando submetido; gerir uma intenção com key/payload/If-Match imutáveis até resultado; permitir retry manual apenas da mesma intenção. | `aria-busy` e anúncio discreto; botão duplicado inativo; não navegar para S07 sem confirmação. |

## Camada de dados e segurança

`frontend/src/lib/api.ts` devolve só corpo e actualmente descarta cabeçalhos: FE-03 precisa de uma variante `requestWithMetadata<T>(): Promise<{data:T;etag:ETag | null;status:number}>` para GET/POST/PUT/PATCH/DELETE relevantes, partilhando refresh FE-01 sem replay de escritas. Se o backend disponibilizar `version`, `If-Match` pode ser derivado como `"${draft.version}"`, mas o cliente deve também ler e conferir o `ETag` HTTP; nunca usar versão de um draft diferente. `api.upload` já suporta `FormData` sem `Content-Type` imposto, mas `POST C/documents` não tem chave de idempotência: não repetir upload automaticamente depois de timeout; pedir GET da lista e decisão do utilizador.

Cache React Query por conta+draft+formVersion, invalidada em mutação confirmada, logout e troca de conta. Guardar respostas não confirmadas apenas em memória da sessão activa; se for preciso sobrevivência a reload, introduzir armazenamento cifrado/limitado **após** decisão de segurança. Para a intenção de submissão, persistir só mínimo por conta/draft para resolver timeout/reload, com política de expiração e remoção após estado confirmado, sem tokens/declaração textual/respostas; escolher armazenamento após revisão de ameaça, já que tokens FE-01 usam `localStorage`. Gerar key aleatória criptográfica uma vez, nunca gerar outra após 401/timeout. No reload sem key mas com estado não confirmado, ler draft e pedido; não permitir submit novo até reconciliação explícita.
