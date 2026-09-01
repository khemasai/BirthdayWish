import { supabase } from "@/integrations/supabase/client";
import { decodeCard, type CardData, type ThemeId } from "@/lib/card";

const THEME_IDS: ThemeId[] = ["cosmos", "candy", "neon", "glam"];

export const MAX_TO = 60;
export const MAX_MESSAGE = 600;
export const MAX_FROM = 60;

export function normalizeCard(data: CardData): CardData {
  return {
    to: data.to.trim().slice(0, MAX_TO),
    message: data.message.trim().slice(0, MAX_MESSAGE),
    from: data.from.trim().slice(0, MAX_FROM),
    theme: THEME_IDS.includes(data.theme) ? data.theme : "cosmos",
  };
}

/** Saves the card and returns its short code (e.g. "k7fq2mx"). */
export async function saveCard(input: CardData): Promise<string> {
  const card = normalizeCard(input);
  if (!card.to) throw new Error("Add a name before creating the card.");

  const { data, error } = await supabase
    .from("cards")
    .insert({
      to_name: card.to,
      message: card.message,
      from_name: card.from,
      theme: card.theme,
    })
    .select("code")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not save the card. Please try again.");
  }
  return data.code;
}

/**
 * Looks a card up by its short code. Long legacy links (base64 payload in the
 * URL) still work: they decode locally when there is no matching row.
 */
export async function loadCard(token: string): Promise<CardData | null> {
  if (/^[23456789abcdefghijkmnpqrstuvwxyz]{4,16}$/.test(token)) {
    const { data } = await supabase
      .from("cards")
      .select("to_name, message, from_name, theme")
      .eq("code", token)
      .maybeSingle();

    if (data) {
      return {
        to: data.to_name,
        message: data.message,
        from: data.from_name,
        theme: (THEME_IDS.includes(data.theme as ThemeId) ? data.theme : "cosmos") as ThemeId,
      };
    }
  }
  return decodeCard(token);
}
