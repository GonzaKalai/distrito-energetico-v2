import {
  FileText, Zap, TrendingUp, Map, Shield, Calculator,
  Building, FileBox, Info, Train, Warehouse, Check, X,
  ArrowUpRight, BarChart3, Globe, Flame, DollarSign, Clock,
  Plus, Trash2
} from "lucide-react";
import React from "react";
import { FinancialCalculator } from "./FinancialCalculator";
import { CoverPage } from "./CoverPage";
import { useState } from "react";
import { useApp } from "@/state/store";
import { EditableText } from "./editor/EditableText";
import { SectionWrap, VisibilityToggle } from "./editor/Toggle";
import { CustomBlocks } from "./editor/CustomBlocks";

// ─── Shared UI ────────────────────────────────────────────────────────────────

const Card = ({ children, dark = false, accent = false, className = "" }: {
  children: React.ReactNode; dark?: boolean; accent?: boolean; className?: string;
}) => (
  <div className={`rounded-3xl border p-6 md:p-8 ${
    dark ? "bg-foreground text-background border-foreground/20" :
    accent ? "bg-primary/5 border-primary/20" :
    "bg-card text-card-foreground border-border"
  } ${className}`}>
    {children}
  </div>
);

const StatBadge = ({ value, label, highlight = false }: { value: string; label: string; highlight?: boolean }) => (
  <div className={`rounded-2xl p-4 text-center ${highlight ? "bg-foreground text-background" : "bg-accent/50 border border-border"}`}>
    <div className={`text-2xl md:text-3xl font-black ${highlight ? "" : "text-primary"}`}>{value}</div>
    <div className={`text-xs font-semibold uppercase tracking-wider mt-1 ${highlight ? "opacity-70" : "text-muted-foreground"}`}>{label}</div>
  </div>
);

