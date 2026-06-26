// Barre supérieure fixe — #1C42BD, 36px, pleine largeur (CLAUDE.md section 3).
export function TopBar() {
  const today = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-9 items-center justify-between bg-blue px-4 text-card">
      <span className="text-[11px] font-[600] tracking-[0.1em]">
        CORE SOCIETY BOARD
      </span>
      <span className="text-[10px] font-[400] capitalize text-blue-mid">
        {today}
      </span>
    </header>
  );
}
