import { isUuid } from './types';

// One unresolved intent per citizen/draft and browser tab. No tokens, form answers,
// document metadata or declaration text are stored. A missing/corrupt record must
// never silently overwrite a prior uncertain submission.
const prefix = 'boane:request-submit:v1:';
export type SubmissionIntent = Readonly<{
  key: string; draftId: string; accountId: string; etag: string;
  declarationVersion: string; schemaChecksum: string; createdAt: number;
}>;
const storageKey = (accountId: string, draftId: string) => `${prefix}${accountId}:${draftId}`;

export function readIntent(accountId: string, draftId: string): SubmissionIntent | null {
  if (!isUuid(draftId) || !isUuid(accountId)) throw new Error('Conta ou rascunho inválido.');
  const raw = sessionStorage.getItem(storageKey(accountId, draftId));
  if (raw === null) return null;
  try {
    const item = JSON.parse(raw) as SubmissionIntent;
    if (item.accountId !== accountId || item.draftId !== draftId || !isUuid(item.key) ||
        !/^"\d+"$/.test(item.etag) || !item.declarationVersion?.trim() ||
        !item.schemaChecksum?.trim() || !Number.isFinite(item.createdAt)) throw new Error();
    return item;
  } catch { throw new Error('A intenção anterior não pode ser lida. Não crie outra submissão; consulte o estado do rascunho.'); }
}

export function createIntent(accountId: string, draftId: string, etag: string, declarationVersion: string, schemaChecksum: string): SubmissionIntent {
  if (readIntent(accountId, draftId)) throw new Error('Já existe uma intenção pendente para este rascunho.');
  if (!/^"\d+"$/.test(etag) || !declarationVersion.trim() || !schemaChecksum.trim() || !globalThis.crypto?.randomUUID)
    throw new Error('Não é possível criar uma chave segura para a submissão.');
  const item: SubmissionIntent = { key: globalThis.crypto.randomUUID(), accountId, draftId, etag,
    declarationVersion, schemaChecksum, createdAt: Date.now() };
  sessionStorage.setItem(storageKey(accountId, draftId), JSON.stringify(item));
  if (readIntent(accountId, draftId)?.key !== item.key) throw new Error('Não foi possível conservar a intenção. Nenhum pedido foi enviado.');
  return item;
}

export function clearIntent(accountId: string, draftId: string): void {
  sessionStorage.removeItem(storageKey(accountId, draftId));
}
export function clearSubmissionIntents(): void {
  for (let index = sessionStorage.length - 1; index >= 0; index--) {
    const key = sessionStorage.key(index);
    if (key?.startsWith(prefix)) sessionStorage.removeItem(key);
  }
}
