import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { AuthContext } from '@/hooks/auth-context';
import type { AuthContextType } from '@/types';

import { RequestJourneyAccountBoundary } from './RequestJourneyAccountBoundary';

function AccountContent() {
  const [initial] = useState(() => Math.random());
  return <span data-testid="instance">{initial}</span>;
}

function node(id: string) {
  const auth: AuthContextType = {
    user: { id, email: `${id}@example.test` }, profile: null, role: 'municipe',
    permissions: [], isAuthenticated: true, isLoading: false,
    login: vi.fn(), register: vi.fn(), logout: vi.fn(), refreshProfile: vi.fn(),
  };
  return <AuthContext.Provider value={auth}><RequestJourneyAccountBoundary><AccountContent /></RequestJourneyAccountBoundary></AuthContext.Provider>;
}

describe('FE-03a account boundary', () => {
  it('remounts private journey state when the citizen account changes', () => {
    const { rerender } = render(node('citizen-a'));
    const first = screen.getByTestId('instance').textContent;
    rerender(node('citizen-b'));
    expect(screen.getByTestId('instance').textContent).not.toBe(first);
  });
});
