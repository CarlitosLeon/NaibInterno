import { formatDate, registerLocaleData } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, elementMatches } from '@fullcalendar/common';
import { EventInput } from '@fullcalendar/core';
import LocaleMX from '@angular/common/locales/es-MX';
import { extUtilities } from 'src/util/constants/extUtilities';
import { element } from 'protractor';
import { CarteraEvento } from 'src/app/models/CarteraEvento';
import { WhatsAppContacto } from 'src/app/models/whatsappContacto';
import Swal from 'sweetalert2';
import { CalendarioService } from './calendario.service';
import { AuthService } from 'src/app/users/service/auth.service';
import { ListaCalendario } from 'src/app/models/ListaCalendario';
import { EventoCalendario } from 'src/app/models/EventoCalendario';
import { SubTareaCalendario } from 'src/app/models/SubTareaCalendario';
import { ImgEventoCalendario } from 'src/app/models/ImgEventoCalendario';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { execSync } from 'child_process';
import { HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { timer } from 'rxjs';
import { WhatsAppCartera } from 'src/app/models/WhatsAppCartera';
import { Expositor } from 'src/app/models/Expositor';
import { ContactoExpositor } from 'src/app/models/ContactoExpositor';
import { MatMenuTrigger } from '@angular/material/menu';
import { NgxSpinnerService } from 'ngx-spinner';
import { IncidenciaService } from 'src/app/menu-fm/service/incidencia.service';
declare var $: any;
@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css'],
})
export class CalendarioComponent implements OnInit {
  public allTareas: any = [];

  public eventosInCalendario: EventInput[] = [];

  public selectedLista: ListaCalendario;
  public selectedEvento: EventoCalendario;
  public eventosTodayEmpty = true;

  public listMensajesProgramados: ListaCalendario = new ListaCalendario();
  private whatsProgramadosContacto: WhatsAppContacto[]=[];
  private whatsProgramadosCartera:WhatsAppCartera[]=[]; 

  private cleanedListWhatsContacto:ContactoExpositor[]=[];
  private cleanedListWhatsCartera:CarteraEvento[]=[];
  public selectedWhatsPContacto:ContactoExpositor[]=[];
  public selectedWhatsPCartera:CarteraEvento[]=[];

  public selectedDateFromModalWhatsApp:string;
  private selectedIdToEdit:number;

  public listCalendario: ListaCalendario[] = [];
  public eventosToday: EventoCalendario[] = [];
  public picturesAdded: any = [];
  public eventoExist:boolean;
  ///////Este metodo no existe por el momento
  public emailP = [];

  private emptyFile: File;
  private fotoEvidencia: File;
  private lstFileFotos:File[]=[];
  private showFoto: any;
  private deletedSubTareas:SubTareaCalendario[]=[];

  private defaultIcon = extUtilities.MATERIAL_ICONS[2];
  private defaultColor = extUtilities.getBootstrapColor('teal');
  public endUrlBack=environment.endPointBack+'/calendar/calendario/calendarTask/';

  public selectedIcon: any;
  public selectedColor: any;
  public tituloLista: string;

  public tituloTarea: string;
  public notas: string;
  public subtarea: string;
  public listSubtarea: SubTareaCalendario[] = [];
  public fecha: any;
  public hora: any;
  public ubicacion: string;
  public listaSelectedFromCalendar = undefined;
  public erroresTareas = [];

  public minDate: string;
  public maxDate: string;
  public cargandoModal:boolean;
  public eventoSeleccionado;

  public coloresForm = [];
  public iconosForm = [];

  calendarOptions: CalendarOptions;

  constructor(
    private service: CalendarioService,
    private storage: AuthService,
    private spinner:NgxSpinnerService,
    private auth:IncidenciaService
  ) {}

  ngOnInit(): void {
    this.auth.openEvent.subscribe(evento=>{
      this.spinner.show('spinnerCalendarioCRM');
      // console.log(evento);
      this.chargeEvento(evento);
      if(evento==0){
        this.eventoExist=false;
      }else{
        this.eventoExist=true;
      }
    });
  }



