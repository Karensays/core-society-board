import { ArrowUp, ArrowDown, ArrowRight } from "lucide-react";

export type TrendDirection = "up" | "down" | "neutral";

export interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: string;
  trendDirection?: TrendDirection;
  baseline?: string;
  variant?: "primary" | "default";
}

// Couleurs de tendance (CLAUDE.md section 2)
const TREND_COLOR: Record<TrendDirection, string> = {
  up: "#16A34A", // Vert succès
  down: "#DC2626", // Rouge urgent
  neutral: "#888888", // Texte muted
};

const TREND_ICON = {
  up: ArrowUp,
  down: ArrowDown,
  neutral: ArrowRight,
};

export function KPICard({
  label,
  value,
  unit,
  trend,
  trendDirection,
  baseline,
  variant = "default",
}: KPICardProps) {
  const isPrimary = variant === "primary";

  // Variant primary : tendance toujours vert clair. Sinon couleur selon direction.
  const trendColor = isPrimary
    ? "#86efac"
    : trendDirection
      ? TREND_COLOR[trendDirection]
      : TREND_COLOR.neutral;

  const TrendIcon = trendDirection ? TREND_ICON[trendDirection] : null;

  return (
    <div
      className={
        isPrimary
          ? "flex flex-col rounded-card bg-blue px-4 py-3.5 text-card"
          : "flex flex-col rounded-card border border-border bg-card px-4 py-3.5"
      }
    >
      <p
        className={`text-[10px] font-[500] ${
          isPrimary ? "text-blue-mid" : "text-muted"
        }`}
      >
        {label}
      </p>

      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span
          className={`font-[700] leading-none ${
            isPrimary ? "text-[28px]" : "text-[22px] text-ink"
          }`}
        >
          {value}
          {unit && (
            <span className="ml-0.5 text-[0.6em] font-[600]">{unit}</span>
          )}
        </span>

        {trend && (
          <span
            className="flex items-center gap-0.5 text-[10px] font-[600] leading-none"
            style={{ color: trendColor }}
          >
            {TrendIcon && <TrendIcon size={11} strokeWidth={2.5} />}
            {trend}
          </span>
        )}
      </div>

      {baseline && (
        <p
          className={`mt-2 text-[9px] font-[400] ${
            isPrimary ? "text-blue-mid" : "text-muted-light"
          }`}
        >
          {baseline}
        </p>
      )}
    </div>
  );
}
