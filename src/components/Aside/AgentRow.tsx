export interface AgentRowProps {
  code: string;
  name: string;
  role: string;
  status: "online" | "warning";
  active?: boolean;
  inMeeting?: boolean;
  onClick?: () => void;
}

export function AgentRow({
  code,
  name,
  role,
  status,
  active,
  inMeeting,
  onClick,
}: AgentRowProps) {
  const isWarning = status === "warning";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-[9px] rounded-[6px] border px-[9px] py-[7px] text-left transition-colors ${
        active
          ? "border-[#c5d2f7] bg-[#eff4ff]"
          : "border-transparent hover:border-[#e8e8e4] hover:bg-[#f5f5f3]"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[6px] text-[9px] font-[700] ${
          isWarning ? "bg-[#fef9ec] text-[#d97706]" : "bg-[#e8edf8] text-[#1C42BD]"
        }`}
      >
        {code}
      </div>

      {/* Identité */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-[600] text-[#1a1a1a]">{name}</p>
        <p className="truncate text-[9px] font-[400] text-[#aaa]">
          {inMeeting ? "En réunion" : role}
        </p>
      </div>

      {/* Dot statut */}
      <span
        className="h-[6px] w-[6px] shrink-0 rounded-full"
        style={{ backgroundColor: isWarning ? "#f59e0b" : "#22c55e" }}
      />
    </button>
  );
}