  private chargeEvento(idEvSelectedFromBar:number){
    this.calendarOptions=undefined;
    this.calendarOptions = {
      themeSystem: 'bootstrap',
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.clcikedEvent.bind(this),
      initialView: 'dayGridMonth',
      locale: 'es',
      weekends: true,
      editable: false,
      selectable: false,
      selectMirror: true,
      dayMaxEvents: true,
      buttonText: {
        today: 'Hoy',
        month: 'Mes',
        week: 'Semana',
        day: 'Dia',
        list: 'Lista',
      },
      height: 800,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
      },
      events: [],
      //events: this.eventosInCalendario
    };
    this.calendarOptions.events = [];
    this.eventosInCalendario=[];
    this.listCalendario=[];
    this.eventosToday=[];
    ////
    this.whatsProgramadosContacto=[];
    this.whatsProgramadosCartera=[];
    this.cleanedListWhatsContacto=[];
    this.cleanedListWhatsCartera=[];
    this.selectedWhatsPCartera=[];
    this.selectedWhatsPContacto=[];
    this.coloresForm = extUtilities.BOOTSTRAP_COLORS;
    this.iconosForm = extUtilities.MATERIAL_ICONS;
    this.listMensajesProgramados=new ListaCalendario()
    this.listMensajesProgramados.lstEventoCalendario = [];
    registerLocaleData(LocaleMX, 'es-MX');
    let fecha = new Date();
    this.minDate = formatDate(fecha, 'yyyy-MM-dd', 'es-MX');
    let f = fecha.getFullYear() + 1 + '-12-31';
    this.maxDate = formatDate(f, 'yyyy-MM-dd', 'es-MX');
    this.selectedIcon = this.defaultIcon;
    this.selectedColor = this.defaultColor;
    ///////
    let id = this.storage.user.id;
    if(idEvSelectedFromBar!=0){
      this.service.getCalendarInfo(id,idEvSelectedFromBar).subscribe(Respuesta => {
        Respuesta.lstEventoCalendario.forEach((element) => {
          let lista = new ListaCalendario();
          lista.id = element.id;
          lista.titulo = element.titulo;
          lista.icono = extUtilities.getMaterialIcon(element.icono).icon;
          lista.bootstrapColor = extUtilities.getBootstrapColor(element.color);
          lista.color = lista.bootstrapColor.id.toString();
          element.lstEventoCalendario.forEach((eventoC) => {
            let newEventoC = new EventoCalendario();
            newEventoC.id = eventoC.id;
            newEventoC.titulo = eventoC.titulo;
            newEventoC.notas = eventoC.notas;
            newEventoC.hora = formatDate(
              eventoC.hora,
              'yyyy-MM-ddTHH:mm',
              'es-MX'
            );
            newEventoC.ubicacion = eventoC.ubicacion;
            newEventoC.estatus = eventoC.estatus;
            eventoC.lstSubTareaCalendario.forEach((subTarea) => {
              let subT = new SubTareaCalendario();
              subT.id = subTarea.id;
              subT.titulo = subTarea.titulo;
              subT.estatus = subTarea.estatus;
              newEventoC.lstSubTareaCalendario.push(subT);
            });
            eventoC.lstImgEventoCalendario.forEach((imgEvento) => {
              let img = new ImgEventoCalendario();
              img.id = imgEvento.id;
              img.url = imgEvento.url;
              newEventoC.lstImgEventoCalendario.push(img);
            });
            newEventoC.className = lista.bootstrapColor.class;
            let fecha = formatDate(newEventoC.hora,'yyyy-MM-dd','es-MX');
            if (new Date(this.minDate).getTime() == new Date(fecha).getTime()) {
              lista.eventosToday = lista.eventosToday + 1;
              this.eventosToday.push(newEventoC);
              this.eventosTodayEmpty = false;
            }
            lista.lstEventoCalendario.push(newEventoC);
            this.eventosInCalendario.push({
              id: newEventoC.id.toString(),
              title: newEventoC.titulo,
              start: newEventoC.hora,
              className: newEventoC.className,
              tipo: 1,
            });
            this.calendarOptions.events = [];
            this.calendarOptions.events = this.calendarOptions.events.concat(
              this.eventosInCalendario
            );
          });
          this.listCalendario.push(lista);
        });
        ////init list programados
        this.listMensajesProgramados.id = 0;
        this.listMensajesProgramados.bootstrapColor = extUtilities.getBootstrapColor('danger');
        this.listMensajesProgramados.titulo = 'Programados';
        this.listMensajesProgramados.icono = extUtilities.getBootstrapColor('watch_later');
        this.listMensajesProgramados.eventosToday=0;
        /////init list programados
        Respuesta.lstWhatsPFromContacto.forEach(element => {
          let wh=new WhatsAppContacto();
          wh.id_whatsapp_contacto=element.id;
          wh.contacto=element.contacto;
          wh.contacto.idContacto=element.contacto.id;
          wh.tipo=element.tipo;
          wh.descripcion=element.descripcion;
          wh.fecha_programado=element.fecha_programado;
          wh.status=element.status;
          wh.creacion=element.creacion;
          this.whatsProgramadosContacto.push(wh);
          wh.contacto.msjWhats=[];
          let existe;
          this.cleanedListWhatsContacto.forEach(cleaned=>{
            if(cleaned.idContacto==wh.contacto.idContacto)existe=true;
          });
          if(!existe)this.cleanedListWhatsContacto.push(wh.contacto);
        });
        this.cleanedListWhatsContacto.forEach(element=>{
          this.whatsProgramadosContacto.forEach(msj=>{
            if(element.idContacto==msj.contacto.idContacto) element.msjWhats.push(msj);
          })
        });
  
        this.cleanedListWhatsContacto.forEach(element=>{
          let evento = new EventoCalendario();
            let id=element.idContacto.toString();
            evento.id = element.idContacto;
            evento.className = this.listMensajesProgramados.bootstrapColor.class;
            evento.titulo = element.nombre;
          element.msjWhats.forEach(msj=>{
            evento.hora = formatDate(msj.fecha_programado, 'yyyy-MM-dd', 'es-MX');
            let existe=false;
            this.eventosInCalendario.forEach(date=>{
              let f=formatDate(date.start.toString(),'yyyy-MM-dd','es-MX');
              if(f==evento.hora) existe=true;
            });
            if(!existe){
              this.eventosInCalendario.push({
                id: id,
                title: 'WhatsApp '+'('+1+')',
                start: evento.hora,
                className: extUtilities.getBootstrapColor('danger').class,
                tipo: 2,
                tipoSec:'Contacto',
                totales:0,
                allDay:true,
                fecha:evento.hora
              });
            }
          });
          let minf=formatDate(this.minDate,'yyyy-MM-dd','es-MX');
          if(new Date(minf).getTime()<=new Date(evento.hora).getTime()){
            this.listMensajesProgramados.lstEventoCalendario.push(evento);
            this.listMensajesProgramados.eventosToday=this.listMensajesProgramados.eventosToday+1;
          }
        });
  
        this.eventosInCalendario.forEach(date=>{
          this.cleanedListWhatsContacto.forEach(cartera=>{
            let f=formatDate(date.start.toString(),'yyyy-MM-dd','es-MX');
            let existe=false;
            cartera.msjWhats.forEach(element => {
              let fecha=formatDate(element.fecha_programado, 'yyyy-MM-dd', 'es-MX')
              if(fecha==f)existe=true;
            });
            if(existe){
              date.totales=date.totales+1;
              date.title='WhatsApp '+'('+date.totales+')'; 
            }
          })
        })
          
         
  
        Respuesta.lstWhatsPFromCartera.forEach(element => {
          let wh=new WhatsAppCartera();
          wh.id=element.id;
          wh.cartera=element.detalleCartera;
          wh.tipo=element.tipo;
          wh.descripcion=element.descripcion;
          wh.fechaProgramado=element.fecha_programado;
          wh.status=element.status;
          wh.creacion=element.creacion;
          this.whatsProgramadosCartera.push(wh);
          wh.cartera.msjWhats=[];
          let existe;
          this.cleanedListWhatsCartera.forEach(cleaned=>{
            if(cleaned.id==wh.cartera.id)existe=true;
          });
          if(!existe)this.cleanedListWhatsCartera.push(wh.cartera);
        });
  
        this.cleanedListWhatsCartera.forEach(element=>{
          this.whatsProgramadosCartera.forEach(msj=>{
            if(element.id==msj.cartera.id) element.msjWhats.push(msj);
          })
        });
  
  
        
  
        this.cleanedListWhatsCartera.forEach(element=>{
          let evento = new EventoCalendario();
            evento.id = element.id;
            evento.className = this.listMensajesProgramados.bootstrapColor.class;
            evento.titulo = element.expositor.nombre_comercial;
            ////
            element.msjWhats.forEach(msj=>{
            evento.hora = formatDate(msj.fechaProgramado, 'yyyy-MM-dd', 'es-MX');
            let existe=false;
            this.eventosInCalendario.forEach(date=>{
              let f=formatDate(date.start.toString(),'yyyy-MM-dd','es-MX');
              if(f==evento.hora) existe=true;
            });
            if(!existe){
              this.eventosInCalendario.push({
                id: element.id.toString(),
                title: 'WhatsApp '+'('+1+')',
                start: evento.hora,
                tipoSec:'Cartera',
                className: extUtilities.getBootstrapColor('danger').class,
                tipo: 2,
                totales:0,
                allDay:true,
                fecha:evento.hora
              });
            }
          });
          let minf=formatDate(this.minDate,'yyyy-MM-dd','es-MX');
          if(new Date(minf).getTime()<=new Date(evento.hora).getTime()){
            this.listMensajesProgramados.lstEventoCalendario.push(evento);
            this.listMensajesProgramados.eventosToday=this.listMensajesProgramados.eventosToday+1;
          }
          
        })
  
        this.eventosInCalendario.forEach(date=>{
          this.cleanedListWhatsCartera.forEach(cartera=>{
            let f=formatDate(date.start.toString(),'yyyy-MM-dd','es-MX');
            let existe=false;
            cartera.msjWhats.forEach(element => {
              let fecha=formatDate(element.fechaProgramado, 'yyyy-MM-dd', 'es-MX')
              if(fecha==f)existe=true;
            });
            if(existe){
              date.totales=date.totales+1;
              date.title='WhatsApp '+'('+date.totales+')'; 
            }
          })
        })
          this.calendarOptions.events = [];
          this.calendarOptions.events = this.calendarOptions.events.concat(
          this.eventosInCalendario
        );
        this.spinner.hide('spinnerCalendarioCRM');
      });
    }else{
      this.spinner.hide('spinnerCalendarioCRM');
    }
    
