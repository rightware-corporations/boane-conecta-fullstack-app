import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from '@/hooks/auth-context';
import { ApiError } from '@/lib/api';
import type { AuthContextType } from '@/types';
import RequestSubmitPage from './RequestSubmitPage';
import RequestConfirmationPage from './RequestConfirmationPage';
import { requestJourneyApi } from './request-journey.api';
import { readIntent } from './submission-intent';

vi.mock('./RequestJourneyShell',()=>({RequestJourneyShell:({title,children}:{title:string;children:React.ReactNode})=><main><h1>{title}</h1>{children}</main>}));
vi.mock('./request-journey.api',()=>({requestJourneyApi:{detail:vi.fn(),pinnedDefinition:vi.fn(),submittedRequest:vi.fn(),submit:vi.fn()}}));
const draftId='22222222-2222-4222-8222-222222222222', accountId='11111111-1111-4111-8111-111111111111', requestId='33333333-3333-4333-8333-333333333333';
const draft={id:draftId,serviceId:draftId,serviceVersionId:draftId,formVersionId:draftId,status:'READY_FOR_REVIEW',expiresAt:'2099-01-01T00:00:00Z',eligibilityResult:null,submittedRequestId:null};
const definition={serviceId:draftId,serviceVersionId:draftId,formVersionId:draftId,schemaChecksum:'sha256:qa',declarationVersion:'v1',eligibility:[]};
const accepted={draftId,etag:'"7"',declarationVersion:'v1',schemaChecksum:'sha256:qa',accepted:true};
const auth={user:{id:accountId,email:'qa@example.test'},profile:null,role:'municipe',permissions:[],isAuthenticated:true,isLoading:false,login:vi.fn(),register:vi.fn(),logout:vi.fn(),refreshProfile:vi.fn()} as AuthContextType;
function at(path:'submissao'|'confirmacao',withAcceptance=false){
  return render(<AuthContext.Provider value={auth}><MemoryRouter initialEntries={[{pathname:`/municipe/pedidos/rascunhos/${draftId}/${path}`,state:withAcceptance?accepted:null}]}><Routes>
    <Route path="/municipe/pedidos/rascunhos/:draftId/submissao" element={<RequestSubmitPage/>}/>
    <Route path="/municipe/pedidos/rascunhos/:draftId/confirmacao" element={<RequestConfirmationPage/>}/>
  </Routes></MemoryRouter></AuthContext.Provider>);
}
beforeEach(()=>{ vi.clearAllMocks(); sessionStorage.clear();
  vi.mocked(requestJourneyApi.detail).mockResolvedValue({draft,etag:'"7"'} as never);
  vi.mocked(requestJourneyApi.pinnedDefinition).mockResolvedValue(definition as never);
  vi.mocked(requestJourneyApi.submittedRequest).mockResolvedValue({id:requestId,reference:'REF-QA',status:'SUBMITTED',statusLabel:'Submetido',submittedAt:'2026-09-25T18:00:00'} as never);
});

