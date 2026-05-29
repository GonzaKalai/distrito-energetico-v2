import {
  FileText, Zap, TrendingUp, Map, Shield, Calculator,
  Building, FileBox, Info, Train, Warehouse, Check, X,
  ArrowUpRight, BarChart3, Globe, Flame, DollarSign, Clock,
  Plus, Trash2
} from "lucide-react";
import React, { useRef } from "react";
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
  const { content, sector, language, updateTab, isEditingMode } = useApp();
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

      <SectionWrap isVisible={t.calculatorVisible !== false} onToggle={() => updateTab("tab2", "calculatorVisible", !(t.calculatorVisible !== false))} label="Calculadora">
        <FinancialCalculator />
      </SectionWrap>
      <CustomBlocks tabKey="tab2" />
    </div>
  );
}

// ─── TAB 3 ────────────────────────────────────────────────────────────────────

function ImageUploadSection({ tabKey, sectionKey }: { tabKey: string; sectionKey: string }) {
  const { content, sector, language, updateTab, isEditingMode } = useApp();
  const t = content[sector][language][tabKey];
  const section = t[sectionKey] || { isVisible: true, images: [], caption: "" };
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const images = [...(section.images || []), reader.result as string];
        updateTab(tabKey, `${sectionKey}.images`, images);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (i: number) => {
    const images = (section.images || []).filter((_: string, idx: number) => idx !== i);
    updateTab(tabKey, `${sectionKey}.images`, images);
  };

  const images: string[] = section.images || [];

  return (
    <SectionWrap isVisible={section.isVisible} onToggle={() => updateTab(tabKey, `${sectionKey}.isVisible`, !section.isVisible)} label="Images">
      <div className="space-y-4">
        {images.length > 0 && (
          <div className={`grid gap-4 ${images.length === 1 ? "grid-cols-1" : images.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"}`}>
            {images.map((src: string, i: number) => (
              <div key={i} className="relative group rounded-2xl overflow-hidden border border-border aspect-video bg-accent/20">
                <img src={src} alt={`Location ${i + 1}`} className="w-full h-full object-cover" />
                {isEditingMode && (
                  <button onClick={() => removeImage(i)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {section.caption && (
          <p className="text-xs text-muted-foreground text-center italic">
            <EditableText value={section.caption} onSave={(v) => updateTab(tabKey, `${sectionKey}.caption`, v)} />
          </p>
        )}
        {isEditingMode && (
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
            className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="text-3xl mb-2">🗺️</div>
            <p className="text-sm font-medium text-muted-foreground">Hacé click o arrastrá imágenes aquí</p>
            <p className="text-xs text-muted-foreground mt-1">Mapas, fotos aéreas, renders del sitio · Múltiples imágenes</p>
            <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={e => handleFiles(e.target.files)} />
          </div>
        )}
        {!isEditingMode && images.length === 0 && (
          <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center text-muted-foreground text-sm">
            Activá modo edición para agregar mapas e imágenes del sitio
          </div>
        )}
      </div>
    </SectionWrap>
  );
}

export function Tab3() {
  const { content, sector, language, updateTab, isEditingMode } = useApp();
  const t = content[sector][language].tab3;
  return (
    <div className="space-y-6">
      <ImageUploadSection tabKey="tab3" sectionKey="locationImages" />
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
{(() => {
              const fStats = (t.funnel?.stats && t.funnel.stats.length > 0) ? t.funnel.stats : [{value:"95%",label:"Tráfico pesado canalizado"},{value:"15K",label:"Vehículos/día actuales"},{value:"30K",label:"Proyectado 2028"}];
              return fStats.map((s: any, i: number) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-black text-yellow-400">
                    <EditableText value={s.value} onSave={(v) => { const arr = [...fStats]; arr[i] = {...arr[i], value: v}; updateTab("tab3", "funnel.stats", arr); }} />
                  </div>
                  <div className="text-xs opacity-60 mt-1">
                    <EditableText value={s.label} onSave={(v) => { const arr = [...fStats]; arr[i] = {...arr[i], label: v}; updateTab("tab3", "funnel.stats", arr); }} />
                  </div>
                </div>
              ));
            })()}
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
          {(() => {
            const ops: string[] = t.epicenter?.operators || ["YPF", "Chevron", "Shell", "ExxonMobil", "Pan American Energy", "Tecpetrol"];
            return (
              <div className="flex flex-wrap gap-2 items-center">
                {ops.map((op: string, i: number) => (
                  <div key={i} className="group relative">
                    <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                      <EditableText value={op} onSave={(v) => { const arr = [...ops]; arr[i] = v; updateTab("tab3", "epicenter.operators", arr); }} />
                      {isEditingMode && (
                        <button onClick={() => updateTab("tab3", "epicenter.operators", ops.filter((_:string, j:number) => j !== i))}
                          className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all ml-0.5">
                          <X size={10} />
                        </button>
                      )}
                    </span>
                  </div>
                ))}
                {isEditingMode && (
                  <button onClick={() => updateTab("tab3", "epicenter.operators", [...ops, "Nueva empresa"])}
                    className="bg-accent border-2 border-dashed border-border text-muted-foreground text-xs font-bold px-3 py-1.5 rounded-full hover:border-primary hover:text-primary transition-colors flex items-center gap-1">
                    <Plus size={10} /> Agregar
                  </button>
                )}
              </div>
            );
          })()}
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
              <div className="text-2xl font-black text-primary">
                <EditableText value={t.proximity.stat1value || "8-12 km"} onSave={(v) => updateTab("tab3", "proximity.stat1value", v)} />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                <EditableText value={t.proximity.stat1label || "Distrito Energético al pad"} onSave={(v) => updateTab("tab3", "proximity.stat1label", v)} />
              </div>
            </div>
            <div className="bg-background rounded-xl p-4 border border-border text-center">
              <div className="text-2xl font-black text-red-500">
                <EditableText value={t.proximity.stat2value || "60-120 km"} onSave={(v) => updateTab("tab3", "proximity.stat2value", v)} />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                <EditableText value={t.proximity.stat2label || "Alternativas actuales"} onSave={(v) => updateTab("tab3", "proximity.stat2label", v)} />
              </div>
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

function CycleCell({ val, onSave, center = true }: { val: string; onSave: (v: string) => void; center?: boolean }) {
  const { isEditingMode } = useApp();
  const isCheck = val === "✓" || val === "✗";
  const cycle = () => {
    if (val === "✓") onSave("✗");
    else if (val === "✗") onSave("—");
    else onSave("✓");
  };
  return (
    <div className={`flex items-center gap-1 ${center ? "justify-center" : ""}`}>
      {isCheck ? (
        <span
          className={`text-base font-bold ${val === "✓" ? "text-emerald-600" : "text-red-500"} ${isEditingMode ? "cursor-pointer hover:opacity-70" : ""}`}
          onClick={isEditingMode ? cycle : undefined}
          title={isEditingMode ? "Click para cambiar: ✓ → ✗ → texto" : undefined}
        >{val}</span>
      ) : (
        <EditableText value={val} onSave={onSave} />
      )}
      {isEditingMode && !isCheck && (
        <button onClick={cycle} className="text-[10px] text-muted-foreground hover:text-primary transition-colors shrink-0" title="Convertir a ✓ / ✗">⊙</button>
      )}
    </div>
  );
}

const ComparisonTable = ({ rows, cols, onUpdate, onUpdateCols }: { rows: any[]; cols: string[]; onUpdate: (rows: any[]) => void; onUpdateCols?: (cols: string[]) => void }) => {
  const { isEditingMode } = useApp();
  const addColumn = () => {
    const newKey = `col${cols.length}`;
    const newCols = [...cols, "Nueva columna"];
    const newRows = rows.map(r => ({ ...r, [newKey]: "—" }));
    onUpdateCols?.(newCols);
    onUpdate(newRows);
  };
  const removeColumn = (ci: number) => {
    const key = Object.keys(rows[0] || {})[ci];
    const newCols = cols.filter((_, i) => i !== ci);
    const newRows = rows.map(r => { const nr = { ...r }; delete nr[key]; return nr; });
    onUpdateCols?.(newCols);
    onUpdate(newRows);
  };
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-foreground text-background">
            {cols.map((c, i) => (
              <th key={i} className={`px-4 py-3 text-left font-bold text-xs uppercase tracking-wide group ${i === 0 ? "" : "text-center"}`}>
                {onUpdateCols ? (
                  <EditableText value={c} onSave={(v) => { const nc = [...cols]; nc[i] = v; onUpdateCols(nc); }} />
                ) : c}
                {isEditingMode && onUpdateCols && i > 0 && (
                  <button onClick={() => removeColumn(i)} className="ml-1 opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-100 transition-all" title="Quitar columna"><X size={10} /></button>
                )}
              </th>
            ))}
            {isEditingMode && onUpdateCols && <th className="px-2"><button onClick={addColumn} className="text-background/60 hover:text-background text-xs" title="Agregar columna"><Plus size={12} /></button></th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any, ri: number) => (
            <tr key={ri} className={`border-t border-border ${ri % 2 === 0 ? "bg-background" : "bg-accent/20"}`}>
              {cols.map((_, ci) => {
                const key = Object.keys(row)[ci] || `col${ci}`;
                const val = (row[key] !== undefined && row[key] !== null) ? String(row[key]) : "—";
                const isCheck = val === "✓" || val === "✗";
                return (
                  <td key={ci} className={`px-4 py-3 ${ci === 0 ? "font-medium" : "text-center"}`}>
                    {isCheck ? (
                      <span
                        className={`font-bold text-base cursor-pointer ${val === "✓" ? "text-emerald-600 hover:text-emerald-400" : "text-red-500 hover:text-red-400"}`}
                        onClick={() => { const newRows = [...rows]; newRows[ri] = { ...newRows[ri], [key]: val === "✓" ? "✗" : "✓" }; onUpdate(newRows); }}
                        title="Click para cambiar ✓ / ✗"
                      >{val}</span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <EditableText value={val} onSave={(v) => { const newRows = [...rows]; newRows[ri] = { ...newRows[ri], [key]: v }; onUpdate(newRows); }} />
                        {isEditingMode && (
                          <button onClick={() => { const newRows = [...rows]; newRows[ri] = { ...newRows[ri], [key]: "✓" }; onUpdate(newRows); }}
                            className="text-[10px] text-muted-foreground hover:text-emerald-600 shrink-0" title="Convertir a ✓ / ✗">⊙</button>
                        )}
                      </div>
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
          // Use same keys as first row, or fallback to col{i}
          const refKeys = rows.length > 0 ? Object.keys(rows[0]) : cols.map((_: any, i: number) => `col${i}`);
          const newRow: any = {};
          cols.forEach((_: any, i: number) => { newRow[refKeys[i] || `col${i}`] = i === 0 ? "Nueva fila" : "—"; });
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
              cols={t.benchmarks.cols || (isES ? ["Mercado / Zona","Precio m²/mes (USD)","Clase","Disponibilidad","Distancia al pad"] : ["Market / Zone","Price sqm/month (USD)","Class","Availability","Distance to pad"])}
              onUpdate={(rows) => updateTab("tab5", "benchmarks.table", rows)}
              onUpdateCols={(cols) => updateTab("tab5", "benchmarks.cols", cols)}
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
            cols={t.comparison?.cols || (isES ? ["Atributo","Distrito Energético","Alternativas Neuquén","Alternativas Añelo","Permian Basin (TX)"] : ["Attribute","Distrito Energético","Neuquén Alternatives","Añelo Alternatives","Permian Basin (TX)"])}
            onUpdate={(rows) => updateTab("tab5", "comparison.rows", rows)}
            onUpdateCols={(cols) => updateTab("tab5", "comparison.cols", cols)}
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
                  {(() => {
                  const cfCols = t.cashflow?.cols || (isES ? ["Concepto","Año 1","Año 2","Año 3","Año 4","Año 5"] : ["Item","Year 1","Year 2","Year 3","Year 4","Year 5"]);
                  const cfYrKeys = ["label","y1","y2","y3","y4","y5","y6","y7","y8","y9","y10"].slice(0, cfCols.length);
                  return cfCols.map((col: string, ci: number) => (
                    <th key={ci} className={`px-4 py-3 text-xs uppercase font-bold tracking-wide ${ci === 0 ? "text-left" : "text-center"}`}>
                      <EditableText value={col} onSave={(v) => { const nc = [...cfCols]; nc[ci] = v; updateTab("tab6", "cashflow.cols", nc); }} />
                    </th>
                  ));
                })()}
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const cfCols = t.cashflow?.cols || (isES ? ["Concepto","Año 1","Año 2","Año 3","Año 4","Año 5"] : ["Item","Year 1","Year 2","Year 3","Year 4","Year 5"]);
                  const cfYrKeys = ["label","y1","y2","y3","y4","y5","y6","y7","y8","y9","y10"].slice(0, cfCols.length);
                  return (t.cashflow?.rows || []).map((row: any, i: number) => (
                  <tr key={i} className={`border-t border-border ${row.total ? "bg-accent/40 font-bold" : i % 2 === 0 ? "bg-background" : "bg-accent/10"}`}>
                    {cfYrKeys.map((yrKey, ci) => (
                      <td key={ci} className={`px-4 py-3 ${ci === 0 ? "font-medium text-sm" : `text-center text-sm ${String(row[yrKey] || "").startsWith("(") ? "text-red-600" : row.total ? "text-primary" : ""}`}`}>
                        <EditableText value={row[yrKey] !== undefined ? String(row[yrKey]) : "—"} onSave={(v) => { const rows = [...(t.cashflow?.rows||[])]; rows[i] = {...rows[i], [yrKey]: v}; updateTab("tab6", "cashflow.rows", rows); }} />
                      </td>
                    ))}
                    {isEditingMode && (
                      <td className="px-2"><button onClick={() => { const rows = (t.cashflow?.rows||[]).filter((_:any, j:number) => j !== i); updateTab("tab6", "cashflow.rows", rows); }} className="p-1 hover:bg-red-100 hover:text-red-600 rounded"><Trash2 size={12} /></button></td>
                    )}
                  </tr>
                  ));
                })()}
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
          {(() => {
            const firms: string[] = t.protection?.firms || ["KPMG", "Deloitte", "EY", "PwC"];
            return (
              <div className="flex flex-wrap gap-2 items-center">
                {firms.map((firm: string, i: number) => (
                  <div key={i} className="group relative">
                    <span className="bg-background/20 text-background text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <EditableText value={firm} onSave={(v) => { const arr = [...firms]; arr[i] = v; updateTab("tab6", "protection.firms", arr); }} />
                      {isEditingMode && (
                        <button onClick={() => updateTab("tab6", "protection.firms", firms.filter((_:string, j:number) => j !== i))}
                          className="opacity-0 group-hover:opacity-100 hover:text-red-300 transition-all ml-0.5">
                          <X size={10} />
                        </button>
                      )}
                    </span>
                  </div>
                ))}
                {isEditingMode && (
                  <button onClick={() => updateTab("tab6", "protection.firms", [...firms, "Nueva firma"])}
                    className="bg-background/10 border-2 border-dashed border-background/30 text-background/60 text-xs font-bold px-3 py-1 rounded-full hover:border-background hover:text-background transition-colors flex items-center gap-1">
                    <Plus size={10} /> Agregar
                  </button>
                )}
              </div>
            );
          })()}
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
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
                  <EditableText value={t.metrics.lotsTitle || (isES ? "Tamaños de Lote Disponibles" : "Available Lot Sizes")} onSave={(v) => updateTab("tab7", "metrics.lotsTitle", v)} />
                </h3>
              </div>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead><tr className="bg-foreground text-background">
                    {(t.metrics.lotsCols || (isES ? ["Tipo de Lote","Superficie (m²)","Edificabilidad (m²)","Precio referencial","Estado"] : ["Lot Type","Area (sqm)","Buildable Area (sqm)","Reference Price","Status"])).map((h: string, hi: number) => (
                      <th key={hi} className="px-4 py-3 text-left text-xs uppercase font-bold tracking-wide">
                        <EditableText value={h} onSave={(v) => { const cols = [...(t.metrics.lotsCols || (isES ? ["Tipo de Lote","Superficie (m²)","Edificabilidad (m²)","Precio referencial","Estado"] : ["Lot Type","Area (sqm)","Buildable Area (sqm)","Reference Price","Status"]))]; cols[hi] = v; updateTab("tab7", "metrics.lotsCols", cols); }} />
                      </th>
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
            <h2 className="text-2xl font-bold"><EditableText value={t.services?.title || (isES ? "Servicios e Infraestructura Incluidos" : "Included Services & Infrastructure")} onSave={(v) => updateTab("tab7", "services.title", v)} /></h2>
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
  const { content, sector, language, updateTab, isEditingMode } = useApp();
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
{(t.mixer?.partners || [{icon:"🏗",label:"EPC / Constructora",desc:"Aportás capacidad de obra, recibís equity"},{icon:"🚛",label:"Operador Logístico",desc:"Aportás cliente ancla, reducís tu ticket"},{icon:"💡",label:"Proveedor de Energía",desc:"Aportás generación solar, recibís participación"}]).map((item: any, i: number) => (
              <div key={i} className="bg-background/10 rounded-2xl p-5 text-center">
                <div className="text-3xl mb-3">
                  <EditableText value={item.icon} onSave={(v) => { const p = [...t.mixer.partners]; p[i] = {...p[i], icon: v}; updateTab("tab8", "mixer.partners", p); }} />
                </div>
                <div className="font-bold text-sm mb-1">
                  <EditableText value={item.label} onSave={(v) => { const p = [...t.mixer.partners]; p[i] = {...p[i], label: v}; updateTab("tab8", "mixer.partners", p); }} />
                </div>
                <div className="text-xs opacity-70">
                  <EditableText multiline value={item.desc} onSave={(v) => { const p = [...t.mixer.partners]; p[i] = {...p[i], desc: v}; updateTab("tab8", "mixer.partners", p); }} />
                </div>
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

function LoiInput({ label, value, placeholder, onSave, wide = false }: {
  label: string; value: string; placeholder?: string; onSave: (v: string) => void; wide?: boolean;
}) {
  return (
    <div className={wide ? "md:col-span-2" : ""}>
      <label className="block text-xs font-semibold text-muted-foreground mb-1">{label}</label>
      <input
        className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
        value={value}
        placeholder={placeholder}
        onChange={e => onSave(e.target.value)}
      />
    </div>
  );
}

function BindingBadge() {
  return <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200"><Shield size={10} /> Binding</span>;
}

export function Tab9() {
  const { content, sector, language, updateTab, isEditingMode } = useApp();
  const t = content[sector][language].tab9;
  const b = t.builder;
  const isES = language === "ES";
  const today = new Date().toLocaleDateString(isES ? "es-AR" : "en-US", { day: "2-digit", month: "long", year: "numeric" });
  const [loiMode, setLoiMode] = React.useState<"summary" | "formal">("summary");

  const upd = (path: string, val: any) => updateTab("tab9", `builder.${path}`, val);

  // Helpers to fill placeholders in formal text
  const fill = (text: string) => (text || "")
    .replace("{opportunityName}", b.opportunityName || "")
    .replace("{package}", b.investmentPackage || "")
    .replace("{amount}", b.entryAmount || "");

  const tranches: any[] = b.tranches || [];
  const conditions: string[] = b.conditionsPrecedent || [];
  const ddItems: string[] = b.ddItems || [];

  return (
    <div className="space-y-6">
      <SectionWrap isVisible={t.builder.isVisible} onToggle={() => updateTab("tab9", "builder.isVisible", !t.builder.isVisible)} label="LOI">
        <Card>
          {/* Header with mode toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileBox className="text-primary" size={22} />
              <div>
                <div className="font-bold text-lg">
                  <EditableText value={b.title || "Letter of Intent"} onSave={v => upd("title", v)} />
                </div>
                <div className="text-xs text-muted-foreground">Investment commitment document</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-accent p-1 rounded-xl border border-border">
                <button onClick={() => setLoiMode("summary")} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${loiMode === "summary" ? "bg-foreground text-background shadow" : "opacity-50 hover:opacity-80"}`}>Summary</button>
                <button onClick={() => setLoiMode("formal")} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${loiMode === "formal" ? "bg-foreground text-background shadow" : "opacity-50 hover:opacity-80"}`}>Formal</button>
              </div>
            </div>
          </div>

          {/* ── SUMMARY MODE ── */}
          {loiMode === "summary" && (
            <div className="space-y-6">
              {/* Header card */}
              <div className="bg-accent/30 rounded-2xl p-5 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base">{isES ? "Resumen de Inversión" : "Investment Summary"}</h3>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                    <EditableText value={b.status || "Draft"} onSave={v => upd("status", v)} />
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground">{isES ? "Oportunidad" : "Opportunity"}</div>
                    <div className="font-medium"><EditableText value={b.opportunityName || ""} onSave={v => upd("opportunityName", v)} /></div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{isES ? "Fecha" : "Date"}</div>
                    <div className="font-medium">{today}</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <LoiInput label={isES ? "Nombre del Inversor" : "Investor Name"} value={b.investorName || ""} placeholder={isES ? "Nombre completo" : "Enter full name"} onSave={v => upd("investorName", v)} />
                  <LoiInput label={isES ? "Entidad / Empresa" : "Entity / Company"} value={b.entityName || ""} placeholder={isES ? "Nombre de entidad (opcional)" : "Enter entity name (optional)"} onSave={v => upd("entityName", v)} />
                  <LoiInput label={isES ? "Monto de Entrada (USD)" : "Entry Amount (USD)"} value={b.entryAmount || ""} placeholder="500000" onSave={v => upd("entryAmount", v)} />
                  <LoiInput label={isES ? "Estructura Legal" : "Legal Structure"} value={b.legalStructure || ""} placeholder="Trust" onSave={v => upd("legalStructure", v)} />
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">{isES ? "Paquete de Inversión" : "Investment Package"}</label>
                    {isEditingMode ? (
                      <input className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                        value={b.investmentPackage || ""} onChange={e => upd("investmentPackage", e.target.value)} />
                    ) : (
                      <div className="border border-border rounded-lg px-3 py-2 text-sm bg-background font-medium">{b.investmentPackage || "—"}</div>
                    )}
                  </div>
                </div>

                {/* Key Terms auto-generated */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="font-semibold text-sm mb-2">{isES ? "Términos Clave" : "Key Terms"}</div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>• {isES ? "Paquete" : "Investment Package"}: <EditableText value={b.investmentPackage || "—"} onSave={v => upd("investmentPackage", v)} /></div>
                    <div>• {isES ? "IRR Proyectado" : "Projected IRR"}: <EditableText value={b.projectedIRR || "15.0%"} onSave={v => upd("projectedIRR", v)} /></div>
                    <div>• {isES ? "Plazo" : "Term"}: <EditableText value={b.term || "36 months"} onSave={v => upd("term", v)} /></div>
                    <div>• {isES ? "Estructura" : "Structure"}: <EditableText value={b.structureType || ""} onSave={v => upd("structureType", v)} /></div>
                  </div>
                </div>
              </div>

              {/* Investment Tranches */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign size={16} className="text-primary" />
                  <h3 className="font-bold text-sm uppercase tracking-wide">{isES ? "Tramos de Pago" : "Investment Tranches"}</h3>
                </div>
                <div className="space-y-2">
                  {tranches.map((tr: any, i: number) => (
                    <div key={i} className="relative flex items-center gap-4 bg-accent/20 rounded-xl p-4 border border-border group">
                      {isEditingMode && (
                        <button onClick={() => upd("tranches", tranches.filter((_: any, j: number) => j !== i))}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 hover:text-red-600 rounded"><Trash2 size={11} /></button>
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-sm"><EditableText value={tr.name} onSave={v => { const t2=[...tranches]; t2[i]={...t2[i],name:v}; upd("tranches",t2); }} /></div>
                        <div className="text-xs text-muted-foreground"><EditableText value={tr.description} onSave={v => { const t2=[...tranches]; t2[i]={...t2[i],description:v}; upd("tranches",t2); }} /></div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-base">$<EditableText value={tr.amount} onSave={v => { const t2=[...tranches]; t2[i]={...t2[i],amount:v}; upd("tranches",t2); }} /></div>
                        <div className="text-xs text-muted-foreground"><EditableText value={tr.percentage} onSave={v => { const t2=[...tranches]; t2[i]={...t2[i],percentage:v}; upd("tranches",t2); }} /></div>
                      </div>
                    </div>
                  ))}
                  {isEditingMode && (
                    <button onClick={() => upd("tranches", [...tranches, { name: isES ? "Nuevo tramo" : "New tranche", description: "—", amount: "0", percentage: "0%" }])}
                      className="w-full border-2 border-dashed border-border rounded-xl p-3 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                      <Plus size={14} /> {isES ? "Agregar tramo" : "Add tranche"}
                    </button>
                  )}
                </div>
              </div>

              {/* Due Diligence & Exclusivity cards */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-rose-200 rounded-2xl p-5 bg-rose-50">
                  <div className="flex items-center gap-2 mb-3"><FileText size={16} className="text-rose-500" /><span className="font-bold text-sm">{isES ? "Período de Due Diligence" : "Due Diligence Period"}</span></div>
                  <div className="text-4xl font-black mb-1"><EditableText value={b.dueDiligenceDays || "45"} onSave={v => upd("dueDiligenceDays", v)} /></div>
                  <div className="text-sm text-muted-foreground mb-3">{isES ? "días hábiles" : "business days"}</div>
                  <div className="text-xs text-muted-foreground">{isES ? "Revisión legal, masterplan y gobernanza" : "Full review of legal status, masterplan approvals, and trust governance"}</div>
                </div>
                <div className="border border-blue-200 rounded-2xl p-5 bg-blue-50">
                  <div className="flex items-center gap-2 mb-3"><Clock size={16} className="text-blue-500" /><span className="font-bold text-sm">{isES ? "Período de Exclusividad" : "Exclusivity Period"}</span></div>
                  <div className="text-4xl font-black mb-1"><EditableText value={b.exclusivityDays || "60"} onSave={v => upd("exclusivityDays", v)} /></div>
                  <div className="text-sm text-muted-foreground mb-3">{isES ? "días" : "days"}</div>
                  <div className="text-xs text-muted-foreground mb-2">{isES ? "El Desarrollador no negociará con terceros para el mismo activo." : "Lock-out period: Developer will not negotiate with third parties for the same asset."}</div>
                  <div className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-lg w-fit"><Shield size={10} /> Binding Clause</div>
                </div>
              </div>
            </div>
          )}

          {/* ── FORMAL MODE ── */}
          {loiMode === "formal" && (
            <div className="space-y-0 font-serif">
              {/* Document header */}
              <div className="text-center py-6 border-b-2 border-foreground mb-6">
                <h1 className="text-2xl font-black tracking-wide uppercase">
                  <EditableText value={b.title || "Letter of Intent"} onSave={v => upd("title", v)} />
                </h1>
                <div className="text-sm text-muted-foreground mt-1">
                  <EditableText value={b.opportunityName || ""} onSave={v => upd("opportunityName", v)} />
                </div>
                <div className="text-sm text-muted-foreground">{today}</div>
              </div>

              {/* Parties */}
              <div className="mb-6 text-sm leading-relaxed">
                <p className="mb-2">{isES ? 'Esta Carta de Intención ("LOI") representa el entendimiento preliminar entre:' : 'This Letter of Intent ("LOI") represents the preliminary understanding between:'}</p>
                <div className="ml-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold uppercase text-xs w-32 shrink-0">{isES ? "Inversor:" : "Investor:"}</span>
                    <input className="border-b border-border bg-transparent text-sm focus:outline-none focus:border-primary flex-1 pb-0.5"
                      value={b.investorName || ""} placeholder={isES ? "[Nombre del Inversor]" : "[Investor Name]"} onChange={e => upd("investorName", e.target.value)} />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold uppercase text-xs w-32 shrink-0">{isES ? "Entidad:" : "Entity:"}</span>
                    <input className="border-b border-border bg-transparent text-sm focus:outline-none focus:border-primary flex-1 pb-0.5"
                      value={b.entityName || ""} placeholder={isES ? "[Nombre de Entidad]" : "[Entity Name]"} onChange={e => upd("entityName", e.target.value)} />
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-bold uppercase text-xs w-32 shrink-0">{isES ? "Desarrollador:" : "Master Developer:"}</span>
                    <span className="font-bold text-sm"><EditableText value={b.masterDeveloper || "Distrito Energético Vaca Muerta S.A."} onSave={v => upd("masterDeveloper", v)} /></span>
                  </div>
                </div>
              </div>

              {/* Section 1 */}
              <div className="mb-5">
                <h3 className="font-black uppercase text-sm mb-2">1. {isES ? "Interés de Inversión" : "Investment Interest"}</h3>
                <div className="ml-4 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                  <EditableText multiline value={fill(b.investmentInterestText || "")} onSave={v => upd("investmentInterestText", v)} />
                </div>
              </div>

              {/* Section 2 */}
              <div className="mb-5">
                <h3 className="font-black uppercase text-sm mb-2">2. {isES ? "Monto Propuesto" : "Proposed Consideration"}</h3>
                <div className="ml-4 text-sm leading-relaxed text-muted-foreground mb-3">
                  <EditableText multiline value={fill(b.considerationText || "")} onSave={v => upd("considerationText", v)} />
                </div>
                <div className="ml-4 space-y-1">
                  {tranches.map((tr: any, i: number) => (
                    <div key={i} className="text-sm">• <strong>{tr.percentage}</strong> (${tr.amount}) {tr.description}.</div>
                  ))}
                </div>
              </div>

              {/* Section 3 */}
              <div className="mb-5">
                <h3 className="font-black uppercase text-sm mb-2">3. {isES ? "Due Diligence" : "Due Diligence"}</h3>
                <div className="ml-4 text-sm leading-relaxed text-muted-foreground mb-3">
                  <EditableText multiline value={b.ddText || ""} onSave={v => upd("ddText", v)} />
                </div>
                <div className="ml-4 space-y-1">
                  {ddItems.map((item: string, i: number) => (
                    <div key={i} className="text-sm flex items-start gap-2">
                      <span className="shrink-0">•</span>
                      <EditableText value={item} onSave={v => { const items=[...ddItems]; items[i]=v; upd("ddItems",items); }} />
                      {isEditingMode && <button onClick={() => upd("ddItems", ddItems.filter((_:string,j:number)=>j!==i))} className="text-red-400 hover:text-red-600 shrink-0"><X size={11} /></button>}
                    </div>
                  ))}
                  {isEditingMode && <button onClick={() => upd("ddItems", [...ddItems, isES ? "Nuevo ítem" : "New item"])} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-1"><Plus size={11} />{isES ? "Agregar" : "Add"}</button>}
                </div>
              </div>

              {/* Section 4 - Binding */}
              <div className="mb-5 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-black uppercase text-sm mb-2 flex items-center gap-2">4. {isES ? "Exclusividad" : "Exclusivity"} <BindingBadge /></h3>
                <div className="ml-0 text-sm leading-relaxed text-muted-foreground">
                  <EditableText multiline value={b.exclusivityText || ""} onSave={v => upd("exclusivityText", v)} />
                </div>
              </div>

              {/* Section 5 */}
              <div className="mb-5">
                <h3 className="font-black uppercase text-sm mb-2">5. {isES ? "Condiciones Precedentes" : "Conditions Precedent"}</h3>
                <div className="ml-4 text-sm text-muted-foreground mb-2">{isES ? "La ejecución del Acuerdo Definitivo está sujeta a:" : "The execution of the Definitive Agreement is subject to the satisfaction of the following conditions:"}</div>
                <div className="ml-4 space-y-1">
                  {conditions.map((cond: string, i: number) => (
                    <div key={i} className="text-sm flex items-start gap-2">
                      <span className="shrink-0">•</span>
                      <EditableText value={cond} onSave={v => { const c=[...conditions]; c[i]=v; upd("conditionsPrecedent",c); }} />
                      {isEditingMode && <button onClick={() => upd("conditionsPrecedent", conditions.filter((_:string,j:number)=>j!==i))} className="text-red-400 hover:text-red-600 shrink-0"><X size={11} /></button>}
                    </div>
                  ))}
                  {isEditingMode && <button onClick={() => upd("conditionsPrecedent", [...conditions, isES ? "Nueva condición" : "New condition"])} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-1"><Plus size={11} />{isES ? "Agregar" : "Add"}</button>}
                </div>
              </div>

              {/* Section 6 */}
              <div className="mb-5">
                <h3 className="font-black uppercase text-sm mb-2">6. {isES ? "Acuerdo Definitivo" : "Definitive Agreement"}</h3>
                <div className="ml-4 text-sm leading-relaxed text-muted-foreground">
                  <EditableText multiline value={b.definitiveAgreementText || ""} onSave={v => upd("definitiveAgreementText", v)} />
                </div>
              </div>

              {/* Section 7 - Binding */}
              <div className="mb-5 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-black uppercase text-sm mb-2 flex items-center gap-2">7. {isES ? "Confidencialidad & No Elusión" : "Confidentiality & Non-Circumvention"} <BindingBadge /></h3>
                <div className="text-sm leading-relaxed text-muted-foreground">
                  <EditableText multiline value={b.confidentialityText || ""} onSave={v => upd("confidentialityText", v)} />
                </div>
              </div>

              {/* Section 8 - Binding Effect */}
              <div className="mb-8 bg-purple-50 border border-purple-200 rounded-xl p-4">
                <h3 className="font-black uppercase text-sm mb-2">8. {isES ? "Efecto Vinculante" : "Binding Effect"}</h3>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  <EditableText multiline value={b.bindingEffectText || ""} onSave={v => upd("bindingEffectText", v)} />
                </div>
              </div>

              {/* Signatures */}
              <div className="grid md:grid-cols-2 gap-8 pt-6 border-t-2 border-foreground">
                <div>
                  <div className="text-xs uppercase font-bold text-muted-foreground mb-3">{isES ? "Firma del Inversor" : "Investor Signature"}</div>
                  <div className="h-14 border-b border-dashed border-muted-foreground mb-2"></div>
                  <div className="font-semibold text-sm">{b.investorName || (isES ? "[Nombre]" : "[Name]")}</div>
                  <div className="text-xs text-muted-foreground">{today}</div>
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-muted-foreground mb-3">{isES ? "Representante Autorizado" : "Master Developer"}</div>
                  <div className="h-14 border-b border-dashed border-muted-foreground mb-2"></div>
                  <div className="font-semibold text-sm"><EditableText value={b.authorizedRep || "Authorized Representative"} onSave={v => upd("authorizedRep", v)} /></div>
                  <div className="text-xs text-muted-foreground">{b.masterDeveloper || "Distrito Energético Vaca Muerta S.A."}</div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </SectionWrap>
      <CustomBlocks tabKey="tab9" />
    </div>
  );
}

// ─── TAB 10 — Market Intelligence// ─── TAB 10 — Market Intelligence// ─── TAB 10 — Market Intelligence ─────────────────────────────────────────────

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
              const catLabel = (t.data.catLabels || {})[cat] || cat;
              return (
                <div key={cat} className={`rounded-2xl border overflow-hidden`}>
                  <div className={`${colors.bg} px-5 py-3 flex items-center justify-between`}>
                    <span className={`font-bold text-sm ${colors.text}`}>
                      <EditableText value={catLabel} onSave={(v) => {
                        const newLabels = {...(t.data.catLabels || {}), [cat]: v};
                        updateTab("tab10", "data.catLabels", newLabels);
                      }} />
                    </span>
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
  tab6: Tab6, tab7: Tab7, tab8: Tab8, tab9: Tab9, tab10: Tab10, tab11: Tab11,
};

// ─── TAB 11 — Due Diligence ────────────────────────────────────────────────────

function ChecklistItem({ item, onToggle, onUpdate, onRemove, isEditingMode }: {
  item: any; onToggle: () => void; onUpdate: (patch: any) => void; onRemove: () => void; isEditingMode: boolean;
}) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border ${item.checked ? "border-emerald-200 bg-emerald-50" : "border-border bg-background"} group`}>
      <button onClick={onToggle} className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${item.checked ? "bg-emerald-500 border-emerald-500 text-white" : "border-border hover:border-primary"}`}>
        {item.checked && <Check size={11} />}
      </button>
      <div className="flex-1 min-w-0">
        <div className={`font-medium text-sm ${item.checked ? "line-through text-muted-foreground" : ""}`}>
          <EditableText value={item.label} onSave={(v) => onUpdate({ label: v })} />
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          <EditableText value={item.detail} onSave={(v) => onUpdate({ detail: v })} />
        </div>
      </div>
      {isEditingMode && (
        <button onClick={onRemove} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 hover:text-red-600 rounded transition-all shrink-0"><Trash2 size={11} /></button>
      )}
    </div>
  );
}

export function Tab11() {
  const { content, sector, language, updateTab, isEditingMode } = useApp();
  const t = content[sector][language].tab11;
  const isES = language === "ES";

  if (!t || !t.checklist) return <div className="p-8 text-muted-foreground text-center">Cargando contenido...</div>;

  const checklist = t.checklist || {};
  const servicePackage = t.servicePackage || {};
  const experience = t.experience || {};

  const updateChecklist = (categories: any[]) => updateTab("tab11", "checklist.categories", categories);
  const updateItem = (ci: number, ii: number, patch: any) => {
    const cats = structuredClone(checklist.categories);
    cats[ci].items[ii] = { ...cats[ci].items[ii], ...patch };
    updateChecklist(cats);
  };
  const toggleItem = (ci: number, ii: number) => {
    const cats = structuredClone(checklist.categories);
    cats[ci].items[ii].checked = !cats[ci].items[ii].checked;
    updateChecklist(cats);
  };
  const removeItem = (ci: number, ii: number) => {
    const cats = structuredClone(checklist.categories);
    cats[ci].items = cats[ci].items.filter((_: any, j: number) => j !== ii);
    updateChecklist(cats);
  };
  const addItem = (ci: number) => {
    const cats = structuredClone(checklist.categories);
    cats[ci].items.push({ label: isES ? "Nuevo ítem" : "New item", detail: "—", checked: false });
    updateChecklist(cats);
  };
  const updateServiceItem = (i: number, patch: any) => {
    const svcs = [...(servicePackage.services || [])];
    svcs[i] = { ...svcs[i], ...patch };
    updateTab("tab11", "servicePackage.services", svcs);
  };

  const totalItems = checklist.categories?.reduce((a: number, c: any) => a + c.items.length, 0) || 0;
  const completedItems = checklist.categories?.reduce((a: number, c: any) => a + c.items.filter((i: any) => i.checked).length, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Checklist */}
      <SectionWrap isVisible={checklist?.isVisible !== false} onToggle={() => updateTab("tab11", "checklist.isVisible", !(checklist?.isVisible !== false))} label="Checklist">
        <Card>
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-primary/10 rounded-xl"><FileText className="text-primary" size={20} /></div>
                <h2 className="text-2xl font-bold"><EditableText value={checklist.title} onSave={(v) => updateTab("tab11", "checklist.title", v)} /></h2>
              </div>
              <p className="text-sm text-muted-foreground ml-14"><EditableText value={checklist.subtitle} onSave={(v) => updateTab("tab11", "checklist.subtitle", v)} /></p>
            </div>
            <div className="text-right shrink-0 ml-4">
              <div className="text-2xl font-black text-primary">{completedItems}/{totalItems}</div>
              <div className="text-xs text-muted-foreground">{isES ? "completados" : "completed"}</div>
              <div className="w-24 h-2 bg-border rounded-full mt-1 ml-auto">
                <div className="h-2 bg-primary rounded-full transition-all" style={{ width: `${totalItems > 0 ? (completedItems/totalItems)*100 : 0}%` }} />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {(checklist.categories || []).map((cat: any, ci: number) => (
              <div key={ci} className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <h3 className="font-bold text-sm">
                      <EditableText value={cat.title} onSave={(v) => { const cats = structuredClone(checklist.categories); cats[ci].title = v; updateChecklist(cats); }} />
                    </h3>
                  </div>
                  <span className="text-xs text-muted-foreground">{cat.items.filter((i: any) => i.checked).length}/{cat.items.length}</span>
                </div>
                {cat.items.map((item: any, ii: number) => (
                  <ChecklistItem key={ii} item={item}
                    onToggle={() => toggleItem(ci, ii)}
                    onUpdate={(p) => updateItem(ci, ii, p)}
                    onRemove={() => removeItem(ci, ii)}
                    isEditingMode={isEditingMode}
                  />
                ))}
                {isEditingMode && (
                  <button onClick={() => addItem(ci)} className="w-full text-xs text-muted-foreground hover:text-primary border border-dashed border-border hover:border-primary rounded-xl p-2 transition-colors flex items-center justify-center gap-1">
                    <Plus size={12} /> {isES ? "Agregar ítem" : "Add item"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>
      </SectionWrap>

      {/* Service Package */}
      <SectionWrap isVisible={servicePackage?.isVisible !== false} onToggle={() => updateTab("tab11", "servicePackage.isVisible", !(servicePackage?.isVisible !== false))} label="Service Package">
        <Card accent>
          <div className="flex items-start gap-4 mb-5">
            <div className="p-2 bg-primary/10 rounded-xl shrink-0"><Building className="text-primary" size={20} /></div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold"><EditableText value={servicePackage?.title} onSave={(v) => updateTab("tab11", "servicePackage.title", v)} /></h2>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                  <EditableText value={servicePackage?.badge} onSave={(v) => updateTab("tab11", "servicePackage.badge", v)} />
                </span>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed mt-2">
                <EditableText multiline value={servicePackage?.description} onSave={(v) => updateTab("tab11", "servicePackage.description", v)} />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-5">
            {(servicePackage?.services || []).map((svc: any, i: number) => (
              <div key={i} className="bg-background rounded-xl p-4 border border-border group relative">
                {isEditingMode && (
                  <button onClick={() => { const s = (servicePackage.services||[]).filter((_:any,j:number)=>j!==i); updateTab("tab11","servicePackage.services",s); }} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 hover:text-red-600 rounded"><Trash2 size={11} /></button>
                )}
                <div className="flex items-center gap-2 mb-1">
                  <Check size={14} className="text-primary shrink-0" />
                  <div className="font-bold text-sm"><EditableText value={svc.label} onSave={(v) => updateServiceItem(i, { label: v })} /></div>
                </div>
                <div className="text-xs text-muted-foreground pl-5"><EditableText value={svc.detail} onSave={(v) => updateServiceItem(i, { detail: v })} /></div>
              </div>
            ))}
            {isEditingMode && (
              <button onClick={() => { const s = [...(servicePackage.services||[]), {label: isES?"Nuevo servicio":"New service", detail:"—"}]; updateTab("tab11","servicePackage.services",s); }} className="border-2 border-dashed border-border rounded-xl p-4 text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 text-sm">
                <Plus size={14} />{isES?"Agregar":"Add"}
              </button>
            )}
          </div>
          <div className="bg-background/60 rounded-xl p-4 border border-border italic text-sm text-muted-foreground">
            <EditableText multiline value={servicePackage?.differentiator} onSave={(v) => updateTab("tab11", "servicePackage.differentiator", v)} />
          </div>
        </Card>
      </SectionWrap>

      {/* Experience */}
      <SectionWrap isVisible={experience?.isVisible !== false} onToggle={() => updateTab("tab11", "experience.isVisible", !(experience?.isVisible !== false))} label="Experience">
        <Card dark>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-400/20 rounded-xl"><Shield className="text-yellow-400" size={20} /></div>
            <h2 className="text-xl font-bold"><EditableText value={experience?.title} onSave={(v) => updateTab("tab11", "experience.title", v)} /></h2>
          </div>
          <div className="text-base leading-relaxed opacity-90">
            <EditableText multiline value={experience?.content} onSave={(v) => updateTab("tab11", "experience.content", v)} />
          </div>
        </Card>
      </SectionWrap>

      <CustomBlocks tabKey="tab11" />
    </div>
  );
}
