import { beforeEach, describe, expect, it, vi } from 'vitest';

import { api, clearAuthTokens, setAuthToken, setRefreshToken } from '@/lib/api';

import { requestJourneyApi } from './request-journey.api';

const serviceId = '11111111-1111-4111-8111-111111111111';
const draftId = '22222222-2222-4222-8222-222222222222';
const draft = { id: draftId, serviceId, serviceVersionId: serviceId, formVersionId: draftId, status: 'IN_PROGRESS', version: 4 };
const json = (data: unknown, status = 200, etag?: string) => ({
  ok: status < 400, status, statusText: status === 401 ? 'Unauthorized' : 'OK',
  headers: new Headers({ 'content-type': 'application/json', ...(etag ? { etag } : {}) }),
  json: async () => data,
});

beforeEach(() => { clearAuthTokens(); vi.unstubAllGlobals(); });

describe('FE-03a backend transport contracts', () => {
  it('returns the body, exact ETag, and actual HTTP status to callers', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ success: true, data: draft }, 201, '"4"')));
    expect(await api.postWithMetadata('/citizen/request-drafts', { serviceId })).toEqual({
      body: { success: true, data: draft }, status: 201, etag: '"4"',
    });
  });
  it('accepts 201 for a resumed draft and preserves HTTP status and exact ETag', async () => {
    const fetchMock = vi.fn().mockResolvedValue(json({ success: true, data: draft }, 201, '"4"'));
    vi.stubGlobal('fetch', fetchMock);
    const result = await requestJourneyApi.createOrResume(serviceId);
    expect(result).toEqual({ draft, etag: '"4"' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: 'POST', body: JSON.stringify({ serviceId, resumeExisting: true }) });
  });
  it('rejects a mutation response missing ETag or 201 instead of claiming it was saved', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ success: true, data: draft }, 201)));
    await expect(requestJourneyApi.createOrResume(serviceId)).rejects.toThrow('versão');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ success: true, data: draft }, 200, '"4"')));
    await expect(requestJourneyApi.createOrResume(serviceId)).rejects.toThrow('versão');
  });
  it('loads the own draft with exact ETag and checks the returned ID', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ success: true, data: draft }, 200, '"4"')));
    expect(await requestJourneyApi.detail(draftId)).toEqual({ draft, etag: '"4"' });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ success: true, data: { ...draft, id: serviceId } }, 200, '"4"')));
    await expect(requestJourneyApi.detail(draftId)).rejects.toThrow('endereço');
  });
  it('loads an empty list from the actual envelope and refuses malformed payload', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ success: true, data: [] })));
    expect(await requestJourneyApi.list()).toEqual([]);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ success: true, data: null })));
    await expect(requestJourneyApi.list()).rejects.toThrow();
  });
  it('does not send a request for invalid route UUIDs', async () => {
    const fetchMock = vi.fn(); vi.stubGlobal('fetch', fetchMock);
    await expect(requestJourneyApi.detail('other-owner')).rejects.toThrow('inválido');
    await expect(requestJourneyApi.definition('not-uuid')).rejects.toThrow('inválido');
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('refreshes once then retries a GET with the fresh bearer token', async () => {
    setAuthToken('old'); setRefreshToken('refresh');
    const fetchMock = vi.fn().mockResolvedValueOnce(json({ message: 'Expired' }, 401))
      .mockResolvedValueOnce(json({ success: true, data: { accessToken: 'new', refreshToken: 'new-refresh' } }))
      .mockResolvedValueOnce(json({ success: true, data: draft }, 200, '"4"'));
    vi.stubGlobal('fetch', fetchMock);
    expect((await requestJourneyApi.detail(draftId)).etag).toBe('"4"');
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[2][1].headers.Authorization).toBe('Bearer new');
  });
  it('refreshes after 401 POST but never repeats that POST automatically', async () => {
    setAuthToken('old'); setRefreshToken('refresh');
    const fetchMock = vi.fn().mockResolvedValueOnce(json({ message: 'Expired' }, 401))
      .mockResolvedValueOnce(json({ success: true, data: { accessToken: 'new', refreshToken: 'new-refresh' } }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(requestJourneyApi.createOrResume(serviceId)).rejects.toMatchObject({ status: 401 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls.filter(call => call[1]?.method === 'POST' && !call[0].endsWith('/auth/refresh'))).toHaveLength(1);
  });
  it('does not replay a POST after transport timeout', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('Network unavailable'));
    vi.stubGlobal('fetch', fetchMock);
    await expect(requestJourneyApi.createOrResume(serviceId)).rejects.toThrow('Network unavailable');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('FE-03b mutation transport', () => {
  it.each(['PUT','PATCH'] as const)('preserves %s status and ETag, without replay on 401', async method => {
    setAuthToken('old'); setRefreshToken('refresh');
    const fetchMock = vi.fn().mockResolvedValueOnce(json({message:'Expired'},401))
      .mockResolvedValueOnce(json({success:true,data:{accessToken:'new',refreshToken:'new-refresh'}}));
    vi.stubGlobal('fetch',fetchMock);
    const call = method === 'PUT' ? requestJourneyApi.saveEligibility(draftId,'"4"',{resident:true}) : requestJourneyApi.saveAnswers(draftId,'"4"','intro',{name:'new'});
    await expect(call).rejects.toMatchObject({status:401});
    expect(fetchMock.mock.calls.filter(([,request])=>request.method===method)).toHaveLength(1);
    expect(fetchMock.mock.calls[0][1].headers['If-Match']).toBe('"4"');
  });
  it('accepts 200 and a new ETag for confirmed PATCH/PUT',async()=>{
    vi.stubGlobal('fetch',vi.fn().mockResolvedValue(json({success:true,data:draft},200,'"5"')));
    expect((await requestJourneyApi.saveAnswers(draftId,'"4"','intro',{name:'new'})).etag).toBe('"5"');
    expect((await requestJourneyApi.saveEligibility(draftId,'"4"',{resident:true})).etag).toBe('"5"');
  });
});
