import { useState } from "react";
import { Toolbar } from "@/components/Toolbar";
import { TabNav } from "@/components/TabNav";
import { TAB_COMPONENTS } from "@/components/tabs";
import { CoverPage } from "@/components/CoverPage";
import { useApp } from "@/state/store";
import { TAB_KEYS } from "@/lib/default-content";

function PrintProxy({ children }: { children: React.ReactNode }) {
  return <div className="[&_button[title='Drag']]:hidden">{children}</div>;
}

export function App() {
  const [activeTab, setActiveTab] = useState("tab1");
  const { content, sector, language, isEditingMode, theme } = useApp();
  const Active = TAB_COMPONENTS[activeTab] ?? TAB_COMPONENTS.tab1;
  const themeClass = theme === "Industrial" ? "theme-industrial" : theme === "Impact" ? "theme-impact" : "";

  return (
    <div className={`min-h-screen bg-background text-foreground ${themeClass}`}>
      <Toolbar />
      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8">
        <CoverPage />
        <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="animate-in fade-in duration-300">
          <Active />
        </div>

        {/* Hidden print tree for PDF export */}
        <div id="print-root" className="absolute -left-[9999px] top-0 w-[1100px] bg-white">
          <div data-print-section>
            <CoverPage />
          </div>
          {TAB_KEYS.map((k) => {
            const tab = content[sector][language][k];
            if (!tab?.isVisible) return null;
            const C = TAB_COMPONENTS[k];
            if (!C) return null;
            return (
              <div key={k} data-print-section className="p-8 bg-white">
                <h2 className="text-3xl font-extrabold mb-6">{tab.title}</h2>
                <PrintProxy><C /></PrintProxy>
              </div>
            );
          })}
        </div>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          {isEditingMode ? "Modo edición · hacé click en cualquier texto para editar" : "Modo presentación"}
        </footer>
      </main>
    </div>
  );
}
