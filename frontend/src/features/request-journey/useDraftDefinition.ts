import { useEffect, useState } from 'react';
import { ApiError } from '@/lib/api';
import { requestJourneyApi } from './request-journey.api';
import { isUuid } from './types';
import type { DraftDetail, RequestDefinition } from './types';

type State = { loading: boolean; detail: DraftDetail | null; definition: RequestDefinition | null; error: string | null };
export function useDraftDefinition(draftId: string) {
  const [reload, setReload] = useState(0);
  const [state, setState] = useState<State>({ loading: true, detail: null, definition: null, error: null });
  useEffect(() => {
    if (!isUuid(draftId)) { setState({ loading: false, detail: null, definition: null, error: 'Endereço de rascunho inválido.' }); return; }
    let active = true;
    setState({ loading: true, detail: null, definition: null, error: null });
    (async () => {
      const detail = await requestJourneyApi.detail(draftId);
      if (!['IN_PROGRESS', 'READY_FOR_REVIEW'].includes(detail.draft.status) || Date.parse(detail.draft.expiresAt) <= Date.now())
        throw new Error('Este rascunho não está disponível para edição.');
      const definition = await requestJourneyApi.pinnedDefinition(draftId);
      if (definition.serviceId !== detail.draft.serviceId || definition.serviceVersionId !== detail.draft.serviceVersionId || definition.formVersionId !== detail.draft.formVersionId)
        throw new Error('A versão fixada deste rascunho não está disponível. Os dados foram preservados.');
      if (active) setState({ loading: false, detail, definition, error: null });
    })().catch(error => {
      if (active) setState({ loading: false, detail: null, definition: null,
        error: error instanceof ApiError && error.status === 404 ? 'Este rascunho não está disponível.' : error instanceof Error ? error.message : 'Não foi possível consultar o rascunho.' });
    });
    return () => { active = false; };
  }, [draftId, reload]);
  return { ...state, retry: () => setReload(value => value + 1) };
}
