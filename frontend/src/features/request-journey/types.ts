// Mirrors the citizen request DTOs; schema/eligibility remain unknown until FE-03b.
export type DraftStatus = 'IN_PROGRESS' | 'READY_FOR_REVIEW' | 'SUBMITTING' | 'SUBMITTED' | 'EXPIRED' | 'ABANDONED';

export interface RequestDefinition {
  serviceId: string;
  serviceVersionId: string;
  formVersionId: string;
  status: string;
  serviceTitle: string;
  serviceDescription: string | null;
  processingTime: string | null;
  onlineSubmissionEnabled: boolean;
  schema: unknown;
  eligibility: unknown;
  documentRequirements: unknown;
  declarationVersion: string;
  declarationText: string;
  schemaChecksum: string;
}

export interface RequestDraft {
  id: string;
  serviceId: string;
  serviceVersionId: string;
  formVersionId: string;
  status: DraftStatus;
  currentStepKey: string;
  answers: Record<string, unknown>;
  eligibilityAnswers: Record<string, unknown>;
  eligibilityResult: unknown | null;
  version: number;
  lastSavedAt: string | null;
  expiresAt: string;
  submittedRequestId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type DraftDetail = { draft: RequestDraft; etag: string };

export type DocumentStatus = 'PENDING' | 'VALID' | 'REJECTED' | 'QUARANTINED' | 'SCANNING' | 'INFECTED' | 'ERROR';
export interface CitizenDocument { id: string; originalFileName: string; mimeType: string; fileSize: number | null; status: DocumentStatus }
export interface DraftDocument { linkId: string; requirementKey: string; documentId: string; title: string; originalFileName: string; detectedMimeType: string; fileSize: number | null; status: DocumentStatus }
export interface ValidationIssue { stepKey: string | null; fieldKey: string | null; requirementKey: string | null; code: string; message: string }
export interface DraftValidation { valid: boolean; fieldErrors: ValidationIssue[]; documentErrors: ValidationIssue[]; globalErrors: ValidationIssue[]; draft: RequestDraft }
export interface SubmissionResponse { requestId: string; reference: string; status: string; submittedAt: string; replayed: boolean }
export interface SubmittedRequestDetail { id: string; reference: string; status: string; statusLabel: string; submittedAt: string }

export const isUuid = (value: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