const Pill = ({ children, color = "default" }: { children: React.ReactNode; color?: "default" | "green" | "amber" | "red" | "blue" }) => {
  const colors = {
    default: "bg-accent text-accent-foreground",
    green: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-red-100 text-red-800",
    blue: "bg-blue-100 text-blue-800",
  };
  return <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[color]}`}>{children}</span>;
};

// ─── TAB 1 — Intro ────────────────────────────────────────────────────────────

export function Tab1() {
  const { content, sector, language, updateTab } = useApp();
  const t = content[sector][language].tab1;
  const isES = language === "ES";

  return (
    <div className="space-y-6">
      <SectionWrap isVisible={t.execSummary.isVisible} onToggle={() => updateTab("tab1", "execSummary.isVisible", !t.execSummary.isVisible)} label="Exec Summary">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-primary/10 rounded-xl"><FileText className="text-primary" size={20} /></div>
                <h2 className="text-2xl font-bold"><EditableText value={t.execSummary.title} onSave={(v) => updateTab("tab1", "execSummary.title", v)} /></h2>
              </div>
              <div className="text-base leading-relaxed text-muted-foreground">
                <EditableText multiline value={t.execSummary.text} onSave={(v) => updateTab("tab1", "execSummary.text", v)} />
              </div>
            </Card>
          </div>
          <div className="flex flex-col gap-4">
            <StatBadge value="2°" label={isES ? "Reserva de gas no conv. del mundo" : "World's 2nd largest non-conv. gas reserve"} highlight />
            <StatBadge value="2.6x" label={isES ? "Aumento de producción proyectado a 2030" : "Projected production increase by 2030"} />
            <StatBadge value="95%" label={isES ? "Del tráfico pesado pasará por el proyecto" : "Of heavy traffic through the project"} />
            <StatBadge value="USD 25B" label={isES ? "Exportaciones de hidrocarburos meta 2030" : "Hydrocarbon export target 2030"} />
          </div>
        </div>
      </SectionWrap>

      <SectionWrap isVisible={t.thesis.isVisible} onToggle={() => updateTab("tab1", "thesis.isVisible", !t.thesis.isVisible)} label="Investment Thesis">
        <Card dark>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-400/20 rounded-xl"><Zap className="text-yellow-400" size={20} /></div>
            <h2 className="text-2xl font-bold"><EditableText value={t.thesis.title} onSave={(v) => updateTab("tab1", "thesis.title", v)} /></h2>
          </div>
          <div className="text-base leading-relaxed opacity-90">
            <EditableText multiline value={t.thesis.text} onSave={(v) => updateTab("tab1", "thesis.text", v)} />
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-background/20">
            {[
              { icon: <Flame size={16} />, label: isES ? "Cuello de Botella" : "Bottleneck", desc: isES ? "Capacidad logística saturada — sin oferta Clase A" : "Saturated logistics capacity — no Class A supply" },
              { icon: <Building size={16} />, label: isES ? "Escasez de Activos" : "Asset Scarcity", desc: isES ? "Déficit estructural en todas las categorías" : "Structural deficit across all asset categories" },
              { icon: <Globe size={16} />, label: isES ? "Vientos Regulatorios" : "Regulatory Tailwinds", desc: isES ? "RIGI activo + meta nacional USD 25B" : "Active RIGI + USD 25B national target" },
            ].map((p, i) => (
              <div key={i} className="bg-background/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2 text-yellow-400">{p.icon}<span className="font-bold text-sm">{p.label}</span></div>
                <p className="text-xs opacity-70 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </SectionWrap>
      <CustomBlocks tabKey="tab1" />
    </div>
  );
}

// ─── TAB 2 — Overview ─────────────────────────────────────────────────────────

export function Tab2() {
  const { content, sector, language, updateTab, isEditingMode } = useApp();
  const t = content[sector][language].tab2;
  const [exitMode, setExitMode] = useState<"Rental" | "Sale">("Rental");
  const [selected, setSelected] = useState("turnkey");

  return (
    <div className="space-y-6">
      <SectionWrap isVisible={t.packages.isVisible} onToggle={() => updateTab("tab2", "packages.isVisible", !t.packages.isVisible)} label="Packages">
        <Card>
          <h2 className="text-2xl font-bold mb-8"><EditableText value={t.packages.title} onSave={(v) => updateTab("tab2", "packages.title", v)} /></h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(t.packages.items).map(([key, pkgRaw]) => {
              const pkg = pkgRaw as any;
              if (!pkg.isVisible && !isEditingMode) return null;
              const isSelected = selected === key;
              return (
                <div key={key} className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? "border-foreground bg-foreground text-background shadow-lg scale-[1.02]" : "border-border hover:border-foreground/40 hover:shadow-md"} ${!pkg.isVisible ? "opacity-40 grayscale" : ""}`} onClick={() => setSelected(key)}>
                  {isEditingMode && <div className="absolute top-2 right-2"><VisibilityToggle isVisible={pkg.isVisible} onToggle={() => updateTab("tab2", `packages.items.${key}.isVisible`, !pkg.isVisible)} /></div>}
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold mb-3 ${isSelected ? "bg-background/20 text-background" : "bg-primary/10 text-primary"}`}>
                    <EditableText value={pkg.multiplier} onSave={(v) => updateTab("tab2", `packages.items.${key}.multiplier`, v)} />
                  </div>
                  <h4 className="font-bold text-lg mb-2"><EditableText value={pkg.name} onSave={(v) => updateTab("tab2", `packages.items.${key}.name`, v)} /></h4>
                  <p className={`text-sm mb-4 leading-relaxed min-h-[4rem] ${isSelected ? "opacity-80" : "text-muted-foreground"}`}>
                    <EditableText multiline value={pkg.desc} onSave={(v) => updateTab("tab2", `packages.items.${key}.desc`, v)} />
                  </p>
                  <div className={`border-t pt-3 space-y-2 text-sm ${isSelected ? "border-background/20" : "border-border"}`}>
                    <div className={`text-[10px] uppercase font-bold ${isSelected ? "opacity-60" : "text-muted-foreground"}`}>Ownership</div>
                    <div className="font-medium text-xs"><EditableText value={pkg.ownership} onSave={(v) => updateTab("tab2", `packages.items.${key}.ownership`, v)} /></div>
                    <div className="flex gap-2"><Check size={12} className="text-emerald-500 shrink-0 mt-0.5" /><span className="text-xs opacity-70"><EditableText multiline value={pkg.includes} onSave={(v) => updateTab("tab2", `packages.items.${key}.includes`, v)} /></span></div>
                    <div className="flex gap-2"><X size={12} className="text-rose-400 shrink-0 mt-0.5" /><span className="text-xs opacity-60"><EditableText multiline value={pkg.excludes} onSave={(v) => updateTab("tab2", `packages.items.${key}.excludes`, v)} /></span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </SectionWrap>

      <SectionWrap isVisible={t.dashboard.isVisible} onToggle={() => updateTab("tab2", "dashboard.isVisible", !t.dashboard.isVisible)} label="Returns Dashboard">
        <Card accent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl"><TrendingUp className="text-primary" size={20} /></div>
              <h2 className="text-2xl font-bold"><EditableText value={t.dashboard.title} onSave={(v) => updateTab("tab2", "dashboard.title", v)} /></h2>
            </div>
            <div className="flex bg-background p-1 rounded-xl border border-border shadow-sm">
              {(["Rental", "Sale"] as const).map((m) => (
                <button key={m} onClick={() => setExitMode(m)} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${exitMode === m ? "bg-foreground text-background shadow" : "opacity-50 hover:opacity-80"}`}>{m}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Entry Ticket", value: t.dashboard.entryTicket, path: "dashboard.entryTicket", icon: <DollarSign size={16} /> },
              { label: `IRR (${exitMode})`, value: exitMode === "Rental" ? t.dashboard.irrRental : t.dashboard.irrSale, path: exitMode === "Rental" ? "dashboard.irrRental" : "dashboard.irrSale", icon: <TrendingUp size={16} /> },
              { label: `ROI (${exitMode})`, value: exitMode === "Rental" ? t.dashboard.roiRental : t.dashboard.roiSale, path: exitMode === "Rental" ? "dashboard.roiRental" : "dashboard.roiSale", icon: <BarChart3 size={16} /> },
              { label: "Term", value: t.dashboard.term, path: "dashboard.term", icon: <Clock size={16} /> },
            ].map(({ label, value, path, icon }) => (
              <div key={label} className="bg-background rounded-2xl p-5 border border-border shadow-sm text-center">
                <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-2 text-xs font-semibold uppercase tracking-wide">{icon}{label}</div>
                <div className="text-2xl font-black text-primary"><EditableText value={value} onSave={(v) => updateTab("tab2", path, v)} /></div>
              </div>
            ))}
          </div>
        </Card>
      </SectionWrap>

      <SectionWrap isVisible={t.faq.isVisible} onToggle={() => updateTab("tab2", "faq.isVisible", !t.faq.isVisible)} label="FAQ">
        <Card>
          <h2 className="text-2xl font-bold mb-6"><EditableText value={t.faq.title} onSave={(v) => updateTab("tab2", "faq.title", v)} /></h2>
          <div className="space-y-3">
            {t.faq.items.map((item: any, i: number) => (
              <div key={i} className={`relative bg-accent/30 rounded-xl p-5 border border-border ${!item.isVisible ? "opacity-40 grayscale" : ""}`}>
                {isEditingMode && <div className="absolute top-2 right-2"><VisibilityToggle isVisible={item.isVisible} onToggle={() => { const items = [...t.faq.items]; items[i] = { ...items[i], isVisible: !items[i].isVisible }; updateTab("tab2", "faq.items", items); }} /></div>}
                <div className="font-bold mb-2 text-sm">❓ <EditableText value={item.q} onSave={(v) => { const items = [...t.faq.items]; items[i] = { ...items[i], q: v }; updateTab("tab2", "faq.items", items); }} /></div>
                <div className="text-sm text-muted-foreground leading-relaxed"><EditableText multiline value={item.a} onSave={(v) => { const items = [...t.faq.items]; items[i] = { ...items[i], a: v }; updateTab("tab2", "faq.items", items); }} /></div>
              </div>
            ))}
            {isEditingMode && (
              <button onClick={() => {
                const items = [...t.faq.items, { isVisible: true, q: "Nueva pregunta", a: "Respuesta" }];
                updateTab("tab2", "faq.items", items);
              }} className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition-colors text-sm font-medium">
                <Plus size={16} /> Agregar pregunta
              </button>
            )}
          </div>
        </Card>
      </SectionWrap>

      <FinancialCalculator />
      <CustomBlocks tabKey="tab2" />
    </div>
  );
}

