import * as React from 'react';

import { cn } from '@/lib/utils';

type DivProps = React.HTMLAttributes<HTMLDivElement>;

type ContainerProps = DivProps & {
  size?: 'public' | 'citizen' | 'admin' | 'reading' | 'form' | 'full';
};

const containerSizes: Record<NonNullable<ContainerProps['size']>, string> = {
  public: 'max-w-[1280px]',
  citizen: 'max-w-[1280px]',
  admin: 'max-w-[1440px]',
  reading: 'max-w-[760px]',
  form: 'max-w-[800px]',
  full: 'max-w-none',
};

export function Container({ className, size = 'public', ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 xsm:px-5 tb:px-6 lg:px-8 2xl:px-12',
        containerSizes[size],
        className,
      )}
      {...props}
    />
  );
}

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  spacing?: 'none' | 'sm' | 'md' | 'lg';
};

const sectionSpacing = {
  none: '',
  sm: 'py-6 md:py-8',
  md: 'py-10 md:py-12 lg:py-16',
  lg: 'py-14 md:py-16 lg:py-20',
};

export function Section({ className, spacing = 'md', ...props }: SectionProps) {
  return <section className={cn(sectionSpacing[spacing], className)} {...props} />;
}

type StackProps = DivProps & {
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

const stackGap = { xs: 'gap-1', sm: 'gap-2', md: 'gap-4', lg: 'gap-6', xl: 'gap-8' };

export function Stack({ className, gap = 'md', ...props }: StackProps) {
  return <div className={cn('flex flex-col', stackGap[gap], className)} {...props} />;
}

type InlineProps = DivProps & {
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'baseline';
  wrap?: boolean;
};

const inlineGap = { xs: 'gap-1', sm: 'gap-2', md: 'gap-4', lg: 'gap-6' };
const inlineAlign = { start: 'items-start', center: 'items-center', end: 'items-end', baseline: 'items-baseline' };

export function Inline({ className, gap = 'sm', align = 'center', wrap = true, ...props }: InlineProps) {
  return <div className={cn('flex', wrap && 'flex-wrap', inlineGap[gap], inlineAlign[align], className)} {...props} />;
}

type GridProps = DivProps & {
  columns?: 1 | 2 | 3 | 4 | 12;
  gap?: 'sm' | 'md' | 'lg';
};

const gridColumns = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 tb:grid-cols-2',
  3: 'grid-cols-1 tb:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 xsm:grid-cols-2 lg:grid-cols-4',
  12: 'grid-cols-4 tb:grid-cols-8 lg:grid-cols-12',
};
const gridGap = { sm: 'gap-3', md: 'gap-4 lg:gap-6', lg: 'gap-6 lg:gap-8' };

export function Grid({ className, columns = 12, gap = 'md', ...props }: GridProps) {
  return <div className={cn('grid', gridColumns[columns], gridGap[gap], className)} {...props} />;
}

type SplitProps = DivProps & {
  ratio?: 'equal' | 'wide-start' | 'wide-end';
  align?: 'start' | 'center';
};

const splitRatio = {
  equal: 'lg:grid-cols-2',
  'wide-start': 'lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]',
  'wide-end': 'lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]',
};

export function Split({ className, ratio = 'equal', align = 'start', ...props }: SplitProps) {
  return (
    <div
      className={cn('grid grid-cols-1 gap-6 lg:gap-10', splitRatio[ratio], align === 'center' && 'items-center', className)}
      {...props}
    />
  );
}
