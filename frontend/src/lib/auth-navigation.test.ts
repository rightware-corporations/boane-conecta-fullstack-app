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

describe('FE-03b return to the active stage', () => {
  const draftId = '22222222-2222-4222-8222-222222222222';
  it.each([
    `/municipe/pedidos/rascunhos/${draftId}/elegibilidade`,
    `/municipe/pedidos/rascunhos/${draftId}/formulario?step=intro_1`,
  ])('restores citizen stage %s but never permits staff', path => {
    expect(destinationAfterLogin('municipe',path)).toBe(path);
    expect(destinationAfterLogin('admin',path)).toBe('/admin');
  });
  it.each([
    `/municipe/pedidos/rascunhos/${draftId}/formulario?step=x&next=https://evil.example`,
    `/municipe/pedidos/rascunhos/${draftId}/formulario?step=..%2fadmin`,
    `/municipe/pedidos/rascunhos/bad/formulario`,
    `/municipe/pedidos/rascunhos/${draftId}/elegibilidade?step=x`,
  ])('rejects unsafe stage destination %s',path => {
    expect(destinationAfterLogin('municipe',path)).toBe('/municipe');
  });
});

const serviceId = '11111111-1111-4111-8111-111111111111';
const draftId = '22222222-2222-4222-8222-222222222222';
describe('FE-03a protected return destinations', () => {
  it.each([
    `/municipe/pedidos/iniciar/${serviceId}`,
    '/municipe/pedidos/rascunhos',
    `/municipe/pedidos/rascunhos/${draftId}`,
  ])('returns citizen to %s', path => {
    expect(destinationAfterLogin('municipe', path)).toBe(path);
    expect(destinationAfterLogin('funcionario', path)).toBe('/admin');
  });
  it.each([
    '/municipe/pedidos/iniciar/evil',
    '/municipe/pedidos/rascunhos/evil',
    `/municipe/pedidos/rascunhos/${draftId}?next=https://evil.example`,
    `/municipe/pedidos/iniciar/${serviceId}/../../admin`,
    '//evil.example/municipe/pedidos/rascunhos',
    `/municipe/pedidos/rascunhos/${draftId}%2fadmin`,
  ])('rejects unsafe FE-03a destination %s', path => {
    expect(destinationAfterLogin('municipe', path)).toBe('/municipe');
  });
});
