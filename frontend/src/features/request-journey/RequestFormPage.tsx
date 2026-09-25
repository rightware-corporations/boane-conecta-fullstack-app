import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ApiError } from '@/lib/api';
import { DraftEditStatus } from './DraftEditStatus';
import { FieldRenderer } from './FieldRenderer';
import { RequestJourneyShell } from './RequestJourneyShell';
import { requestJourneyApi } from './request-journey.api';
import { isVisible, parseSteps, stepPatch, UnsupportedDefinition, validateStep } from './schema';
import type { Step } from './schema';
import { useDraftDefinition } from './useDraftDefinition';
import type { DraftDetail } from './types';

export default function RequestFormPage() {
  const { draftId = '' } = useParams();
  const [params, setParams] = useSearchParams();
  const { loading, error, detail: loaded, definition, retry } = useDraftDefinition(draftId);
  const [snapshot, setSnapshot] = useState<DraftDetail | null>(null);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [edited, setEdited] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [conflict, setConflict] = useState<DraftDetail | null>(null);
  const [unknown, setUnknown] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (loaded) { setSnapshot(loaded); setAnswers(loaded.draft.answers); setEdited(new Set()); setErrors({}); setConflict(null); setUnknown(false); setMessage(null); } }, [loaded]);
  let steps: Step[] = []; let unsupported: string | null = null; let eligibilityRequired = true;
  if (definition) try {
    steps = parseSteps(definition.schema);
    if (!Array.isArray(definition.eligibility)) throw new UnsupportedDefinition('Os critérios de elegibilidade não têm formato válido.');
    eligibilityRequired = definition.eligibility.length > 0;
  }
  catch (cause) { unsupported = cause instanceof UnsupportedDefinition ? cause.message : 'Definição indisponível.'; }
  const requestedStep = params.get('step');
  const stepIndex = requestedStep ? steps.findIndex(step => step.key === requestedStep) : steps.findIndex(step => step.key === snapshot?.draft.currentStepKey);
  const index = requestedStep && stepIndex === -1 ? -1 : Math.max(0, stepIndex);
  const step = steps[index];
  const canEdit = !!snapshot && (!eligibilityRequired || snapshot.draft.eligibilityResult != null && (snapshot.draft.eligibilityResult as {eligible?: boolean}).eligible === true);
  const addressBlocked = step?.fields.some(field => field.type === 'ADDRESS');
  const dirty = edited.size > 0;
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  function change(key: string, value: unknown) { setAnswers(prev => ({ ...prev, [key]: value })); setEdited(prev => new Set(prev).add(key)); setMessage(null); setErrors(prev => ({...prev,[key]:''})); }
  function navigateStep(next: number) {
    if (dirty || saving || unknown || conflict) { setMessage('Guarde ou descarte as alterações desta etapa antes de mudar.'); return; }
    setParams({ step: steps[next].key });
    document.getElementById('main-content')?.focus();
  }
  async function save() {
    if (!step || !snapshot || saving || conflict || unknown || addressBlocked) return;
    const checked = validateStep(step, answers);
    const numeric = step.fields.filter(field => edited.has(field.key) && ['INTEGER','DECIMAL'].includes(field.type) && answers[field.key] !== null && answers[field.key] !== '' && (typeof answers[field.key] !== 'number' || !Number.isFinite(answers[field.key])));
    numeric.forEach(field => {checked[field.key]='Introduza um número válido.';});
    if (Object.keys(checked).length) { setErrors(checked); setMessage('Corrija os campos indicados antes de guardar.'); summaryRef.current?.focus(); return; }
    const payload = stepPatch(step, answers, edited);
    if (Object.keys(payload).length === 0) { setMessage('Não há alterações para guardar.'); return; }
    setSaving(true); setMessage(null);
    try {
      const confirmed = await requestJourneyApi.saveAnswers(draftId, snapshot.etag, step.key, payload);
      setSnapshot(confirmed); setAnswers(confirmed.draft.answers); setEdited(new Set()); setErrors({}); setMessage('Alterações guardadas no servidor.');
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 409) {
        try { setConflict(await requestJourneyApi.detail(draftId)); setMessage('O rascunho mudou noutra sessão. Compare as respostas antes de voltar a guardar.'); }
        catch { setUnknown(true); setMessage('Conflito detectado. Não foi possível ler a versão actual; a edição local foi preservada.'); }
      } else {
        setUnknown(true);
        try { setConflict(await requestJourneyApi.detail(draftId)); }
        catch { /* Keep the uncertain state and all local edits. */ }
        setMessage('Resultado da gravação por confirmar. A escrita não será repetida automaticamente.');
      }
    } finally { setSaving(false); }
  }
  const returnPath = `/municipe/pedidos/rascunhos/${draftId}`;
  return <RequestJourneyShell title="Formulário do pedido" subtitle={definition?.serviceTitle}>
    <DraftEditStatus loading={loading} error={error} retry={retry} />
    {unsupported && <p role="alert">{unsupported} O rascunho não foi alterado.</p>}
    {snapshot && !unsupported && !canEdit && <div role="alert" className="space-y-3 border-l-4 border-warning p-4"><p>A elegibilidade ainda não foi confirmada pelo servidor.</p><Link className="text-primary underline" to={`${returnPath}/elegibilidade`}>Verificar elegibilidade</Link></div>}
    {snapshot && !unsupported && canEdit && (!step ? <p role="alert">Etapa desconhecida. Escolha uma etapa publicada sem alterar o rascunho.</p> : <div className="space-y-6">
      <p role="status" className="text-sm text-muted-foreground">Etapa {index + 1} de {steps.length}: {step.title}</p>
      <h2 className="text-xl font-semibold">{step.title}</h2>
      {addressBlocked && <p role="alert" className="border-l-4 border-warning p-3">Esta etapa inclui um endereço sem contrato de estrutura. Pode consultar os dados, mas não editá-los até ser publicado um formato seguro.</p>}
      {step.fields.filter(field => isVisible(field, answers)).map(field => <FieldRenderer key={field.key} field={field} value={answers[field.key]} error={errors[field.key]} disabled={saving || !!conflict || unknown || !!addressBlocked} onChange={value => change(field.key,value)} />)}
      {message && <div ref={summaryRef} tabIndex={-1} role={errors && Object.values(errors).some(Boolean) || conflict || unknown ? 'alert' : 'status'} className="border-l-4 border-primary p-3">{message}</div>}
      {conflict && <div role="alert" className="space-y-3 border-l-4 border-warning p-4">
        <p>O servidor está na versão {conflict.draft.version}. Respostas locais ainda não confirmadas:</p>
        <ul className="list-disc pl-6">{step.fields.filter(field => edited.has(field.key)).map(field => <li key={field.key}>{field.label}: local {JSON.stringify(answers[field.key] ?? null)}, servidor {JSON.stringify(conflict.draft.answers[field.key] ?? null)}</li>)}</ul>
        <Button variant="outline" onClick={() => { setSnapshot(conflict); setAnswers(prev => ({ ...conflict.draft.answers, ...Object.fromEntries([...edited].map(key => [key,prev[key]])) })); setConflict(null); setUnknown(false); setMessage('Compare os valores locais com os do servidor antes de guardar manualmente.'); }}>Conservar edições locais e usar ETag actual</Button>
        <Button variant="outline" onClick={() => { setSnapshot(conflict); setAnswers(conflict.draft.answers); setEdited(new Set()); setConflict(null); setUnknown(false); setMessage('Alterações locais descartadas por escolha explícita.'); }}>Descartar edições locais</Button>
      </div>}
      {unknown && !conflict && <Button variant="outline" onClick={async () => { try { setConflict(await requestJourneyApi.detail(draftId)); setMessage('Compare as versões antes de qualquer nova escrita.'); } catch { setMessage('A consulta falhou; mantenha as respostas desta página.'); } }}>Consultar versão actual</Button>}
      <div className="flex flex-wrap gap-3 border-t border-border pt-5">
        <Button onClick={save} disabled={!dirty || saving || !!conflict || unknown || !!addressBlocked}>{saving ? 'A guardar...' : 'Guardar alterações'}</Button>
        {dirty && <Button variant="outline" disabled={saving} onClick={() => {
          if (window.confirm('Descartar as alterações não guardadas desta etapa?')) {
            setAnswers(snapshot.draft.answers); setEdited(new Set()); setConflict(null); setUnknown(false); setErrors({}); setMessage('Alterações locais descartadas.');
          }
        }}>Descartar alterações</Button>}
        {index > 0 && <Button variant="outline" onClick={() => navigateStep(index-1)}>Etapa anterior</Button>}
        {index < steps.length - 1 && <Button variant="outline" onClick={() => navigateStep(index+1)}>Próxima etapa</Button>}
      </div>
      {index === steps.length - 1 && <p role="status">A etapa de documentos ainda não foi implementada. As respostas confirmadas permanecem guardadas.</p>}
    </div>)}
    <Link className="mt-6 block text-primary underline" to={returnPath} onClick={event => {
      if ((dirty || saving || unknown) && !window.confirm('Sair desta etapa? As alterações locais não confirmadas serão perdidas.')) event.preventDefault();
    }}>Voltar ao rascunho</Link>
  </RequestJourneyShell>;
}
