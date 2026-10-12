import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={cn('text-primary', className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="echo-grad" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="currentColor" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
      <rect
        x="3"
        y="3"
        width="34"
        height="34"
        rx="10"
        className="fill-[url(#echo-grad)]"
      />
      {/* echo wave rings */}
      <g stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.95">
        <path d="M11 20 q3 -6 6 0 t6 0 t6 0" fill="none" opacity="0.5" />
        <path d="M13 20 q2.5 -4.5 5 0 t5 0 t4 0" fill="none" />
        <circle cx="20" cy="20" r="1.6" fill="white" stroke="none" />
      </g>
    </svg>
  );
}
