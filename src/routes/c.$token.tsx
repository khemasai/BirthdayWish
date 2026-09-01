import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Confetti } from "@/components/Confetti";
import { decodeCard, getTheme } from "@/lib/card";

export const Route = createFileRoute("/c/$token")({
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
    ],
  }),
  component: CardView,
});

function CardView() {
  const { token } = Route.useParams();
  const data = decodeCard(token);
  const [open, setOpen] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const t = getTheme(data?.theme ?? "cosmos");

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

      <main className="relative z-10 flex-1 grid place-items-center px-6 py-12">
        {!open ? (
          <button
            onClick={() => setOpen(true)}
            className="pop group relative w-full max-w-sm text-center transition-transform duration-300 hover:-translate-y-1 active:scale-95 focus:outline-none"
            aria-label="Open your birthday card"
          >
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-gold via-accent to-brand2 blur-xl opacity-60 transition-opacity duration-300 group-hover:opacity-90" />
            <div className={`relative rounded-[1.8rem] p-[3px] shine ${t.card}`}>
              <div className={`rounded-[1.6rem] ${t.inner} px-8 py-14`}>
                <p className="text-5xl wobble">✉️</p>
                <p className="mt-4 text-[11px] font-bold uppercase tracking-widest text-brand/70">
                  Sealed for
                </p>
                <p
                  className={`font-display font-bold text-4xl mt-1 break-words ${t.accentText}`}
                >
                  {data.to || "You"}
                </p>
                <p className="mt-5 inline-block font-display font-semibold text-ink text-sm px-5 py-2.5 rounded-2xl bg-gradient-to-r from-accent via-gold to-accent shine shadow-lg shadow-accent/40 transition-transform duration-300 group-hover:scale-105">
                  Tap to open 🎉
                </p>
              </div>
            </div>
          </button>

        ) : (
          <div className="relative w-full max-w-sm">
            <span className="absolute -top-8 left-2 text-gold text-2xl twinkle">✦</span>
            <span
              className="absolute -bottom-6 right-2 text-white text-xl twinkle"
              style={{ animationDelay: ".8s" }}
            >
              ✦
            </span>
            <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-gold via-accent to-brand2 blur-xl opacity-60" />
            <div
              className={`pointer-events-none lid absolute inset-x-0 top-0 h-1/2 rounded-t-[1.8rem] ${t.card} z-20`}
            />
            <div className={`relative rounded-[1.8rem] p-[3px] shine ${t.card}`}>
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
                  className="text-ink/70 text-sm mt-4 leading-relaxed whitespace-pre-wrap rise"
                  style={{ animationDelay: ".95s" }}
                >
                  {data.message}
                </p>
                <div
                  className="mt-5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-brand/70 rise"
                  style={{ animationDelay: "1.1s" }}
                >
                  <span>✦</span>
                  <span>from {data.from || "someone lovely"}</span>
                  <span>✦</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setBurstKey((k) => k + 1)}
              className="mt-6 w-full font-display font-semibold text-ink text-sm px-5 py-3 rounded-2xl bg-gradient-to-r from-accent via-gold to-accent shine shadow-lg shadow-accent/40 transition-transform hover:scale-[1.02] active:scale-95"
            >
              Pop the confetti again 🎉
            </button>
            <Link
              to="/"
              className="mt-3 block text-center font-display font-semibold text-ink text-sm px-5 py-3 rounded-2xl bg-cream shadow-md transition-transform hover:scale-[1.02] active:scale-95"
            >
              Create your own card ↗
            </Link>
          </div>
        )}
      </main>

      <footer className="relative z-10 px-6 sm:px-12 pb-8 text-white/60 text-xs text-center">
        Made with PartyPop Studio
      </footer>
    </div>
  );
}
