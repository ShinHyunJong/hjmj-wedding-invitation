interface Props {
  initials: string;
  className?: string;
}

/** 버건디 실링왁스 (SVG). 종이 청첩장 표지의 왁스 실을 모티프로 그린 것. */
export default function WaxSeal({ initials, className = "" }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="실링왁스">
      <defs>
        <radialGradient id="wax" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#c8323f" />
          <stop offset="55%" stopColor="var(--color-primary)" />
          <stop offset="100%" stopColor="#5d0b14" />
        </radialGradient>
        <radialGradient id="waxHi" cx="30%" cy="25%" r="40%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* 울퉁불퉁한 왁스 외곽 */}
      <path
        fill="url(#wax)"
        d="M60 6c9 0 14 5 21 6s15-2 21 5 5 14 8 21 8 12 6 21-9 12-11 19-1 16-8 21-15 3-22 6-13 8-21 6-11-8-19-11-17-2-22-9-2-15-6-22S1 57 3 49s10-12 13-19 1-16 8-21 15-3 22-6S51 6 60 6z"
      />
      <circle cx="60" cy="60" r="38" fill="none" stroke="#f3c7cc" strokeOpacity="0.55" strokeWidth="1.2" />
      <circle cx="60" cy="60" r="33" fill="none" stroke="#3f0810" strokeOpacity="0.45" strokeWidth="0.8" />
      <text
        x="60"
        y="72"
        textAnchor="middle"
        fontFamily="var(--font-script)"
        fontSize="38"
        fill="#f6d5d9"
        fillOpacity="0.9"
      >
        {initials}
      </text>
      <path fill="url(#waxHi)" d="M60 6c9 0 14 5 21 6s15-2 21 5 5 14 8 21 8 12 6 21-9 12-11 19-1 16-8 21-15 3-22 6-13 8-21 6-11-8-19-11-17-2-22-9-2-15-6-22S1 57 3 49s10-12 13-19 1-16 8-21 15-3 22-6S51 6 60 6z" />
    </svg>
  );
}
