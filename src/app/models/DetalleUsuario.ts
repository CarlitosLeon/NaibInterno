import { User } from 'src/app/users/models/user';
import { Evento } from '../users/models/userEvento';

export class DetalleUsuario {
    id: number;
    idUsuario: number;
    idEvento: number;
    estatus: number;
    usuario: User;
    evento: Evento;
}