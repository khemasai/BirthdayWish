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
  page: string;
  card: string;
  title: string;
  confetti: string[];
}[] = [
  {
    id: "cosmos",
    name: "Cosmos",
    swatch: "bg-gradient-to-br from-brand to-brand2",
    page: "bg-gradient-to-br from-brand via-purple-400 to-brand2",
    card: "bg-gradient-to-br from-white/90 via-gold to-accent",
    title: "bg-gradient-to-r from-brand via-accent to-gold",
    confetti: ["#8a63f0", "#4bd0ff", "#ffd54a", "#ff5fa2"],
  },
  {
    id: "candy",
    name: "Candy",
    swatch: "bg-gradient-to-br from-accent to-gold",
    page: "bg-gradient-to-br from-accent via-pink-300 to-gold",
    card: "bg-gradient-to-br from-white/90 via-accent to-gold",
    title: "bg-gradient-to-r from-accent via-brand to-gold",
    confetti: ["#ff5fa2", "#ffd54a", "#ffffff", "#8a63f0"],
  },
  {
    id: "neon",
    name: "Neon",
    swatch: "bg-gradient-to-br from-green to-brand2",
    page: "bg-gradient-to-br from-green via-teal-300 to-brand2",
    card: "bg-gradient-to-br from-white/90 via-green to-brand2",
    title: "bg-gradient-to-r from-green via-brand2 to-brand",
    confetti: ["#57e0a0", "#4bd0ff", "#ffd54a", "#8a63f0"],
  },
  {
    id: "glam",
    name: "Glam",
    swatch: "bg-gradient-to-br from-ink to-brand",
    page: "bg-gradient-to-br from-ink via-indigo-500 to-brand",
    card: "bg-gradient-to-br from-gold via-white/80 to-brand",
    title: "bg-gradient-to-r from-ink via-brand to-accent",
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
