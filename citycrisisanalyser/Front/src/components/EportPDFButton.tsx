import React from "react";
import jsPDF from 'jspdf';
import { marked } from 'marked';

interface ExportPDFButtonProps {
  responses: Record<string, string>;
}

export default function ExportPDFButton({ responses }: ExportPDFButtonProps) {

// Fonction export PDF avec markdown et multi-pages
  const handleExportPDF = async () => {
    const doc = new jsPDF({
      unit: 'pt',
      format: 'a4',
      putOnlyUsedFonts: true,
    });

    // Charger le logo (PNG ou JPEG, base64)
    const logoUrl = '/logoPDF.png';
    const logoImg = await fetch(logoUrl)
      .then(res => res.blob())
      .then(blob => new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      }));

    // Ajouter le logo en haut à droite
    doc.addImage(logoImg, 'PNG', doc.internal.pageSize.getWidth() - 100, 30, 60, 40);

    // Titre centré et plus grand
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('Intervention Planner', doc.internal.pageSize.getWidth() / 2, 80, { align: 'center' });

    // Convertir le markdown en HTML
    const markdown = responses.intervention || '-';
    const html = await marked.parse(markdown);

    // Créer un élément temporaire pour le HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    tempDiv.style.width = '500px';

    // Rendu du HTML sous le titre (multi-pages auto)
    await doc.html(tempDiv, {
      x: 40,
      y: 120,
      width: 500,
      windowWidth: 600,
      autoPaging: true,
    });

    doc.save('intervention-planner-result.pdf');
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