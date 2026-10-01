import type { AttackId } from '../../../shared/contracts';
export function WeaponArt({ id, className = '' }: { id: AttackId; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`weapon-art ${className}`} aria-hidden="true">
      <g stroke="#241d17" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
        {id === 'slap' && (
          <g transform="rotate(-18 50 50)">
            <path
              fill="#ffc48b"
              d="M30 79 18 51q-3-9 5-9l11 13V25q0-11 8-8l3 28V14q6-8 11 1v30l4-27q7-6 10 2l-3 31 7-17q8-4 9 4l-7 31-13 18Z"
            />
            <path stroke="#db8d68" d="m44 58 2 15m11-18 1 15" />
            <path fill="#faf0d8" d="m31 78 35 6-3 11-32-5Z" />
          </g>
        )}
        {id === 'punch' && (
          <g transform="rotate(-20 50 50)">
            <path
              fill="#ff785f"
              d="M22 75V40q0-10 10-10l5 4V24q3-10 13-5 8-8 16 0 13-2 14 10l2 29-15 20Z"
            />
            <path fill="#ff9378" d="M21 53q-4-17 8-18l18 4q9 5 1 13l-12-1 6 13" />
            <path d="M49 21v18m14-19v22m14-13v16" />
            <path fill="#f3e6c8" d="M24 73h44v17H24Z" />
            <path d="M30 79h30m-30 5h30" />
          </g>
        )}
        {id === 'chappal' && (
          <g transform="rotate(35 50 50)">
            <path
              fill="#976c42"
              d="M31 22Q48-4 67 17q9 11 5 34L63 84q-7 18-27 9-12-5-10-18l3-39Z"
            />
            <path fill="#cfaa6c" d="M34 26q14-19 28-7 8 8 5 22L57 80q-5 11-16 6-9-3-6-13Z" />
            <path fill="none" stroke="#f8e5bc" strokeWidth="8" d="m32 51 18-14 15 13M50 37l3-16" />
            <path d="M35 77h21" opacity=".4" />
          </g>
        )}
        {id === 'bonk' && (
          <g transform="rotate(32 50 50)">
            <path fill="#d3965b" d="M44 38h14v53q-7 8-14 0Z" />
            <rect x="15" y="13" width="73" height="35" rx="6" fill="#ffce63" />
            <path fill="#e2a63d" d="M73 13h10q5 0 5 6v23q0 6-5 6H73Z" />
            <path d="M25 21v18m8-16v14M47 56h8m-8 10h8m-8 10h8" />
          </g>
        )}
        {id === 'tomato' && (
          <>
            <path
              fill="#ff654e"
              d="M14 54Q11 27 42 28q30-10 42 14 17 33-16 43-30 13-47-5-7-9-7-26Z"
            />
            <path fill="#a5c970" d="m48 34-21-6 15-7-7-12 16 9L63 9l-3 15 19 3-22 9-6 13Z" />
            <path stroke="#ffb092" strokeWidth="7" d="M28 45q-7 10-2 20" />
          </>
        )}
        {id === 'roast' && (
          <>
            <path fill="#ffe1a0" d="M10 15h78v55H49L28 88l4-18H10Z" />
            <path fill="#ff744d" d="M47 61c-18-11-15-22-3-30-1 10 11 9 9-14 22 25 17 41-6 44Z" />
            <path fill="#ffd75b" stroke="none" d="M48 55q-10-8 2-16 13 12-2 16" />
          </>
        )}
        {id === 'thunder' && (
          <>
            <path fill="#ffc175" d="M51 3 18 55h29l-5 42 42-59H57L70 3Z" />
            <path stroke="#fff0ce" strokeWidth="4" d="M48 22 32 47h23" />
          </>
        )}
        {id === 'emotional' && (
          <>
            <path fill="#e8a58c" d="M49 27Q28-1 11 25-3 48 49 90q51-40 41-62-12-29-35-6" />
            <path fill="#241d17" stroke="none" d="m50 15-9 26 16 7-16 23 8 19 16-35-13-12 12-23Z" />
            <path stroke="#ffd2e3" strokeWidth="6" d="M20 29q-8 8 1 18" />
          </>
        )}
      </g>
    </svg>
  );
}
