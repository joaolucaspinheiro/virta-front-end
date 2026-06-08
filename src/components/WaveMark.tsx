type Props = { className?: string };

export function WaveMark({ className }: Props) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 18c3-3 6-3 9 0s6 3 9 0 6-3 9 0 6 3 9 0"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M6 26c3-3 6-3 9 0s6 3 9 0 6-3 9 0 6 3 9 0"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M6 34c3-3 6-3 9 0s6 3 9 0 6-3 9 0 6 3 9 0"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}
