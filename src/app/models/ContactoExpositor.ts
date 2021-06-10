import { Expositor } from "./Expositor";
import { WhatsAppContacto } from "./whatsappContacto";

export class ContactoExpositor {
    idContacto: number;
    expositor:Expositor[];
    nombre: string;
    puesto: string;
    telefono: string;
    email: string;
    img: string;
    checked: boolean;

    msjWhats:WhatsAppContacto[];
    
    
}