
import React, { useState, useCallback } from 'react';
import { Room, Appliance, CalculationResults, RoomType } from './types';
import { INITIAL_ROOMS } from './constants';
import { generateFullReport } from './services/electricalCalculator';
import { generatePdf } from './services/pdfGenerator';
import { generateExcel } from './services/excelGenerator';
import RoomInputList from './components/RoomInputList';
import ApplianceInputList from './components/ApplianceInputList';
import ResultsDisplay from './components/ResultsDisplay';
import { Button } from './components/ui/Button';

const App: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
    const [appliances, setAppliances] = useState<Appliance[]>([
        { id: Date.now(), name: 'Chuveiro Elétrico', power: 5500, voltage: 220 },
    ]);
    const [results, setResults] = useState<CalculationResults | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCalculate = useCallback(() => {
        setIsLoading(true);
        // Simulate a short delay for better UX
        setTimeout(() => {
            const validRooms = rooms.filter(room => room.area > 0 && room.perimeter > 0);
            const report = generateFullReport(validRooms, appliances);
            setResults(report);
            setIsLoading(false);
            // Scroll to results on mobile
            if (window.innerWidth < 768) {
                document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);
    }, [rooms, appliances]);

    const handleGeneratePdf = useCallback(() => {
        if (results) {
            generatePdf(results);
        }
    }, [results]);

    const handleGenerateExcel = useCallback(() => {
        if (results) {
            generateExcel(results);
        }
    }, [results]);

    const updateRoom = (id: number, field: keyof Room, value: number | RoomType) => {
        setRooms(currentRooms =>
            currentRooms.map(room =>
                room.id === id ? { ...room, [field]: value } : room
            )
        );
    };

    const addRoom = () => {
        const newRoom: Room = { id: Date.now(), name: 'Novo Ambiente', type: RoomType.DRY, area: 0, perimeter: 0 };
        setRooms(currentRooms => [...currentRooms, newRoom]);
    };

    const removeRoom = (id: number) => {
        setRooms(currentRooms => currentRooms.filter(room => room.id !== id));
    };

    const updateAppliance = (id: number, field: keyof Appliance, value: string | number) => {
        setAppliances(currentAppliances =>
            currentAppliances.map(app =>
                app.id === id ? { ...app, [field]: value } : app
            )
        );
    };

    const addAppliance = () => {
        const newAppliance: Appliance = { id: Date.now(), name: 'Novo Equipamento', power: 0, voltage: 220 };
        setAppliances(currentAppliances => [...currentAppliances, newAppliance]);
    };

    const removeAppliance = (id: number) => {
        setAppliances(currentAppliances => currentAppliances.filter(app => app.id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400">Calculadora Elétrica Residencial</h1>
                    <p className="text-lg text-gray-400 mt-2">Dimensione seu projeto elétrico com base na NBR 5410</p>
                </header>

                <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-8">
                        <RoomInputList
                            rooms={rooms}
                            onUpdate={updateRoom}
                            onAdd={addRoom}
                            onRemove={removeRoom}
                        />
                        <ApplianceInputList
                            appliances={appliances}
                            onUpdate={updateAppliance}
                            onAdd={addAppliance}
                            onRemove={removeAppliance}
                        />
                         <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                            <Button onClick={handleCalculate} disabled={isLoading} className="w-full sm:flex-1">
                                {isLoading ? 'Calculando...' : 'Calcular Dimensionamento'}
                            </Button>
                            {results && (
                                <div className="w-full sm:flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Button onClick={handleGeneratePdf} variant="secondary">
                                        Gerar PDF
                                    </Button>
                                    <Button onClick={handleGenerateExcel} variant="secondary">
                                        Exportar Excel
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div id="results-section">
                        <ResultsDisplay results={results} isLoading={isLoading} />
                    </div>
                </main>
                
                <footer className="text-center mt-12 text-gray-500 text-sm">
                    <p>
                        Este é um projeto para fins de demonstração. Os cálculos são baseados em interpretações da norma NBR 5410.
                    </p>
                    <p>
                        Consulte sempre um engenheiro eletricista para projetos reais.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default App;