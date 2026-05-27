import { Eye, EyeOff } from "lucide-react";
import { useApp } from "@/state/store";
import { usePrintMode } from "@/App";

interface Props {
  isVisible: boolean;
  onToggle: () => void;
  label?: string;
  className?: string;
}

export function VisibilityToggle({ isVisible, onToggle, label, className = "" }: Props) {
  const isEditingMode = useApp((s) => s.isEditingMode);
  if (!isEditingMode) return null;
  return (
    <button
      onClick={onToggle}
      title={isVisible ? `Hide ${label ?? ""}` : `Show ${label ?? ""}`}
      className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-1 rounded-md border transition-colors ${
        isVisible
          ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : "border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100"
      } ${className}`}
    >
      {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
      {isVisible ? "Visible" : "Hidden"}
    </button>
  );
}

export function SectionWrap({
  isVisible,
  onToggle,
  label,
  children,
}: {
  isVisible: boolean;
  onToggle: () => void;
  label?: string;
  children: React.ReactNode;
}) {
  const isEditingMode = useApp((s) => s.isEditingMode);
  const isPrintMode = usePrintMode();

  if (!isVisible && !isEditingMode) return null;

  // In print mode: each visible section gets data-pdf-section for smart pagination
  if (isPrintMode) {
    if (!isVisible) return null;
    return (
      <div data-pdf-section style={{ background: "white", padding: "1.5rem 2rem" }}>
        {children}
      </div>
    );
  }

  return (
    <section className={`relative ${!isVisible ? "opacity-40 grayscale" : ""}`}>
      {isEditingMode && (
        <div className="absolute right-3 top-3 z-10">
          <VisibilityToggle isVisible={isVisible} onToggle={onToggle} label={label} />
        </div>
      )}
      {children}
    </section>
  );
}