// ─── TAB 3 ────────────────────────────────────────────────────────────────────

export function Tab3() {
  const { content, sector, language, updateTab } = useApp();
  const t = content[sector][language].tab3;
  return (
    <div className="space-y-6">
      <SectionWrap isVisible={t.funnel.isVisible} onToggle={() => updateTab("tab3", "funnel.isVisible", !t.funnel.isVisible)} label="Traffic Funnel">
        <Card dark>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-yellow-400/20 rounded-xl"><Map className="text-yellow-400" size={20} /></div>
            <h2 className="text-2xl font-bold"><EditableText value={t.funnel.title} onSave={(v) => updateTab("tab3", "funnel.title", v)} /></h2>
          </div>
          <div className="text-base leading-relaxed opacity-90">
            <EditableText multiline value={t.funnel.text} onSave={(v) => updateTab("tab3", "funnel.text", v)} />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-background/20">
            <div className="text-center"><div className="text-3xl font-black text-yellow-400">95%</div><div className="text-xs opacity-60 mt-1">Tráfico pesado canalizado</div></div>
            <div className="text-center"><div className="text-3xl font-black text-yellow-400">15K</div><div className="text-xs opacity-60 mt-1">Vehículos/día actuales</div></div>
            <div className="text-center"><div className="text-3xl font-black text-yellow-400">30K</div><div className="text-xs opacity-60 mt-1">Proyectado 2028</div></div>
          </div>
        </Card>
      </SectionWrap>
      <SectionWrap isVisible={t.epicenter.isVisible} onToggle={() => updateTab("tab3", "epicenter.isVisible", !t.epicenter.isVisible)} label="Epicenter">
        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-primary/10 rounded-xl"><Flame className="text-primary" size={20} /></div>
            <h2 className="text-2xl font-bold"><EditableText value={t.epicenter.title} onSave={(v) => updateTab("tab3", "epicenter.title", v)} /></h2>
          </div>
          <div className="text-base leading-relaxed text-muted-foreground mb-5">
            <EditableText multiline value={t.epicenter.text} onSave={(v) => updateTab("tab3", "epicenter.text", v)} />
          </div>
          <div className="flex flex-wrap gap-2">
            {["YPF", "Chevron", "Shell", "ExxonMobil", "Pan American Energy", "Tecpetrol"].map(op => (
              <span key={op} className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full">{op}</span>
            ))}
          </div>
        </Card>
      </SectionWrap>
      <SectionWrap isVisible={t.proximity.isVisible} onToggle={() => updateTab("tab3", "proximity.isVisible", !t.proximity.isVisible)} label="Proximity">
        <Card accent>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-primary/10 rounded-xl"><ArrowUpRight className="text-primary" size={20} /></div>
            <h2 className="text-2xl font-bold"><EditableText value={t.proximity.title} onSave={(v) => updateTab("tab3", "proximity.title", v)} /></h2>
          </div>
          <div className="text-base leading-relaxed text-muted-foreground mb-5">
            <EditableText multiline value={t.proximity.text} onSave={(v) => updateTab("tab3", "proximity.text", v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background rounded-xl p-4 border border-border text-center">
              <div className="text-2xl font-black text-primary">8-12 km</div>
              <div className="text-xs text-muted-foreground mt-1">Distrito Energético al pad</div>
            </div>
            <div className="bg-background rounded-xl p-4 border border-border text-center">
              <div className="text-2xl font-black text-red-500">60-120 km</div>
              <div className="text-xs text-muted-foreground mt-1">Alternativas actuales</div>
            </div>
          </div>
        </Card>
      </SectionWrap>
      <CustomBlocks tabKey="tab3" />
    </div>
  );
}

// ─── TAB 4 ────────────────────────────────────────────────────────────────────

export function Tab4() {
  const { content, sector, language, updateTab } = useApp();
  const t = content[sector][language].tab4;
  const p = t.pillars;
  return (
    <div className="space-y-6">
      <SectionWrap isVisible={t.intro.isVisible} onToggle={() => updateTab("tab4", "intro.isVisible", !t.intro.isVisible)} label="Overview">
        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-primary/10 rounded-xl"><Warehouse className="text-primary" size={20} /></div>
            <h2 className="text-2xl font-bold"><EditableText value={t.intro.title} onSave={(v) => updateTab("tab4", "intro.title", v)} /></h2>
          </div>
          <div className="text-base leading-relaxed text-muted-foreground">
            <EditableText multiline value={t.intro.text} onSave={(v) => updateTab("tab4", "intro.text", v)} />
          </div>
        </Card>
      </SectionWrap>
      <SectionWrap isVisible={p.isVisible} onToggle={() => updateTab("tab4", "pillars.isVisible", !p.isVisible)} label="Hub Pillars">
        <div>
          <h2 className="text-xl font-bold mb-4"><EditableText value={p.title} onSave={(v) => updateTab("tab4", "pillars.title", v)} /></h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { key: "rail", icon: <Train size={20} />, color: "bg-blue-100 border-blue-200 text-blue-800" },
              { key: "aviation", icon: <Globe size={20} />, color: "bg-sky-100 border-sky-200 text-sky-800" },
              { key: "road", icon: <ArrowUpRight size={20} />, color: "bg-orange-100 border-orange-200 text-orange-800" },
              { key: "warehousing", icon: <Warehouse size={20} />, color: "bg-emerald-100 border-emerald-200 text-emerald-800" },
            ].map(({ key, icon, color }) => {
              const pillar = p[key];
              if (!pillar) return null;
              return (
                <div key={key} className={`rounded-2xl border-2 p-5 ${!pillar.isVisible ? "opacity-40 grayscale" : ""} ${color.split(" ").slice(0,2).join(" ")} bg-opacity-30`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-xl bg-white/70`}>{icon}</div>
                    <div>
                      <div className="font-bold text-sm"><EditableText value={pillar.title} onSave={(v) => updateTab("tab4", `pillars.${key}.title`, v)} /></div>
                      <div className="text-xs opacity-70"><EditableText value={pillar.sub} onSave={(v) => updateTab("tab4", `pillars.${key}.sub`, v)} /></div>
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-lg px-3 py-1.5 text-xs font-bold mb-3 inline-block">
                    <EditableText value={pillar.stat} onSave={(v) => updateTab("tab4", `pillars.${key}.stat`, v)} />
                  </div>
                  <div className="text-sm opacity-80 leading-relaxed">
                    <EditableText multiline value={pillar.details} onSave={(v) => updateTab("tab4", `pillars.${key}.details`, v)} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SectionWrap>
      <CustomBlocks tabKey="tab4" />
    </div>
  );
}

// ─── TAB 5 ────────────────────────────────────────────────────────────────────

const ComparisonTable = ({ rows, cols, onUpdate }: { rows: any[]; cols: string[]; onUpdate: (rows: any[]) => void }) => {
  const { isEditingMode } = useApp();
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-foreground text-background">
            {cols.map((c, i) => <th key={i} className={`px-4 py-3 text-left font-bold text-xs uppercase tracking-wide ${i === 0 ? "" : "text-center"}`}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any, ri: number) => (
            <tr key={ri} className={`border-t border-border ${ri % 2 === 0 ? "bg-background" : "bg-accent/20"}`}>
              {cols.map((_, ci) => {
                const key = Object.keys(row)[ci];
                const val = row[key];
                const isCheck = val === "✓" || val === "✗" || val === "—";
                return (
                  <td key={ci} className={`px-4 py-3 ${ci === 0 ? "font-medium" : "text-center"}`}>
                    {isCheck ? (
                      <span className={val === "✓" ? "text-emerald-600 font-bold text-base" : val === "✗" ? "text-red-500 font-bold text-base" : "text-muted-foreground"}>{val}</span>
                    ) : (
                      <EditableText value={val} onSave={(v) => { const newRows = [...rows]; newRows[ri] = { ...newRows[ri], [key]: v }; onUpdate(newRows); }} />
                    )}
                  </td>
                );
              })}
              {isEditingMode && (
                <td className="px-2 py-3">
                  <button onClick={() => onUpdate(rows.filter((_, i) => i !== ri))} className="p-1 hover:bg-red-100 hover:text-red-600 rounded"><Trash2 size={12} /></button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {isEditingMode && (
        <button onClick={() => {
          const newRow: any = {};
          cols.forEach((c, i) => { newRow[`col${i}`] = i === 0 ? "Nueva fila" : "—"; });
          onUpdate([...rows, newRow]);
        }} className="w-full flex items-center justify-center gap-2 p-3 border-t border-dashed border-border text-muted-foreground hover:text-primary hover:bg-accent/20 transition-colors text-sm">
          <Plus size={14} /> Agregar fila
        </button>
      )}
    </div>
  );
};

export function Tab5() {
  const { content, sector, language, updateTab, isEditingMode } = useApp();
  const t = content[sector][language].tab5;
  const isES = language === "ES";

  return (
    <div className="space-y-6">
      <SectionWrap isVisible={t.benchmarks.isVisible} onToggle={() => updateTab("tab5", "benchmarks.isVisible", !t.benchmarks.isVisible)} label="Benchmarks">
        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-emerald-100 rounded-xl"><TrendingUp className="text-emerald-600" size={20} /></div>
            <h2 className="text-2xl font-bold"><EditableText value={t.benchmarks.title} onSave={(v) => updateTab("tab5", "benchmarks.title", v)} /></h2>
          </div>
          <div className="mb-6">
            <ComparisonTable
              rows={t.benchmarks.table || []}
              cols={isES ? ["Mercado / Zona", "Precio m²/mes (USD)", "Clase", "Disponibilidad", "Distancia al pad"] : ["Market / Zone", "Price sqm/month (USD)", "Class", "Availability", "Distance to pad"]}
              onUpdate={(rows) => updateTab("tab5", "benchmarks.table", rows)}
            />
          </div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground bg-accent/20 rounded-xl p-4">
            <EditableText multiline value={t.benchmarks.text} onSave={(v) => updateTab("tab5", "benchmarks.text", v)} />
          </div>
        </Card>
      </SectionWrap>

      <SectionWrap isVisible={t.risk.isVisible} onToggle={() => updateTab("tab5", "risk.isVisible", !t.risk.isVisible)} label="Risk Mitigation">
        <Card accent>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-xl"><Shield className="text-primary" size={20} /></div>
            <h2 className="text-2xl font-bold"><EditableText value={t.risk.title} onSave={(v) => updateTab("tab5", "risk.title", v)} /></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {t.risk.items.map((item: any, i: number) => (
              <div key={i} className={`relative bg-background rounded-2xl p-5 border border-border shadow-sm ${!item.isVisible ? "opacity-40 grayscale" : ""}`}>
                {isEditingMode && <div className="absolute top-2 right-2"><VisibilityToggle isVisible={item.isVisible} onToggle={() => { const items = [...t.risk.items]; items[i] = { ...items[i], isVisible: !items[i].isVisible }; updateTab("tab5", "risk.items", items); }} /></div>}
                <div className="font-bold text-sm mb-2 text-primary"><EditableText value={item.t} onSave={(v) => { const items = [...t.risk.items]; items[i] = { ...items[i], t: v }; updateTab("tab5", "risk.items", items); }} /></div>
                <div className="text-sm text-muted-foreground leading-relaxed"><EditableText multiline value={item.d} onSave={(v) => { const items = [...t.risk.items]; items[i] = { ...items[i], d: v }; updateTab("tab5", "risk.items", items); }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </SectionWrap>

      <SectionWrap isVisible={t.comparison?.isVisible !== false} onToggle={() => updateTab("tab5", "comparison.isVisible", !(t.comparison?.isVisible !== false))} label="Competitor Comparison">
        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-blue-100 rounded-xl"><BarChart3 className="text-blue-600" size={20} /></div>
            <h2 className="text-2xl font-bold">{isES ? "Comparativa Competitiva" : "Competitive Comparison"}</h2>
          </div>
          <ComparisonTable
            rows={t.comparison?.rows || []}
            cols={isES ? ["Atributo", "Distrito Energético", "Alternativas Neuquén", "Alternativas Añelo", "Permian Basin (TX)"] : ["Attribute", "Distrito Energético", "Neuquén Alternatives", "Añelo Alternatives", "Permian Basin (TX)"]}
            onUpdate={(rows) => updateTab("tab5", "comparison.rows", rows)}
          />
        </Card>
      </SectionWrap>

      <CustomBlocks tabKey="tab5" />
    </div>
  );
}

// ─── TAB 6 ────────────────────────────────────────────────────────────────────

export function Tab6() {
  const { content, sector, language, updateTab, isEditingMode } = useApp();
  const t = content[sector][language].tab6;
  const isES = language === "ES";

  return (
    <div className="space-y-6">

      {/* Cash Flow Summary */}
      <SectionWrap isVisible={t.cashflow?.isVisible !== false} onToggle={() => updateTab("tab6", "cashflow.isVisible", !(t.cashflow?.isVisible !== false))} label="Cash Flow">
        <Card accent>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-xl"><DollarSign className="text-primary" size={20} /></div>
            <h2 className="text-2xl font-bold">{isES ? "Flujo de Caja Proyectado" : "Projected Cash Flow"}</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-foreground text-background">
                  <th className="px-4 py-3 text-left text-xs uppercase font-bold tracking-wide">{isES ? "Concepto" : "Item"}</th>
                  {["Año 1","Año 2","Año 3","Año 4","Año 5"].map(y => (
                    <th key={y} className="px-4 py-3 text-center text-xs uppercase font-bold tracking-wide">{y}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(t.cashflow?.rows || []).map((row: any, i: number) => (
                  <tr key={i} className={`border-t border-border ${row.total ? "bg-accent/40 font-bold" : i % 2 === 0 ? "bg-background" : "bg-accent/10"}`}>
                    <td className="px-4 py-3 font-medium text-sm">
                      <EditableText value={row.label} onSave={(v) => { const rows = [...(t.cashflow?.rows||[])]; rows[i] = {...rows[i], label: v}; updateTab("tab6", "cashflow.rows", rows); }} />
                    </td>
                    {["y1","y2","y3","y4","y5"].map(yr => (
                      <td key={yr} className={`px-4 py-3 text-center text-sm ${row[yr]?.startsWith("-") || row[yr]?.startsWith("(") ? "text-red-600" : row.total ? "text-primary" : ""}`}>
                        <EditableText value={row[yr] || "—"} onSave={(v) => { const rows = [...(t.cashflow?.rows||[])]; rows[i] = {...rows[i], [yr]: v}; updateTab("tab6", "cashflow.rows", rows); }} />
                      </td>
                    ))}
                    {isEditingMode && (
                      <td className="px-2"><button onClick={() => { const rows = (t.cashflow?.rows||[]).filter((_:any, j:number) => j !== i); updateTab("tab6", "cashflow.rows", rows); }} className="p-1 hover:bg-red-100 hover:text-red-600 rounded"><Trash2 size={12} /></button></td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {isEditingMode && (
              <button onClick={() => {
                const rows = [...(t.cashflow?.rows||[]), { label: "Nueva fila", y1: "0", y2: "0", y3: "0", y4: "0", y5: "0" }];
                updateTab("tab6", "cashflow.rows", rows);
              }} className="w-full flex items-center justify-center gap-2 p-3 border-t border-dashed border-border text-muted-foreground hover:text-primary hover:bg-accent/20 text-sm">
                <Plus size={14} /> Agregar fila
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-3">* {isES ? "Valores en USD. Proyecciones sujetas a variables de mercado. Activá modo edición para modificar." : "Values in USD. Projections subject to market variables. Enable edit mode to modify."}</p>
        </Card>
      </SectionWrap>

      {/* Timeline */}
      <SectionWrap isVisible={t.timeline.isVisible} onToggle={() => updateTab("tab6", "timeline.isVisible", !t.timeline.isVisible)} label="Timeline">
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-xl"><Clock size={20} className="text-primary" /></div>
            <h2 className="text-2xl font-bold"><EditableText value={t.timeline.title} onSave={(v) => updateTab("tab6", "timeline.title", v)} /></h2>
          </div>
          <div className="space-y-0">
            {t.timeline.phases.map((phase: any, i: number) => (
              <div key={i} className={`relative flex gap-4 ${!phase.isVisible ? "opacity-40 grayscale" : ""}`}>
                {isEditingMode && <div className="absolute top-0 right-0"><VisibilityToggle isVisible={phase.isVisible} onToggle={() => { const phases = [...t.timeline.phases]; phases[i] = { ...phases[i], isVisible: !phases[i].isVisible }; updateTab("tab6", "timeline.phases", phases); }} /></div>}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0 mt-1">{i + 1}</div>
                  {i < t.timeline.phases.length - 1 && <div className="w-0.5 bg-border flex-1 mt-1 mb-0"></div>}
                </div>
                <div className="pb-5 flex-1">
                  <div className="font-bold mb-1"><EditableText value={phase.name} onSave={(v) => { const phases = [...t.timeline.phases]; phases[i] = { ...phases[i], name: v }; updateTab("tab6", "timeline.phases", phases); }} /></div>
                  <div className="text-sm text-muted-foreground leading-relaxed"><EditableText multiline value={phase.desc} onSave={(v) => { const phases = [...t.timeline.phases]; phases[i] = { ...phases[i], desc: v }; updateTab("tab6", "timeline.phases", phases); }} /></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </SectionWrap>

      {/* Capital Protection */}
      <SectionWrap isVisible={t.protection.isVisible} onToggle={() => updateTab("tab6", "protection.isVisible", !t.protection.isVisible)} label="Capital Protection">
        <Card dark>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-emerald-400/20 rounded-xl"><Shield className="text-emerald-400" size={20} /></div>
            <h2 className="text-2xl font-bold"><EditableText value={t.protection.title} onSave={(v) => updateTab("tab6", "protection.title", v)} /></h2>
          </div>
          <div className="text-base leading-relaxed opacity-90 mb-5">
            <EditableText multiline value={t.protection.text} onSave={(v) => updateTab("tab6", "protection.text", v)} />
          </div>
          <div className="flex flex-wrap gap-2">
            {["KPMG", "Deloitte", "EY", "PwC"].map(firm => (
              <span key={firm} className="bg-background/20 text-background text-xs font-bold px-3 py-1 rounded-full">{firm}</span>
            ))}
          </div>
        </Card>
      </SectionWrap>

      <CustomBlocks tabKey="tab6" />
    </div>
  );
}

// ─── TAB 7 ────────────────────────────────────────────────────────────────────

export function Tab7() {
  const { content, sector, language, updateTab, isEditingMode } = useApp();
  const t = content[sector][language].tab7;
  const m = t.metrics;
  const isES = language === "ES";

  return (
    <div className="space-y-6">

      {/* Key Metrics */}
      <SectionWrap isVisible={m.isVisible} onToggle={() => updateTab("tab7", "metrics.isVisible", !m.isVisible)} label="Land Metrics">
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-xl"><Building className="text-primary" size={20} /></div>
            <h2 className="text-2xl font-bold"><EditableText value={m.title} onSave={(v) => updateTab("tab7", "metrics.title", v)} /></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {[["fos","metrics.fos"],["fot","metrics.fot"]].map(([key, path]) => {
              const metric = m[key];
              if (!metric) return null;
              return (
                <div key={key} className="bg-accent/30 rounded-2xl p-6 border border-border">
                  <div className="text-5xl font-black text-primary mb-2"><EditableText value={metric.val} onSave={(v) => updateTab("tab7", `${path}.val`, v)} /></div>
                  <div className="font-bold text-sm mb-2"><EditableText value={metric.label} onSave={(v) => updateTab("tab7", `${path}.label`, v)} /></div>
                  <div className="text-sm text-muted-foreground leading-relaxed"><EditableText multiline value={metric.desc} onSave={(v) => updateTab("tab7", `${path}.desc`, v)} /></div>
                </div>
              );
            })}
          </div>

          {/* Lot sizes table */}
          {t.metrics.lots && (
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wide text-muted-foreground mb-3">{isES ? "Tamaños de Lote Disponibles" : "Available Lot Sizes"}</h3>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead><tr className="bg-foreground text-background">
                    {(isES ? ["Tipo de Lote","Superficie (m²)","Edificabilidad (m²)","Precio referencial","Estado"] : ["Lot Type","Area (sqm)","Buildable Area (sqm)","Reference Price","Status"]).map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs uppercase font-bold tracking-wide">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {t.metrics.lots.map((lot: any, i: number) => (
                      <tr key={i} className={`border-t border-border ${i % 2 === 0 ? "bg-background" : "bg-accent/10"}`}>
                        {Object.keys(lot).map((k, ci) => (
                          <td key={ci} className="px-4 py-3">
                            {k === "status" ? (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${lot[k] === "Disponible" || lot[k] === "Available" ? "bg-emerald-100 text-emerald-800" : lot[k] === "Reservado" || lot[k] === "Reserved" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-800"}`}>
                                <EditableText value={lot[k]} onSave={(v) => { const lots = [...t.metrics.lots]; lots[i] = {...lots[i], [k]: v}; updateTab("tab7", "metrics.lots", lots); }} />
                              </span>
                            ) : (
                              <EditableText value={lot[k]} onSave={(v) => { const lots = [...t.metrics.lots]; lots[i] = {...lots[i], [k]: v}; updateTab("tab7", "metrics.lots", lots); }} />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Card>
      </SectionWrap>

      {/* Specs */}
      <SectionWrap isVisible={t.specs.isVisible} onToggle={() => updateTab("tab7", "specs.isVisible", !t.specs.isVisible)} label="Specifications">
        <Card accent>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-primary/10 rounded-xl"><Calculator className="text-primary" size={20} /></div>
            <h2 className="text-2xl font-bold"><EditableText value={t.specs.title} onSave={(v) => updateTab("tab7", "specs.title", v)} /></h2>
          </div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground font-mono bg-background rounded-xl p-5 border border-border">
            <EditableText multiline value={t.specs.text} onSave={(v) => updateTab("tab7", "specs.text", v)} />
          </div>
        </Card>
      </SectionWrap>

      {/* Services included */}
      <SectionWrap isVisible={t.services?.isVisible !== false} onToggle={() => updateTab("tab7", "services.isVisible", !(t.services?.isVisible !== false))} label="Services">
        <Card dark>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-400/20 rounded-xl"><Flame className="text-blue-400" size={20} /></div>
            <h2 className="text-2xl font-bold">{isES ? "Servicios e Infraestructura Incluidos" : "Included Services & Infrastructure"}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {(t.services?.items || []).map((item: any, i: number) => (
              <div key={i} className="flex items-start gap-3 bg-background/10 rounded-xl p-3">
                <Check size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-sm opacity-90">
                  <EditableText value={item} onSave={(v) => { const items = [...(t.services?.items||[])]; items[i] = v; updateTab("tab7", "services.items", items); }} />
                </span>
              </div>
            ))}
            {isEditingMode && (
              <button onClick={() => {
                const items = [...(t.services?.items||[]), "Nuevo servicio"];
                updateTab("tab7", "services.items", items);
              }} className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-background/30 rounded-xl text-background/60 hover:text-background hover:border-background/60 transition-colors text-sm">
                <Plus size={14} /> Agregar servicio
              </button>
            )}
          </div>
        </Card>
      </SectionWrap>

      <CustomBlocks tabKey="tab7" />
    </div>
  );
}

// ─── TAB 8 ────────────────────────────────────────────────────────────────────

export function Tab8() {
  const { content, sector, language, updateTab } = useApp();
  const t = content[sector][language].tab8;
  const isES = language === "ES";
  return (
    <div className="space-y-6">
      <SectionWrap isVisible={t.mixer.isVisible} onToggle={() => updateTab("tab8", "mixer.isVisible", !t.mixer.isVisible)} label="Co-Investment">
        <Card dark>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-400/20 rounded-xl"><Calculator className="text-purple-400" size={20} /></div>
            <h2 className="text-2xl font-bold"><EditableText value={t.mixer.title} onSave={(v) => updateTab("tab8", "mixer.title", v)} /></h2>
          </div>
          <div className="text-base leading-relaxed opacity-90 mb-8">
            <EditableText multiline value={t.mixer.text} onSave={(v) => updateTab("tab8", "mixer.text", v)} />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: "🏗", label: isES ? "EPC / Constructora" : "EPC / Construction", desc: isES ? "Aportás capacidad de obra, recibís equity" : "Contribute construction capacity, receive equity" },
              { icon: "🚛", label: isES ? "Operador Logístico" : "Logistics Operator", desc: isES ? "Aportás cliente ancla, reducís tu ticket" : "Bring anchor tenant, reduce your ticket" },
              { icon: "💡", label: isES ? "Proveedor de Energía" : "Energy Provider", desc: isES ? "Aportás generación solar, recibís participación" : "Contribute solar generation, receive participation" },
            ].map((item, i) => (
              <div key={i} className="bg-background/10 rounded-2xl p-5 text-center">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="font-bold text-sm mb-1">{item.label}</div>
                <div className="text-xs opacity-70">{item.desc}</div>
              </div>
            ))}
          </div>
        </Card>
      </SectionWrap>
      <CustomBlocks tabKey="tab8" />
    </div>
  );
}

// ─── TAB 9 — LOI ──────────────────────────────────────────────────────────────

export function Tab9() {
  const { content, sector, language, updateTab } = useApp();
  const t = content[sector][language].tab9;
  const b = t.builder;
  const today = new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });
  const isES = language === "ES";

  const fields: [string, string][] = [
    ["investorName", isES ? "Inversor / Vehículo" : "Investor / Vehicle"],
    ["entryAmount", isES ? "Monto de Entrada (USD)" : "Entry Amount (USD)"],
    ["structure", isES ? "Estructura Legal" : "Legal Structure"],
    ["package", isES ? "Paquete Seleccionado" : "Selected Package"],
    ["irrExpected", isES ? "IRR Esperado" : "Expected IRR"],
    ["term", isES ? "Plazo de Inversión" : "Investment Term"],
    ["guarantee", isES ? "Garantía / Respaldo" : "Guarantee / Security"],
    ["exitStrategy", isES ? "Estrategia de Salida" : "Exit Strategy"],
  ];

  return (
    <div className="space-y-6">
      <SectionWrap isVisible={t.builder.isVisible} onToggle={() => updateTab("tab9", "builder.isVisible", !t.builder.isVisible)} label="LOI">
        <Card>
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <FileBox className="text-primary" />
                <EditableText value={t.builder.title} onSave={(v) => updateTab("tab9", "builder.title", v)} />
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Distrito Energético · Vaca Muerta · {today}</p>
            </div>
            <div className="text-right bg-accent/30 rounded-xl px-4 py-2">
              <div className="text-xs uppercase font-bold text-muted-foreground">Sector</div>
              <div className="text-sm font-bold">{sector}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {fields.map(([k, label]) => (
              <div key={k} className="bg-accent/30 p-5 rounded-xl border border-border">
                <div className="text-xs uppercase font-bold text-muted-foreground mb-1">{label}</div>
                <div className="text-base font-semibold"><EditableText value={b[k] || "—"} onSave={(v) => updateTab("tab9", `builder.${k}`, v)} /></div>
              </div>
            ))}
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
              <div className="text-xs uppercase font-bold text-blue-700 mb-2">{isES ? "Términos & Condiciones" : "Terms & Conditions"}</div>
              <div className="text-sm leading-relaxed text-muted-foreground">
                <EditableText multiline value={b.terms || "—"} onSave={(v) => updateTab("tab9", "builder.terms", v)} />
              </div>
            </div>
            <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
              <div className="text-xs uppercase font-bold text-amber-700 mb-2">{isES ? "Condiciones Precedentes" : "Conditions Precedent"}</div>
              <div className="text-sm leading-relaxed text-muted-foreground">
                <EditableText multiline value={b.conditions || "—"} onSave={(v) => updateTab("tab9", "builder.conditions", v)} />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-6 border-t-2 border-foreground">
            <div>
              <div className="text-xs uppercase font-bold text-muted-foreground mb-3">{isES ? "Firma del Inversor" : "Investor Signature"}</div>
              <div className="h-14 border-b border-dashed border-muted-foreground mb-2"></div>
              <div className="font-semibold text-sm"><EditableText value={b.investorName || "—"} onSave={(v) => updateTab("tab9", "builder.investorName", v)} /></div>
              <div className="text-xs text-muted-foreground mt-1">{isES ? "Fecha" : "Date"}: {today}</div>
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-muted-foreground mb-3">{isES ? "Representante Distrito Energético" : "Distrito Energético Representative"}</div>
              <div className="h-14 border-b border-dashed border-muted-foreground mb-2"></div>
              <div className="font-semibold text-sm"><EditableText value={b.sponsor || "—"} onSave={(v) => updateTab("tab9", "builder.sponsor", v)} /></div>
              <div className="text-xs text-muted-foreground mt-1">{isES ? "Fecha" : "Date"}: {today}</div>
            </div>
          </div>
        </Card>
      </SectionWrap>
      <CustomBlocks tabKey="tab9" />
    </div>
  );
}

