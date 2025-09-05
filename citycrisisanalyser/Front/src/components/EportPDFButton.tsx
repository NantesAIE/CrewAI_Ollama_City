import React from "react";
import jsPDF from "jspdf";
import { marked } from "marked";

interface ExportPDFButtonProps {
  responses: Record<string, string>;
  selectedImage: string | null;
}

export default function ExportPDFButton({ responses, selectedImage }: ExportPDFButtonProps) {
  const handleExportPDF = async () => {
    const doc = new jsPDF({
      unit: "pt",
      format: "a4",
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    let currentY = margin;

    // 1. Ajouter le logo (uniquement sur la première page)
    try {
      const logoUrl = "/logoPDF.png";
      const logoResponse = await fetch(logoUrl);
      const logoBlob = await logoResponse.blob();
      const logoBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(logoBlob);
      });
      doc.addImage(logoBase64, "PNG", pageWidth - 100 - margin, currentY, 100, 40);
    } catch (e) {
      console.error("Erreur lors du chargement du logo:", e);
    }

    // 2. Ajouter le titre
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Intervention Planner", pageWidth / 2, currentY + 50, { align: "center" });
    currentY += 80;

    // 3. Ajouter l'image (si elle existe)
    if (selectedImage) {
      try {
        const imageBlob = await fetch(selectedImage).then((res) => res.blob());
        const imageBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imageBlob);
        });
        const imgWidth = 400;
        const imgHeight = 250;
        doc.addImage(
          imageBase64,
          "JPEG",
          (pageWidth - imgWidth) / 2,
          currentY,
          imgWidth,
          imgHeight
        );
        currentY += imgHeight + 30;
      } catch (e) {
        console.error("Erreur lors du traitement de l'image:", e);
      }
    }

    // 4. Convertir le markdown en HTML
    const markdownContent = responses.intervention || "-";
    const htmlContent = marked.parse(markdownContent) as string;

    // 5. Parser le HTML et écrire dans le PDF avec gestion du markdown
    const parser = new DOMParser();
    const docHtml = parser.parseFromString(htmlContent, "text/html");
    const elements = Array.from(docHtml.body.childNodes);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    const lineHeight = 18;

    function writeText(text: string, fontSize = 13, fontStyle = "normal", indent = 0) {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", fontStyle);
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin - indent);
      lines.forEach((line: string) => {
        if (currentY + lineHeight > pageHeight - margin) {
          doc.addPage();
          currentY = margin;
        }
        doc.text(line, margin + indent, currentY);
        currentY += lineHeight;
      });
    }

    elements.forEach((el) => {
      if (el.nodeType === 3) {
        // Text node
        writeText(el.textContent || "");
      } else if (el.nodeName === "H1" || el.nodeName === "H2" || el.nodeName === "H3") {
        const size = el.nodeName === "H1" ? 22 : el.nodeName === "H2" ? 18 : 15;
        writeText((el.textContent || "").trim(), size, "bold");
        currentY += 4;
      } else if (el.nodeName === "P") {
        writeText((el.textContent || "").trim());
        currentY += 4;
      } else if (el.nodeName === "UL" || el.nodeName === "OL") {
        Array.from(el.childNodes).forEach((li, idx) => {
          if (li.nodeName === "LI") {
            const prefix = el.nodeName === "OL" ? `${idx + 1}. ` : "• ";
            writeText(prefix + (li.textContent || "").trim(), 13, "normal", 20);
          }
        });
        currentY += 4;
      } else if (el.nodeName === "STRONG" || el.nodeName === "B") {
        writeText((el.textContent || "").trim(), 13, "bold");
        currentY += 4;
      } else if (el.nodeName === "EM" || el.nodeName === "I") {
        writeText((el.textContent || "").trim(), 13, "italic");
        currentY += 4;
      }
    });

    // 6. Sauvegarder le PDF
    doc.save("intervention-planner-result.pdf");
  };

  return (
    <button
      onClick={handleExportPDF}
      className="mt-4 w-full py-3 px-4 bg-gradient-to-r from-[#1976D2] to-[#6f0dd2] text-white border-none rounded-[8px] text-base font-bold cursor-pointer shadow-lg transition-all duration-200 hover:from-[#1565C0] hover:to-[#953cef]"
      disabled={!responses.intervention}
    >
      Exporter en PDF
    </button>
  );
}