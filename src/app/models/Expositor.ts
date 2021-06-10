import { ContactoExpositor } from "./ContactoExpositor";


export class Expositor {
    id: number;
    razon_social: string;
    nombre_comercial: string;
    contacto: string;
    telefono: string;
    telefono2: string;
    email: string;
    rfc: string;
    estatus_crm: string;
    prioridad: string;
    direccion: string;
    pagina_web: string;
    acercaDe: string;
    pais: string;
    estado: string;
    logo: string = 'nouser.png';

    // FUNCIÓN EXCEL CRM
    nombreContacto: string;
    puestoContacto: string;
    telefonoContacto: string;
    correoContacto: string;
    
    nombreContacto2: string;
    puestoContacto2: string;
    telefonoContacto2: string;
    correoContacto2: string;

    nombreContacto3: string;
    puestoContacto3: string;
    telefonoContacto3: string;
    correoContacto3: string;

    nombreContacto4: string;
    puestoContacto4: string;
    telefonoContacto4: string;
    correoContacto4: string;

    /////////////////////////////////////////FUNTION MAPA VENTAS
    /**
     * img===logo
     */
    clicked: boolean;
    img: string;
    positionStands: Array<number> = [];
    idStandRefe: number;

    contactoExpositor:ContactoExpositor = new ContactoExpositor();
}