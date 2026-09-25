import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearAuthTokens, setAuthToken, setRefreshToken } from '@/lib/api';
import { requestJourneyApi } from './request-journey.api';
import { parseDocumentRequirements } from './document-requirements';
import { parseSteps, validateStep } from './schema';

const id = '22222222-2222-4222-8222-222222222222';
const draft = { id, serviceId: id, version: 5 };
const reply = (data: unknown, status = 200, etag?: string) => ({ ok: status < 400, status, statusText: 'OK',
  headers: new Headers({ 'content-type': 'application/json', ...(etag ? { etag } : {}) }), json: async () => ({ success: true, data }) });
beforeEach(() => { clearAuthTokens(); vi.unstubAllGlobals(); });

describe('FE-04a pinned and document contracts', () => {
  it('reads pinned definition by draft ID without requesting the current publication', async () => {
    const fetchMock = vi.fn().mockResolvedValue(reply({ serviceId: id, serviceVersionId: id, formVersionId: id }));
    vi.stubGlobal('fetch', fetchMock);
    await requestJourneyApi.pinnedDefinition(id);
    expect(fetchMock.mock.calls[0][0]).toContain(`/citizen/request-drafts/${id}/definition`);
  });
  it('preserves exact If-Match and returned ETag for attachment and detachment', async () => {
    const fetchMock = vi.fn().mockResolvedValue(reply({ draft, document: { documentId: id } }, 200, '"5"'));
    vi.stubGlobal('fetch', fetchMock);
    expect((await requestJourneyApi.attach(id, 'proof', id, '"4"')).etag).toBe('"5"');
    expect((await requestJourneyApi.detach(id, 'proof', '"5"')).etag).toBe('"5"');
    expect(fetchMock.mock.calls[0][1].headers['If-Match']).toBe('"4"');
    expect(fetchMock.mock.calls[1][1].method).toBe('DELETE');
  });
  it('does not replay upload after 401 even when refresh succeeds', async () => {
    setAuthToken('old'); setRefreshToken('refresh');
    const fetchMock = vi.fn().mockResolvedValueOnce(reply({}, 401)).mockResolvedValueOnce(reply({ accessToken: 'new', refreshToken: 'new-refresh' }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(requestJourneyApi.upload(new File(['x'], 'qa.pdf', { type: 'application/pdf' }))).rejects.toMatchObject({ status: 401 });
    expect(fetchMock.mock.calls.filter(([url]) => url.endsWith('/citizen/documents'))).toHaveLength(1);
    expect(fetchMock.mock.calls[0][1].headers['Content-Type']).toBeUndefined();
  });
  it('validates only published address component keys and required text', () => {
    const field = { key:'address',label:'Endereço',type:'ADDRESS',required:true,addressFields:[{key:'part',label:'Componente',required:true}] };
    const step = parseSteps({steps:[{key:'main',title:'Dados',fields:[field]}]})[0];
    expect(validateStep(step,{address:{part:''}})).toHaveProperty('address');
    expect(validateStep(step,{address:{part:'QA'}})).toEqual({});
    expect(validateStep(step,{address:{invented:'QA'}})).toHaveProperty('address');
    expect(() => parseSteps({steps:[{key:'main',title:'Dados',fields:[{...field,addressFields:undefined}]}]})).toThrow();
  });
  it('refuses undocumented requirements and accepts real published constraints', () => {
    expect(() => parseDocumentRequirements([{key:'proof',title:'Comprovativo'}])).toThrow();
    expect(parseDocumentRequirements([{key:'proof',title:'Comprovativo',acceptedMimeTypes:['application/pdf'],maxSizeBytes:1024}])).toHaveLength(1);
  });
});
