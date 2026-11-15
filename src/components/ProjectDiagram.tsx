import type { HomepageProject } from '../content/home';

export function ProjectDiagram({ type }: { type: HomepageProject['diagram'] }) {
  return (
    <svg viewBox="0 0 300 150" aria-hidden="true" focusable="false">
      {type === 'release' ? (
        <>
          <path
            d="M82 14V136 M82 35H213 M82 75H190 M82 115H230"
            fill="none"
            stroke="var(--line)"
            strokeWidth="2"
          />
          {[35, 75, 115].map((y, index) => (
            <g key={y} opacity={1 - index * 0.22}>
              <circle cx="82" cy={y} r="8" fill="var(--blue)" />
              <rect
                x="108"
                y={y - 4}
                width={105 - index * 17}
                height="8"
                rx="4"
                fill="var(--line)"
              />
            </g>
          ))}
        </>
      ) : type === 'cloud' ? (
        <>
          <g fill="none" stroke="var(--blue)" strokeWidth="1.8">
            <rect x="96" y="18" width="105" height="110" rx="7" />
            {[33, 64, 95].map((y) => (
              <rect key={y} x="111" y={y} width="75" height="21" rx="3" />
            ))}
            <path d="M56 74H96 M201 74H244 M150 18V5 M150 128V144" strokeDasharray="4 4" />
          </g>
          <circle cx="56" cy="74" r="7" fill="var(--blue)" />
          <circle cx="244" cy="74" r="7" fill="var(--blue)" />
        </>
      ) : (
        <>
          <rect
            x="32"
            y="12"
            width="236"
            height="126"
            rx="9"
            fill="var(--card)"
            stroke="var(--line)"
          />
          <path d="M32 38H268" stroke="var(--line)" />
          {[47, 58, 69].map((x) => (
            <circle key={x} cx={x} cy="25" r="3" fill={x === 47 ? 'var(--blue)' : 'var(--line)'} />
          ))}
          {[94, 160, 122, 177].map((width, i) => (
            <rect
              key={width}
              x="47"
              y={52 + 15 * i}
              width={width}
              height="6"
              rx="3"
              fill={i === 2 ? 'var(--blue)' : 'var(--line)'}
            />
          ))}
        </>
      )}
    </svg>
  );
}