// ─── TAB 10 — Market Intelligence ─────────────────────────────────────────────

const CAT_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  "Oil & Gas": { bg: "bg-orange-100", text: "text-orange-800", bar: "bg-orange-500" },
  "Logistics": { bg: "bg-blue-100", text: "text-blue-800", bar: "bg-blue-500" },
  "Real Estate": { bg: "bg-emerald-100", text: "text-emerald-800", bar: "bg-emerald-500" },
  "Macro": { bg: "bg-purple-100", text: "text-purple-800", bar: "bg-purple-500" },
};

export function Tab10() {
  const { content, sector, language, updateTab, isEditingMode } = useApp();
  const t = content[sector][language].tab10;
  const items: any[] = t.data.items || [];
  const categories = Array.from(new Set(items.map((i: any) => i.cat)));

  return (
    <div className="space-y-6">
      <SectionWrap isVisible={t.data.isVisible} onToggle={() => updateTab("tab10", "data.isVisible", !t.data.isVisible)} label="Market Data">
        <Card>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-xl"><Info className="text-primary" size={20} /></div>
            <div>
              <h2 className="text-2xl font-bold"><EditableText value={t.data.title} onSave={(v) => updateTab("tab10", "data.title", v)} /></h2>
              <p className="text-sm text-muted-foreground mt-0.5">Fuente: YPF, Secretaría de Energía, INDEC, consultores del sector · Proyecciones 2030</p>
            </div>
          </div>

          {/* Category cards layout */}
          <div className="space-y-6">
            {categories.map((cat) => {
              const catItems = items.filter((i: any) => i.cat === cat && (i.isVisible !== false || isEditingMode));
              const colors = CAT_COLORS[cat] || { bg: "bg-gray-100", text: "text-gray-800", bar: "bg-gray-500" };
              return (
                <div key={cat} className={`rounded-2xl border overflow-hidden`}>
                  <div className={`${colors.bg} px-5 py-3 flex items-center justify-between`}>
                    <span className={`font-bold text-sm ${colors.text}`}>{cat}</span>
                    <BarChart3 size={16} className={colors.text} />
                  </div>
                  <div className="divide-y divide-border">
                    {catItems.map((item: any, idx: number) => {
                      const globalIdx = items.findIndex((i: any) => i === item);
                      return (
                        <div key={idx} className={`px-5 py-4 ${!item.isVisible ? "opacity-40" : ""}`}>
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1 font-medium text-sm">
                              <EditableText value={item.label} onSave={(v) => {
                                const arr = [...items]; arr[globalIdx] = { ...arr[globalIdx], label: v }; updateTab("tab10", "data.items", arr);
                              }} />
                            </div>
                            {isEditingMode && (
                              <div className="flex items-center gap-1">
                                <VisibilityToggle isVisible={item.isVisible !== false} onToggle={() => {
                                  const arr = [...items]; arr[globalIdx] = { ...arr[globalIdx], isVisible: !item.isVisible }; updateTab("tab10", "data.items", arr);
                                }} />
                                <button onClick={() => {
                                  const arr = items.filter((_: any, i: number) => i !== globalIdx); updateTab("tab10", "data.items", arr);
                                }} className="p-1 hover:bg-red-100 hover:text-red-600 rounded transition-colors"><Trash2 size={12} /></button>
                              </div>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs text-muted-foreground uppercase font-semibold mb-1">Actual</div>
                              <div className="text-base font-bold">
                                <EditableText value={item.current} onSave={(v) => {
                                  const arr = [...items]; arr[globalIdx] = { ...arr[globalIdx], current: v }; updateTab("tab10", "data.items", arr);
                                }} />
                              </div>
                              <div className={`h-2 rounded-full mt-2 ${colors.bar} opacity-40`} style={{ width: "40%" }}></div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground uppercase font-semibold mb-1 flex items-center gap-1">
                                Proyectado <ArrowUpRight size={10} className="text-emerald-500" />
                              </div>
                              <div className={`text-base font-bold ${colors.text}`}>
                                <EditableText value={item.proj} onSave={(v) => {
                                  const arr = [...items]; arr[globalIdx] = { ...arr[globalIdx], proj: v }; updateTab("tab10", "data.items", arr);
                                }} />
                              </div>
                              <div className={`h-2 rounded-full mt-2 ${colors.bar}`} style={{ width: "100%" }}></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {isEditingMode && (
            <button onClick={() => {
              const newItem = { isVisible: true, cat: "Oil & Gas", label: "Nuevo indicador", current: "—", proj: "—" };
              updateTab("tab10", "data.items", [...items, newItem]);
            }} className="w-full flex items-center justify-center gap-2 p-4 mt-4 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition-colors text-sm font-medium">
              <Plus size={16} /> Agregar indicador de mercado
            </button>
          )}
        </Card>
      </SectionWrap>
      <CustomBlocks tabKey="tab10" />
    </div>
  );
}

export const TAB_COMPONENTS: Record<string, React.FC> = {
  tab1: Tab1, tab2: Tab2, tab3: Tab3, tab4: Tab4, tab5: Tab5,
  tab6: Tab6, tab7: Tab7, tab8: Tab8, tab9: Tab9, tab10: Tab10,
};
