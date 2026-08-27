import { useState } from 'react';

import boaneLogo from '@/assets/boane logo.jpg';
import { cn } from '@/lib/utils';

type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className }: BrandMarkProps) {
  const [imageUnavailable, setImageUnavailable] = useState(false);

  if (imageUnavailable) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          'inline-flex items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground',
          className,
        )}
      >
        BC
      </span>
    );
  }

  return (
    <img
      src={boaneLogo}
      alt=""
      className={cn('rounded-full object-cover', className)}
      onError={() => setImageUnavailable(true)}
    />
  );
}
