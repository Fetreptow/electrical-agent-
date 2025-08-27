import { CalculationResults } from '../types';

// Minimal type definitions to satisfy TypeScript for jsPDF and its autoTable plugin,
// which are loaded via CDN in index.html.
declare global {
    // This defines the global 'jspdf' object from the CDN.
    const jspdf: {
        jsPDF: new (options?: any) => jsPDF;
    };

    // This extends the jsPDF instance type.
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
        lastAutoTable: {
            finalY: number;
        };
        // Standard jsPDF methods used in this file
        setFontSize(size: number): jsPDF;
        setTextColor(r: number, g: number, b: number): jsPDF;
        text(
            text: string | string[],
            x: number,
            y: number,
            options?: any
        ): jsPDF;
        save(filename: string): void;
        internal: {
            pageSize: {
                getWidth(): number;
                getHeight(): number;
            };
        };
    }
}


export const generatePdf = (results: CalculationResults) => {
    const doc = new jspdf.jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // --- Header ---
    doc.setFontSize(20);
    doc.setTextColor(44, 122, 123); // A shade of cyan
    doc.text('Relatório de Dimensionamento Elétrico', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, 26, { align: 'center' });

    // --- Summary Section ---
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Resumo Geral do Projeto', 14, 40);
    
    const summaryData = [
        ['Potência Total Instalada', `${results.summary.totalInstalledVA} VA`],
        ['Potência de Demanda Calculada', `${results.summary.demandedPowerVA.toFixed(2)} VA`],
        ['Corrente de Demanda (220V)', `${results.summary.mainCircuit.currentA.toFixed(2)} A`],
        ['Disjuntor Geral Recomendado', `${results.summary.mainCircuit.breakerA} A`],
        ['Cabo de Entrada Recomendado', `${results.summary.mainCircuit.cableMM2}`]
    ];
    doc.autoTable({
        startY: 45,
        head: [['Parâmetro', 'Valor']],
        body: summaryData,
        theme: 'grid',
        headStyles: { fillColor: [44, 122, 123] }
    });
    
    let lastY = doc.lastAutoTable.finalY + 15;

    // --- Room Details ---
    doc.text('Detalhamento por Ambiente', 14, lastY);
    const roomBody = results.rooms.map(r => [
        r.name,
        `${r.lighting.quantity} un. / ${r.lighting.powerVA} VA`,
        `${r.tugs.quantity} un. / ${r.tugs.powerVA} VA`,
    ]);
    doc.autoTable({
        startY: lastY + 5,
        head: [['Ambiente', 'Iluminação (Qtde/Potência)', 'Tomadas (Qtde/Potência)']],
        body: roomBody,
        theme: 'striped',
        headStyles: { fillColor: [44, 122, 123] }
    });

    lastY = doc.lastAutoTable.finalY + 15;
    
    // --- TUE Details ---
    doc.text('Circuitos de Uso Específico (TUEs)', 14, lastY);
    const tueBody = results.appliances.map(a => [
        a.name,
        `${a.circuit.powerVA} VA`,
        `${a.circuit.currentA.toFixed(2)} A`,
        a.circuit.cableMM2,
        `${a.circuit.breakerA} A`
    ]);
    doc.autoTable({
        startY: lastY + 5,
        head: [['Equipamento', 'Potência', 'Corrente', 'Cabo', 'Disjuntor']],
        body: tueBody,
        theme: 'striped',
        headStyles: { fillColor: [44, 122, 123] }
    });

    lastY = doc.lastAutoTable.finalY + 15;

    // --- Footer ---
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const disclaimer = "AVISO: Este relatório é uma estimativa baseada na NBR 5410 para fins de demonstração. Consulte sempre um engenheiro eletricista qualificado para a elaboração e execução de projetos elétricos.";
    doc.text(disclaimer, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center', maxWidth: pageWidth - 28 });
    
    doc.save('Relatorio_Eletrico_Residencial.pdf');
};