describe('FE-04b S06/S07',()=>{
  it('guards double click while one submission is in flight',async()=>{
    let finish!: (value:unknown)=>void;
    vi.mocked(requestJourneyApi.submit).mockImplementation(()=>new Promise(resolve=>{finish=resolve;}) as never);
    vi.mocked(requestJourneyApi.detail).mockResolvedValueOnce({draft,etag:'"7"'} as never)
      .mockResolvedValueOnce({draft,etag:'"7"'} as never)
      .mockResolvedValue({draft:{...draft,status:'SUBMITTED',submittedRequestId:requestId},etag:'"8"'} as never);
    at('submissao',true);
    const button=await screen.findByRole('button',{name:'Enviar pedido'});
    fireEvent.click(button);fireEvent.click(button);
    await waitFor(()=>expect(requestJourneyApi.submit).toHaveBeenCalledTimes(1));
    expect(readIntent(accountId,draftId)?.etag).toBe('"7"');
    finish({status:201,result:{requestId,reference:'REF-QA',status:'SUBMITTED',submittedAt:'2026-09-25T16:00:00Z',replayed:false}});
    expect(await screen.findByText('REF-QA')).toBeInTheDocument();
  });
  it('preserves an uncertain intention over reload without another POST',async()=>{
    vi.mocked(requestJourneyApi.submit).mockRejectedValueOnce(new TypeError('timeout'));
    const first=at('submissao',true);
    fireEvent.click(await screen.findByRole('button',{name:'Enviar pedido'}));
    expect(await screen.findByText(/Isto não prova que o envio anterior falhou/)).toBeInTheDocument();
    const key=readIntent(accountId,draftId)?.key; expect(key).toBeTruthy();
    first.unmount();at('submissao');
    expect(await screen.findByText(/Existe uma intenção anterior/)).toBeInTheDocument();
    expect(readIntent(accountId,draftId)?.key).toBe(key);
    expect(requestJourneyApi.submit).toHaveBeenCalledTimes(1);
  });
  it('resolves timeout after commit through the owner-scoped GET and confirmation',async()=>{
    vi.mocked(requestJourneyApi.submit).mockRejectedValueOnce(new TypeError('timeout'));
    vi.mocked(requestJourneyApi.detail).mockResolvedValueOnce({draft,etag:'"7"'} as never)
      .mockResolvedValueOnce({draft,etag:'"7"'} as never)
      .mockResolvedValue({draft:{...draft,status:'SUBMITTED',submittedRequestId:requestId},etag:'"8"'} as never);
    at('submissao',true);
    fireEvent.click(await screen.findByRole('button',{name:'Enviar pedido'}));
    expect(await screen.findByText('REF-QA')).toBeInTheDocument();
    expect(requestJourneyApi.submit).toHaveBeenCalledTimes(1);
  });
  it('keeps one intention after 401 and retries only after explicit action with the original arguments',async()=>{
    vi.mocked(requestJourneyApi.submit).mockRejectedValueOnce(new ApiError(401,'Unauthorized'))
      .mockResolvedValueOnce({status:200,result:{requestId,reference:'REF-QA',status:'SUBMITTED',submittedAt:'2026-09-25T16:00:00Z',replayed:true}} as never);
    at('submissao',true);
    fireEvent.click(await screen.findByRole('button',{name:'Enviar pedido'}));
    expect(await screen.findByText(/Isto não prova que o envio anterior falhou/)).toBeInTheDocument();
    expect(requestJourneyApi.submit).toHaveBeenCalledTimes(1);
    const original=vi.mocked(requestJourneyApi.submit).mock.calls[0];
    fireEvent.click(screen.getByRole('button',{name:'Repetir a mesma intenção'}));
    await waitFor(()=>expect(requestJourneyApi.submit).toHaveBeenCalledTimes(2));
    expect(vi.mocked(requestJourneyApi.submit).mock.calls[1]).toEqual(original);
  });
  it('retains a conflicting intention without offering a different key',async()=>{
    vi.mocked(requestJourneyApi.submit).mockRejectedValueOnce(new ApiError(409,'Conflict'));
    at('submissao',true);
    fireEvent.click(await screen.findByRole('button',{name:'Enviar pedido'}));
    expect(await screen.findByText(/O servidor devolveu conflito/)).toBeInTheDocument();
    expect(readIntent(accountId,draftId)).not.toBeNull();
    expect(screen.queryByRole('button',{name:'Repetir a mesma intenção'})).not.toBeInTheDocument();
    expect(requestJourneyApi.submit).toHaveBeenCalledTimes(1);
  });
  it('blocks a stale ETag or missing declaration acceptance before POST',async()=>{
    vi.mocked(requestJourneyApi.detail).mockResolvedValue({draft,etag:'"8"'} as never);
    at('submissao',true);
    expect(await screen.findByText(/revisão ou a versão do rascunho mudou/)).toBeInTheDocument();
    expect(requestJourneyApi.submit).not.toHaveBeenCalled();
  });
  it('reconstructs confirmation on direct reload exclusively with the own request',async()=>{
    vi.mocked(requestJourneyApi.detail).mockResolvedValue({draft:{...draft,status:'SUBMITTED',submittedRequestId:requestId},etag:'"8"'} as never);
    at('confirmacao');
    expect(await screen.findByText('REF-QA')).toBeInTheDocument();
    expect(screen.getByText(requestId)).toBeInTheDocument();
    expect(requestJourneyApi.submittedRequest).toHaveBeenCalledWith(requestId);
  });
  it('does not disclose another citizen request after a 404',async()=>{
    vi.mocked(requestJourneyApi.detail).mockRejectedValue({status:404});
    at('confirmacao');
    expect(await screen.findByText(/Ainda não foi possível confirmar o pedido/)).toBeInTheDocument();
    expect(requestJourneyApi.submittedRequest).not.toHaveBeenCalled();
  });
});
