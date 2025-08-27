import { CalculationResults } from '../types';

// Declaração de tipo global para a biblioteca XLSX carregada via CDN.
declare global {
    const XLSX: any;
}

/**
 * Gera um arquivo Excel (.xlsx) com o resumo e detalhamento do dimensionamento elétrico.
 * @param results - O objeto com os resultados dos cálculos.
 */
export const generateExcel = (results: CalculationResults) => {
    // --- Planilha 1: Resumo Quantitativo ---
    const totalLamps = results.rooms.reduce((sum, room) => sum + room.lighting.quantity, 0);
    const totalTugs = results.rooms.reduce((sum, room) => sum + room.tugs.quantity, 0);
    const totalTues = results.appliances.length;
    // Estimativa: 1 disjuntor geral + 1 para cada circuito TUE. 
    // Circuitos de iluminação/TUG são geralmente agrupados e não contados individualmente aqui.
    const totalBreakers = 1 + totalTues;

    const summaryData = [
        { Item: 'Pontos de Iluminação (Lâmpadas)', Quantidade: totalLamps },
        { Item: 'Tomadas de Uso Geral (TUGs)', Quantidade: totalTugs },
        { Item: 'Tomadas de Uso Específico (TUEs)', Quantidade: totalTues },
        { 
          Item: 'Disjuntores (estimativa mínima)', 
          Quantidade: totalBreakers, 
          'Observação': '1 Geral + 1 para cada TUE. Circuitos de TUG/Iluminação geralmente são agrupados.' 
        },
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    // Ajusta a largura das colunas
    summarySheet['!cols'] = [{ wch: 40 }, { wch: 15 }, { wch: 65 }];

    // --- Planilha 2: Detalhamento de Circuitos ---
    const circuitsData = [];

    // Circuito Principal
    circuitsData.push({
        'Circuito': 'Geral / Quadro de Distribuição',
        'Potência Demandada (VA)': results.summary.demandedPowerVA.toFixed(2),
        'Corrente de Demanda (A)': results.summary.mainCircuit.currentA.toFixed(2),
        'Cabo (Fase+Neutro)': results.summary.mainCircuit.cableMM2,
        'Disjuntor (A)': results.summary.mainCircuit.breakerA
    });

    // Circuitos TUEs
    results.appliances.forEach(app => {
        circuitsData.push({
            'Circuito': `TUE - ${app.name}`,
            'Potência Demandada (VA)': app.circuit.powerVA,
            'Corrente de Demanda (A)': app.circuit.currentA.toFixed(2),
            'Cabo (Fase+Neutro)': app.circuit.cableMM2,
            'Disjuntor (A)': app.circuit.breakerA
        });
    });
    const circuitsSheet = XLSX.utils.json_to_sheet(circuitsData);
     // Ajusta a largura das colunas
    circuitsSheet['!cols'] = [{ wch: 35 }, { wch: 25 }, { wch: 25 }, { wch: 20 }, { wch: 15 }];


    // --- Cria e baixa o arquivo ---
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo Quantitativo');
    XLSX.utils.book_append_sheet(workbook, circuitsSheet, 'Detalhamento de Circuitos');

    XLSX.writeFile(workbook, 'Quantitativo_Eletrico.xlsx');
};