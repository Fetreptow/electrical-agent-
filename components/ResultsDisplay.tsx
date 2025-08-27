
import React from 'react';
import { CalculationResults } from '../types';
import { Card } from './ui/Card';

interface ResultsDisplayProps {
    results: CalculationResults | null;
    isLoading: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, isLoading }) => {

    const renderSkeleton = () => (
        <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-full"></div>
        </div>
    );
    
    if (isLoading) {
        return (
             <Card>
                <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Resultados do Dimensionamento</h2>
                {renderSkeleton()}
                {renderSkeleton()}
            </Card>
        )
    }

    if (!results) {
        return (
            <Card className="h-full flex flex-col items-center justify-center text-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-cyan-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h2 className="text-2xl font-semibold text-cyan-300 mb-2">Pronto para começar?</h2>
                <p className="text-gray-400">Preencha os dados dos ambientes e equipamentos à esquerda e clique em "Calcular" para ver os resultados aqui.</p>
            </Card>
        );
    }
    
    const ResultRow: React.FC<{ label: string, value: React.ReactNode, isHeader?: boolean }> = ({label, value, isHeader}) => (
        <div className={`flex justify-between py-2 ${isHeader ? 'font-bold text-cyan-400' : 'border-b border-gray-700'}`}>
            <span>{label}</span>
            <span className={isHeader ? '' : 'text-gray-300 font-mono'}>{value}</span>
        </div>
    )

    return (
        <Card>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-6">Resultados do Dimensionamento</h2>
            
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-semibold text-cyan-400 border-b-2 border-cyan-500 pb-2 mb-3">Detalhamento por Ambiente</h3>
                    {results.rooms.map(room => (
                        <div key={room.id} className="mb-4 p-3 bg-gray-800/50 rounded-lg">
                            <p className="font-bold text-lg text-white">{room.name}</p>
                            <ResultRow label="Pontos de Iluminação" value={`${room.lighting.quantity} un.`}/>
                            <ResultRow label="Potência de Iluminação" value={`${room.lighting.powerVA} VA`}/>
                            <ResultRow label="Tomadas de Uso Geral" value={`${room.tugs.quantity} un.`}/>
                            <ResultRow label="Potência de TUGs" value={`${room.tugs.powerVA} VA`}/>
                        </div>
                    ))}
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-cyan-400 border-b-2 border-cyan-500 pb-2 mb-3">Circuitos de Uso Específico (TUEs)</h3>
                     {results.appliances.map(app => (
                        <div key={app.id} className="mb-4 p-3 bg-gray-800/50 rounded-lg">
                            <p className="font-bold text-lg text-white">{app.name}</p>
                            <ResultRow label="Potência" value={`${app.circuit.powerVA} VA`}/>
                            <ResultRow label="Corrente" value={`${app.circuit.currentA.toFixed(2)} A`}/>
                            <ResultRow label="Cabo" value={`${app.circuit.cableMM2}`}/>
                            <ResultRow label="Disjuntor" value={`${app.circuit.breakerA} A`}/>
                        </div>
                    ))}
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-cyan-400 border-b-2 border-cyan-500 pb-2 mb-3">Resumo Geral</h3>
                     <div className="p-3 bg-gray-800/50 rounded-lg">
                        <ResultRow label="Potência Total Iluminação" value={`${results.summary.totalLightingVA} VA`}/>
                        <ResultRow label="Potência Total TUGs" value={`${results.summary.totalTugsVA} VA`}/>
                        <ResultRow label="Potência Total TUEs" value={`${results.summary.totalTuesVA} VA`}/>
                        <ResultRow label="Potência Total Instalada" value={`${results.summary.totalInstalledVA} VA`} isHeader/>
                        <ResultRow label="Potência de Demanda" value={`${results.summary.demandedPowerVA.toFixed(2)} VA`} isHeader/>
                     </div>
                </div>

                 <div>
                    <h3 className="text-xl font-semibold text-cyan-400 border-b-2 border-cyan-500 pb-2 mb-3">Dimensionamento do Quadro Geral</h3>
                     <div className="p-3 bg-gray-800/50 rounded-lg">
                        <ResultRow label="Corrente de Demanda" value={`${results.summary.mainCircuit.currentA.toFixed(2)} A`}/>
                        <ResultRow label="Cabo de Entrada (Fase+Neutro)" value={results.summary.mainCircuit.cableMM2} isHeader/>
                        <ResultRow label="Disjuntor Geral" value={`${results.summary.mainCircuit.breakerA} A`} isHeader/>
                     </div>
                </div>
            </div>
        </Card>
    );
};

export default ResultsDisplay;
