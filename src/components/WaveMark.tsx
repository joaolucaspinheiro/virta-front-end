type Props = { className?: string };

/**
 * Three stacked waves that flow horizontally. Each path is drawn wider than the
 * 48x48 viewBox (clipped by it) and shifted left by exactly one wavelength (12
 * units), so the translate loop is seamless. Different durations per line give
 * a layered, water-like parallax.
 */
const WAVES = [
  { y: 18, opacity: 1, dur: "2.2s" },
  { y: 26, opacity: 0.75, dur: "2.8s" },
  { y: 34, opacity: 0.45, dur: "3.4s" },
];

/** Wave height: control-point offset of each arch. Higher = more pronounced. */
const AMP = 6;

/** Repeating wave path across x = -12..60, one arch every 6 units. */
function wavePath(y: number): string {
  return `M-12 ${y} q3 -${AMP} 6 0 ${"t6 0 ".repeat(11).trim()}`;
}

export function WaveMark({ className }: Props) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      {WAVES.map((w) => (
        <g key={w.y} opacity={w.opacity}>
          <path
            d={wavePath(w.y)}
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <animateTransform
            attributeName="transform"
            type="translate"
            from="0 0"
            to="-12 0"
            dur={w.dur}
            repeatCount="indefinite"
          />
        </g>
      ))}
    </svg>
  );
}
