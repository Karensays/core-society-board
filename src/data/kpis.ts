// Données KPIs statiques — V1 (CLAUDE.md section 7)
// En V2 : brancher l'API Bsport pour des KPIs temps réel.

export const KPI_DATA = {
  month: "juin 2025",
  ca: { value: 8240, trend: "+12%", target: 9000 },
  seances: { value: 94, trend: "+5", max: 140 },
  remplissage: { value: 68, target: 75 },
  note: { value: 5.0, avis: 500 },
  breakdown: {
    bsport: { value: 5680, detail: "Abonnements + séances" },
    classpass: { value: 1340, detail: "28 réservations" },
    egym: { value: 720, detail: "12 réservations" },
    decouvertes: { value: 18, detail: "6 → abonnées" },
  },
  weekActivity: [
    { day: "Lun", value: 12, state: "past" },
    { day: "Mar", value: 16, state: "past" },
    { day: "Mer", value: 14, state: "past" },
    { day: "Jeu", value: 10, state: "past" },
    { day: "Ven", value: 18, state: "today" },
    { day: "Sam", value: 0, state: "future" },
    { day: "Dim", value: 0, state: "future" },
  ],
  nextCours: { time: "09:00", places: 3 },
} as const;

export type KpiData = typeof KPI_DATA;
