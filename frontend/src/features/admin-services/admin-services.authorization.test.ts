import { describe, expect, it } from 'vitest';

import { ADMIN_SERVICES_READ_ROLES, canReadAdminServices } from './admin-services.authorization';

describe('admin services read authorization', () => {
  it('allows Super Admin', () => expect(canReadAdminServices('super_admin')).toBe(true));
  it('allows Admin', () => expect(canReadAdminServices('admin')).toBe(true));
  it('allows Gestor through the confirmed MANAGER mapping', () => expect(canReadAdminServices('gestor')).toBe(true));
  it('blocks Funcionario', () => expect(canReadAdminServices('funcionario')).toBe(false));
  it('blocks Editor', () => expect(canReadAdminServices('editor')).toBe(false));
  it('blocks Munícipe and unauthenticated users', () => {
    expect(canReadAdminServices('municipe')).toBe(false);
    expect(canReadAdminServices(null)).toBe(false);
  });
  it('mirrors exactly the backend list authority', () => {
    expect(ADMIN_SERVICES_READ_ROLES).toEqual(['super_admin', 'admin', 'gestor']);
  });
});
