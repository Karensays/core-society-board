import { KPI_DATA } from "@/data/kpis";

const { weekActivity, nextCours } = KPI_DATA;

// Couleur de barre selon l'état (CLAUDE.md section 2)
const BAR_COLOR: Record<string, string> = {
  past: "#E8E8E4",
  today: "#1C42BD",
  future: "transparent",
};

// Numéro de semaine ISO de la date courante.
function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function MiniBarChart() {
  // Max calculé sur les jours passés/aujourd'hui (on exclut les jours future)
  const maxValue = Math.max(
    ...weekActivity.filter((d) => d.state !== "future").map((d) => d.value),
    1,
  );
  const seancesCount = weekActivity.filter((d) => d.value > 0).length;
  const participantsTotal = weekActivity.reduce((sum, d) => sum + d.value, 0);
  const week = getISOWeek(new Date());

  return (
    <div className="rounded-card border border-border bg-card px-4 py-3.5">
      {/* En-tête */}
      <div className="flex items-baseline justify-between">
        <h3 className="text-[11px] font-[600] text-ink">Séances cette semaine</h3>
        <span className="text-[9px] font-[400] text-[#ccc]">Semaine {week}</span>
      </div>

      {/* Barres */}
      <div className="mt-3 flex items-end gap-2">
        {weekActivity.map((d) => {
          // Hauteur en pixels proportionnelle au max (jours future = 0)
          const barHeight =
            d.state === "future" ? 0 : (d.value / maxValue) * 56;
          return (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex w-full items-end" style={{ height: "56px" }}>
                <div
                  className="w-full rounded-t-[3px]"
                  style={{
                    height: `${barHeight}px`,
                    backgroundColor: BAR_COLOR[d.state],
                  }}
                />
              </div>
              <span
                className={`text-[9px] font-[500] ${
                  d.state === "today" ? "text-blue" : "text-[#ccc]"
                }`}
              >
                {d.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5">
        <span className="text-[9px] font-[400] text-muted">
          {seancesCount} séances · {participantsTotal} participants
        </span>
        <span className="text-[9px] font-[600] text-blue">
          Prochain cours {nextCours.time} · {nextCours.places} places
        </span>
      </div>
    </div>
  );
}
