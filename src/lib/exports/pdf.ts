import type { Sector, Language } from "../types";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface Args { sector: Sector; language: Language; logo: string | null }

const wait = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));
const frames = () => new Promise<void>((res) => requestAnimationFrame(() => requestAnimationFrame(() => res())));

async function captureElement(el: HTMLElement): Promise<HTMLCanvasElement> {
  return html2canvas(el, {
    scale: 1.5,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    logging: false,
    windowWidth: 1100,
  });
}

export async function exportPDF({ sector, language }: Args) {
  const printRoot = document.getElementById("print-root");
  if (!printRoot) { alert("Nothing to export."); return; }

  const { useApp } = await import("../../state/store");
  const prevEditing = useApp.getState().isEditingMode;
  if (prevEditing) { useApp.setState({ isEditingMode: false }); await frames(); }

  const prevStyle = printRoot.getAttribute("style") || "";
  printRoot.style.cssText = [
    "position:fixed", "left:0", "top:0", "width:1100px",
    "z-index:-9999", "opacity:0.001", "pointer-events:none", "background:white",
  ].join(";");

  await wait(800);

  const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4", compress: true });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  // px of screen content that maps to one PDF page height
  // Formula: pageH * printRootWidth / pageW
  const screenPxPerPage = pageH * 1100 / pageW;

  try {
    // 1. Cover page — always its own page
    const coverEl = printRoot.querySelector("[data-print-section]") as HTMLElement | null;
    if (coverEl && coverEl.offsetHeight > 5) {
      const canvas = await captureElement(coverEl);
      const imgH = (canvas.height * pageW) / canvas.width;
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, pageW, imgH);
    }

    // 2. Content sections — smart pack into pages
    const sections = Array.from(
      printRoot.querySelectorAll("[data-pdf-section]")
    ) as HTMLElement[];

    let isOnContentPage = false;
    let pageY = 0; // current Y position on active PDF page (in PDF units)

    for (const section of sections) {
      if (section.offsetHeight < 10) continue;

      const canvas = await captureElement(section);
      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      const imgH = (canvas.height * pageW) / canvas.width;

      if (!isOnContentPage) {
        // Start first content page
        pdf.addPage();
        pageY = 0;
        isOnContentPage = true;
      } else if (pageY + imgH > pageH - 10) {
        // Doesn't fit on current page — start a new one
        pdf.addPage();
        pageY = 0;
      }

      if (imgH <= pageH) {
        // Normal section: render at current Y
        pdf.addImage(imgData, "JPEG", 0, pageY, pageW, imgH);
        pageY += imgH;
      } else {
        // Section taller than one page — split across pages
        let y = 0;
        let rem = imgH;
        while (rem > 0) {
          pdf.addImage(imgData, "JPEG", 0, pageY - y, pageW, imgH);
          const fitted = pageH - pageY;
          rem -= fitted;
          y += fitted;
          if (rem > 0) {
            pdf.addPage();
            pageY = 0;
          } else {
            pageY = imgH - Math.floor(imgH / pageH) * pageH;
          }
        }
      }
    }

    if (!isOnContentPage) {
      alert("No hay contenido visible para exportar.");
      return;
    }

    pdf.save(`DistritoEnergetico_${sector}_${language}.pdf`);
  } finally {
    printRoot.setAttribute("style", prevStyle);
    if (prevEditing) useApp.setState({ isEditingMode: true });
  }
}
