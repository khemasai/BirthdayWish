export type ThemeId = "cosmos" | "candy" | "neon" | "glam";

export type CardData = {
  to: string;
  message: string;
  from: string;
  theme: ThemeId;
};

export const THEMES: {
  id: ThemeId;
  name: string;
  swatch: string;
  card: string;
  inner: string;
  accentText: string;
  bodyText: string;
  mutedText: string;
  title: string;
  confetti: string[];
}[] = [
  {
    id: "cosmos",
    name: "Cosmos",
    swatch: "bg-gradient-to-br from-brand to-brand2",
    card: "bg-gradient-to-br from-brand2 via-brand to-gold",
    inner: "bg-gradient-to-b from-ink via-[#3b2f7a] to-brand",
    accentText: "text-gold",
    bodyText: "text-cream/85",
    mutedText: "text-cream/60",
    title: "bg-gradient-to-r from-gold via-brand2 to-cream",
    confetti: ["#8a63f0", "#4bd0ff", "#ffd54a", "#ff5fa2"],
  },
  {
    id: "candy",
    name: "Candy",
    swatch: "bg-gradient-to-br from-accent to-gold",
    card: "bg-gradient-to-br from-accent via-gold to-accent",
    inner: "bg-gradient-to-b from-[#ffe3ef] via-cream to-[#ffeec2]",
    accentText: "text-accent",
    bodyText: "text-ink/80",
    mutedText: "text-ink/55",
    title: "bg-gradient-to-r from-accent via-brand to-gold",
    confetti: ["#ff5fa2", "#ffd54a", "#ffffff", "#8a63f0"],
  },
  {
    id: "neon",
    name: "Neon",
    swatch: "bg-gradient-to-br from-green to-brand2",
    card: "bg-gradient-to-br from-green via-brand2 to-green",
    inner: "bg-gradient-to-b from-[#06232e] via-[#0b3b46] to-[#0a4a44]",
    accentText: "text-green",
    bodyText: "text-cream/85",
    mutedText: "text-brand2/80",
    title: "bg-gradient-to-r from-green via-brand2 to-cream",
    confetti: ["#57e0a0", "#4bd0ff", "#ffd54a", "#8a63f0"],
  },
  {
    id: "glam",
    name: "Glam",
    swatch: "bg-gradient-to-br from-ink to-gold",
    card: "bg-gradient-to-br from-gold via-cream to-gold",
    inner: "bg-gradient-to-b from-[#1b1636] via-ink to-[#3a2a5f]",
    accentText: "text-gold",
    bodyText: "text-cream/85",
    mutedText: "text-gold/70",
    title: "bg-gradient-to-r from-gold via-cream to-accent",
    confetti: ["#ffd54a", "#8a63f0", "#ffffff", "#ff5fa2"],
  },
];


export const getTheme = (id: string) =>
  THEMES.find((t) => t.id === id) ?? THEMES[0]!;

export function encodeCard(data: CardData): string {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeCard(token: string): CardData | null {
  try {
    const b64 = token.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64.padEnd(Math.ceil(b64.length / 4) * 4, "="));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    if (typeof parsed?.to !== "string") return null;
    return {
      to: String(parsed.to),
      message: String(parsed.message ?? ""),
      from: String(parsed.from ?? ""),
      theme: (parsed.theme ?? "cosmos") as ThemeId,
    };
  } catch {
    return null;
  }
}
