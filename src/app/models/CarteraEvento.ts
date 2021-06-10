import { User } from "../users/models/user";
import { Evento } from "../users/models/userEvento";
import { Expositor } from "./Expositor";
import { WhatsAppCartera } from "./WhatsAppCartera";

export class CarteraEvento{
    id:number;
    evento:Evento;
    expositor:Expositor=new Expositor();
    fecha:Date;
    vendedor:User=new User();
    reubicacion:boolean=false;

    msjWhats:WhatsAppCartera[];
}