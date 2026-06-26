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
    <section style={{ padding: "4px 0 8px" }}>
      <h1
        className="leading-tight"
        style={{ fontSize: "26px", letterSpacing: "-0.03em" }}
      >
        <span className="font-[800] text-ink">Bonjour, </span>
        <span className="font-[300] text-blue">Karen.</span>
      </h1>
      <p className="mt-1 text-[11px] font-[400] italic capitalize text-[#aaa]">
        {today}
      </p>
    </section>
  );
}
