import { TopBar } from "@/components/TopBar";
import { Greeting } from "@/components/Greeting";
import { Aside } from "@/components/Aside";
import { KPISection } from "@/components/KPISection";
import { MiniBarChart } from "@/components/MiniBarChart";
import { TodoSection } from "@/components/TodoSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-page">
      <TopBar />

      {/* pt-9 compense la TopBar fixe (36px) */}
      <div className="pt-9">
        <Greeting />

        <div className="flex flex-row items-start">
          <main className="flex flex-1 flex-col gap-3 p-4">
            <KPISection />
            <MiniBarChart />
            <TodoSection />
          </main>
          <Aside />
        </div>
      </div>
    </div>
  );
}
