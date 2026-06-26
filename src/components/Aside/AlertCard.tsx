export interface AlertCardProps {
  type: "warning" | "info";
  title: string;
  body: string;
}

const STYLE = {
  warning: {
    bg: "#fffbeb",
    border: "#f59e0b",
    title: "#92400e",
    body: "#78350f",
  },
  info: {
    bg: "#eff4ff",
    border: "#1C42BD",
    title: "#1C42BD",
    body: "#3b5bdb",
  },
} as const;

export function AlertCard({ type, title, body }: AlertCardProps) {
  const s = STYLE[type];

  return (
    <div
      style={{
        background: s.bg,
        borderLeft: `3px solid ${s.border}`,
        borderRadius: "0 5px 5px 0",
        padding: "8px 10px",
      }}
    >
      <p style={{ fontSize: "10px", fontWeight: 700, color: s.title }}>{title}</p>
      <p style={{ fontSize: "9px", fontWeight: 400, color: s.body, marginTop: "2px" }}>
        {body}
      </p>
    </div>
  );
}
