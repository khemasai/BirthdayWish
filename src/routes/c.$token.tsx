import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

const HOLD_MS = 950;

function LetterReveal({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  return (
    <span className={`inline-block preserve3d ${className ?? ""}`} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          aria-hidden="true"
          className="inline-block letter3d"
          style={{ animationDelay: `${delay + i * 0.06}s` }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}
import { Confetti } from "@/components/Confetti";
import { PortfolioLink } from "@/components/PortfolioLink";
import { getTheme } from "@/lib/card";
import { loadCard } from "@/lib/cards.api";

export const Route = createFileRoute("/c/$token")({
  loader: async ({ params }) => ({ card: await loadCard(params.token) }),
  head: () => ({
    meta: [
      { title: "A Birthday Card Just For You — PartyPop" },
      {
        name: "description",
        content:
          "Someone sent you an animated birthday card. Tap the envelope for a confetti-filled reveal.",
      },
      { property: "og:title", content: "You've got a birthday card 🎉" },
      {
        property: "og:description",
        content: "Tap to open your card and let the confetti fly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CardView,
});

function CardView() {
  const { card: data } = Route.useLoaderData();
  const [open, setOpen] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [holding, setHolding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = getTheme(data?.theme ?? "cosmos");

  const clearHold = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  const startHold = () => {
    if (holding) return;
    setHolding(true);
    clearHold();
    timer.current = setTimeout(() => setOpen(true), HOLD_MS);
  };
  const cancelHold = () => {
    setHolding(false);
    clearHold();
  };
  useEffect(() => clearHold, []);


  if (!data) {
    return (
      <div className="min-h-screen grid place-items-center font-body bg-gradient-to-br from-brand via-purple-400 to-brand2 px-6 text-center">
        <div className="bg-white/95 rounded-3xl p-8 max-w-sm shadow-2xl">
          <p className="text-4xl">🎈</p>
          <h1 className="font-display font-bold text-2xl text-ink mt-3">
            This card link looks broken
          </h1>
          <p className="text-ink/60 text-sm mt-2">
            Ask the sender for a fresh link, or make your own card.
          </p>
          <Link
            to="/"
            className="inline-block mt-5 font-display font-semibold text-ink px-5 py-2.5 rounded-2xl bg-gradient-to-r from-accent via-gold to-accent shine"
          >
            Create a card
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen w-full font-body text-ink relative overflow-hidden flex flex-col bg-gradient-to-br from-brand via-purple-400 to-brand2`}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1.5px)",
          backgroundSize: "22px 22px",
        }}
      />
      {open && <Confetti key={burstKey} colors={t.confetti} count={48} burst />}

      <main className="relative z-10 flex-1 grid place-items-center px-6 py-12 scene">
        {!open ? (
          <button
            onPointerDown={startHold}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            onPointerCancel={cancelHold}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                startHold();
              }
            }}
            onKeyUp={cancelHold}
            className="pop group relative w-full max-w-sm text-center focus:outline-none preserve3d touch-none select-none"
            aria-label="Press and hold the wax seal to open your birthday card"
          >
            <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-gold via-accent to-brand2 blur-xl opacity-60 transition-opacity duration-300 group-hover:opacity-95" />
            <div
              className={`envelope3d preserve3d transition-transform duration-300 group-hover:-translate-y-1 ${holding ? "rumble" : ""}`}
            >
              <div className={`relative rounded-[1.8rem] p-[3px] shine overflow-hidden ${t.card}`}>
                <span className="sheen" />
                <div className={`rounded-[1.6rem] ${t.inner} px-8 pt-12 pb-16`}>
                  <p className="text-5xl wobble">✉️</p>
                  <p className={`mt-4 text-[11px] font-bold uppercase tracking-widest ${t.mutedText}`}>
                    Sealed for
                  </p>
                  <p className={`font-display font-bold text-4xl mt-1 break-words ${t.accentText}`}>
                    <LetterReveal text={data.to || "You"} delay={0.35} />
                  </p>

                  <p className={`mt-6 text-[11px] font-bold uppercase tracking-[0.2em] ${t.mutedText}`}>
                    {holding ? "Almost there…" : "Press & hold the seal"}
                  </p>
                </div>
              </div>

              <div className="pointer-events-none absolute left-1/2 -bottom-9 -translate-x-1/2">
                <div className="relative grid place-items-center h-24 w-24">
                  <svg className="absolute inset-0 h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255,255,255,.28)"
                      strokeWidth="5"
                    />
                    {holding && (
                      <circle
                        className="seal-ring"
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="var(--color-gold)"
                        strokeWidth="5"
                        strokeLinecap="round"
                        pathLength={100}
                      />
                    )}
                  </svg>
                  <span className="absolute inset-[6px] rounded-full bg-gradient-to-br from-accent via-gold to-accent shine shadow-xl shadow-accent/50" />
                  <span
                    className={`relative text-3xl transition-transform duration-200 ${holding ? "scale-90" : "peek"}`}
                  >
                    🎉
                  </span>
                </div>
              </div>

              <div
                className="pointer-events-none absolute inset-x-6 -bottom-5 h-6 rounded-[50%] bg-ink/40 blur-lg -z-10"
                aria-hidden="true"
              />
            </div>
          </button>

        ) : (
          <div className="relative w-full max-w-sm preserve3d">
            <span className="absolute -top-8 left-2 text-gold text-2xl twinkle">✦</span>
            <span
              className="absolute -bottom-6 right-2 text-white text-xl twinkle"
              style={{ animationDelay: ".8s" }}
            >
              ✦
            </span>
            <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-gold via-accent to-brand2 blur-xl opacity-60" />
            <div
              className={`pointer-events-none lid3d absolute inset-x-0 top-0 h-1/2 rounded-t-[1.8rem] ${t.card} z-20`}
            />
            <div className="card3d preserve3d">
              <div className="card3d-float preserve3d">
                <div className={`relative rounded-[1.8rem] p-[3px] shine overflow-hidden ${t.card}`}>
                  <span className="sheen" />
                  <div className={`relative rounded-[1.6rem] ${t.inner} p-8 text-center overflow-hidden transition-colors duration-500`}>
                    <Confetti colors={t.confetti} count={8} />
                    <p className="text-5xl rise" style={{ animationDelay: ".5s" }}>
                      🎂
                    </p>
                    <p
                      className={`font-display font-bold text-3xl mt-2 text-transparent bg-clip-text rise ${t.title}`}
                      style={{ animationDelay: ".65s" }}
                    >
                      Happy Birthday
                    </p>
                    <h1
                      className={`font-display font-semibold text-4xl mt-1 break-words rise ${t.accentText}`}
                      style={{ animationDelay: ".8s" }}
                    >
                      {data.to || "Friend"}!
                    </h1>
                    <p
                      className={`text-sm mt-4 leading-relaxed whitespace-pre-wrap rise ${t.bodyText}`}
                      style={{ animationDelay: ".95s" }}
                    >
                      {data.message}
                    </p>
                    <div
                      className={`mt-5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest rise ${t.mutedText}`}
                      style={{ animationDelay: "1.1s" }}
                    >
                      <span>✦</span>
                      <span>from {data.from || "someone lovely"}</span>
                      <span>✦</span>
                    </div>

                  </div>
                </div>
              </div>
              <div
                className="pointer-events-none absolute inset-x-8 -bottom-6 h-7 rounded-[50%] bg-ink/40 blur-lg"
                aria-hidden="true"
              />
            </div>
            <button
              onClick={() => setBurstKey((k) => k + 1)}
              className="relative z-30 mt-8 w-full font-display font-semibold text-ink text-sm px-5 py-3 rounded-2xl bg-gradient-to-r from-accent via-gold to-accent shine shadow-lg shadow-accent/40 transition-transform hover:scale-[1.02] active:scale-95"
            >
              Pop the confetti again 🎉
            </button>
            <Link
              to="/"
              className="relative z-30 mt-3 block text-center font-display font-semibold text-ink text-sm px-5 py-3 rounded-2xl bg-cream shadow-md transition-transform hover:scale-[1.02] active:scale-95"
            >
              Create your own card ↗
            </Link>
          </div>
        )}
      </main>


      <footer className="relative z-10 px-6 sm:px-12 pb-10 pt-4 text-white/70 text-xs text-center flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
        <span>Made with PartyPop Studio by HEMASAI</span>
        <PortfolioLink />
      </footer>

    </div>
  );
}
