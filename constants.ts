
import { Room, RoomType } from './types';

export const INITIAL_ROOMS: Room[] = [
    { id: 1, name: 'Sala de Estar/Jantar', type: RoomType.DRY, area: 20, perimeter: 18 },
    { id: 2, name: 'Cozinha', type: RoomType.WET, area: 10, perimeter: 13 },
    { id: 3, name: 'Área de Serviço', type: RoomType.WET, area: 4, perimeter: 8 },
    { id: 4, name: 'Quarto 1', type: RoomType.DRY, area: 12, perimeter: 14 },
    { id: 5, name: 'Quarto 2', type: RoomType.DRY, area: 9, perimeter: 12 },
    { id: 6, name: 'Banheiro Social', type: RoomType.BATHROOM, area: 3.5, perimeter: 7.5 },
];

export const ROOM_TYPE_LABELS: { [key in RoomType]: string } = {
    [RoomType.DRY]: 'Ambiente Seco (Sala, Quarto)',
    [RoomType.WET]: 'Ambiente Úmido (Cozinha, Copa)',
    [RoomType.BATHROOM]: 'Banheiro',
};
