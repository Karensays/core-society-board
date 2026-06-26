import { TopBar } from "@/components/TopBar";
import { Greeting } from "@/components/Greeting";
import { Aside } from "@/components/Aside";

export default function Home() {
  return (
    <div className="min-h-screen bg-page">
      <TopBar />

      {/* pt-9 compense la TopBar fixe (36px) */}
      <div className="pt-9">
        <Greeting />

        <div className="flex flex-row items-start">
          <main className="flex-1 p-4">
            {/* KPI Hero, KPI secondaire, MiniBarChart et Todo : sessions suivantes */}
          </main>
          <Aside />
        </div>
      </div>
    </div>
  );
}
