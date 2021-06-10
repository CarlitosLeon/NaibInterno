import { EventoCalendario } from "./EventoCalendario";

export class ListaCalendario{
    id:number;
    icono:string;
    titulo:string;
    color:number;
    bootstrapColor:any;
    lstEventoCalendario:EventoCalendario[]=[];
    //////
    eventosToday:number=0;
    timerLista:number=0;
  }