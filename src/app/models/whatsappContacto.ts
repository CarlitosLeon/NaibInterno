import { ContactoExpositor } from "./ContactoExpositor";

export class WhatsAppContacto {
    id_whatsapp_contacto: number;
    id_contacto_expositor: number;
    tipo: number;
    descripcion: string;
    fecha_programado: Date;
    creacion: Date;
    status: string;

    contacto:ContactoExpositor;
}