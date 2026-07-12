import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Trophy, Medal, Sparkles, Crown, User, RefreshCw,
  Clock, Gift, History, TrendingUp,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getLeaderboard, getSeasonHistory, type LeaderboardEntry } from "@/lib/museum.functions";
import { TOTAL_ARTIFACTS } from "@/lib/museum";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated/leaderboard")({
  component: LeaderboardPage,
});

const MEDAL_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"] as const;
const REWARD_POINTS = [15, 10, 5] as const;

function MedalIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="size-5 text-[#FFD700]" />;
  if (rank === 2) return <Medal className="size-5 text-[#C0C0C0]" />;
  if (rank === 3) return <Medal className="size-5 text-[#CD7F32]" />;
  return <span className="w-5 text-center text-sm font-bold text-muted-foreground">{rank}</span>;
}

function CountdownTimer({ endDate }: { endDate: string }) {
  const { t } = useI18n();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function update() {
      const now = new Date();
      const end = new Date(endDate);
      const diff = end.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft(t("leaderboard_ending_soon"));
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      if (days > 0) setTimeLeft(`${days}d ${hours}h ${mins}m`);
      else if (hours > 0) setTimeLeft(`${hours}h ${mins}m`);
      else setTimeLeft(`${mins}m`);
    }
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, [endDate, t]);

  return (
    <span className="tabular-nums text-xs font-semibold">
      <Clock className="mr-1 inline size-3" />
      {timeLeft}
    </span>
  );
}

