import { CarteraEvento } from "./CarteraEvento";
import { ContactoExpositor } from "./ContactoExpositor";

export class WhatsAppCartera{
    id: number;
    cartera:CarteraEvento;
    tipo: number;
    descripcion: string;
    fechaProgramado: Date;
    creacion: Date;
    status: string;
}