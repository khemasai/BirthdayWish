import { useMemo } from "react";

type Props = { colors: string[]; count?: number; burst?: boolean };

export function Confetti({ colors, count = 40, burst = false }: Props) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 97) % 100,
        color: colors[i % colors.length],
        delay: ((i * 37) % 220) / 100,
        duration: 2.6 + (((i * 53) % 200) / 100),
        size: 6 + ((i * 7) % 8),
        tx: (((i * 61) % 200) - 100) * 2,
        ty: -160 - ((i * 43) % 260),
        rot: ((i % 2 ? 1 : -1) * (240 + ((i * 71) % 300))),
      })),
    [colors, count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className={burst ? "confetti-burst" : "confetti-fall"}
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 1.6,
              background: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              "--tx": `${p.tx}px`,
              "--ty": `${p.ty}px`,
              "--rot": `${p.rot}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
