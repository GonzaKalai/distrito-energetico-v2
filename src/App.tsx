import { createContext, useContext, useState, useEffect } from "react";
import { Toolbar } from "@/components/Toolbar";
import { TabNav } from "@/components/TabNav";
import { TAB_COMPONENTS } from "@/components/tabs";
import { CoverPage } from "@/components/CoverPage";
import { useApp } from "@/state/store";
import { TAB_KEYS } from "@/lib/default-content";

export const PrintModeContext = createContext(false);
export const usePrintMode = () => useContext(PrintModeContext);

export function App() {
  const [activeTab, setActiveTab] = useState("tab1");
  const { undo } = useApp();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") { e.preventDefault(); undo(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo]);
  const { content, sector, language, isEditingMode, theme } = useApp();
  const Active = TAB_COMPONENTS[activeTab] ?? TAB_COMPONENTS.tab1;
  const themeClass = theme === "Industrial" ? "theme-industrial" : theme === "Impact" ? "theme-impact" : "";

  return (
    <div className={`min-h-screen bg-background text-foreground ${themeClass}`}>
      <Toolbar />
      {isEditingMode && (
        <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 text-center text-sm text-primary font-medium">
          ✏️ Modo edición — hacé click en cualquier texto para editarlo
        </div>
      )}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8">
        <CoverPage />
        <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="animate-in fade-in duration-300"><Active /></div>

        {/* Hidden print tree — cover gets data-print-section, sections get data-pdf-section via PrintModeContext */}
        <PrintModeContext.Provider value={true}>
          <div id="print-root" style={{ position:"fixed",left:"-9999px",top:0,width:"1100px",opacity:0.001,pointerEvents:"none",background:"white",zIndex:-9999 }}>
            <div data-print-section style={{ background:"white",padding:"2rem" }}>
              <CoverPage />
            </div>
            {TAB_KEYS.map((k) => {
              const tab = content[sector][language][k];
              if (!tab?.isVisible) return null;
              const C = TAB_COMPONENTS[k];
              if (!C) return null;
              return <div key={k} style={{ background:"white" }}><C /></div>;
            })}
          </div>
        </PrintModeContext.Provider>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          {isEditingMode ? "Modo edición · Click en cualquier texto · 'Presentar' para vista final" : "Modo presentación · Click en 'Editar' para modificar"}
        </footer>
      </main>
    </div>
  );
}
