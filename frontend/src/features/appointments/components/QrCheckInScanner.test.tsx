import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { QrCheckInScanner } from './QrCheckInScanner';

describe('QrCheckInScanner', () => {
  it('does not request camera permission before explicit user action', () => {
    const getUserMedia = vi.fn();
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia } });
    render(<QrCheckInScanner onScan={vi.fn()} />);
    expect(getUserMedia).not.toHaveBeenCalled();
  });

  it('keeps the manual fallback when QR detection is unavailable', () => {
    render(<QrCheckInScanner onScan={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Ler código QR' }));
    expect(screen.getByText(/introduza o código manualmente/i)).toBeInTheDocument();
  });
});
