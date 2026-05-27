import type { Sector, Language } from "../types";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface Args { sector: Sector; language: Language; logo: string | null }

const wait = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));
const frames = () => new Promise<void>((res) => requestAnimationFrame(() => requestAnimationFrame(() => res())));

export async function exportPDF({ sector, language }: Args) {
  const printRoot = document.getElementById("print-root");
  if (!printRoot) { alert("Nothing to export."); return; }

  const { useApp } = await import("../../state/store");
  const prevEditing = useApp.getState().isEditingMode;
  if (prevEditing) { useApp.setState({ isEditingMode: false }); await frames(); }

  // IMPORTANT: opacity:0.001 keeps element visible to html2canvas, invisible to user
  const prevStyle = printRoot.getAttribute("style") || "";
  printRoot.style.cssText = [
    "position:fixed",
    "left:0",
    "top:0",
    "width:1100px",
    "z-index:-9999",
    "opacity:0.001",
    "pointer-events:none",
    "background:white",
  ].join(";");

  await wait(800); // let fonts/images render

  try {
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4", compress: true });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    const sections = Array.from(printRoot.querySelectorAll("[data-print-section]")) as HTMLElement[];
    const targets: HTMLElement[] = sections.length > 0 ? sections : [printRoot];

    let first = true;
    for (const el of targets) {
      // Skip empty sections
      if (el.offsetHeight < 10) continue;

      const canvas = await html2canvas(el, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: 1100,
      });

      if (canvas.width === 0 || canvas.height === 0) continue;

      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      const imgH = (canvas.height * pageW) / canvas.width;

      if (!first) pdf.addPage();
      first = false;

      if (imgH <= pageH) {
        pdf.addImage(imgData, "JPEG", 0, 0, pageW, imgH);
      } else {
        let y = 0;
        let rem = imgH;
        while (rem > 0) {
          pdf.addImage(imgData, "JPEG", 0, -y, pageW, imgH);
          rem -= pageH;
          y += pageH;
          if (rem > 0) pdf.addPage();
        }
      }
    }

    if (first) {
      alert("No hay contenido visible para exportar. Asegurate de que las secciones estén activas.");
      return;
    }

    pdf.save(`DistritoEnergetico_${sector}_${language}.pdf`);
  } finally {
    printRoot.setAttribute("style", prevStyle);
    if (prevEditing) useApp.setState({ isEditingMode: true });
  }
}
