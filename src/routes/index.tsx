import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Confetti } from "@/components/Confetti";
import { THEMES, getTheme, type ThemeId } from "@/lib/card";
import { MAX_FROM, MAX_MESSAGE, MAX_TO, saveCard } from "@/lib/cards.api";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PartyPop — Make a Birthday Card & Share the Link" },
      {
        name: "description",
        content:
          "Design a glossy confetti-loaded birthday card, pick a theme, and share a magic link that opens with a party-popper reveal.",
      },
      { property: "og:title", content: "PartyPop — Birthday Cards That Pop" },
      {
        property: "og:description",
        content:
          "Create an animated birthday card in seconds and send it as a link. Themes, confetti and a big reveal included.",
      },
    ],
  }),
  component: Create,
});

function Create() {
  const [to, setTo] = useState("Maya");
  const [message, setMessage] = useState(
    "Three whole decades of being the best. Here's to the sparkle, the cake, and everything ahead.",
  );
  const [from, setFrom] = useState("The Crew");
  const [theme, setTheme] = useState<ThemeId>("cosmos");
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const t = getTheme(theme);
  const token = useMemo(
    () => encodeCard({ to, message, from, theme }),
    [to, message, from, theme],
  );

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const generate = async () => {
    const url = `${window.location.origin}/c/${token}`;
    setLink(url);
    await copy(url);
  };

  const share = async (url: string) => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: `A birthday card for ${to}`, url });
        return;
      } catch {
        /* fall through to copy */
      }
    }
    await copy(url);
  };


  return (
    <div
      className={`min-h-screen w-full font-body text-ink relative overflow-hidden bg-gradient-to-br from-brand via-purple-400 to-brand2`}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1.5px)",
          backgroundSize: "22px 22px",
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-6 sm:px-12 py-6">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl grid place-items-center text-2xl bg-gradient-to-br from-gold to-accent shadow-lg shadow-accent/40">
            🎂
          </div>
          <div>
            <p className="font-display font-bold text-white text-xl leading-none tracking-tight">
              PartyPop<span className="text-gold">.biz</span>
            </p>
            <p className="text-white/70 text-[11px] tracking-wide">
              Send the big surprise
            </p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-white/80 text-sm font-medium">
          <span>How it works</span>
          <span>Gallery</span>
          <span>Themes</span>
        </nav>
        <a
          href="#builder"
          className="font-display font-semibold text-sm text-ink bg-cream rounded-full px-5 py-2.5 shadow-md hover:scale-105 transition-transform"
        >
          Get started free
        </a>
      </header>

      <main className="relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-6 items-center px-6 sm:px-12 pt-4 pb-20 max-w-7xl mx-auto">
        <div className="pop">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ink bg-gold px-3 py-1.5 rounded-full shadow">
            ✦ Y2K birthday studio
          </span>
          <h1 className="font-display font-bold text-white text-5xl sm:text-6xl leading-[1.02] mt-5 tracking-tight drop-shadow-[0_3px_0_rgba(42,35,80,0.25)]">
            Make their
            <br />
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-white to-white shine"
            >
              whole day
            </span>{" "}
            pop
          </h1>
          <p className="text-white/85 text-lg max-w-md mt-5">
            Design a glossy, confetti-loaded card, pick a theme, and hand over a
            magic link. Open it and watch the big reveal.
          </p>

          <div
            id="builder"
            className="mt-7 max-w-md bg-white/95 backdrop-blur rounded-3xl p-5 shadow-2xl shadow-ink/20"
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-brand">
              Pick a theme
            </p>
            <div className="grid grid-cols-4 gap-2.5 mt-3">
              {THEMES.map((th) => (
                <button
                  key={th.id}
                  title={th.name}
                  aria-pressed={theme === th.id}
                  onClick={() => setTheme(th.id)}
                  className="group text-center focus:outline-none"
                >
                  <span
                    className={`block aspect-square rounded-xl ${th.swatch} transition-all duration-300 group-hover:-translate-y-0.5 group-active:scale-95 ${
                      theme === th.id
                        ? "ring-4 ring-brand/40 shadow-inner scale-105"
                        : "shadow-md opacity-80 group-hover:opacity-100"
                    }`}
                  />
                  <span
                    className={`mt-1.5 block text-[10px] font-semibold ${
                      theme === th.id ? "text-brand" : "text-ink/40"
                    }`}
                  >
                    {th.name}
                  </span>
                </button>
              ))}
            </div>


            <label className="block text-[11px] font-bold uppercase tracking-widest text-brand mt-4">
              Their name
            </label>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full mt-1.5 rounded-xl border-2 border-brand/20 bg-cream px-4 py-2.5 text-sm text-ink outline-none focus:border-brand"
              placeholder="Maya"
            />

            <label className="block text-[11px] font-bold uppercase tracking-widest text-brand mt-4">
              Your wish
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full mt-1.5 rounded-xl border-2 border-brand/20 bg-cream px-4 py-2.5 text-sm text-ink outline-none focus:border-brand resize-none"
              placeholder="Happy 30th, Maya! 🎈"
            />

            <label className="block text-[11px] font-bold uppercase tracking-widest text-brand mt-4">
              From
            </label>
            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full mt-1.5 rounded-xl border-2 border-brand/20 bg-cream px-4 py-2.5 text-sm text-ink outline-none focus:border-brand"
              placeholder="The Crew"
            />

            <button
              onClick={generate}
              disabled={!to.trim()}
              className="mt-4 w-full font-display font-semibold text-ink text-lg py-3 rounded-2xl bg-gradient-to-r from-accent via-gold to-accent shine shadow-lg shadow-accent/40 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            >
              {link ? "Update card link ↻" : "Create card & get link ↗"}
            </button>

            {link && (
              <div className="mt-4 rounded-2xl bg-cream border-2 border-brand/15 p-3 rise">
                <p className="text-[11px] font-bold uppercase tracking-widest text-brand/70">
                  {copied ? "Link copied ✓" : "Your share link"}
                </p>
                <p className="mt-1 text-xs text-ink/70 break-all">{link}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => share(link)}
                    className="flex-1 text-xs font-semibold rounded-xl bg-brand text-cream py-2 transition-transform hover:scale-[1.03] active:scale-95"
                  >
                    {copied ? "Copied ✓" : "Share link"}
                  </button>
                  <Link
                    to="/c/$token"
                    params={{ token }}
                    className="flex-1 text-center text-xs font-semibold rounded-xl bg-ink text-cream py-2 transition-transform hover:scale-[1.03] active:scale-95"
                  >
                    Open card
                  </Link>
                </div>
              </div>

            )}
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-6 text-4xl">
            <span className="pop" style={{ animationDelay: ".1s" }}>
              🎉
            </span>
            <span className="pop" style={{ animationDelay: ".35s" }}>
              🎊
            </span>
            <span className="pop" style={{ animationDelay: ".6s" }}>
              🎈
            </span>
          </div>
          <span className="absolute top-10 left-2 text-gold text-2xl twinkle">✦</span>
          <span
            className="absolute bottom-8 right-4 text-white text-xl twinkle"
            style={{ animationDelay: ".8s" }}
          >
            ✦
          </span>
          <span
            className="absolute top-1/3 -right-1 text-accent text-lg twinkle"
            style={{ animationDelay: ".4s" }}
          >
            ✦
          </span>

          <div className="pop2 relative w-full max-w-sm">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-gold via-accent to-brand2 blur-xl opacity-60" />
            <div
              className={`relative rounded-[1.8rem] p-[3px] shine ${t.card}`}
            >
              <div className={`relative rounded-[1.6rem] ${t.inner} p-8 text-center overflow-hidden transition-colors duration-500`}>
                <Confetti colors={t.confetti} count={8} />
                <p className="text-5xl">🎂</p>
                <p
                  className={`font-display font-bold text-3xl mt-2 text-transparent bg-clip-text ${t.title}`}
                >
                  Happy Birthday
                </p>
                <p className="font-display font-semibold text-brand text-4xl mt-1 break-words">
                  {to || "Friend"}!
                </p>
                <p className="text-ink/70 text-sm mt-4 leading-relaxed whitespace-pre-wrap">
                  {message}
                </p>
                <div className="mt-5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-brand/70">
                  <span>✦</span>
                  <span>from {from || "someone lovely"}</span>
                  <span>✦</span>
                </div>
                <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-ink/50">
                  <span className="w-2 h-2 rounded-full bg-green inline-block" />
                  live preview
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 px-6 sm:px-12 pb-8 text-white/60 text-xs flex flex-wrap items-center gap-x-6 gap-y-2">
        <span>© 2026 PartyPop Studio</span>
        <span>Every card ships with confetti. No two the same.</span>
      </footer>
    </div>
  );
}
