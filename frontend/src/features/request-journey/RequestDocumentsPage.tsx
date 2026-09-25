import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ApiError } from '@/lib/api';
import { DraftEditStatus } from './DraftEditStatus';
import { parseDocumentRequirements } from './document-requirements';
import type { DocumentRequirement } from './document-requirements';
import { RequestJourneyShell } from './RequestJourneyShell';
import { requestJourneyApi } from './request-journey.api';
import type { CitizenDocument, DraftDetail, DraftDocument } from './types';
import { useDraftDefinition } from './useDraftDefinition';

export default function RequestDocumentsPage() {
  const { draftId = '' } = useParams();
  const { loading, error, detail, definition, retry } = useDraftDefinition(draftId);
  const [snapshot, setSnapshot] = useState<DraftDetail | null>(null);
  const [links, setLinks] = useState<DraftDocument[]>([]);
  const [documents, setDocuments] = useState<CitizenDocument[]>([]);
  const [busy, setBusy] = useState(false);
  const [uncertain, setUncertain] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  let requirements: DocumentRequirement[] = []; let invalid: string | null = null;
  if (definition) try { requirements = parseDocumentRequirements(definition.documentRequirements); }
  catch (cause) { invalid = cause instanceof Error ? cause.message : 'Requisitos indisponíveis.'; }
  useEffect(() => {
    if (!detail || !definition) return;
    let active = true;
    setLoaded(false); setSnapshot(detail); setUncertain(false);
    Promise.all([requestJourneyApi.draftDocuments(draftId), requestJourneyApi.citizenDocuments()])
      .then(([current, owned]) => { if (active) { setLinks(current); setDocuments(owned); setLoaded(true); } })
      .catch(() => { if (active) { setMessage('Não foi possível consultar os documentos. Tente novamente.'); setLoaded(false); } });
    return () => { active = false; };
  }, [detail, definition, draftId]);
  async function refresh() {
    try {
      const [current, owned, fresh] = await Promise.all([requestJourneyApi.draftDocuments(draftId), requestJourneyApi.citizenDocuments(), requestJourneyApi.detail(draftId)]);
      setLinks(current); setDocuments(owned); setSnapshot(fresh); setUncertain(false); setLoaded(true);
      setMessage('Estado actual consultado. Compare os documentos antes de efectuar outra alteração.');
    } catch { setMessage('Não foi possível confirmar o estado. Não repita a operação anterior.'); }
  }
  async function upload(file: File | undefined, requirement: DocumentRequirement) {
    if (!file || busy || uncertain) return;
    if (file.size > requirement.maxSizeBytes || !requirement.acceptedMimeTypes.includes(file.type)) {
      setMessage('O ficheiro seleccionado não corresponde ao tamanho ou tipo indicado.'); return;
    }
    setBusy(true); setMessage('A enviar o ficheiro. A verificação de segurança pode demorar.');
    try {
      const sent = await requestJourneyApi.upload(file);
      setDocuments(current => [sent, ...current.filter(item => item.id !== sent.id)]);
      setMessage(sent.status === 'VALID' ? 'Envio confirmado. O documento pode ser associado.' : 'Envio confirmado. Aguarde pela verificação de segurança antes de associar.');
    } catch {
      setUncertain(true);
      setMessage('Resultado do envio desconhecido. Consulte os seus documentos; não reenvie automaticamente o ficheiro.');
    } finally { setBusy(false); }
  }
  async function mutate(requirement: DocumentRequirement, documentId?: string) {
    if (!snapshot || busy || uncertain) return;
    setBusy(true); setMessage(null);
    try {
      const result = documentId ? await requestJourneyApi.attach(draftId, requirement.key, documentId, snapshot.etag)
        : await requestJourneyApi.detach(draftId, requirement.key, snapshot.etag);
      setSnapshot(result); setLinks(await requestJourneyApi.draftDocuments(draftId));
      setMessage('Associação confirmada pelo servidor. A revisão deverá ser validada novamente.');
    } catch (cause) {
      setUncertain(true);
      setMessage(cause instanceof ApiError && cause.status === 409 ? 'Conflito de versões. Consulte o estado actual e compare antes de decidir.' :
        'Resultado da associação desconhecido ou operação recusada. Consulte o estado actual antes de tentar novamente.');
    } finally { setBusy(false); }
  }
  const base = `/municipe/pedidos/rascunhos/${draftId}`;
  return <RequestJourneyShell title="Documentos do pedido" subtitle={definition?.serviceTitle}>
    <DraftEditStatus loading={loading} error={error} retry={retry} />
    {invalid && <p role="alert">{invalid} Os dados do rascunho foram preservados.</p>}
    {message && <p role={uncertain ? 'alert' : 'status'} className="my-4 border-l-4 border-primary p-3">{message}</p>}
    {uncertain && <Button variant="outline" onClick={refresh} disabled={busy}>Consultar estado actual</Button>}
    {definition && !invalid && !loaded && <p role="status" aria-busy="true">A consultar os documentos...</p>}
    {definition && !invalid && loaded && <div className="space-y-6">
      {requirements.length === 0 && <p role="status">Esta versão não exige documentos.</p>}
      {requirements.map(requirement => {
        const attached = links.find(item => item.requirementKey === requirement.key);
        const candidates = documents.filter(item => item.status === 'VALID' && requirement.acceptedMimeTypes.includes(item.mimeType) && item.fileSize != null && item.fileSize <= requirement.maxSizeBytes);
        return <section key={requirement.key} className="space-y-3 border-b border-border pb-6" aria-label={requirement.title}>
          <h2 className="text-lg font-semibold">{requirement.title}{requirement.required ? ' *' : ''}</h2>
          <p className="text-sm">Tipos aceites: {requirement.acceptedMimeTypes.join(', ')}. Tamanho máximo: {Math.ceil(requirement.maxSizeBytes / 1024 / 1024)} MB.</p>
          {attached && <div role="status"><p>Associado: {attached.originalFileName} ({attached.status}).</p>
            <Button variant="outline" disabled={busy || uncertain} onClick={() => mutate(requirement)}>Remover associação</Button></div>}
          <label className="block font-medium" htmlFor={`upload-${requirement.key}`}>Enviar documento para verificação</label>
          <input id={`upload-${requirement.key}`} type="file" disabled={busy || uncertain} accept={requirement.acceptedMimeTypes.join(',')}
            className="block max-w-full text-sm file:mr-3 file:min-h-11 file:rounded-md file:border file:border-border file:px-3"
            onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; void upload(file, requirement); }} />
          {documents.filter(item => item.status !== 'VALID').map(item => <p key={item.id} className="text-sm" role="status">{item.originalFileName}: {item.status}. Ainda não pode ser associado.</p>)}
          <label className="block font-medium" htmlFor={`choice-${requirement.key}`}>Documento validado disponível</label>
          <select id={`choice-${requirement.key}`} disabled={busy || uncertain || !candidates.length} defaultValue="" key={`${requirement.key}-${documents.map(item => item.id).join(',')}`}
            className="min-h-11 w-full rounded-md border border-input bg-surface p-2"
            onChange={event => { if (event.target.value) void mutate(requirement, event.target.value); event.target.value = ''; }}>
            <option value="">Seleccione para associar</option>{candidates.map(item => <option key={item.id} value={item.id}>{item.originalFileName}</option>)}
          </select>
        </section>;
      })}
      <Button variant="outline" onClick={refresh} disabled={busy}>Actualizar estado dos documentos</Button>
      <Button asChild><Link to={`${base}/revisao`}>Continuar para revisão</Link></Button>
    </div>}
    <Link to={base} className="mt-6 block text-primary underline">Voltar ao rascunho</Link>
  </RequestJourneyShell>;
}
