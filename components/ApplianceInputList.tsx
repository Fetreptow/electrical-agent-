
import React from 'react';
import { Appliance } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ApplianceInputListProps {
    appliances: Appliance[];
    onUpdate: (id: number, field: keyof Appliance, value: string | number) => void;
    onAdd: () => void;
    onRemove: (id: number) => void;
}

const ApplianceInputList: React.FC<ApplianceInputListProps> = ({ appliances, onUpdate, onAdd, onRemove }) => {
    return (
        <Card>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Equipamentos de Uso Específico (TUEs)</h2>
            <p className="text-sm text-gray-400 mb-4">Liste equipamentos com corrente nominal &gt; 10A (ex: chuveiro, forno elétrico, ar-condicionado).</p>
            <div className="space-y-4">
                {appliances.map((app) => (
                    <div key={app.id} className="p-3 bg-gray-800 rounded-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <Input
                                label="Nome do Equipamento"
                                type="text"
                                value={app.name}
                                onChange={(e) => onUpdate(app.id, 'name', e.target.value)}
                                className="md:col-span-1"
                            />
                            <Input
                                label="Potência (W)"
                                type="number"
                                value={app.power}
                                onChange={(e) => onUpdate(app.id, 'power', parseInt(e.target.value, 10) || 0)}
                                min="0"
                            />
                             <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Tensão (V)</label>
                                <select
                                    value={app.voltage}
                                    onChange={(e) => onUpdate(app.id, 'voltage', parseInt(e.target.value, 10) as 127 | 220)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                >
                                    <option value={127}>127V</option>
                                    <option value={220}>220V</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-3 text-right">
                           <button
                                onClick={() => onRemove(app.id)}
                                className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/50 rounded-full transition-colors duration-200"
                           >
                              <TrashIcon/>
                           </button>
                        </div>
                    </div>
                ))}
            </div>
            <Button onClick={onAdd} variant="ghost" className="mt-4 w-full">
                <PlusIcon />
                Adicionar Equipamento
            </Button>
        </Card>
    );
};

export default ApplianceInputList;
