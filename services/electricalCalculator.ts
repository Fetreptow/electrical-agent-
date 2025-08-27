
import { Room, Appliance, CalculationResults, RoomType, RoomResult, ApplianceResult, CalculationDetails, CircuitDetails } from '../types';

// --- Helper Functions for Sizing ---

const getCableSize = (current: number): string => {
    if (current <= 15) return '1.5 mm²';
    if (current <= 21) return '2.5 mm²';
    if (current <= 28) return '4.0 mm²';
    if (current <= 36) return '6.0 mm²';
    if (current <= 50) return '10.0 mm²';
    if (current <= 68) return '16.0 mm²';
    return 'Acima de 16.0 mm² (Consultar especialista)';
};

const getBreakerSize = (current: number): number => {
    const standardSizes = [10, 15, 20, 25, 30, 35, 40, 50, 60, 70];
    const breaker = standardSizes.find(size => size >= current);
    return breaker || Math.ceil(current / 5) * 5;
};

const sizeCircuit = (power: number, voltage: number, minCable: string = "1.5 mm²"): CircuitDetails => {
    if(power === 0) return { powerVA: 0, currentA: 0, cableMM2: 'N/A', breakerA: 0 };
    
    const current = power / voltage;
    let cable = getCableSize(current);

    // Enforce minimum cable size
    const minCableVal = parseFloat(minCable);
    const currentCableVal = parseFloat(cable);
    if(currentCableVal < minCableVal) {
        cable = minCable;
    }
    
    const breaker = getBreakerSize(current);
    
    return {
        powerVA: power,
        currentA: current,
        cableMM2: cable,
        breakerA: breaker,
    };
};

// --- Calculation Functions ---

const calculateLighting = (area: number): CalculationDetails => {
    if (area <= 0) return { quantity: 0, powerVA: 0 };
    
    const first6m2 = Math.min(area, 6);
    const remainingArea = Math.max(0, area - 6);
    
    const quantity = 1 + Math.ceil(remainingArea / 4);
    const powerVA = 100 + (Math.ceil(remainingArea / 4) * 60);

    return { quantity, powerVA };
};

const calculateTugs = (room: Room): CalculationDetails => {
    const { type, area, perimeter } = room;
    if (perimeter <= 0) return { quantity: 0, powerVA: 0 };

    let quantity = 0;
    let powerVA = 0;

    switch (type) {
        case RoomType.BATHROOM:
            quantity = 1;
            powerVA = 600;
            break;
        case RoomType.WET: // Cozinhas, copas, áreas de serviço
            quantity = Math.ceil(perimeter / 3.5);
            powerVA = Math.min(quantity, 3) * 600 + Math.max(0, quantity - 3) * 100;
            break;
        case RoomType.DRY: // Salas, quartos
        default:
            quantity = Math.max(1, Math.ceil(perimeter / 5));
            powerVA = quantity * 100;
            break;
    }
    return { quantity, powerVA };
};

const calculateDemandFactor = (lightingPower: number, tugsPower: number): number => {
    const totalPower = lightingPower + tugsPower;
    if (totalPower <= 1000) return totalPower * 0.87;
    if (totalPower <= 2000) return totalPower * 0.75;
    if (totalPower <= 3000) return totalPower * 0.68;
    if (totalPower <= 4000) return totalPower * 0.62;
    if (totalPower <= 5000) return totalPower * 0.56;
    if (totalPower <= 6000) return totalPower * 0.51;
    if (totalPower <= 7000) return totalPower * 0.47;
    if (totalPower <= 8000) return totalPower * 0.44;
    if (totalPower <= 9000) return totalPower * 0.41;
    if (totalPower <= 10000) return totalPower * 0.38;
    return totalPower * 0.35; // Acima de 10kVA
};

// --- Main Report Generator ---

export const generateFullReport = (rooms: Room[], appliances: Appliance[]): CalculationResults => {
    let totalLightingVA = 0;
    let totalTugsVA = 0;
    let totalTuesVA = 0;
    
    const roomResults: RoomResult[] = rooms.map(room => {
        const lighting = calculateLighting(room.area);
        const tugs = calculateTugs(room);
        
        totalLightingVA += lighting.powerVA;
        totalTugsVA += tugs.powerVA;

        return { id: room.id, name: room.name, lighting, tugs };
    });

    const applianceResults: ApplianceResult[] = appliances.map(app => {
        totalTuesVA += app.power;
        return {
            id: app.id,
            name: app.name,
            circuit: sizeCircuit(app.power, app.voltage, "2.5 mm²")
        };
    });
    
    const totalInstalledVA = totalLightingVA + totalTugsVA + totalTuesVA;
    
    const demandedLightingAndTugs = calculateDemandFactor(totalLightingVA, totalTugsVA);
    const demandedPowerVA = demandedLightingAndTugs + totalTuesVA; // TUEs usually have demand factor of 1

    const mainCircuit = sizeCircuit(demandedPowerVA, 220); // Assuming two-phase 220V for main entry
    
    return {
        rooms: roomResults,
        appliances: applianceResults,
        summary: {
            totalLightingVA,
            totalTugsVA,
            totalTuesVA,
            totalInstalledVA,
            demandedPowerVA,
            mainCircuit,
        },
    };
};
