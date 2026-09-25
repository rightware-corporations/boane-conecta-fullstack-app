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

export const isUuid = (value: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
