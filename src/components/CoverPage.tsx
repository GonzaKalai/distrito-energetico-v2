import { useState } from "react";
import { useApp } from "@/state/store";
import { Calendar, X } from "lucide-react";

export function CoverPage() {
  const { profiles, activeProfileId, sector, language, logo, isEditingMode, coverDate, setCoverDate } = useApp();
  const profile = profiles.find(p => p.id === activeProfileId);
  const [editingDate, setEditingDate] = useState(false);
  const [tempDate, setTempDate] = useState(coverDate);

  return (
    <div className="rounded-3xl border border-border bg-foreground text-background overflow-hidden min-h-[380px] flex flex-col justify-between p-8 md:p-12 mb-6">
      <div className="flex justify-between items-start">
        {logo
          ? <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
          : <div className="text-xl font-bold tracking-tight opacity-90">Distrito Energético</div>
        }
        <div className="text-right">
          <div className="text-xs opacity-60 uppercase tracking-widest">{sector}</div>
          <div className="text-xs opacity-60 uppercase tracking-widest">{language === "ES" ? "Confidencial" : "Confidential"}</div>
        </div>
      </div>

      <div className="my-8">
        <div className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-2">
          {language === "ES" ? "Oportunidad de Inversión" : "Investment Opportunity"}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-2">
          Distrito Energético
        </h1>
        <h2 className="text-xl md:text-2xl opacity-70 font-medium">Vaca Muerta — {sector}</h2>
      </div>

      <div className="border-t border-background/20 pt-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <div className="text-xs opacity-50 uppercase tracking-widest mb-1">
            {language === "ES" ? "Preparado para" : "Prepared for"}
          </div>
          <div className="text-lg font-semibold">
            {profile?.name || (language === "ES" ? "Nombre del Inversor" : "Investor Name")}
          </div>
          {profile?.company && (
            <div className="text-sm opacity-70 mt-0.5">{profile.company}</div>
          )}
        </div>

        <div className="text-right">
          <div className="text-xs opacity-50 uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
            {language === "ES" ? "Fecha" : "Date"}
            {isEditingMode && !editingDate && (
              <button
                onClick={() => { setTempDate(coverDate); setEditingDate(true); }}
                className="ml-1 p-0.5 bg-background/10 rounded hover:bg-background/20 transition-colors"
                title="Editar fecha"
              >
                <Calendar size={11} />
              </button>
            )}
          </div>

          {editingDate ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                type="text"
                value={tempDate}
                onChange={e => setTempDate(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") { setCoverDate(tempDate); setEditingDate(false); }
                  if (e.key === "Escape") setEditingDate(false);
                }}
                className="bg-background/10 border border-background/30 rounded-lg px-2 py-1 text-sm text-background w-44 text-right"
                placeholder="27 de mayo de 2026"
              />
              <button onClick={() => { setCoverDate(tempDate); setEditingDate(false); }} className="p-1 bg-background/20 rounded hover:bg-background/30 transition-colors text-xs">✓</button>
              <button onClick={() => setEditingDate(false)} className="p-1 hover:bg-background/20 rounded transition-colors"><X size={12} /></button>
            </div>
          ) : (
            <div
              className={`text-sm font-medium opacity-80 ${isEditingMode ? "cursor-pointer hover:opacity-100 hover:underline decoration-dashed underline-offset-2" : ""}`}
              onClick={() => isEditingMode && (setTempDate(coverDate), setEditingDate(true))}
              title={isEditingMode ? "Click para editar fecha" : undefined}
            >
              {coverDate || (language === "ES" ? "Fecha a confirmar" : "Date TBD")}
            </div>
          )}

          {isEditingMode && !editingDate && (
            <button
              onClick={() => setCoverDate("")}
              className="text-xs opacity-40 hover:opacity-70 mt-1 block ml-auto transition-opacity"
              title="Borrar fecha"
            >
              {language === "ES" ? "Borrar fecha" : "Clear date"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
