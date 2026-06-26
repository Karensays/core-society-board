import { KPICard } from "./KPICard";
import { KPI_DATA } from "@/data/kpis";

// Formatage des nombres en français (séparateur de milliers par espace)
const fr = new Intl.NumberFormat("fr-FR");

const { ca, seances, remplissage, note, breakdown } = KPI_DATA;

// Cartes secondaires (breakdown des revenus)
const SECONDARY = [
  { label: "Bsport", value: `${fr.format(breakdown.bsport.value)} €`, sub: breakdown.bsport.detail },
  { label: "ClassPass", value: `${fr.format(breakdown.classpass.value)} €`, sub: breakdown.classpass.detail },
  { label: "Egym", value: `${fr.format(breakdown.egym.value)} €`, sub: breakdown.egym.detail },
  { label: "Découvertes", value: `${fr.format(breakdown.decouvertes.value)}`, sub: breakdown.decouvertes.detail },
];

function MiniStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="flex flex-col rounded-card border border-border bg-card px-3.5 py-3">
      <p className="text-[9px] font-[500] uppercase tracking-[0.08em] text-muted-light">
        {label}
      </p>
      <p className="mt-1 text-[19px] font-[700] leading-none text-ink">{value}</p>
      <p className="mt-1.5 text-[9px] font-[400] text-[#ccc]">{sub}</p>
    </div>
  );
}

export function KPISection() {
  const objectifPct = Math.round((ca.value / ca.target) * 100);

  return (
    <section>
      <h2 className="mb-2.5 text-[9px] font-[600] uppercase tracking-[0.12em] text-muted-light">
        Chiffres clés · {KPI_DATA.month}
      </h2>

      {/* Grille hero — 4 KPICard */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2">
        <KPICard
          variant="primary"
          label="Chiffre d'affaires"
          value={fr.format(ca.value)}
          unit="€"
          trend={`${ca.trend} vs mai`}
          trendDirection="up"
          baseline={`Objectif : ${fr.format(ca.target)} € · ${objectifPct}% atteint`}
        />
        <KPICard
          label="Séances"
          value={seances.value}
          trend={`${seances.trend} vs mai`}
          trendDirection="up"
          baseline={`Capacité max : ${seances.max}`}
        />
        <KPICard
          label="Remplissage"
          value={remplissage.value}
          unit="%"
          trend="stable"
          trendDirection="neutral"
          baseline={`Cible : ${remplissage.target}%`}
        />
        <KPICard
          label="Note ClassPass"
          value={note.value.toFixed(1)}
          unit="★"
          trend={`${note.avis}+ avis`}
          baseline="Meilleur de la zone"
        />
      </div>

      {/* Grille secondaire — breakdown revenus */}
      <div className="mt-2 grid grid-cols-4 gap-2">
        {SECONDARY.map((stat) => (
          <MiniStat key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}