    let color=extUtilities.getBootstrapColor(4).id;
    if(color!=null){
      let pos = this.coloresForm.findIndex((element) => element.id ===color.id);
      if (pos != -1) this.coloresForm.splice(pos, 1);
    }
  }

  public asignColor(color) {
    this.selectedColor = color;
  }

  public asignIcon(icon) {
    this.selectedIcon.selected = false;
    this.selectedIcon = icon;
    icon.selected = true;
  }

  public restartValues() {
    this.selectedColor = this.defaultColor;
    this.selectedIcon.selected = false;
    this.selectedIcon = this.defaultIcon;
    this.tituloLista = undefined;
    this.selectedIdToEdit=null;
  }

  public RestartValuesTarea(lista, evento: EventoCalendario) {
    this.selectedLista = lista;
    this.erroresTareas=[];
    this.lstFileFotos=[];
    this.deletedSubTareas=[];
    this.listaSelectedFromCalendar = undefined;
    this.fecha = undefined;
    this.hora = undefined;
    this.ubicacion = undefined;
    this.tituloTarea = undefined;
    this.subtarea = undefined;
    this.notas = undefined;
    this.listSubtarea = [];
    this.picturesAdded = []
    if (evento != null) {
      this.selectedEvento = evento;
      let tareas = [];
      this.selectedEvento.lstSubTareaCalendario.forEach((element) => {
        tareas.push(element);
      });
      this.fecha = formatDate(this.selectedEvento.hora, 'yyyy-MM-dd', 'es-MX');
      this.hora = formatDate(this.selectedEvento.hora, 'HH:mm', 'es-MX');
      let titulo = this.selectedEvento.titulo;
      this.tituloTarea = titulo;
      let notas = this.selectedEvento.notas;
      this.notas = notas;
      let ubicacion = this.selectedEvento.ubicacion;
      this.ubicacion = ubicacion;
      this.selectedEvento.secSubtareas = tareas;
    }
  }

  public agregarLista() {
    let lis: ListaCalendario = new ListaCalendario();
    lis.id = null;
    lis.bootstrapColor = this.selectedColor;
    lis.titulo = this.tituloLista;
    lis.icono = this.selectedIcon.icon;
    lis.lstEventoCalendario = [];
    lis.eventosToday = 0;
    lis.color = this.selectedColor.id;
    Swal.fire({
      title: this.getMensajeModal(this.selectedIdToEdit==null),
      html:
        '<div>'+
        '<div style="font-size: 50px;" class="float-center material-icons img-circle p-4 '+this.selectedColor.class+'">'+
        this.selectedIcon.icon+'</div>'+
        '<br><label class="float-center ml-1 mt-1 mb-2">'+this.tituloLista+'</label>'+
        '</div>',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        if(this.selectedIdToEdit==null){
          this.service
          .saveListaCalendario(lis, this.storage.user.id)
          .subscribe((Respuesta) => {
            lis.id = Respuesta.id;
            this.listCalendario.push(lis);
          });
          Swal.fire({
            icon: 'success',
            title: '¡Nueva lista creada!',
            showConfirmButton: false,
            timer: 1200,
          });
        }else{
          this.selectedLista.titulo=this.tituloLista;
          this.selectedLista.icono=this.selectedIcon.icon;
          this.selectedLista.bootstrapColor=this.selectedColor;
          this.selectedLista.color=this.selectedColor.id;
          this.selectedLista.lstEventoCalendario.forEach(element=>{
            element.className=this.selectedLista.bootstrapColor.class;
            this.eventosInCalendario.forEach(ev=>{
              if(ev.id==element.id.toString() && ev.tipo==1) ev.className=element.className;
            })
          });
          this.calendarOptions.events = [];
          this.calendarOptions.events = this.calendarOptions.events.concat(this.eventosInCalendario);
          this.service.updateListaCalendario(this.selectedLista).subscribe();
          Swal.fire({
            icon: 'success',
            title: '¡Lista editada correctamente!',
            showConfirmButton: false,
            timer: 1100,
          });
        }
        $('#exampleModal').modal('hide');
      }
    });
  }

  getMensajeModal(edicion:boolean):string{
    let mensaje;
    if(edicion){
      mensaje="¿Editar la lista?";
    }else{
      mensaje="¿Agregar nueva Lista?";
    }
    return mensaje
  }

  handleDateClick(arg) {
    let f=formatDate(arg.dateStr,'yyyy-MM-dd','es-MX');
    if(new Date(f).getTime()>=new Date(this.minDate).getTime()){
      $('#modalSinLista').modal('show');
    this.RestartValuesTarea(null, null);
    this.fecha = arg.dateStr;
    }
  }

  /////Click sobre evento en calendario
  private clcikedEvent(arg) {
    let tipo = arg.event._def.extendedProps.tipo;
    let id = arg.event._def.publicId;
    if (tipo.toString() == '1') {
      $('#modalInfoEvento').modal('show');
      this.listCalendario.forEach((lista) => {
        lista.lstEventoCalendario.forEach((evento) => {
          if (evento.id.toString() == id) {
            this.selectedEvento = evento;
            this.selectedLista = lista;
          }
        });
      });
    } else if (tipo.toString() == '2') {
      this.selectedWhatsPCartera=[];
      this.selectedWhatsPContacto=[];
      let fecha=arg.event._def.extendedProps.fecha;
      this.selectedDateFromModalWhatsApp=fecha;
      this.selectedLista = this.listMensajesProgramados;
      this.whatsProgramadosCartera.forEach(whatsPC=> {
        let existe:boolean=false;
        this.selectedWhatsPCartera.forEach(element=>{
          if(element.id==whatsPC.cartera.id)existe=true;
        });
        if(!existe){
          whatsPC.cartera.msjWhats=[];
          this.selectedWhatsPCartera.push(whatsPC.cartera);
        }
      });
      this.selectedWhatsPCartera.forEach(element=>{
        this.whatsProgramadosCartera.forEach(msj=>{
          if(element.id==msj.cartera.id){
            if (formatDate(msj.fechaProgramado,'yyyy-MM-dd','es-MX') == fecha) {
              element.msjWhats.push(msj);
            }
          }
        })
      });

      this.whatsProgramadosContacto.forEach(whatsPc=>{
        let existe=false;
        this.selectedWhatsPContacto.forEach(element=>{
          if(element.idContacto==whatsPc.contacto.idContacto)existe=true;
        });
        if(!existe){
          whatsPc.contacto.msjWhats=[];
          this.selectedWhatsPContacto.push(whatsPc.contacto);
        }
      });
      this.selectedWhatsPContacto.forEach(element=>{
        this.whatsProgramadosContacto.forEach(msj=>{
          if(element.idContacto==msj.contacto.idContacto){
            if (formatDate(msj.fecha_programado,'yyyy-MM-dd','es-MX') == fecha) {
              element.msjWhats.push(msj);
            }
          }
        })
      });

      $('#modalMensajesWhatsApp').modal('show');
    }
  }

  public AgreagarSubTarea(opc: number) {
    if (this.subtarea != undefined) {
      let subT = new SubTareaCalendario();
      subT.titulo = this.subtarea;
      subT.estatus = false;
      subT.id = null;
      if (opc == 1) {
        this.listSubtarea.push(subT);
      } else if (opc == 2) {
        this.selectedEvento.secSubtareas.push(subT);
      }
      this.subtarea = undefined;
    }
  }

  public deleteSubTarea(pos: number, opc: number) {
    if (opc == 1) {
      this.listSubtarea.splice(pos, 1);
    } else if (opc == 2) {
      if(this.selectedEvento.secSubtareas[pos].id!=null) this.deletedSubTareas.push(this.selectedEvento.secSubtareas[pos]);
      this.selectedEvento.secSubtareas.splice(pos, 1);
    }
  }

  public selectEvento(lista, item) {
    this.selectedLista = lista;
    this.selectedEvento = item;
  }

  public selectListaModal(opc) {
    this.listCalendario.forEach((element) => {
      if (element.id == parseInt(opc)) this.selectedLista = element;
    });
    this.listaSelectedFromCalendar = opc;
  }

  public cambioEstatusEvento(lista:ListaCalendario ,item: EventoCalendario) {
    lista.timerLista=lista.timerLista+1;
    var time = timer(1600);
    time.subscribe((n) => {
      if (n == 0) {
        lista.timerLista=lista.timerLista-1;
        if (lista.timerLista == 0) {
          lista.timerLista = 1;
          this.service.updateEstatusEventoCalendario(lista).subscribe((Respuesta) => {
            lista.timerLista = 0;
          });
        }
      }
    });
  }
  public cambioEstatusSubTarea(item: EventoCalendario) {
    item.timerEventoCalendario=item.timerEventoCalendario+1;
    var time = timer(1600);
    time.subscribe((n) => {
      if (n == 0) {
        item.timerEventoCalendario=item.timerEventoCalendario-1;
        if (item.timerEventoCalendario == 0) {
          item.timerEventoCalendario = 1;
          this.service.updateEstatusSubTareaCalendario(item).subscribe(
            Respuesta => {
              item.timerEventoCalendario=0;
            });
        }
      }
    });
  }

  public deleteEventoCalendario(lista:ListaCalendario,item:EventoCalendario) {
    Swal.fire({
      title: '¿Desea ELIMINAR la tarea?',
      html: '<span class="font-italic">'+item.titulo+'</span>',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      icon:'warning'
    }).then((result) => {
      if (result.value) {
        this.service.deleteEventoCalendario(item).subscribe(Respuesta=>{
          let pos=lista.lstEventoCalendario.findIndex(element=>element.id===item.id);
          if(pos!=-1)lista.lstEventoCalendario.splice(pos,1);
          let res=this.eventosInCalendario.findIndex(element=>element.id===item.id.toString());
          if(res!=-1)this.eventosInCalendario.splice(res,1);
          this.calendarOptions.events = [];
          this.calendarOptions.events = this.calendarOptions.events.concat(this.eventosInCalendario);

          Swal.fire({
            icon: 'success',
            title: '¡Tarea eliminada!',
            showConfirmButton: false,
            timer: 1200,
          });

          let hora=formatDate(item.hora,'yyyy-MM-dd','es-MX');
          if(hora==this.minDate) {
            lista.eventosToday-=1;
            let pos=this.eventosToday.findIndex(element=>element.id===item.id)
            this.eventosToday.splice(pos,1);
          }
        });
      }
    });
  }

  public deleteListaCalendario(lista:ListaCalendario){
    // console.log(lista);
    Swal.fire({
      title: '¿Desea ELIMINAR la lista?',
      html: '<div>'+
      '<div style="font-size: 50px;" class="float-center material-icons img-circle p-4 '+lista.bootstrapColor.class+'">'+
      lista.icono+'</div>'+
      '<br><label class="float-center ml-1 mt-1 mb-2">'+lista.titulo+'</label>'+
      '</div><br>'+
      '<span class="text-dark">Al confirmar se eliminaran todas las tareas y su contenido, ¿Desea continuar?</span>',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.service.deleteListaCalendario(lista.id).subscribe(Respuesta=>{
          this.listCalendario.forEach(element=>{
            if(element.id==lista.id){
              element.lstEventoCalendario.forEach(lst=>{
                let pos=this.eventosInCalendario.findIndex(eventosCalendario=>eventosCalendario.id===lst.id.toString());
                if(pos!=-1) this.eventosInCalendario.splice(pos,1);
              });
            }
          });
          this.calendarOptions.events = [];
          this.calendarOptions.events = this.calendarOptions.events.concat(this.eventosInCalendario);
          let pos=this.listCalendario.findIndex(element=>element.id===lista.id);
          if(pos!=-1){
            this.listCalendario.splice(pos,1);
          }
          Swal.fire({
            icon: 'success',
            title: '¡Lista eliminada!',
            showConfirmButton: false,
            timer: 1200,
          });
        });
      }
    });
  }

  public addEvento(opc: number) {
    this.erroresTareas = [];
    if (opc == 2)
      if (this.listaSelectedFromCalendar == undefined ||this.listaSelectedFromCalendar == '0')this.erroresTareas.push('Debe seleccionar una LISTA');
    if (this.tituloTarea == undefined || this.tituloTarea=='')
      this.erroresTareas.push('Debe asignar un TÍTULO a la tarea');
    if (this.fecha == undefined)
      this.erroresTareas.push('Debe ingresar la FECHA de la tarea');
    if (this.hora == undefined)
      this.erroresTareas.push('Debe ingresar la HORA de la tarea');
    // if (this.ubicacion == undefined || this.ubicacion=='')
    //   this.erroresTareas.push('Debe agregar una UBICACIÓN');

    if (this.erroresTareas.length == 0) {
      let eve = new EventoCalendario();
      eve.id = null;
      eve.estatus = false;
      eve.notas = this.notas;
      eve.titulo = this.tituloTarea;
      eve.lstSubTareaCalendario = this.listSubtarea;
      eve.ubicacion = this.ubicacion;
      eve.hora = this.fecha + 'T' + this.hora;
      eve.className = this.selectedLista.bootstrapColor.class;
      if (eve.notas == undefined) eve.notas = '';

      Swal.fire({
        title: '¿Desea confirmar la nueva tarea?',
        html: '<span class="font-italic">'+this.tituloTarea+'</span>',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        icon:'question'
      }).then((result) => {
        if (result.value) {
          this.selectedLista.lstEventoCalendario.push(eve);
          this.service.saveListaCalendario(this.selectedLista, this.storage.user.id).subscribe(
            Respuesta => {
              Respuesta.lstEventoCalendario.forEach((element) => {
                let existe = false;
                this.selectedLista.lstEventoCalendario.forEach((evP) => {
                  if (evP.id == element.id) existe = true;
                });
                if (!existe) {
                  eve.id = element.id;
                  eve.lstSubTareaCalendario=element.lstSubTareaCalendario;
                }
              });
              this.eventosInCalendario.push({
                id: eve.id.toString(),
                title: eve.titulo,
                start: eve.hora,
                className: eve.className,
                tipo: 1,
              });
              this.calendarOptions.events = [];
              this.calendarOptions.events = this.calendarOptions.events.concat(this.eventosInCalendario);
              if(this.lstFileFotos.length>0)this.subirFoto(this.selectedLista.id,eve.id);
            });
            Swal.fire({
              icon: 'success',
              title: '¡Nueva tarea agregada!',
              showConfirmButton: false,
              timer: 1200,
            });
            this.picturesAdded.forEach((element) => {
              let img = new ImgEventoCalendario();
              img.id = 1;
              img.url = element;
              eve.lstImgEventoCalendario.push(img);
            });
            let fecha = formatDate(eve.hora, 'yyyy-MM-dd', 'es-MX');
            if (fecha == this.minDate) {
              this.eventosToday.push(eve);
              this.selectedLista.eventosToday += 1;
              this.eventosTodayEmpty = false;
            }
            $('#modalTareaNueva').modal('hide');
            $('#modalSinLista').modal('hide');
        }
      });
    }
  }

  

  public editarEvento() {
    Swal.fire({
      title: '¿Desea confirmar la edición de la tarea?',
      html: '<span class="font-italic">'+this.tituloTarea+'</span>',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      icon:'question'
    }).then((result) => {
      if (result.value) {
        let tareas = [];
        this.selectedEvento.secSubtareas.forEach((element) => {
          tareas.push(element);
        });
        this.selectedEvento.notas = this.notas;
        this.selectedEvento.titulo = this.tituloTarea;
        this.selectedEvento.ubicacion = this.ubicacion;
        this.selectedEvento.lstSubTareaCalendario = tareas;
        let fecha = this.fecha + 'T' + this.hora;
        this.selectedEvento.hora = fecha;
        this.service.updateListaCalendario(this.selectedLista).subscribe((Respuesta) => {
          Respuesta.lstEventoCalendario.forEach((element) => {
            if (this.selectedEvento.id==element.id) {
              this.selectedEvento.lstSubTareaCalendario=element.lstSubTareaCalendario;
            }
          });
          let newFecha = formatDate(fecha, 'yyyy-MM-dd', 'es-MX');
          let prevFecha = formatDate(this.selectedEvento.hora, 'yyyy-MM-dd', 'es-MX');
          let today = formatDate(new Date(), 'yyyy-MM-dd', 'es-MX');
          if (
            new Date(prevFecha).getTime() == new Date(today).getTime() &&
            new Date(newFecha).getTime() != new Date(prevFecha).getTime()
          ) {
            if (this.selectedLista.eventosToday > 0)
              this.selectedLista.eventosToday = this.selectedLista.eventosToday - 1;
            let pos = this.eventosToday.findIndex(
              (element) => element.id === this.selectedEvento.id
            );
            if (pos != -1) this.eventosToday.splice(pos, 1);
          } else if (new Date(newFecha).getTime() == new Date(today).getTime()) {
            this.selectedLista.eventosToday = this.selectedLista.eventosToday + 1;
            this.eventosToday.push(this.selectedEvento);
          }
          this.eventosTodayEmpty = false;
          if (this.eventosToday.length == 0) this.eventosTodayEmpty = true;
          this.calendarOptions.events = [];
          let pos = this.eventosInCalendario.findIndex(
            (element) =>
              element.id === this.selectedEvento.id.toString() && element.tipo === 1
          );
          if (pos != -1) {
            this.eventosInCalendario[pos].start = fecha;
            this.eventosInCalendario[pos].titulo = this.selectedEvento.titulo;
          }
          this.calendarOptions.events = this.calendarOptions.events.concat(this.eventosInCalendario);
          Swal.fire({
            icon: 'success',
            title: '¡Tarea editada con éxito!',
            showConfirmButton: false,
            timer: 1200,
          });
          if(this.lstFileFotos.length>0)this.subirFoto(this.selectedLista.id,this.selectedEvento.id);
          $('#exampleModal3').modal("hide");
        });
        if(this.deletedSubTareas.length>0){
          this.service.deleteSubTareaCalendario(this.deletedSubTareas).subscribe(Respuesta=>{
          })
        }
        
      }
    });
  }

  public editarLista(item:ListaCalendario){
    // console.log(item)
    this.restartValues();
    this.tituloLista=item.titulo;
    this.selectedIcon=extUtilities.getMaterialIcon(item.icono);
    this.selectedIcon.selected=true;
    this.selectedColor=item.bootstrapColor;
    this.selectedIdToEdit=item.id;
    this.selectedLista=item;
    $('#exampleModal').modal('show');
  }

  private getMensajesProgramados() {
    let whats: WhatsAppContacto[] = [];
    let msj = new WhatsAppContacto();
    msj.creacion = new Date();
    msj.descripcion = 'WhatsApp';
    msj.fecha_programado = new Date('2021-03-27T12:23');
    msj.id_contacto_expositor = 1;
    msj.id_whatsapp_contacto = 1;
    msj.status = '1';
    msj.tipo = 1;
    whats.push(msj);
    let evento = new EventoCalendario();
    evento.id = 1;
    evento.className = this.listMensajesProgramados.bootstrapColor.class;
    evento.titulo = msj.descripcion;
    evento.hora = formatDate(msj.fecha_programado, 'yyyy-MM-dd', 'es-MX');
    this.listMensajesProgramados.lstEventoCalendario.push(evento);
    this.eventosInCalendario.push({
      id: '1',
      title: msj.descripcion,
      start: msj.fecha_programado,
      className: extUtilities.getBootstrapColor('danger').class,
      tipo: 2,
    });

    this.calendarOptions.events = [];
    this.calendarOptions.events = this.calendarOptions.events.concat(
      this.eventosInCalendario
    );
  }

  /*
  private getEmailsProgramados(){
    let email= new emailContacto();
    email.id=1;
    email.fechaProgramado='2021-03-29T14:50'
    email.descripcion='Email'
    this.emailP.push(email);
    this.eventosInCalendario.push({
      id:'2',
      title:email.descripcion,
      start:email.fechaProgramado,
      className:extUtilities.getBootstrapColor('danger').class,
      tipo:2
    });
    let evento= new EventoCalendario();
    evento.id=2;
    evento.className=this.listMensajesProgramados.bootstrapColor.class;
    evento.title=email.descripcion;
    evento.start=formatDate(email.fechaProgramado,'yyyy-MM-dd', 'es-MX');
    this.listMensajesProgramados.evento.push(evento);
  }
  */

  seleccionarFoto(event, opc: number) {
    this.fotoEvidencia = event.target.files[0];
    if (this.fotoEvidencia != null) {
      if (this.fotoEvidencia.type.indexOf('image') < 0) {
        Swal.fire('Error', 'Debe de seleccionar una foto', 'error');
        this.fotoEvidencia = this.emptyFile;
      } else {
        var reader = new FileReader();
        reader.readAsDataURL(this.fotoEvidencia);
        reader.onload = (e) => {
          this.showFoto = reader.result;
          Swal.fire({
            title: '¿Subir foto de la tarea?',
            html:
              '<br><img src="' +
              this.showFoto +
              '" style="max-width: 350px; max-height:350px;">',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',

            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
          }).then((result) => {
            if (result.value) {
              this.lstFileFotos.push(this.fotoEvidencia);
              this.picturesAdded.push(this.showFoto);
            }
          });
          $('#subirEvidenciaCalendario').val('');
          $('#subirEvidenciaCalendarioEditar').val('');
          $('#subirEvidenciaCalendarioFromCalendar').val('');
        }; ///End reader onload
      }
    }
  }

  public subirFoto(idLista:number,idEvento:number){
    let lstImg:ImgEventoCalendario[]=[];
    if (this.fotoEvidencia) {
      this.service.uploadFotoEventoCalendario(this.lstFileFotos,idLista,idEvento).subscribe(
        Respuesta => {
          if (Respuesta.type === HttpEventType.Response) {
            let response: any = Respuesta.body;
            response.registro.lstEventoCalendario.forEach(element => {
              if(element.id==idEvento) lstImg=element.lstImgEventoCalendario;
            });
            this.listCalendario.forEach(lista=>{
              if(lista.id==idLista){
                lista.lstEventoCalendario.forEach(evC=>{
                  if(evC.id==idEvento){
                    evC.lstImgEventoCalendario=lstImg;
                  }
                });
              }
            })
          }
        }
      );
    } else {
      Swal.fire('Error', 'Debe de seleccionar una foto', 'error');
      return null;
    }
  }



  // we create an object that contains coordinates 
  menuTopLeftPosition =  {x: '0', y: '0'} 
 
  // reference to the MatMenuTrigger in the DOM 
  @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger: MatMenuTrigger; 
 
  /** 
   * Method called when the user click with the right button 
   * @param event MouseEvent, it contains the coordinates 
   * @param item Our data contained in the row of the table 
   */ 
  onRightClick(event: MouseEvent, item:ListaCalendario) { 
      // preventDefault avoids to show the visualization of the right-click menu of the browser 
      event.preventDefault(); 
 
      // we record the mouse position in our object 
      this.menuTopLeftPosition.x = event.clientX + 1 + 'px'; 
      this.menuTopLeftPosition.y = event.clientY + 1 + 'px'; 
 
      // we open the menu 
      // we pass to the menu the information about our object 
      this.matMenuTrigger.menuData = {item: item} 
 
      // we open the menu 
      this.matMenuTrigger.openMenu(); 
 
  } 

}