function LeaderboardPage() {
  const { t, lang } = useI18n();
  const lbFn = useServerFn(getLeaderboard);
  const historyFn = useServerFn(getSeasonHistory);
  const [showHistory, setShowHistory] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => lbFn(),
    refetchInterval: 30_000,
  });

  const { data: pastSeasons } = useQuery({
    queryKey: ["season-history"],
    queryFn: () => historyFn(),
    staleTime: 60_000,
  });

  const entries = data?.entries ?? [];
  const userRank = data?.userRank;
  const season = data?.season;
  const topThree = entries.slice(0, 3);
  const rest = entries.slice(3);
  const currentUserId = entries.find((e) => e.rank === userRank)?.userId;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {t("nav_leaderboard")}
        </p>
        <h1 className="font-display text-3xl">{t("nav_leaderboard")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("leaderboard_intro")}</p>
      </header>

      {/* Season banner */}
      {season && (
        <section className="game-card bg-gradient-to-br from-primary/10 via-gold/10 to-accent/30 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              <div>
                <p className="font-display text-sm leading-tight">
                  {lang === "bm" ? season.name_bm : season.name_en}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  {season.seasonType === "weekly"
                    ? t("leaderboard_weekly")
                    : t("leaderboard_monthly")}
                </p>
              </div>
            </div>
            <CountdownTimer endDate={season.endDate} />
          </div>
        </section>
      )}

      {/* Podium — top 3 with reward badges */}
      {topThree.length > 0 && (
        <section className="game-card p-6">
          <div className="flex items-end justify-center gap-3">
            {topThree[1] && <PodiumEntry entry={topThree[1]} place={2} />}
            {topThree[0] && <PodiumEntry entry={topThree[0]} place={1} />}
            {topThree[2] && <PodiumEntry entry={topThree[2]} place={3} />}
          </div>

          {/* Reward badges for top 3 */}
          <div className="mt-4 flex items-center justify-center gap-4">
            {topThree.slice(0, 3).map((entry, i) => (
              <div
                key={entry.userId}
                className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                style={{
                  borderColor: MEDAL_COLORS[i],
                  color: MEDAL_COLORS[i],
                  background: `${MEDAL_COLORS[i]}15`,
                }}
              >
                <Gift className="size-3" />
                +{REWARD_POINTS[i]} {t("points")}
              </div>
            ))}
          </div>

          {topThree[0] && (
            <div className="mt-2 text-center">
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-gold to-primary px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-md">
                <Trophy className="size-3" /> {t("leaderboard_champion")}
              </span>
            </div>
          )}
        </section>
      )}

      {/* Leaderboard table */}
      <section className="game-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("leaderboard_rankings")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {pastSeasons && pastSeasons.length > 0 && (
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className={`bounce-soft grid size-8 place-items-center rounded-full border text-muted-foreground hover:text-ink ${
                  showHistory ? "border-primary bg-primary/10 text-primary" : "border-border"
                }`}
                aria-label={t("leaderboard_history")}
              >
                <History className="size-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isLoading}
              className="bounce-soft grid size-8 place-items-center rounded-full border border-border text-muted-foreground hover:text-ink"
              aria-label={t("refresh")}
            >
              <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {isLoading && entries.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">…</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <User className="size-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">{t("leaderboard_empty")}</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {rest.map((entry) => (
              <li
                key={entry.userId}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  entry.userId === currentUserId
                    ? "bg-primary/5 ring-1 ring-inset ring-primary/20"
                    : "hover:bg-accent/40"
                }`}
              >
                <div className="flex w-8 items-center justify-center">
                  <MedalIcon rank={entry.rank} />
                </div>
                <div className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent to-secondary text-xs font-display text-ink shadow-sm">
                  {entry.username.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm leading-tight">
                    {entry.username}
                    {entry.userId === currentUserId && (
                      <span className="ml-1.5 text-[10px] text-primary">({t("you")})</span>
                    )}
                    {entry.isDemo && (
                      <span className="ml-1.5 rounded-full border border-dashed border-muted-foreground/40 px-1.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground/60">
                        demo
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {t("level")} {entry.level} · {entry.scanCount}/{TOTAL_ARTIFACTS} {t("discovered_count").toLowerCase()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-base tabular-nums text-primary">{entry.totalExp}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">EXP</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Current user's rank summary */}
      {data && !isLoading && userRank !== null && (
        <section className="game-card bg-gradient-to-br from-gold/10 to-primary/5 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-gold-foreground" />
              <span className="text-sm font-display">
                {t("leaderboard_your_rank")}
              </span>
            </div>
            <span className="font-display text-2xl text-primary">
              #{userRank} <span className="text-sm text-muted-foreground">/ {entries.length}</span>
            </span>
          </div>
        </section>
      )}

      {/* Past seasons history */}
      {showHistory && pastSeasons && pastSeasons.length > 0 && (
        <section className="game-card overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <History className="size-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t("leaderboard_past_seasons")}
              </span>
            </div>
          </div>
          <ul className="divide-y divide-border">
            {pastSeasons.map((s) => (
              <li key={s.id} className="px-4 py-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-display text-sm">
                    {lang === "bm" ? s.name_bm : s.name_en}
                  </p>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(s.startDate).toLocaleDateString()} – {new Date(s.endDate).toLocaleDateString()}
                  </span>
                </div>
                {s.winners.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {s.winners.map((w) => (
                      <div
                        key={w.rank}
                        className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-[11px]"
                        style={{
                          borderColor: w.rank <= 3 ? MEDAL_COLORS[w.rank - 1] : "var(--color-border)",
                        }}
                      >
                        <MedalIcon rank={w.rank} />
                        <span className="font-display">{w.username}</span>
                        <span className="text-muted-foreground">· {w.totalExp} EXP</span>
                        {w.rewardPoints > 0 && (
                          <span className="ml-0.5 text-gold-foreground font-semibold">
                            +{w.rewardPoints}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">{t("none_yet")}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function PodiumEntry({ entry, place }: { entry: LeaderboardEntry; place: number }) {
  const heights = [48, 36, 28];
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br ${
          place === 1
            ? "from-gold to-primary text-white shadow-lg"
            : "from-accent to-secondary text-ink shadow-sm"
        }`}
        style={{ width: place === 1 ? 52 : 40, height: place === 1 ? 52 : 40 }}
      >
        <span className="font-display text-sm">{entry.username.charAt(0).toUpperCase()}</span>
      </div>
      <p className="max-w-[80px] truncate text-center text-[11px] font-semibold leading-tight">
        {entry.username}
      </p>
      <div
        className="flex w-16 flex-col items-center justify-end rounded-t-lg"
        style={{
          height: heights[place - 1],
          background: MEDAL_COLORS[place - 1],
          opacity: 0.7,
        }}
      >
        <span className="text-[10px] font-bold tabular-nums leading-none" style={{ color: place === 1 ? "#fff" : "#333" }}>
          {entry.totalExp}
        </span>
      </div>
      <span className="text-[10px] text-muted-foreground">{t("level")} {entry.level}</span>
    </div>
  );
}
