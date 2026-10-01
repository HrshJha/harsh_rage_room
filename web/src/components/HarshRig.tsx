export type Expression =
  | 'smug'
  | 'nervous'
  | 'hit'
  | 'asleep'
  | 'kind'
  | 'ko'
  | 'slapped'
  | 'punched'
  | 'dazed'
  | 'splatted'
  | 'roasted'
  | 'shocked';
export function HarshRig({
  expression = 'smug',
  ego = 100,
  className = '',
}: {
  expression?: Expression;
  ego?: number;
  className?: string;
}) {
  const hurt = ['hit', 'slapped', 'punched'].includes(expression),
    embarrassed = expression === 'roasted',
    stunned = expression === 'dazed',
    wide = expression === 'shocked' || expression === 'splatted',
    ko = expression === 'ko',
    sleep = expression === 'asleep';
  return (
    <svg
      className={`harsh-rig ${className} expression-${expression}`}
      viewBox="0 0 440 520"
      role="img"
      aria-label={`Cartoon Harsh looking ${expression}`}
    >
      <defs>
        <pattern id="hoodie-dots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#6b3324" opacity=".25" />
        </pattern>
      </defs>
      <ellipse id="shadow" cx="226" cy="486" rx="112" ry="17" fill="#080909" opacity=".2" />
      <g
        id="harsh-root"
        stroke="#211c18"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g id="body">
          <g id="leg-l">
            <path fill="#292927" d="m155 387-8 81 54 1 21-83Z" />
            <path fill="#fff0d7" d="M143 456h59l3 26q-15 10-73 4-12-10 11-30Z" />
            <path d="M150 475h42m-41-12 13 1m-7 7 14 1" />
            <path stroke="#d9c9af" d="M138 483h60" />
          </g>
          <g id="leg-r">
            <path fill="#292927" d="m224 385 16 83 55-2-11-88Z" />
            <path fill="#fff0d7" d="M242 456h52q34 24 19 29-47 9-76-2Z" />
            <path d="m254 464 14-1m-11 10 16-1" />
            <path stroke="#d9c9af" d="m245 482 59-1" />
          </g>
          <path
            id="torso"
            data-zone="torso"
            fill="#bd532e"
            d="M156 271q66-22 127 0l32 112q-7 29-91 33-80 3-98-24Z"
          />
          <path
            fill="url(#hoodie-dots)"
            stroke="none"
            d="m149 315 144-11 22 79q-7 29-91 33-80 3-98-24Z"
          />
          <path fill="#713a29" d="M158 275q-5 43 62 52 66-14 62-52l-40-20Z" />
          <path fill="#e9a77c" d="m185 248 0 35q32 40 66-1l-2-38Z" />
          <path
            fill="#d77542"
            d="m160 274 24 1q-2 25 35 39l-20 30-47-42Zm94-2 28 1 9 30-54 41-17-30q31-16 34-42Z"
          />
          <path stroke="#f4dfc2" strokeWidth="4" d="m196 322-4 33m48-34 7 30" />
          <path fill="#9c4229" d="m177 369-13 25q58 20 115-2l-12-23Z" />
          <path d="m190 376-6 13m64-14 7 12" stroke="#ed9460" />
          <g id="arm-l">
            <path fill="#c46236" d="M158 279q-30-8-45 35l-23 43q-10 26 23 34 25-1 44-37l14-46" />
            <path fill="#f3b78a" d="M88 354q-14 1-10 17l-5 12q2 19 22 19 12-3 22-17l-7-24Z" />
            <path d="m82 382 11 2m-7 9 12-1" strokeWidth="3" />
            <path fill="#e18a4e" d="m92 345 28 13-9 20-28-11Z" />
          </g>
          <g id="arm-r">
            <path fill="#c46236" d="M282 280q33-9 44 34l25 45q7 24-22 34-21-2-45-39l-9-42" />
            <path fill="#f3b78a" d="M350 355q17 3 12 18l5 13q-4 19-23 16-14-3-23-20l10-24Z" />
            <path d="m359 383-11 1m7 9-11-2" strokeWidth="3" />
            <path fill="#e18a4e" d="m320 361 26-15 10 22-27 13Z" />
          </g>
          <path d="m201 350 15-12 15 12-15 12Z" fill="#f2d6ad" stroke="none" />
          <g id="laptop-prop" opacity="0">
            <path fill="#514359" d="M123 334h201l-18 100H140Z" />
            <circle cx="224" cy="379" r="13" fill="#c5afd9" />
          </g>
        </g>
        <g id="head">
          <path
            id="hair-back"
            fill="#25221f"
            d="M130 165Q91 60 171 43q82-45 129 24 38 34 23 98l-38 72-130-4Z"
          />
          <path id="ear-l" fill="#edac80" d="M133 172q-37-18-36 20 6 36 38 25Z" />
          <path stroke="#cc855f" strokeWidth="4" d="M115 183q-10 5 4 19" />
          <path id="ear-r" fill="#edac80" d="M309 172q37-18 36 20-6 36-38 25Z" />
          <path stroke="#cc855f" strokeWidth="4" d="M328 183q10 5-4 19" />
          <path
            id="face"
            data-zone="cheeks"
            fill="#f7bc8c"
            d="M132 129q14-37 90-39 74 0 87 43l3 74q-6 72-89 82-82-10-94-77Z"
          />
          <path
            fill="#e9a277"
            stroke="none"
            d="M132 208q32 58 90 62 62-7 89-64-8 72-88 83-80-10-91-81Z"
          />
          <path
            id="hair-tuft"
            data-zone="hair"
            fill="#25221f"
            d="M131 166q-14-21-13-46-16 2-22-8 32-9 37-25-17-5-20-21 40 5 61-16-11-9-10-22 22 15 61 4 38-13 53 13 54-5 59 35 21 20-5 58l-19 30-8-55q-22-1-48-25-45 33-92 23-21 22-34 13Z"
          />
          <path
            stroke="#51473d"
            strokeWidth="5"
            d="M146 92q48 8 89-29m14-8q27-1 36 21m-127 1 25-13"
          />
          <g id="brow-l">
            <path d={hurt ? 'M145 146q18 16 41-2' : 'M145 137q19-10 41-3'} strokeWidth="9" />
          </g>
          <g id="brow-r">
            <path d={hurt ? 'M250 144q23 14 44-2' : 'M248 132q23-1 44 10'} strokeWidth="9" />
          </g>
          <g id="eyes" opacity={stunned ? 0 : 1}>
            <g id="eye-l">
              {sleep || ko ? (
                <path
                  d={ko ? 'm152 162 25 21m-25 0 25-21' : 'M146 171q20 14 39 0'}
                  strokeWidth="5"
                />
              ) : (
                <>
                  <ellipse
                    cx="169"
                    cy="176"
                    rx="22"
                    ry={hurt ? 5 : embarrassed ? 12 : wide ? 25 : 22}
                    fill="#fff9ec"
                    stroke="none"
                  />
                  <g className="pupil">
                    <ellipse cx="176" cy="178" rx="7" ry="10" fill="#211c18" stroke="none" />
                    <circle cx="178" cy="174" r="2" fill="white" stroke="none" />
                  </g>
                  <path d="M146 162h42" strokeWidth="3" opacity={hurt ? 0 : 1} />
                </>
              )}
            </g>
            <g id="eye-r">
              {sleep || ko ? (
                <path
                  d={ko ? 'm258 162 25 21m-25 0 25-21' : 'M253 171q20 14 39 0'}
                  strokeWidth="5"
                />
              ) : (
                <>
                  <ellipse
                    cx="273"
                    cy="176"
                    rx="22"
                    ry={hurt ? 5 : embarrassed ? 12 : wide ? 25 : 22}
                    fill="#fff9ec"
                    stroke="none"
                  />
                  <g className="pupil">
                    <ellipse cx="278" cy="178" rx="7" ry="10" fill="#211c18" stroke="none" />
                    <circle cx="280" cy="174" r="2" fill="white" stroke="none" />
                  </g>
                  <path d="M252 162h42" strokeWidth="3" opacity={hurt ? 0 : 1} />
                </>
              )}
            </g>
          </g>
          <g id="glasses" data-zone="glasses">
            <path
              fill="#dec9a8"
              fillOpacity=".13"
              strokeWidth="7"
              d="M136 153h61l-3 38q-3 16-30 14-25-1-26-17Zm107 0h61l-2 35q-1 17-26 17-27 2-30-14Z"
            />
            <path strokeWidth="6" d="M198 164q21-14 44 0m-105-4-10-4m179 5 9-5" />
            <path stroke="#fff7df" opacity=".6" strokeWidth="3" d="m149 160-6 14m112-14-4 13" />
          </g>
          <path
            id="nose"
            data-zone="nose"
            fill="#efaa7b"
            d="m218 180-8 26q10 10 25 0"
            strokeWidth="3"
          />
          <ellipse
            id="cheek-l"
            cx="156"
            cy="218"
            rx="18"
            ry="8"
            fill={expression === 'kind' || embarrassed ? '#ef7690' : '#e68f72'}
            stroke="none"
            opacity=".6"
          />
          <ellipse
            id="cheek-r"
            cx="285"
            cy="218"
            rx="18"
            ry="8"
            fill={expression === 'kind' || embarrassed ? '#ef7690' : '#e68f72'}
            stroke="none"
            opacity=".6"
          />
          <g id="mouth">
            {stunned ? (
              <path d="M198 241q10-14 19 0t20 0" fill="none" />
            ) : embarrassed ? (
              <path d="m203 246 37 0" strokeWidth="5" />
            ) : hurt || ko || wide ? (
              <ellipse cx="223" cy="240" rx="20" ry="19" fill="#512a38" />
            ) : sleep ? (
              <ellipse cx="222" cy="241" rx="9" ry="12" fill="#512a38" />
            ) : expression === 'nervous' ? (
              <>
                <path d="M198 242q21-15 44 0" />
                <path d="M204 240h32" stroke="#fff6df" />
              </>
            ) : (
              <>
                <path fill="#fff6df" d="M192 232q30 18 63-5-7 28-32 30-23-1-31-25Z" />
                <path d="M197 242q24 11 50-5" strokeWidth="2" />
              </>
            )}
          </g>
          <g id="sweat" opacity={expression === 'nervous' || ego < 50 ? 1 : 0}>
            <path fill="#85d8e1" d="M307 123q27 26 14 34-20 4-14-34Z" />
          </g>
          <g id="bandaid-1" opacity={ego < 75 ? 1 : 0} transform="rotate(-25 158 229)">
            <rect x="135" y="219" width="45" height="20" rx="7" fill="#ffe3ab" strokeWidth="2" />
            <path d="M151 220v18m13-18v18" stroke="#c69065" strokeWidth="2" />
          </g>
          <g id="bump-1" opacity={ego < 50 ? 1 : 0}>
            <path fill="#ec9290" d="M272 123q3-33 25-16l1 23" />
            <path d="m279 109 11 8" strokeWidth="2" />
          </g>
          <g id="bandaid-2" opacity={ego < 25 ? 1 : 0} transform="rotate(30 280 228)">
            <rect x="262" y="220" width="36" height="17" rx="6" fill="#ffe3ab" strokeWidth="2" />
          </g>
          <g id="tear-l" opacity="0">
            <path fill="#9de7ef" d="M145 201q-17 30-3 31 13-1 3-31Z" />
          </g>
          <g id="spiral" opacity={stunned ? 1 : 0}>
            <path d="M154 174q18-18 25 1-2 15-19 6-6-10 6-11m92 4q18-18 25 1-2 15-19 6-6-10 6-11" />
          </g>
        </g>
        <g id="decal-layer" strokeWidth="2" />
        <g id="zzz" opacity={sleep ? 1 : 0} fill="#fff0d8" strokeWidth="2">
          <text x="335" y="123" fontSize="36" fontFamily="Bangers">
            Z
          </text>
          <text x="363" y="84" fontSize="25" fontFamily="Bangers">
            z
          </text>
        </g>
        <g id="stars" opacity={ego < 25 ? 1 : 0} fill="#ffd55b" strokeWidth="2">
          <path d="m92 119 5 10 11 1-8 8 2 11-10-5-10 5 2-11-8-8 11-1Z" />
          <path d="m350 104 5 10 11 1-8 8 2 11-10-5-10 5 2-11-8-8 11-1Z" />
        </g>
      </g>
    </svg>
  );
}
