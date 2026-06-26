import { BoardBody } from "@/components/BoardBody";
import { CockpitView } from "@/views/CockpitView";
import { AgentsView } from "@/views/AgentsView";
import { SystemView } from "@/views/SystemView";
import { AccessView } from "@/views/AccessView";

export default function Home() {
  return (
    <div className="min-h-screen bg-page">
      <BoardBody
        cockpit={<CockpitView />}
        agents={<AgentsView />}
        system={<SystemView />}
        access={<AccessView />}
      />
    </div>
  );
}
