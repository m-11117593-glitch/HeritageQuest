import { useMemo } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

/* ── Feedback popup: big icon that springs up and fades ── */
export function FeedbackPopup({ type }: { type: "correct" | "wrong" }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      {/* Background flash */}
      <div
        className={`absolute inset-0 ${
          type === "correct"
            ? "bg-jungle/5"
            : "bg-destructive/5"
        } animate-in fade-in duration-200`}
      />
      {/* Icon */}
      <div className="feedback-popup">
        {type === "correct" ? (
          <div className="flex size-28 items-center justify-center rounded-full bg-gradient-to-br from-jungle to-emerald-400 shadow-2xl shadow-jungle/40">
            <CheckCircle2 className="size-16 text-white drop-shadow-lg" />
          </div>
        ) : (
          <div className="flex size-28 items-center justify-center rounded-full bg-gradient-to-br from-destructive to-red-400 shadow-2xl shadow-destructive/40">
            <XCircle className="size-16 text-white drop-shadow-lg" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Confetti particles for celebration ── */
export function ConfettiBurst({ count = 16 }: { count?: number }) {
  const particles = useMemo(() => {
    const colors = [
      "oklch(0.86 0.1 70)",   // gold
      "oklch(0.74 0.13 25)",  // primary
      "oklch(0.72 0.09 165)", // jungle
      "oklch(0.7 0.08 265)",  // indigo
      "oklch(0.9 0.08 35)",   // coral
      "oklch(0.78 0.12 25)",  // stamp
    ];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      left: `${(i / count) * 100}%`,
      fall: `-${60 + Math.random() * 100}px`,
      spin: `${Math.random() > 0.5 ? "" : "-"}${120 + Math.random() * 480}deg`,
      delay: `${Math.random() * 0.3}s`,
      size: 5 + Math.random() * 7,
    }));
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle absolute top-1/2 rounded-full"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            ["--fall" as string]: p.fall,
            ["--spin" as string]: p.spin,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ── Pulse ring that radiates on correct answer ── */
export function PulseRing({ color = "oklch(0.72 0.09 165)" }: { color?: string }) {
  return (
    <div
      className="pulse-glow pointer-events-none absolute inset-0 rounded-2xl"
      style={{ border: `3px solid ${color}` }}
    />
  );
}

/* ── Streak / Combo Meter — Duolingo-inspired streak tracker ── */
export function ComboMeter({ streak, animKey }: { streak: number; animKey: number }) {
  if (streak === 0) return null;

  const isHot = streak >= 3;
  const isOnFire = streak >= 4;

  let emoji: string;
  let colorClass: string;
  let bgClass: string;

  if (streak === 1) {
    emoji = "✅";
    colorClass = "text-jungle";
    bgClass = "bg-jungle/10";
  } else if (streak === 2) {
    emoji = "🔥";
    colorClass = "text-amber-500 dark:text-amber-400 streak-glow";
    bgClass = "bg-amber-500/10";
  } else if (streak === 3) {
    emoji = "🔥🔥";
    colorClass = "text-orange-500 dark:text-orange-400 streak-glow";
    bgClass = "bg-orange-500/10";
  } else {
    emoji = "💥🔥";
    colorClass = "text-rose-500 dark:text-rose-400 streak-glow";
    bgClass = "bg-rose-500/10";
  }

  return (
    <div
      key={animKey}
      className={`combo-slide-in flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${colorClass} ${bgClass} ${
        isOnFire ? "fire-flicker" : ""
      }`}
    >
      <span className={`${isOnFire ? "fire-flicker" : ""}`}>{emoji}</span>
      <span className="streak-bump font-display text-sm">{streak}</span>
      {isOnFire && <span className="ml-0.5 text-[9px] opacity-60">COMBO!</span>}
    </div>
  );
}
