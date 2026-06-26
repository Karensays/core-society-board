// Bandeau de salutation — fond blanc, bordure bottom (CLAUDE.md sections 2 & 3).
// "Bonjour," en 700 #1a1a1a + "Karen." en 300 #aaa, 22px.
export function Greeting() {
  const today = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <section className="border-b border-border bg-card px-4 py-5">
      <h1 className="text-[22px] leading-tight">
        <span className="font-[700] text-ink">Bonjour, </span>
        <span className="font-[300] text-[#aaa]">Karen.</span>
      </h1>
      <p className="mt-1 text-[9px] font-[400] uppercase tracking-[0.12em] capitalize text-muted-light">
        {today}
      </p>
    </section>
  );
}
