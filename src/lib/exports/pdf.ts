import type { Sector, Language } from "../types";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface Args { sector: Sector; language: Language; logo: string | null }

const wait = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));
const twoFrames = () => new Promise<void>((res) => requestAnimationFrame(() => requestAnimationFrame(() => res())));

export async function exportPDF({ sector, language }: Args) {
  const printRoot = document.getElementById("print-root");
  if (!printRoot) { alert("Nothing to export."); return; }

  const { useApp } = await import("../../state/store");
  const prevEditing = useApp.getState().isEditingMode;
  if (prevEditing) { useApp.setState({ isEditingMode: false }); await twoFrames(); }

  const prevStyle = printRoot.getAttribute("style") || "";
  printRoot.style.cssText = "position:absolute;left:0;top:0;width:1100px;z-index:-1;visibility:hidden;";
  await wait(600);

  try {
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4", compress: true });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const sections = Array.from(printRoot.querySelectorAll("[data-print-section]"));
    const targets = sections.length > 0 ? sections : [printRoot];

    let first = true;
    for (const el of targets) {
      const canvas = await html2canvas(el as HTMLElement, {
        scale: 1.5, useCORS: true, allowTaint: true, backgroundColor: "#ffffff", logging: false,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      const imgH = (canvas.height * pageWidth) / canvas.width;
      if (!first) pdf.addPage();
      first = false;
      if (imgH <= pageHeight) {
        pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, imgH);
      } else {
        let y = 0, rem = imgH;
        while (rem > 0) {
          pdf.addImage(imgData, "JPEG", 0, -y, pageWidth, imgH);
          rem -= pageHeight; y += pageHeight;
          if (rem > 0) pdf.addPage();
        }
      }
    }
    pdf.save(`DistritoEnergetico_${sector}_${language}.pdf`);
  } finally {
    printRoot.setAttribute("style", prevStyle);
    if (prevEditing) useApp.setState({ isEditingMode: true });
  }
}
