import { describe, expect, it } from 'vitest';
import { destinationAfterLogin } from './auth-navigation';
import type { UserRole } from '@/types';

describe('FE-01 post-login destination', () => {
  it.each(['super_admin', 'admin', 'editor', 'funcionario', 'gestor'] as UserRole[])(
    'keeps %s out of citizen-private screens', role => {
      expect(destinationAfterLogin(role, '/municipe/pedidos/123')).toBe('/admin');
    },
  );
  it('restores a citizen request detail after login', () => {
    expect(destinationAfterLogin('municipe', '/municipe/pedidos/123?tab=history')).toBe('/municipe/pedidos/123?tab=history');
  });
  it('keeps a citizen out of staff routes', () => {
    expect(destinationAfterLogin('municipe', '/admin/servicos')).toBe('/municipe');
  });
  it('respects staff route roles', () => {
    expect(destinationAfterLogin('gestor', '/admin/servicos')).toBe('/admin/servicos');
    expect(destinationAfterLogin('editor', '/admin/servicos')).toBe('/admin');
  });
  it.each(['//other.example', '/%2fother.example', 'https://other.example', '/admin/unknown', '/municipe/pedidos/123/other'])(
    'rejects unsafe or unsupported destination %s', requested => {
      expect(destinationAfterLogin('admin', requested)).toBe('/admin');
    },
  );
});
