import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authService } from './auth.service';
import { clearAuthTokens, getAuthToken, getRefreshToken, setAuthToken, setRefreshToken, AUTH_INVALIDATED_EVENT } from '@/lib/api';

const user = (roles: string[]) => ({ id: 'qa', fullName: 'QA', email: 'qa@example.test', roles });
const json = (data: unknown, status = 200) => ({
  ok: status < 400, status, statusText: status === 401 ? 'Unauthorized' : 'OK',
  headers: new Headers({ 'content-type': 'application/json' }),
  json: async () => data,
});

beforeEach(() => { clearAuthTokens(); vi.unstubAllGlobals(); });

describe('FE-01 authentication boundary', () => {
  it.each([['CITIZEN', 'municipe'], ['SUPER_ADMIN', 'super_admin'], ['ADMIN', 'admin'],
    ['EMPLOYEE', 'funcionario'], ['MANAGER', 'gestor'], ['EDITOR', 'editor']] as const)(
    'maps backend %s to %s', async (backendRole, role) => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ success: true, data: { accessToken: 'a', refreshToken: 'r', tokenType: 'Bearer', expiresIn: 600, user: user([backendRole]) } })));
      const result = await authService.login({ email: 'qa@example.test', password: 'test' });
      expect(result.data?.profile.role).toBe(role);
    },
  );

  it('rejects an unrecognized role instead of treating staff as citizen', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ success: true, data: { accessToken: 'a', refreshToken: 'r', tokenType: 'Bearer', expiresIn: 600, user: user(['UNKNOWN']) } })));
    const result = await authService.login({ email: 'qa@example.test', password: 'test' });
    expect(result.data).toBeUndefined();
    expect(getAuthToken()).toBeNull();
  });

  it('returns unauthorized for expired /auth/me so bootstrap can refresh', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ message: 'Expired' }, 401)));
    expect((await authService.me()).unauthorized).toBe(true);
  });

  it('invalidates local tokens when refresh fails after a protected request 401', async () => {
    setAuthToken('a'); setRefreshToken('r');
    const event = vi.fn(); window.addEventListener(AUTH_INVALIDATED_EVENT, event);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ message: 'Expired' }, 401)));
    await expect(authService.me()).resolves.toMatchObject({ unauthorized: true });
    // /auth/me is handled by the session bootstrap, allowing one explicit refresh.
    expect(getRefreshToken()).toBe('r');
    const { api } = await import('@/lib/api');
    await expect(api.get('/citizen/requests')).rejects.toMatchObject({ status: 401 });
    expect(getRefreshToken()).toBeNull();
    expect(event).toHaveBeenCalledOnce();
    window.removeEventListener(AUTH_INVALIDATED_EVENT, event);
  });

  it('rotates refresh once and retries a rejected protected request', async () => {
    setAuthToken('expired'); setRefreshToken('r1');
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(json({ message: 'Expired' }, 401))
      .mockResolvedValueOnce(json({ success: true, data: { accessToken: 'fresh', refreshToken: 'r2' } }))
      .mockResolvedValueOnce(json({ success: true, data: [] }));
    vi.stubGlobal('fetch', fetchMock);
    const { api } = await import('@/lib/api');
    await expect(api.get('/citizen/requests')).resolves.toMatchObject({ success: true });
    expect(getAuthToken()).toBe('fresh');
    expect(getRefreshToken()).toBe('r2');
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[2][1].headers.Authorization).toBe('Bearer fresh');
  });

  it.each(['post', 'put', 'patch', 'delete', 'upload'] as const)(
    'refreshes the session without automatically replaying a rejected %s', async method => {
      setAuthToken('expired'); setRefreshToken('r1');
      const fetchMock = vi.fn()
        .mockResolvedValueOnce(json({ message: 'Expired' }, 401))
        .mockResolvedValueOnce(json({ success: true, data: { accessToken: 'fresh', refreshToken: 'r2' } }));
      vi.stubGlobal('fetch', fetchMock);
      const { api } = await import('@/lib/api');
      const operation = method === 'upload' ? api.upload('/citizen/documents', new FormData())
        : method === 'delete' ? api.delete('/citizen/items/1')
        : api[method]('/citizen/items', { value: 'qa' });
      await expect(operation).rejects.toMatchObject({ status: 401 });
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(getAuthToken()).toBe('fresh');
      expect(getRefreshToken()).toBe('r2');
    },
  );

  it('does not refresh or retry a read indefinitely after a second 401', async () => {
    setAuthToken('expired'); setRefreshToken('r1');
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(json({ message: 'Expired' }, 401))
      .mockResolvedValueOnce(json({ success: true, data: { accessToken: 'fresh', refreshToken: 'r2' } }))
      .mockResolvedValueOnce(json({ message: 'Still unauthorized' }, 401));
    vi.stubGlobal('fetch', fetchMock);
    const { api } = await import('@/lib/api');
    await expect(api.get('/citizen/requests')).rejects.toMatchObject({ status: 401 });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(getRefreshToken()).toBeNull();
  });
});
