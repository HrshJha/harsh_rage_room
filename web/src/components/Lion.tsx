export function Lion({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 90 95"
      className={`lion ${className}`}
      role="img"
      aria-label="Chota Sher, your tiny tattletale"
    >
      <g stroke="#281b2d" strokeWidth="3" strokeLinejoin="round">
        <path
          fill="#cf7b37"
          d="m44 5 11 9 15-2 4 15 12 9-7 15 3 13-15 6-7 15-15-5-15 5-8-14-16-7 4-15-5-13 14-9 5-15 14 2Z"
        />
        <circle cx="23" cy="32" r="8" fill="#ffc961" />
        <circle cx="66" cy="32" r="8" fill="#ffc961" />
        <path fill="#ffc961" d="M24 33q21-14 41 0l2 26Q44 86 21 58Z" />
        <path fill="#ffe2a0" stroke="none" d="M29 52q15-9 30 0v13q-15 13-30-1Z" />
        <path d="m44 52-6-6h12Z" fill="#281b2d" />
        <path d="M44 52v7m-12-3q4 9 12 3 8 6 12-3" fill="none" />
        <circle cx="32" cy="40" r="3" fill="#281b2d" stroke="none" />
        <circle cx="57" cy="40" r="3" fill="#281b2d" stroke="none" />
        <path d="m27 34 9-2m17 0 9 2" />
        <path fill="#efe5d1" d="m59 69 24-2 2 18-24 2Z" />
        <path d="m59 69 13 9 11-11" fill="none" strokeWidth="2" />
      </g>
    </svg>
  );
}
