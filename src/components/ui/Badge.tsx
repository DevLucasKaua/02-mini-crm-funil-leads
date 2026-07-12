import type { ReactNode } from 'react';

export type BadgeColor =
  | 'amber'
  | 'rose'
  | 'sky'
  | 'slate'
  | 'blue'
  | 'violet'
  | 'emerald'
  | 'gray';

// Tailwind cannot resolve dynamically built class names, so every color is spelled out statically.
const COLOR_CLASSES: Record<BadgeColor, string> = {
  amber: 'bg-amber-100 text-amber-800',
  rose: 'bg-rose-100 text-rose-800',
  sky: 'bg-sky-100 text-sky-800',
  slate: 'bg-slate-100 text-slate-800',
  blue: 'bg-blue-100 text-blue-800',
  violet: 'bg-violet-100 text-violet-800',
  emerald: 'bg-emerald-100 text-emerald-800',
  gray: 'bg-gray-100 text-gray-800',
};

interface BadgeProps {
  color: BadgeColor;
  children: ReactNode;
  className?: string;
}

export function Badge({ color, children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${COLOR_CLASSES[color]} ${className}`}
    >
      {children}
    </span>
  );
}
