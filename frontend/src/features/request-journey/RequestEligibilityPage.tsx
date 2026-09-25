import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ApiError } from '@/lib/api';
import { DraftEditStatus } from './DraftEditStatus';
import { RequestJourneyShell } from './RequestJourneyShell';
import { requestJourneyApi } from './request-journey.api';
import { parseEligibility, UnsupportedDefinition } from './schema';
import type { EligibilityRule } from './schema';
import { useDraftDefinition } from './useDraftDefinition';
import type { DraftDetail } from './types';

function initialAnswers(raw: Record<string, unknown>): Record<string, string> {
  return Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, String(value)]));
}
export default function RequestEligibilityPage() {
  const { draftId = '' } = useParams();
  const { loading, error, detail: loaded, definition, retry } = useDraftDefinition(draftId);
  const [snapshot, setSnapshot] = useState<DraftDetail | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [conflict, setConflict] = useState<DraftDetail | null>(null);
  useEffect(() => { if (loaded) { setSnapshot(loaded); setAnswers(initialAnswers(loaded.draft.eligibilityAnswers)); setConflict(null); setMessage(null); } }, [loaded]);
  let rules: EligibilityRule[] = [];
  let unsupported: string | null = null;
  if (definition) try { rules = parseEligibility(definition.eligibility); } catch (cause) { unsupported = cause instanceof UnsupportedDefinition ? cause.message : 'Definição indisponível.'; }
  const result = snapshot?.draft.eligibilityResult as { eligible?: boolean; blockingReasons?: string[]; advisories?: string[] } | null;
  const dirty = !!snapshot && rules.some(rule => String(snapshot.draft.eligibilityAnswers[rule.key] ?? '') !== (answers[rule.key] ?? ''));
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  async function check() {
    if (!snapshot || saving || conflict) return;
    const missing = rules.find(rule => rule.required && !answers[rule.key]);
    if (missing) { setMessage(`Responda à pergunta: ${missing.label}.`); document.getElementById(`elig-${missing.key}`)?.focus(); return; }
    const payload = Object.fromEntries(rules.filter(rule => answers[rule.key]).map(rule => {
      const raw = answers[rule.key];
      const numeric = typeof rule.expected === 'number' || Array.isArray(rule.expected) && rule.expected.some(expected => typeof expected === 'number');
      const value = raw === 'true' ? true : raw === 'false' ? false : numeric ? Number(raw) : raw;
      return [rule.key, value];
    }));
    setSaving(true); setMessage(null);
    try { setSnapshot(await requestJourneyApi.saveEligibility(draftId, snapshot.etag, payload)); }
    catch (cause) {
      if (cause instanceof ApiError && cause.status === 409) {
        try { setConflict(await requestJourneyApi.detail(draftId)); setMessage('O rascunho foi alterado noutra sessão. Compare as respostas antes de substituir.'); }
        catch { setMessage('Há um conflito; não foi possível consultar a versão actual. As respostas locais foram preservadas.'); }
      } else {
        try { const fresh = await requestJourneyApi.detail(draftId); if (fresh.etag !== snapshot.etag) setConflict(fresh); }
        catch { /* A escrita pode ter ocorrido; não a repetir automaticamente. */ }
        setMessage('Não foi possível confirmar a gravação. Verifique o rascunho antes de tentar novamente.');
      }
    } finally { setSaving(false); }
  }
  return <RequestJourneyShell title="Elegibilidade" subtitle={definition?.serviceTitle}>
    <DraftEditStatus loading={loading} error={error} retry={retry} />
    {unsupported && <p role="alert">{unsupported} A edição desta etapa está indisponível.</p>}
    {snapshot && !unsupported && <div className="space-y-6">
      {rules.length === 0 ? <p role="status">Esta definição não publica perguntas de elegibilidade. Pode abrir o formulário.</p> : <>
        <p className="text-sm text-muted-foreground">Responda às perguntas publicadas para verificar se pode continuar.</p>
        {rules.map(rule => <div key={rule.key} className="space-y-2">
          <label htmlFor={`elig-${rule.key}`} className="block font-medium">{rule.label}{rule.required ? ' *' : ''}</label>
          <select id={`elig-${rule.key}`} className="min-h-11 w-full rounded-md border border-input bg-surface px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={answers[rule.key] ?? ''} disabled={saving || !!conflict} onChange={event => { setAnswers(prev => ({...prev,[rule.key]: event.target.value})); setMessage(null); }}>
            <option value="">Seleccione uma resposta</option>{rule.options.map(option => <option value={option.value} key={option.value}>{option.label}</option>)}
          </select>
        </div>)}
        <Button onClick={check} disabled={saving || !!conflict}>{saving ? 'A verificar...' : 'Verificar elegibilidade'}</Button>
      </>}
      {message && <p role="alert" className="border-l-4 border-warning p-3">{message}</p>}
      {conflict && <div role="alert" className="space-y-3 border-l-4 border-warning p-4">
        <p>Versão actual do servidor: {conflict.draft.version}. As suas respostas desta página continuam visíveis e não foram enviadas novamente.</p>
        <Button variant="outline" onClick={() => { setSnapshot(conflict); setConflict(null); setMessage('Compare as respostas e volte a verificar manualmente.'); }}>Manter respostas locais e usar versão actual</Button>
        <Button variant="outline" onClick={() => { setSnapshot(conflict); setAnswers(initialAnswers(conflict.draft.eligibilityAnswers)); setConflict(null); setMessage(null); }}>Descartar alterações locais</Button>
      </div>}
      {!dirty && result && <section role="status" className="space-y-2 border-l-4 border-primary p-4">
        <h2 className="font-semibold">{result.eligible ? 'Elegibilidade confirmada' : 'Elegibilidade não confirmada'}</h2>
        {result.blockingReasons?.map((text, index) => <p key={index}>{text}</p>)}
        {result.advisories?.map((text, index) => <p key={index}>{text}</p>)}
      </section>}
      {(rules.length === 0 || (!dirty && result?.eligible === true)) && <Button asChild><Link to={`/municipe/pedidos/rascunhos/${draftId}/formulario`}>Continuar para o formulário</Link></Button>}
      <Link className="block text-primary underline" to={`/municipe/pedidos/rascunhos/${draftId}`} onClick={event => {
        if ((dirty || saving) && !window.confirm('Sair da elegibilidade? Respostas não confirmadas serão perdidas.')) event.preventDefault();
      }}>Voltar ao rascunho</Link>
    </div>}
  </RequestJourneyShell>;
}
