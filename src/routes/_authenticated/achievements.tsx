import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { BadgeMedallion } from "@/components/BadgeMedallion";
import { resolveAchievementIcon } from "@/lib/utils";
import { RARITY_STYLE, type Rarity } from "@/lib/museum";

export const Route = createFileRoute("/_authenticated/achievements")({
  component: AchievementsPage,
});

/** IDs of badges that use emoji (no JPG file) — hidden from the displayed collection. */
const HIDDEN_BADGE_IDS = new Set([
  "unique-explorer-weapons",
  "unique-explorer-regalia",
  "unique-explorer-music",
  "unique-explorer-crafts",
  "unique-explorer-toys",
]);

async function fetchAll() {
  const [{ data: badges }, { data: achievements }, { data: earnedBadges }, { data: earnedAch }] = await Promise.all([
    supabase.from("badges").select("*").order("sort_order"),
    supabase.from("achievements").select("*").order("sort_order"),
    supabase.from("user_badges").select("badge_id"),
    supabase.from("user_achievements").select("achievement_id"),
  ]);
  const earnedBadgeIds = new Set((earnedBadges ?? []).map((b) => b.badge_id));
  const earnedAchIds = new Set((earnedAch ?? []).map((a) => a.achievement_id));

  // Merge all items into one list, filtering out hidden badges
  const all: Array<{
    id: string;
    name_bm: string;
    name_en: string;
    description_bm: string;
    description_en: string;
    icon: string;
    rarity: Rarity;
    sort_order: number;
    earned: boolean;
  }> = [];

  for (const b of badges ?? []) {
    if (HIDDEN_BADGE_IDS.has(b.id)) continue;
    all.push({ ...b, earned: earnedBadgeIds.has(b.id), sort_order: b.sort_order, rarity: (b.rarity ?? "common") as Rarity });
  }
  for (const a of achievements ?? []) {
    all.push({ ...a, earned: earnedAchIds.has(a.id), rarity: (a.rarity ?? "common") as Rarity, sort_order: a.sort_order + 100 });
  }

  // Sort by sort_order
  all.sort((a, b) => a.sort_order - b.sort_order);

  return all;
}

function AchievementsPage() {
  const { t, lang } = useI18n();
  const { data } = useQuery({ queryKey: ["achievements-unified"], queryFn: fetchAll });
  if (!data) return <p className="text-sm text-muted-foreground">…</p>;

  const earned = data.filter((d) => d.earned).length;
  const total = data.length;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{t("nav_achievements")}</p>
        <h1 className="font-display text-3xl">{t("profile_earned_all")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("ach_locked_hint")} · <span className="font-display text-ink">{earned}/{total}</span></p>
      </header>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        {data.map((item) => {
          const icon = resolveAchievementIcon(item.icon, item.id);
          const name = lang === "bm" ? item.name_bm : item.name_en;
          const desc = lang === "bm" ? item.description_bm : item.description_en;
          return (
            <div key={item.id} className={`game-card flex flex-col items-center gap-2 p-4 ${!item.earned ? "opacity-90" : ""}`}>
              <BadgeMedallion
                icon={icon}
                label={item.earned ? name : "???"}
                rarity={item.rarity ?? "common"}
                locked={!item.earned}
                size="md"
              />
              <p className="text-center text-xs text-muted-foreground line-clamp-2">
                {item.earned ? desc : t("ach_locked_hint")}
              </p>
              <span className="chip mt-auto" style={{ borderColor: RARITY_STYLE[item.rarity ?? "common"].ring, color: RARITY_STYLE[item.rarity ?? "common"].ring }}>
                {item.rarity}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
