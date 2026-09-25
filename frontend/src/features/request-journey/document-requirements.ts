import { UnsupportedDefinition } from './schema';

export type DocumentRequirement = { key: string; title: string; required: boolean; acceptedMimeTypes: string[]; maxSizeBytes: number };
export function parseDocumentRequirements(raw: unknown): DocumentRequirement[] {
  if (!Array.isArray(raw)) throw new UnsupportedDefinition('Os requisitos documentais não estão disponíveis.');
  const result = raw.map(item => {
    if (!item || typeof item !== 'object') throw new UnsupportedDefinition('Requisito documental inválido.');
    const value = item as Record<string, unknown>;
    if (typeof value.key !== 'string' || !value.key.trim() || typeof value.title !== 'string' || !value.title.trim() ||
        !Array.isArray(value.acceptedMimeTypes) || !value.acceptedMimeTypes.length || !value.acceptedMimeTypes.every(mime => typeof mime === 'string' && mime.trim()) ||
        typeof value.maxSizeBytes !== 'number' || value.maxSizeBytes <= 0)
      throw new UnsupportedDefinition('Um requisito documental não possui contrato utilizável.');
    return { key: value.key, title: value.title, required: value.required === true, acceptedMimeTypes: value.acceptedMimeTypes as string[], maxSizeBytes: value.maxSizeBytes };
  });
  if (new Set(result.map(item => item.key)).size !== result.length) throw new UnsupportedDefinition('Os requisitos documentais repetem uma chave.');
  return result;
}
