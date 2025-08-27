
import React from 'react';
import { Room, RoomType } from '../types';
import { ROOM_TYPE_LABELS } from '../constants';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface RoomInputListProps {
    rooms: Room[];
    onUpdate: (id: number, field: keyof Room, value: number | RoomType | string) => void;
    onAdd: () => void;
    onRemove: (id: number) => void;
}

const RoomInputList: React.FC<RoomInputListProps> = ({ rooms, onUpdate, onAdd, onRemove }) => {
    return (
        <Card>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Ambientes da Residência</h2>
            <div className="space-y-4">
                {rooms.map((room) => (
                    <div key={room.id} className="p-3 bg-gray-800 rounded-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <Input
                                label="Nome do Ambiente"
                                type="text"
                                value={room.name}
                                onChange={(e) => onUpdate(room.id, 'name', e.target.value)}
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Tipo</label>
                                <select
                                    value={room.type}
                                    onChange={(e) => onUpdate(room.id, 'type', e.target.value as RoomType)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                >
                                    {Object.entries(ROOM_TYPE_LABELS).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>
                           
                            <Input
                                label="Área (m²)"
                                type="number"
                                value={room.area}
                                onChange={(e) => onUpdate(room.id, 'area', parseFloat(e.target.value) || 0)}
                                min="0"
                                step="0.1"
                            />
                            <Input
                                label="Perímetro (m)"
                                type="number"
                                value={room.perimeter}
                                onChange={(e) => onUpdate(room.id, 'perimeter', parseFloat(e.target.value) || 0)}
                                min="0"
                                step="0.1"
                            />
                        </div>
                         <div className="mt-3 text-right">
                                <button
                                    onClick={() => onRemove(room.id)}
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
                Adicionar Ambiente
            </Button>
        </Card>
    );
};

export default RoomInputList;
