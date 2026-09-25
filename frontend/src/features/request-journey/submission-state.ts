export type SubmissionPhase = 'preparing' | 'sending' | 'unknown' | 'checking' | 'submitted' | 'conflict';
export type SubmissionEvent = 'send' | 'uncertain' | 'check' | 'confirmed' | 'stale' | 'retryReady' | 'reconcile';
const transitions: Record<SubmissionPhase, Partial<Record<SubmissionEvent, SubmissionPhase>>> = {
  preparing: { send: 'sending', check: 'checking', confirmed: 'submitted', stale: 'conflict' },
  sending: { uncertain: 'unknown', check: 'checking', confirmed: 'submitted', stale: 'conflict' },
  unknown: { check: 'checking', send: 'sending', confirmed: 'submitted', stale: 'conflict' },
  checking: { retryReady: 'unknown', confirmed: 'submitted', stale: 'conflict', uncertain: 'unknown' },
  submitted: {},
  conflict: { check: 'checking', reconcile: 'preparing', confirmed: 'submitted' },
};
export function nextPhase(phase: SubmissionPhase, event: SubmissionEvent): SubmissionPhase {
  const next = transitions[phase][event];
  if (!next) throw new Error(`Transição de submissão inválida: ${phase}/${event}`);
  return next;
}
