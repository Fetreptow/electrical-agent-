
export enum RoomType {
    DRY = 'DRY', // Salas, Quartos
    WET = 'WET', // Cozinhas, Áreas de Serviço
    BATHROOM = 'BATHROOM' // Banheiros
}

export interface Room {
    id: number;
    name: string;
    type: RoomType;
    area: number; // in m²
    perimeter: number; // in m
}

export interface Appliance {
    id: number;
    name: string;
    power: number; // in Watts
    voltage: 127 | 220;
}

export interface CalculationDetails {
    quantity: number;
    powerVA: number;
}

export interface CircuitDetails {
    powerVA: number;
    currentA: number;
    cableMM2: string;
    breakerA: number;
}

export interface RoomResult {
    id: number;
    name: string;
    lighting: CalculationDetails;
    tugs: CalculationDetails; // Tomadas de Uso Geral
}

export interface ApplianceResult {
    id: number;
    name: string;
    circuit: CircuitDetails;
}

export interface CalculationResults {
    rooms: RoomResult[];
    appliances: ApplianceResult[];
    summary: {
        totalLightingVA: number;
        totalTugsVA: number;
        totalTuesVA: number;
        totalInstalledVA: number;
        demandedPowerVA: number;
        mainCircuit: CircuitDetails;
    };
}
