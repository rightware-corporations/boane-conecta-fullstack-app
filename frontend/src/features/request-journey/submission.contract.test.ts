import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearAuthTokens, setAuthToken, setRefreshToken } from '@/lib/api';
import { requestJourneyApi } from './request-journey.api';
import { clearSubmissionIntents, createIntent, readIntent } from './submission-intent';
import { nextPhase } from './submission-state';

const draftId='22222222-2222-4222-8222-222222222222';
const accountId='11111111-1111-4111-8111-111111111111';
const requestId='33333333-3333-4333-8333-333333333333';
const key='44444444-4444-4444-8444-444444444444';
const result={requestId,reference:'REF-QA',status:'SUBMITTED',submittedAt:'2026-09-25T15:00:00Z',replayed:false};
const reply=(data:unknown,status=200)=>({ok:status<400,status,statusText:'OK',headers:new Headers({'content-type':'application/json'}),json:async()=>({success:true,data})});
beforeEach(()=>{ vi.unstubAllGlobals(); vi.restoreAllMocks(); clearAuthTokens(); sessionStorage.clear(); });

describe('FE-04b submission transport and intent',()=>{
  it.each([[201,false],[200,true]] as const)('confirms %i and replay=%s without changing request, key or ETag',async(status,replayed)=>{
    const fetchMock=vi.fn().mockResolvedValue(reply({...result,replayed},status)); vi.stubGlobal('fetch',fetchMock);
    expect((await requestJourneyApi.submit(draftId,'"7"',key,'v1'))).toMatchObject({status,result:{requestId,replayed}});
    const init=fetchMock.mock.calls[0][1];
    expect(init.headers['If-Match']).toBe('"7"'); expect(init.headers['Idempotency-Key']).toBe(key);
    expect(JSON.parse(init.body)).toEqual({declarationVersion:'v1',declarationAccepted:true});
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it('never repeats POST after 401 and refresh',async()=>{
    setAuthToken('old');setRefreshToken('refresh');
    const fetchMock=vi.fn().mockResolvedValueOnce(reply({},401)).mockResolvedValueOnce(reply({accessToken:'new',refreshToken:'new-refresh'}));vi.stubGlobal('fetch',fetchMock);
    await expect(requestJourneyApi.submit(draftId,'"7"',key,'v1')).rejects.toMatchObject({status:401});
    expect(fetchMock.mock.calls.filter(([url])=>url.endsWith(`/request-drafts/${draftId}/submit`))).toHaveLength(1);
  });
  it('does not replay timeout or a conflict and preserves the original intention across reload',async()=>{
    vi.spyOn(crypto,'randomUUID').mockReturnValue(key);
    const original=createIntent(accountId,draftId,'"7"','v1','sha256:qa');
    const fetchMock=vi.fn().mockRejectedValueOnce(new TypeError('timeout')).mockResolvedValueOnce(reply({},409));vi.stubGlobal('fetch',fetchMock);
    await expect(requestJourneyApi.submit(draftId,original.etag,original.key,original.declarationVersion)).rejects.toThrow('timeout');
    expect(readIntent(accountId,draftId)).toEqual(original);
    await expect(requestJourneyApi.submit(draftId,original.etag,original.key,original.declarationVersion)).rejects.toMatchObject({status:409});
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(()=>createIntent(accountId,draftId,'"8"','v2','new')).toThrow('Já existe');
  });
  it('reconstructs the submitted request through its owner-scoped GET',async()=>{
    const fetchMock=vi.fn().mockResolvedValue(reply({id:requestId,reference:'REF-QA',status:'SUBMITTED',statusLabel:'Submetido',submittedAt:'2026-09-25T17:00:00'}));vi.stubGlobal('fetch',fetchMock);
    expect((await requestJourneyApi.submittedRequest(requestId)).reference).toBe('REF-QA');
    expect(fetchMock.mock.calls[0][0]).toContain(`/citizen/requests/${requestId}`);
  });
  it('cleans only submission intents at explicit logout',()=>{
    vi.spyOn(crypto,'randomUUID').mockReturnValue(key);
    createIntent(accountId,draftId,'"7"','v1','sha256:qa'); sessionStorage.setItem('unrelated','keep');
    clearSubmissionIntents();expect(readIntent(accountId,draftId)).toBeNull();expect(sessionStorage.getItem('unrelated')).toBe('keep');
  });
  it('prevents invalid state changes after confirmation',()=>{
    expect(nextPhase('preparing','send')).toBe('sending');
    expect(nextPhase('sending','check')).toBe('checking');
    expect(nextPhase('checking','retryReady')).toBe('unknown');
    expect(nextPhase('unknown','confirmed')).toBe('submitted');
    expect(()=>nextPhase('submitted','send')).toThrow();
  });
});
