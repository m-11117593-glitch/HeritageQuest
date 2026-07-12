-- Leaderboard seasons
CREATE TABLE public.leaderboard_seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_bm TEXT NOT NULL,
  name_en TEXT NOT NULL,
  season_type TEXT NOT NULL CHECK (season_type IN ('weekly', 'monthly')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'finalized')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finalized_at TIMESTAMPTZ
);
GRANT SELECT ON public.leaderboard_seasons TO authenticated;
GRANT ALL ON public.leaderboard_seasons TO service_role;
ALTER TABLE public.leaderboard_seasons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "seasons readable" ON public.leaderboard_seasons FOR SELECT TO authenticated USING (true);

-- Season entries (snapshot of rankings at season end / query time)
CREATE TABLE public.leaderboard_season_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES public.leaderboard_seasons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rank INT NOT NULL,
  total_exp INT NOT NULL DEFAULT 0,
  level INT NOT NULL DEFAULT 1,
  scan_count INT NOT NULL DEFAULT 0,
  badge_count INT NOT NULL DEFAULT 0,
  reward_points INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (season_id, user_id)
);
GRANT SELECT ON public.leaderboard_season_entries TO authenticated;
GRANT ALL ON public.leaderboard_season_entries TO service_role;
ALTER TABLE public.leaderboard_season_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "entries readable" ON public.leaderboard_season_entries FOR SELECT TO authenticated USING (true);

-- Seed the first season starting from July 11, 2026
INSERT INTO public.leaderboard_seasons (name_bm, name_en, season_type, start_date, end_date, status)
VALUES ('Musim 1', 'Season 1', 'weekly', '2026-07-11T00:00:00Z', '2026-07-18T00:00:00Z', 'active');
