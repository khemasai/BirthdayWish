CREATE OR REPLACE FUNCTION public.generate_card_code()
RETURNS text
LANGUAGE plpgsql
VOLATILE
SET search_path = public
AS $$
DECLARE
  alphabet text := '23456789abcdefghijkmnpqrstuvwxyz';
  result text := '';
  i int;
BEGIN
  FOR i IN 1..7 LOOP
    result := result || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
  END LOOP;
  RETURN result;
END;
$$;

CREATE TABLE public.cards (
  code text PRIMARY KEY DEFAULT public.generate_card_code(),
  to_name text NOT NULL CHECK (char_length(to_name) BETWEEN 1 AND 60),
  message text NOT NULL DEFAULT '' CHECK (char_length(message) <= 600),
  from_name text NOT NULL DEFAULT '' CHECK (char_length(from_name) <= 60),
  theme text NOT NULL DEFAULT 'cosmos' CHECK (theme IN ('cosmos','candy','neon','glam')),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.cards TO anon;
GRANT SELECT, INSERT ON public.cards TO authenticated;
GRANT ALL ON public.cards TO service_role;

ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view a card by link"
ON public.cards FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can create a card"
ON public.cards FOR INSERT
TO anon, authenticated
WITH CHECK (true);