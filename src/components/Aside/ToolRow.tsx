export interface ToolRowProps {
  name: string;
  status: "online" | "warning";
  /** Dernier item : pas de border-bottom */
  last?: boolean;
}

export function ToolRow({ name, status, last }: ToolRowProps) {
  const isWarning = status === "warning";

  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: "5px 0",
        fontSize: "10px",
        borderBottom: last ? "none" : "1px solid #f0f0ec",
      }}
    >
      <span style={{ fontWeight: 500, color: "#555" }}>{name}</span>
      <span
        style={{
          fontSize: "9px",
          fontWeight: 600,
          color: isWarning ? "#d97706" : "#16a34a",
        }}
      >
        {isWarning ? "ATTENTION" : "EN LIGNE"}
      </span>
    </div>
  );
}
