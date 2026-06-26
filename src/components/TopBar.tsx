// Barre supérieure fixe — #1C42BD, 36px, pleine largeur (CLAUDE.md section 3).
export function TopBar() {
  const today = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-9 items-center justify-between bg-blue px-4 text-card">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-[600] lowercase">core society</span>
        <span
          style={{
            background: "rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.55)",
            fontSize: "9px",
            fontWeight: 500,
            padding: "2px 8px",
            borderRadius: "20px",
          }}
        >
          board
        </span>
      </div>
      <span className="text-[10px] font-[400] capitalize text-blue-mid">
        {today}
      </span>
    </header>
  );
}
