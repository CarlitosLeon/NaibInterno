import { ImgEventoCalendario } from "./ImgEventoCalendario";
import { SubTareaCalendario } from "./SubTareaCalendario";

export class EventoCalendario{
    id:number;
    titulo:string;
    hora:string;
    notas:string;
    lstSubTareaCalendario:SubTareaCalendario[]=[];
    ubicacion:string;
    estatus:boolean;
    lstImgEventoCalendario:ImgEventoCalendario[]=[];
    /////
    className:string;
    secSubtareas:SubTareaCalendario[]=[];
    timerEventoCalendario:number=0;
  }