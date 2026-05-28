import { useState } from "react";
import { useApp } from "@/state/store";
import { FileText, X, ChevronDown } from "lucide-react";

export function DraftNotesButton() {
  const { draftNotes, setDraftNotes } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="bg-background/10 hover:bg-background/20 px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium text-sm relative"
        title="Notas internas — no aparecen en el PDF"
      >
        <FileText size={14} />
        Notas
        {draftNotes && <span className="w-2 h-2 rounded-full bg-yellow-400 absolute top-1 right-1" />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="fixed top-14 right-4 z-50 w-96 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-accent/30">
              <div>
                <div className="font-bold text-sm">📝 Notas internas</div>
                <div className="text-xs text-muted-foreground">No aparecen en el PDF ni en el memo. Solo vos las ves.</div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-accent rounded-lg"><X size={16} /></button>
            </div>
            <textarea
              value={draftNotes}
              onChange={e => setDraftNotes(e.target.value)}
              placeholder={"Usá este espacio como borrador...\n\n• Próximos pasos con inversores\n• Números a revisar\n• Ideas para el deal\n• Textos en borrador\n\nNada de esto va al PDF ni al JSON de backup."}
              className="w-full h-72 p-4 text-sm bg-background text-foreground resize-none outline-none font-mono leading-relaxed"
              autoFocus
            />
            <div className="px-4 py-2 border-t border-border flex justify-between items-center">
              <span className="text-xs text-muted-foreground">{draftNotes.length} caracteres</span>
              <button onClick={() => { if (confirm("¿Borrar todas las notas?")) setDraftNotes(""); }} className="text-xs text-destructive hover:underline">Borrar todo</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
