import { useState } from "react";
import { Toolbar } from "@/components/Toolbar";
import { TabNav } from "@/components/TabNav";
import { TAB_COMPONENTS } from "@/components/tabs";
import { CoverPage } from "@/components/CoverPage";
import { useApp } from "@/state/store";
import { TAB_KEYS } from "@/lib/default-content";

function PrintProxy({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function App() {
  const [activeTab, setActiveTab] = useState("tab1");
  const { content, sector, language, isEditingMode, theme } = useApp();
  const Active = TAB_COMPONENTS[activeTab] ?? TAB_COMPONENTS.tab1;
  const themeClass = theme === "Industrial" ? "theme-industrial" : theme === "Impact" ? "theme-impact" : "";

  return (
    <div className={`min-h-screen bg-background text-foreground ${themeClass}`}>
      <Toolbar />

      {isEditingMode && (
        <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 text-center text-sm text-primary font-medium">
          ✏️ Modo edición activo — hacé click en cualquier texto para editarlo · usá los toggles para mostrar/ocultar secciones
        </div>
      )}

      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8">
        <CoverPage />
        <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="animate-in fade-in duration-300">
          <Active />
        </div>

        {/* Hidden print tree — opacity:0.001 keeps it visible to html2canvas */}
        <div
          id="print-root"
          style={{
            position: "fixed",
            left: "-9999px",
            top: 0,
            width: "1100px",
            opacity: 0.001,
            pointerEvents: "none",
            background: "white",
            zIndex: -9999,
          }}
        >
          <div data-print-section style={{ background: "white", padding: "2rem" }}>
            <CoverPage />
          </div>
          {TAB_KEYS.map((k) => {
            const tab = content[sector][language][k];
            if (!tab?.isVisible) return null;
            const C = TAB_COMPONENTS[k];
            if (!C) return null;
            return (
              <div key={k} data-print-section style={{ background: "white", padding: "2rem" }}>
                <h2 style={{ fontSize: "1.875rem", fontWeight: 800, marginBottom: "1.5rem" }}>{tab.title}</h2>
                <PrintProxy><C /></PrintProxy>
              </div>
            );
          })}
        </div>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          {isEditingMode
            ? "Modo edición · Click en cualquier texto para editarlo · Botón 'Present' para vista final"
            : "Modo presentación · Hacé click en 'Edit' en la barra superior para editar contenido"}
        </footer>
      </main>
    </div>
  );
}
