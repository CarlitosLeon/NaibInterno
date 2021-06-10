import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IncidenciaService } from 'src/app/menu-fm/service/incidencia.service';
import { AuthService } from 'src/app/users/service/auth.service';
import Swal from 'sweetalert2';
import { extUtilities } from 'src/util/constants/extUtilities';
import { VentasProspectosService } from './ventas-prospectos.component.service';
import $ from 'jquery';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { envioW } from 'src/app/models/envioW';
import { AdminReunionService } from 'src/app/adminFM/admin-reunion/service/adminReunion.service';
import { SmsWhatsService } from './sms-whats.service';
import { environment } from 'src/environments/environment.prod';
import { Observable, Subject, timer } from 'rxjs';
import { ContactoExpositor } from 'src/app/models/ContactoExpositor';
import { Expositor } from 'src/app/models/Expositor';
import * as XLSX from 'xlsx';
import { map, startWith } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActividadExpositor } from 'src/app/models/ActividadExpositor';
import { WhatsAppContacto } from 'src/app/models/whatsappContacto';
import * as moment from 'moment';
import { EnviowPdfComponent } from 'src/app/models/envioWhatspdf';
import { formatDate, registerLocaleData } from '@angular/common';
import LocaleMX from '@angular/common/locales/es-MX';
import { FirmaEmail } from 'src/app/models/FirmaEmail';
import { EmailContacto } from 'src/app/models/EmailContacto';
import { HttpEventType } from '@angular/common/http';
import { archivoContacto } from 'src/app/models/Archivocontacto';
import { ListaCalendario } from 'src/app/models/ListaCalendario';
import { EventoCalendario } from 'src/app/models/EventoCalendario';
import { SubTareaCalendario } from 'src/app/models/SubTareaCalendario';
import { ImgEventoCalendario } from 'src/app/models/ImgEventoCalendario';


@Component({
  selector: 'app-ventas-prospectos',
  templateUrl: './ventas-prospectos.component.html',
  styleUrls: ['./ventas-prospectos.component.css']
})
export class VentasProspectosComponent implements OnInit {



  // V A L I D A C I Ó N     S E L E C T     M E N Ú
  public countNumConsultas: number = 0;
  // V A L I D A C I Ó N     D I V S 
  public infoExpositor: boolean = false;
  public actividades: boolean = false;
  public historial: boolean = false;
  public clientes: any;
  // V A L I D A C I Ó N   D O S   U S U A R I O S
  public validRol: boolean;
  // C O N T A D O R E S   C R M
  public countProspecto: number = 0;
  public countContactado: number = 0;
  public countPosibleCliente: number = 0;
  public countCotizado: number = 0;
  public countCotizacionR: number = 0;
  public countCotizacionA: number = 0;

  // C L I E N T E S
  public misClientes: any = [];
  public misClientes2: any = [];
  public clientesGenerales: any = [];
  public clientesGenerales2: any = [];
  public paisesFiltrados: any = [];
  public paisesFiltrados2: any = [];
  public estadosFiltrados: any = [];

  // E X P O S I T O R   S E L E C C I O N A D O
  public clienteSeleccionado: any = null;
  public notasCliente: any = [];
  public contactoCliente: any = [];
  public actividadesExpositor: any = [];
  public carteraExpositor: any = [];
  public idSelect: number = 0;
  // ID EVENTO SELECCIONADO
  public idEventoSelected: number = null;
  // S E L E C T' S
  public selectEstatusCrm: number;
  public selectPrioridadCrm: number;
  public selectTipoActividad: string = "1";
  public selectFiltroVendedores: number = 0;
  public selectEstadosCollapsible: string = "0";
  // I N P U T' S
  public inptNewNota: string = null;
  public inptDescripcionAct: string = null;
  public inptAccionTomar: string = null;
  // C L A S E S    S E L E C T' S
  public estatusClaseCRM: string = null;
  // V A R   E X P O   S E L E C T E D
  public getExpoSelected: number = 0;
  public getResExpoSelected: number;
  // B U S C A D O R
  public searchModel: string = "";
  public sinResultadosMi: boolean = false;
  public sinResultadosGen: boolean = false;
  public searchPrioridad: number = 0;
  public searchVendedores: number = 0;
  // A S I G N A C I O N    V E N D E D O R
  public vendedores: any = [];
  public relacionVendedor: any = [];
  public selectVendedores: number = 0;
  public idCartera: number = 0;
  // E D I T A R   C O N T A C T O
  public nombreEditContacto: string = "";
  public idEditContacto: number = 0;
  public telefonoEditContacto: string = "";
  public puestoEditContacto: string = "";
  public emailEditContacto: string = "";
  public emptyFile: File;
  public fotoEvidencia: File;
  public ShowFoto: any;
  // E D I T A R   E X P O S I T O R
  public razonSocial: string = "";
  public nombreComercial: string = "";
  public direccion: string = "";
  public rfc: string = "";
  public telefono: string = "";
  public telefono2: string = "";
  public correo: string = "";
  public paginaWeb: string = "";
  public acercaDe: string = "";
  public pais: string = "";
  public estado: string = "";
  public idExpoEdit: number = 0;
  public fotoEditExpositor: File;
  // G U A R D A R    E X P O S I T O R
  public formD: any;
  public formC: any;
  public fotoExpositor: File;
  public fotoContacto: File;
  public imagenesContactos: File[] = [];
  public arrayContactos: ContactoExpositor[] = [];
  public contacto: ContactoExpositor = new ContactoExpositor;
  public hayContactos: boolean = false;
  public varRfc: boolean = false;
  public estados: string[] = ['Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua', 'CDMX', 'Coahuila', 'Colima', 'Durango', 'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'];
  public estadosEdit: any = [];
  public paisesEdit: any = [];
  myControl = new FormControl();
  estadoEditar = new FormControl();
  paisEditar = new FormControl();

  filteredOptions: Observable<string[]>;
  filteredOptionsEstadoEditar: Observable<string[]>;
  filteredOptionsPaisEditar: Observable<string[]>;
  // G U A R D A R    C O N T A C T O    D E S D E     C R M 
  public fotoContactoSave: File;
  public formCS: any;

  // B U S C A R    C O N    F I L T R O    E M B U D O
  public estatusEmbudo: number = null;

  // C O N S U L T   I M A G E N E S
  urlImgC: string = `${environment.endPointBack}/ventasProspectos/getImgContacto/`;
  urlImgEx: string = `${environment.endPointBack}/ventasProspectos/getImgExpositor/`;

  // A C T I V I D A D   C A L E N D A R I O 
  public coloresForm = extUtilities.BOOTSTRAP_COLORS;
  public iconosForm = extUtilities.MATERIAL_ICONS;
  public defaultIcon = extUtilities.MATERIAL_ICONS[2];
  public defaultColor = extUtilities.getBootstrapColor('teal');
  public selectedColor: any;
  public selectedIcon: any;
  public tituloLista: string;
  public listCalendario: ListaCalendario[] = [];
  public selectListas: number = 0;
  public notasArr: any = [];
  public listSubtarea: any = [];
  public formularioLista: boolean = false;
  public tituloTarea: string;
  public notas: string;
  public subtarea: string;
  public ubicacion: string;
  public selectedEvento: EventoCalendario;
  public deletedSubTareas: SubTareaCalendario[] = [];
  public selectedLista: ListaCalendario;
  public minDate: string;
  public maxDate: string;
  public picturesAdded: any = [];
  public lstFileFotos: File[] = [];
  public fecha: any;
  public hora: any;
  public actividadCalendario: ActividadExpositor;

  // E X C E L
  public data: Expositor[][];
  public keys: string[] = [];
  public isExcelFile: boolean = false;
  public loadExcel: boolean = false;
  public dataSheet = new Subject();
  public numRegistros: number = 0;
  public numNoRegistros: number = 0;
  public numRfcRepetidos: number = 0;
  public numTelefonosInvalidos: number = 0;
  public numContactosRegistrados: number = 0;
  public arrayNumInvalidosExpo: any = [];
  public arrayNumInvalidosContacto: any = [];
  public contactosNoRegistrados: number = 0;
  public errors: string = "0";

  //Heras
  historialExpH: Array<ActividadExpositor> = new Array<ActividadExpositor>();

  /** E M A I L ' S  C A R L O S */
  public nuevoEmail: any;
  archivosPdf: archivoContacto[];
  // MUESTRA FIRMAS EMAIL
  showFirma: FirmaEmail[];
  //MUESTRA PDFS
  public nuvoPdf: any;
  //MUESTRA FIRMAS EMAIL
  public firmasele: any = null;
  //SELECCION DETALLE EMAILS
  public emailsele: any = null;
  /** F o r m  e n v i o  e m a i l  p r o g r a m a d o */
  formemailPro: FormGroup;
  /**SUBIR Y EDITAR IMG FIRMA */
  private imgUpdate: File;
  /**RECUPERA IMG O ARCHIVO */
  private fotoSeleccionada: File;
  private archivosE: File[] = [];
  public archivosFirma: Array<{ archivo: File, name: string, size: string, tipoAr: string }> = [];
  progreso: number = 0;
  /** F o r m  e n v i o  e m a i l  y f  i r m a */
  formEmail: FormGroup;
  formFirma: FormGroup;
  updaFirma: FormGroup;
  /** ACTUALIZAR FIRMA */
  public firmaEmail: FirmaEmail = new FirmaEmail();
  public nombreEditFirma: string = "";
  public nombreEditdescrip: string = "";
  public firmasEmail: Array<any> = [];
  seleccionado: string[] = [];
  //saveArchivos: EmailArchivosCon = new EmailArchivosCon();
  saveEmail: EmailContacto = new EmailContacto();
  /** C O M B O  H O R A  Y  M I N U T O*/
  public listaHrs: string[] = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
  public listaMnts: string[] = ["00", "15", "30", "45"];
  /** C O N S U L T  I M G  F I R M A */
  urlPdfs: string = `${environment.endPointBack}/ventasProspectos/getImgFirma/`;

  /** V A L I D A  E L  D I A */
  public validaDia: string;
  /** N G X - S U M M E R N O T E  */
  correo4: any = {

    tabsize: 2,
    height: '400px',
    uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo']],
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontsize', ['fontname', 'color', 'fontsize']],
      ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'link', 'hr']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
  };
  correo5: any = {

    tabsize: 2,
    height: '200px',
    uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo']],
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'link', 'hr']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
  };
  correoEdit: any = {

    tabsize: 2,
    height: '300px',
    uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo']],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['font', ['bold', 'italic']],
      ['para', ['style', 'ul', 'ol', 'paragraph']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
  };
  /**Firma del SUMMER NOTE 2 */

  /** F I N  E M A I L ' S  C A R L O S */


  // CARLOS
  /** V e r  W h a t s */
  public smsWhats: Array<any> = [];
  //Mostrar al Principio
  public otrapantalla = true;
  public emailProgramado = false;
  public updateFirma = false;
  public btnDelete = false;
  public btnActulizar = false;
  // R e g i s t r a r  W h a t s  
  saveSms: WhatsAppContacto = new WhatsAppContacto();
  listSms: any[] = [];
  text = '';

  //T e m a s
  public tTratar: Array<{ temas: string }> = [];
  newInsert: envioW = new envioW();
  pdfInsert: EnviowPdfComponent = new EnviowPdfComponent();
  formTems: FormGroup;

  // Pdf
  public Pdf: Array<{ archivo: string, name: string, size: string, tipoAr: string }> = [];
  public base64textString: string = "";
  public nombrePdf: string = "";
  public size: string = "";
  public tipoAr: string = "";
  selectedFiles: FileList;
  currentFile: File;
  textoDeInput: string = null;
  private pdFile: File;
  private archivos: File[] = [];
  form: FormGroup;

  public nuevoCliente: any;
  public format: any;
  /** F i n  C a r l o s */

  constructor(private menu: IncidenciaService,
    private authService: AuthService,
    private router: Router,
    private ventasService: VentasProspectosService,
    private wApp: AdminReunionService,
    private Pdfs: SmsWhatsService,
    private fb: FormBuilder,
    private spinnerD: NgxSpinnerService) {

    this.formD = fb.group({
      razonSocial: ['', Validators.required],
      nombreComercial: ['', Validators.required],
      correo: ['', Validators.required],
      paginaWeb: ['', Validators.required],
      rfc: ['', Validators.required],
      telefono: ['', Validators.required],
      telefono2: ['', Validators.required],
      direccion: ['', Validators.required],
      pais: ['', Validators.required],
      estado: ['', Validators.required],
      acercaDe: ['', Validators.required],
    });

    this.formC = fb.group({
      contactoNombre: ['', Validators.required],
      contactoWhats: ['', Validators.required],
      contactoCorreo: ['', Validators.required],
      contactoPuesto: ['', Validators.required]
    });

    this.formCS = fb.group({
      contactoSaveNombre: ['', Validators.required],
      contactoSaveWhats: ['', Validators.required],
      contactoSaveCorreo: ['', Validators.required],
      contactoSavePuesto: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    registerLocaleData(LocaleMX, 'es-MX');
    this.menu.setNombrePantalla("VENTAS");
    this.validRol = this.authService.hasRole("ROLE_ADMIN_NAIB");
    if (this.ventasService.expositorGet != null) {
      this.clienteSeleccionado = this.ventasService.expositorGet;
      this.idSelect = this.clienteSeleccionado.id;
      this.ventasService.setexpositorSet(null);
    }
    this.selectedIcon = this.defaultIcon;
    this.selectedColor = this.defaultColor;
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.menu.openEvent.subscribe(h => {
      this.idEventoSelected = h;
      if (this.idEventoSelected != null && this.idEventoSelected != undefined && this.idEventoSelected != 0) {
        this.inicioStatus();
        if (!this.validRol) {
          this.filtroCartera('a')
        } else {
          this.filtroCartera('b')
        }
      }
    });
    this.validaFormH();
    this.envioY = false;

    /**CORREO */
    this.validateFormEmail();
    this.validaFormEmailProgramado();
    this.validateFormFirma();
    this.validateUpdateFirma();
    this.verFirma();
    this.mostrartime();

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.estados.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filtroEstadoEdit(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.estadosEdit.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filtroPaisEdit(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.paisesEdit.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  inicioStatus() {

    if (this.validRol == false) {
      this.clientes = "a";
    } else {
      this.clientes = "b";
      this.consVendedores();
    }
    this.limpiarContadores();
    this.miCartera();
  }

  // Tablas de expositores
  filtroCartera(res) {
    this.estadosEdit = [];
    this.paisesEdit = [];
    this.clientes = res;
    this.historial = false;
    this.historialExpH = [];
    this.infoExpositor = false;
    this.actividades = false;
    this.clienteSeleccionado = null;
    this.carteraExpositor = null;
    this.selectEstatusCrm = null;
    this.selectPrioridadCrm = null;
    this.notasCliente = null;
    this.contactoCliente = null;
    this.actividadesExpositor = null;
    this.estatusEmbudo = null;
    this.miCartera();
    this.idSelect = 0;
    this.sinResultadosMi = false;
    this.sinResultadosGen = false;
  }

  countPaisMisClientes(res) {
    let count = 0;
    this.estadosFiltrados = [];

    this.misClientes2.forEach(element => {
      if (element.expositor.pais === res) {
        count++;
        let xz = element.expositor.pais;
        let x = element.expositor.estado;
        if (x == '') {
          x = "Sin estado";
        }
        let exist = this.estadosFiltrados.includes(x);
        let exist2 = this.estadosEdit.includes(x);
        let exist3 = this.paisesEdit.includes(xz);
        if (!exist) {
          if (x != null) {
            this.estadosFiltrados.push(x);
          }
        }
        if (!exist2) {
          if (x != null && x != "") {
            this.estadosEdit.push(x);
          }
        }
        if (!exist3) {
          if (xz != null && xz != "") {
            this.paisesEdit.push(xz);
          }
        }
      }
    });

    if (this.estadosFiltrados.length > 2) {
      this.estadosFiltrados.sort((a, b) => {
        let x = a.toUpperCase(),
          y = b.toUpperCase();
        return x == y ? 0 : x > y ? 1 : -1;
      });
    }

    return count;
  }

  countPaisClientesGrl(res) {
    let count = 0;
    this.estadosFiltrados = [];

    this.clientesGenerales2.forEach(element => {
      if (element.expositor.pais === res) {
        count++;
        let xz = element.expositor.pais;
        let x = element.expositor.estado;
        if (x == '') {
          x = "Sin estado";
        }
        let exist = this.estadosFiltrados.includes(x);
        let exist2 = this.estadosEdit.includes(x);
        let exist3 = this.paisesEdit.includes(xz);

        if (!exist) {
          if (x != null) {
            this.estadosFiltrados.push(x);
          }
        }
        if (!exist2) {
          if (x != null && x != "") {
            this.estadosEdit.push(x);
          }
        }
        if (!exist3) {
          if (xz != null && xz != "") {
            this.paisesEdit.push(xz);
          }
        }
      }
    });

    if (this.estadosFiltrados.length > 2) {
      this.estadosFiltrados.sort((a, b) => {
        let x = a.toUpperCase(),
          y = b.toUpperCase();
        return x == y ? 0 : x > y ? 1 : -1;
      });
    }

    return count;
  }

  countEstadoClientesGrl(res, res2) {

    let count = 0;
    this.clientesGenerales2.forEach(element => {
      if (element.expositor.estado === res && element.expositor.pais === res2) {
        count++;
      }
    });
    return count;
  }

  countEstadoMisClientes(res, res2) {
    let count = 0;
    this.misClientes2.forEach(element => {
      if (element.expositor.estado === res && element.expositor.pais === res2) {
        count++;
      }
    });
    return count;
  }

  miCartera() {

    this.consVendedores();
    if (this.searchModel.length == 0 && this.searchPrioridad == 0) {
      this.spinnerD.show("crmSpinner");
      this.misClientes = [];
      this.misClientes2 = [];
      this.clientesGenerales = [];
      this.clientesGenerales2 = [];
      this.paisesFiltrados = [];
      this.paisesFiltrados2 = [];
      this.estadosFiltrados = [];
      this.getAllExpositores();
      this.ventasService.getMisExpositores(this.idEventoSelected).subscribe((result) => {
        if (result.length == 0) {
          return this.misClientes = null;
        }

        this.misClientes = result;
        this.misClientes2 = result;

        this.paisesFiltrados = [];
        this.misClientes2.forEach(element => {
          let x = element.expositor.pais;
          if (x == '') {
            x = "Sin país";
          }
          let exist = this.paisesFiltrados.includes(x);
          if (!exist) {
            if (x != null) {
              this.paisesFiltrados.push(x);
            }
          }
        });

        this.ordenarArrayPaises(1);

      }, error => {
        this.errorHTTP(error.status);
      })
    } else if (this.searchModel.length != 0) {
      this.buscador();
    } else if (this.searchPrioridad != 0) {
      this.buscarPrioridad();
    } else if (this.estatusEmbudo != null) {
      this.filtrarEstatusEmbudo(this.estatusEmbudo);
    }
  }

  getAllExpositores() {

    this.ventasService.getAllExpositores(this.idEventoSelected).subscribe((result) => {
      // S P I N N E R
      this.spinnerD.hide("crmSpinner");

      if (result.length == 0) {
        return this.clientesGenerales = null;
      }
      this.clientesGenerales = result;
      this.clientesGenerales2 = result;
      this.paisesFiltrados2 = [];
      this.clientesGenerales2.forEach(element => {
        let x = element.expositor.pais;
        if (x == '') {
          x = "Sin país";
        }
        let exist = this.paisesFiltrados2.includes(x);
        if (!exist) {
          if (x != null) {
            this.paisesFiltrados2.push(x);
          }
        }
      });

      this.ordenarArrayPaises(2);


      this.limpiarContadores();
      this.clientesGenerales.forEach(element => {
        if (element.expositor.estatusCrm == "0") {
          this.countProspecto = this.countProspecto + 1;
        } else if (element.expositor.estatusCrm == "1") {
          this.countContactado = this.countContactado + 1;
        } else if (element.expositor.estatusCrm == "2") {
          this.countPosibleCliente = this.countPosibleCliente + 1;
        } else if (element.expositor.estatusCrm == "3") {
          this.countCotizado = this.countCotizado + 1;
        } else if (element.expositor.estatusCrm == "4") {
          this.countCotizacionR = this.countCotizacionR + 1;
        } else if (element.expositor.estatusCrm == "5") {
          this.countCotizacionA = this.countCotizacionA + 1;
        }
      });
      if (this.infoExpositor == true) {
        if (this.getExpoSelected == 1) {
          this.miExpositorSelected(this.getResExpoSelected);
        } else if (this.getExpoSelected == 2) {
          this.genExpositorSelected(this.getResExpoSelected);
        }
      }
    }, error => {
      this.errorHTTP(error.status);
    })
  }

  ordenarArrayPaises(res) {
    if (res == 1) {
      this.paisesFiltrados.sort((a, b) => {
        let x = a.toUpperCase(),
          y = b.toUpperCase();
        return x == y ? 0 : x > y ? 1 : -1;
      });

    } else if (res == 2) {
      this.paisesFiltrados2.sort((a, b) => {
        let x = a.toUpperCase(),
          y = b.toUpperCase();
        return x == y ? 0 : x > y ? 1 : -1;
      });
    }
  }

  // Buscadores y Filtros

  buscarPrioridad() {
    this.sinResultadosMi = false;
    this.sinResultadosGen = false;

    if (this.misClientes != null) {

      if (this.searchPrioridad == 0) {
        this.misClientes2 = this.misClientes;
      }

      if (this.searchPrioridad != 0) {
        var value;
        if (this.searchPrioridad == 3) {
          value = 0;
        } else {
          value = this.searchPrioridad;
        }
        this.misClientes2 = this.misClientes.filter(val => val.expositor.prioridad == value);
      }

      //Buscador
      if (this.searchModel.length > 0) {
        this.misClientes2 = this.misClientes2.filter(
          (val) => val.expositor['nombre_comercial'].toLowerCase().includes(this.searchModel.toLowerCase())
            || val.expositor['razon_social'].toLowerCase().includes(this.searchModel.toLowerCase()));
      }

      //Vendedor
      if (this.searchVendedores != 0) {
        this.misClientes2 = this.misClientes2.filter(val => val.vendedor.id == this.searchVendedores);
      }

      //Embudo
      if (this.estatusEmbudo != null) {
        this.misClientes2 = this.misClientes2.filter(val => val.expositor.estatusCrm == this.estatusEmbudo);
      }

      //Estados
      if (this.selectEstadosCollapsible != "0") {
        this.misClientes2 = this.misClientes2.filter(val => val.expositor.estado == this.selectEstadosCollapsible);
      }

      //Ordenamiento
      this.paisesFiltrados = [];
      this.misClientes2.forEach(element => {
        let x = element.expositor.pais;
        if (x == '') {
          x = "Sin país";
        }
        let exist = this.paisesFiltrados.includes(x);
        if (!exist) {
          this.paisesFiltrados.push(x);
        }
      });
      this.ordenarArrayPaises(1);

      if (this.misClientes2.length == 0) {
        this.sinResultadosMi = true;
      } else {
        this.sinResultadosMi = false;
      }
    }

    if (this.clientesGenerales != null) {

      if (this.searchPrioridad == 0) {
        this.clientesGenerales2 = this.clientesGenerales;
      }

      if (this.searchPrioridad != 0) {
        var value;
        if (this.searchPrioridad == 3) {
          value = 0;
        } else {
          value = this.searchPrioridad;
        }
        this.clientesGenerales2 = this.clientesGenerales.filter(val => val.expositor.prioridad == value);
      }

      //Buscador
      if (this.searchModel.length > 0) {
        this.clientesGenerales2 = this.clientesGenerales2.filter(
          (val) => val.expositor['nombre_comercial'].toLowerCase().includes(this.searchModel.toLowerCase())
            || val.expositor['razon_social'].toLowerCase().includes(this.searchModel.toLowerCase()));
      }

      //Vendedor
      if (this.searchVendedores != 0) {
        this.clientesGenerales2 = this.clientesGenerales2.filter(val => val.vendedor.id == this.searchVendedores);
      }

      //Embudo
      if (this.estatusEmbudo != null) {
        this.clientesGenerales2 = this.clientesGenerales2.filter(val => val.expositor.estatusCrm == this.estatusEmbudo);
      }

      //Estados
      if (this.selectEstadosCollapsible != "0") {
        this.clientesGenerales2 = this.clientesGenerales2.filter(val => val.expositor.estado == this.selectEstadosCollapsible);
      }

      //Ordenamiento
      this.paisesFiltrados2 = [];
      this.clientesGenerales2.forEach(element => {
        let x = element.expositor.pais;
        if (x == '') {
          x = "Sin país";
        }
        let exist = this.paisesFiltrados2.includes(x);
        if (!exist) {
          this.paisesFiltrados2.push(x);
        }
      });
      this.ordenarArrayPaises(2);

      if (this.clientesGenerales2.length === 0) {
        this.sinResultadosGen = true;
      } else {
        this.sinResultadosGen = false;
      }
    }
  }

  cambiarPais() {
    this.sinResultadosMi = false;
    this.sinResultadosGen = false;

    if (this.misClientes != null) {

      if (this.selectEstadosCollapsible == "0") {
        this.misClientes2 = this.misClientes;
      }

      //Estados
      if (this.selectEstadosCollapsible != "0") {
        this.misClientes2 = this.misClientes.filter(val => val.expositor.estado == this.selectEstadosCollapsible);
      }

      //Buscador
      if (this.searchModel.length > 0) {
        this.misClientes2 = this.misClientes2.filter(
          (val) => val.expositor['nombre_comercial'].toLowerCase().includes(this.searchModel.toLowerCase())
            || val.expositor['razon_social'].toLowerCase().includes(this.searchModel.toLowerCase()));
      }

      //Prioridad
      if (this.searchPrioridad != 0) {
        var value;
        if (this.searchPrioridad == 3) {
          value = 0;
        } else {
          value = this.searchPrioridad;
        }
        this.misClientes2 = this.misClientes2.filter(val => val.expositor.prioridad == value);
      }

      //Vendedor
      if (this.searchVendedores != 0) {
        this.misClientes2 = this.misClientes2.filter(val => val.vendedor.id == this.searchVendedores);
      }

      //Embudo
      if (this.estatusEmbudo != null) {
        this.misClientes2 = this.misClientes2.filter(val => val.expositor.estatusCrm == this.estatusEmbudo);
      }

      //Ordenamiento
      this.paisesFiltrados = [];
      this.misClientes2.forEach(element => {
        let x = element.expositor.pais;
        if (x == '') {
          x = "Sin país";
        }
        let exist = this.paisesFiltrados.includes(x);
        if (!exist) {
          this.paisesFiltrados.push(x);
        }
      });
      this.ordenarArrayPaises(1);

      if (this.misClientes2.length == 0) {
        this.sinResultadosMi = true;
      } else {
        this.sinResultadosMi = false;
      }


    }

    if (this.clientesGenerales != null) {
      if (this.selectEstadosCollapsible == "0") {
        this.clientesGenerales2 = this.clientesGenerales;
      }

      //Estados
      if (this.selectEstadosCollapsible != "0") {
        this.clientesGenerales2 = this.clientesGenerales.filter(val => val.expositor.estado == this.selectEstadosCollapsible);
      }

      //Buscador
      if (this.searchModel.length > 0) {
        this.clientesGenerales2 = this.clientesGenerales2.filter(
          (val) => val.expositor['nombre_comercial'].toLowerCase().includes(this.searchModel.toLowerCase())
            || val.expositor['razon_social'].toLowerCase().includes(this.searchModel.toLowerCase()));
      }

      //Prioridad
      if (this.searchPrioridad != 0) {
        var value;
        if (this.searchPrioridad == 3) {
          value = 0;
        } else {
          value = this.searchPrioridad;
        }
        this.clientesGenerales2 = this.clientesGenerales2.filter(val => val.expositor.prioridad == value);
      }

      //Vendedor
      if (this.searchVendedores != 0) {
        this.clientesGenerales2 = this.clientesGenerales2.filter(val => val.vendedor.id == this.searchVendedores);
      }

      //Embudo
      if (this.estatusEmbudo != null) {
        this.clientesGenerales2 = this.clientesGenerales2.filter(val => val.expositor.estatusCrm == this.estatusEmbudo);
      }

      //Ordenamiento
      this.paisesFiltrados2 = [];
      this.clientesGenerales2.forEach(element => {
        let x = element.expositor.pais;
        if (x == '') {
          x = "Sin país";
        }
        let exist = this.paisesFiltrados2.includes(x);
        if (!exist) {
          this.paisesFiltrados2.push(x);
        }
      });
      this.ordenarArrayPaises(2);

      if (this.clientesGenerales2.length === 0) {
        this.sinResultadosGen = true;
      } else {
        this.sinResultadosGen = false;
      }

    }
  }

  filtrarEstatusEmbudo(res) {

    this.estatusEmbudo = res;
    this.sinResultadosMi = false;
    this.sinResultadosGen = false;

    if (this.misClientes != null) {

      if (this.estatusEmbudo == null) {
        this.misClientes2 = this.misClientes;
      }

      if (this.estatusEmbudo != null) {
        this.misClientes2 = this.misClientes.filter(val => val.expositor.estatusCrm == this.estatusEmbudo);
      }

      //Buscador
      if (this.searchModel.length > 0) {
        this.misClientes2 = this.misClientes2.filter(
          (val) => val.expositor['nombre_comercial'].toLowerCase().includes(this.searchModel.toLowerCase())
            || val.expositor['razon_social'].toLowerCase().includes(this.searchModel.toLowerCase()));
      }

      //Prioridad
      if (this.searchPrioridad != 0) {
        var value;
        if (this.searchPrioridad == 3) {
          value = 0;
        } else {
          value = this.searchPrioridad;
        }
        this.misClientes2 = this.misClientes2.filter(val => val.expositor.prioridad == value);
      }

      //Vendedor
      if (this.searchVendedores != 0) {
        this.misClientes2 = this.misClientes2.filter(val => val.vendedor.id == this.searchVendedores);
      }

      //Estados
      if (this.selectEstadosCollapsible != "0") {
        this.misClientes2 = this.misClientes2.filter(val => val.expositor.estado == this.selectEstadosCollapsible);
      }

      //Ordenamiento
      this.paisesFiltrados = [];
      this.misClientes2.forEach(element => {
        let x = element.expositor.pais;
        if (x == '') {
          x = "Sin país";
        }
        let exist = this.paisesFiltrados.includes(x);
        if (!exist) {
          this.paisesFiltrados.push(x);
        }
      });
      this.ordenarArrayPaises(1);

      if (this.misClientes2.length == 0) {
        this.sinResultadosMi = true;
      } else {
        this.sinResultadosMi = false;
      }

    }

    if (this.clientesGenerales != null) {

      if (this.estatusEmbudo == null) {
        this.clientesGenerales2 = this.clientesGenerales;
      }

      if (this.estatusEmbudo != null) {
        this.clientesGenerales2 = this.clientesGenerales.filter(val => val.expositor.estatusCrm == this.estatusEmbudo);
      }

      //Buscador
      if (this.searchModel.length > 0) {
        this.clientesGenerales2 = this.clientesGenerales2.filter(
          (val) => val.expositor['nombre_comercial'].toLowerCase().includes(this.searchModel.toLowerCase())
            || val.expositor['razon_social'].toLowerCase().includes(this.searchModel.toLowerCase()));
      }

      //Prioridad
      if (this.searchPrioridad != 0) {
        var value;
        if (this.searchPrioridad == 3) {
          value = 0;
        } else {
          value = this.searchPrioridad;
        }
        this.clientesGenerales2 = this.clientesGenerales2.filter(val => val.expositor.prioridad == value);
      }

      //Vendedor
      if (this.searchVendedores != 0) {
        this.clientesGenerales2 = this.clientesGenerales2.filter(val => val.vendedor.id == this.searchVendedores);
      }

      //Estados
      if (this.selectEstadosCollapsible != "0") {
        this.clientesGenerales2 = this.clientesGenerales2.filter(val => val.expositor.estado == this.selectEstadosCollapsible);
      }

      //Ordenamiento
      this.paisesFiltrados2 = [];
      this.clientesGenerales2.forEach(element => {
        let x = element.expositor.pais;
        if (x == '') {
          x = "Sin país";
        }
        let exist = this.paisesFiltrados2.includes(x);
        if (!exist) {
          this.paisesFiltrados2.push(x);
        }
      });
      this.ordenarArrayPaises(2);

      if (this.clientesGenerales2.length === 0) {
        this.sinResultadosGen = true;
      } else {
        this.sinResultadosGen = false;
      }
    }

  }

  filtroVendedor() {

    this.sinResultadosMi = false;
    this.sinResultadosGen = false;

    if (this.misClientes != null) {

      if (this.searchVendedores == 0) {
        this.misClientes2 = this.misClientes;
      }

      if (this.searchVendedores != 0) {
        this.misClientes2 = this.misClientes.filter(val => val.vendedor.id == this.searchVendedores);
      }

      //Buscador
      if (this.searchModel.length > 0) {
        this.misClientes2 = this.misClientes2.filter(
          (val) => val.expositor['nombre_comercial'].toLowerCase().includes(this.searchModel.toLowerCase())
            || val.expositor['razon_social'].toLowerCase().includes(this.searchModel.toLowerCase()));
      }

      //Prioridad
      if (this.searchPrioridad != 0) {
        var value;
        if (this.searchPrioridad == 3) {
          value = 0;
        } else {
          value = this.searchPrioridad;
        }
        this.misClientes2 = this.misClientes2.filter(val => val.expositor.prioridad == value);
      }

      //Embudo
      if (this.estatusEmbudo != null) {
        this.misClientes2 = this.misClientes2.filter(val => val.expositor.estatusCrm == this.estatusEmbudo);
      }

      //Estados
      if (this.selectEstadosCollapsible != "0") {
        this.misClientes2 = this.misClientes2.filter(val => val.expositor.estado == this.selectEstadosCollapsible);
      }

      //Ordenamiento
      this.paisesFiltrados = [];
      this.misClientes2.forEach(element => {
        let x = element.expositor.pais;
        if (x == '') {
          x = "Sin país";
        }
        let exist = this.paisesFiltrados.includes(x);
        if (!exist) {
          this.paisesFiltrados.push(x);
        }
      });
      this.ordenarArrayPaises(1);

      if (this.misClientes2.length == 0) {
        this.sinResultadosMi = true;
      } else {
        this.sinResultadosMi = false;
      }
    }

    if (this.clientesGenerales != null) {

      if (this.searchVendedores == 0) {
        this.clientesGenerales2 = this.clientesGenerales;
      }

      if (this.searchVendedores != 0) {
        this.clientesGenerales2 = this.clientesGenerales.filter(val => val.vendedor.id == this.searchVendedores);
      }

      //Buscador
      if (this.searchModel.length > 0) {
        this.clientesGenerales2 = this.clientesGenerales2.filter(
          (val) => val.expositor['nombre_comercial'].toLowerCase().includes(this.searchModel.toLowerCase())
            || val.expositor['razon_social'].toLowerCase().includes(this.searchModel.toLowerCase()));
      }

      //Prioridad
      if (this.searchPrioridad != 0) {
        var value;
        if (this.searchPrioridad == 3) {
          value = 0;
        } else {
          value = this.searchPrioridad;
        }
        this.clientesGenerales2 = this.clientesGenerales2.filter(val => val.expositor.prioridad == value);
      }

      //Embudo
      if (this.estatusEmbudo != null) {
        this.clientesGenerales2 = this.clientesGenerales2.filter(val => val.expositor.estatusCrm == this.estatusEmbudo);
      }

      //Estados
      if (this.selectEstadosCollapsible != "0") {
        this.clientesGenerales2 = this.clientesGenerales2.filter(val => val.expositor.estado == this.selectEstadosCollapsible);
      }

      //Ordenamiento
      this.paisesFiltrados2 = [];
      this.clientesGenerales2.forEach(element => {
        let x = element.expositor.pais;
        if (x == '') {
          x = "Sin país";
        }
        let exist = this.paisesFiltrados2.includes(x);
        if (!exist) {
          this.paisesFiltrados2.push(x);
        }
      });
      this.ordenarArrayPaises(2);

      if (this.clientesGenerales2.length === 0) {
        this.sinResultadosGen = true;
      } else {
        this.sinResultadosGen = false;
      }
    }

  }

  buscador() {

    this.sinResultadosMi = false;
    this.sinResultadosGen = false;

    if (this.misClientes != null) {

      if (this.searchModel.length == 0) {
        this.misClientes2 = this.misClientes;
      }

      //Buscador
      if (this.searchModel.length > 0) {
        this.misClientes2 = this.misClientes.filter(
          (val) => val.expositor['nombre_comercial'].toLowerCase().includes(this.searchModel.toLowerCase())
            || val.expositor['razon_social'].toLowerCase().includes(this.searchModel.toLowerCase()));
      }


      //Prioridad
      if (this.searchPrioridad != 0) {
        var value;
        if (this.searchPrioridad == 3) {
          value = 0;
        } else {
          value = this.searchPrioridad;
        }
        this.misClientes2 = this.misClientes2.filter(val => val.expositor.prioridad == value);
      }
      //Embudo
      if (this.estatusEmbudo != null) {
        this.misClientes2 = this.misClientes2.filter(val => val.expositor.estatusCrm == this.estatusEmbudo);
      }
      //Vendedor
      if (this.searchVendedores != 0) {
        this.misClientes2 = this.misClientes2.filter(val => val.vendedor.id == this.searchVendedores);
      }

      //Estados
      if (this.selectEstadosCollapsible != "0") {
        this.misClientes2 = this.misClientes2.filter(val => val.expositor.estado == this.selectEstadosCollapsible);
      }

      //Ordenamiento
      this.paisesFiltrados = [];
      this.misClientes2.forEach(element => {
        let x = element.expositor.pais;
        if (x == '') {
          x = "Sin país";
        }
        let exist = this.paisesFiltrados.includes(x);
        if (!exist) {
          this.paisesFiltrados.push(x);
        }
      });
      this.ordenarArrayPaises(1);

      if (this.misClientes2.length == 0) {
        this.sinResultadosMi = true;
      } else {
        this.sinResultadosMi = false;
      }

    }

    if (this.clientesGenerales != null) {

      if (this.searchModel.length == 0) {
        this.clientesGenerales2 = this.clientesGenerales;
      }

      //Buscador
      if (this.searchModel.length > 0) {
        this.clientesGenerales2 = this.clientesGenerales.filter(
          (val) => val.expositor['nombre_comercial'].toLowerCase().includes(this.searchModel.toLowerCase())
            || val.expositor['razon_social'].toLowerCase().includes(this.searchModel.toLowerCase()));
      }

      //Prioridad
      if (this.searchPrioridad != 0) {
        var value;
        if (this.searchPrioridad == 3) {
          value = 0;
        } else {
          value = this.searchPrioridad;
        }
        this.clientesGenerales2 = this.clientesGenerales2.filter(val => val.expositor.prioridad == value);
      }
      //Embudo
      if (this.estatusEmbudo != null) {
        this.clientesGenerales2 = this.clientesGenerales2.filter(val => val.expositor.estatusCrm == this.estatusEmbudo);
      }
      //Vendedor
      if (this.searchVendedores != 0) {
        this.clientesGenerales2 = this.clientesGenerales2.filter(val => val.vendedor.id == this.searchVendedores);
      }

      //Estados
      if (this.selectEstadosCollapsible != "0") {
        this.clientesGenerales2 = this.clientesGenerales2.filter(val => val.expositor.estado == this.selectEstadosCollapsible);
      }

      //Ordenamiento
      this.paisesFiltrados2 = [];
      this.clientesGenerales2.forEach(element => {
        let x = element.expositor.pais;
        if (x == '') {
          x = "Sin país";
        }
        let exist = this.paisesFiltrados2.includes(x);
        if (!exist) {
          this.paisesFiltrados2.push(x);
        }
      });
      this.ordenarArrayPaises(2);

      if (this.clientesGenerales2.length === 0) {
        this.sinResultadosGen = true;
      } else {
        this.sinResultadosGen = false;
      }
    }
  }

  // Expositor seleccionado
  miExpositorSelected(res) {
    //RES ID EXPOSITOR
    this.infoExpositor = true;
    this.idSelect = res;

    this.misClientes2.forEach(element => {
      if (element.expositor.id === res) {
        this.carteraExpositor = element;
        this.clienteSeleccionado = element.expositor;
      }
    });

    this.selectEstatusCrm = this.clienteSeleccionado.estatusCrm;
    if (this.selectEstatusCrm == 0) {
      this.estatusClaseCRM = "bg-danger";
    } else if (this.selectEstatusCrm == 1) {
      this.estatusClaseCRM = "bg-orange";
    } else if (this.selectEstatusCrm == 2) {
      this.estatusClaseCRM = "bg-yellow";
    } else if (this.selectEstatusCrm == 3) {
      this.estatusClaseCRM = "bg-primary";
    } else if (this.selectEstatusCrm == 4) {
      this.estatusClaseCRM = "bg-secondary";
    } else if (this.selectEstatusCrm == 5) {
      this.estatusClaseCRM = "bg-success";
    }
    this.selectPrioridadCrm = this.clienteSeleccionado.prioridad;
    this.consultNotas(this.clienteSeleccionado.id);
    this.consultContactos(this.clienteSeleccionado.id);
    this.getExpoSelected = 1;
    this.getResExpoSelected = res;
    this.getHistorialCrm(this.carteraExpositor.id);
  }

  genExpositorSelected(res) {
    //RES ID EXPOSITOR
    this.infoExpositor = true;
    this.idSelect = res;

    this.clientesGenerales2.forEach(element => {
      if (element.expositor.id === res) {
        this.carteraExpositor = element;
        this.clienteSeleccionado = element.expositor;
      }
    });

    this.selectEstatusCrm = this.clienteSeleccionado.estatusCrm;
    if (this.selectEstatusCrm == 0) {
      this.estatusClaseCRM = "bg-danger";
    } else if (this.selectEstatusCrm == 1) {
      this.estatusClaseCRM = "bg-orange";
    } else if (this.selectEstatusCrm == 2) {
      this.estatusClaseCRM = "bg-yellow";
    } else if (this.selectEstatusCrm == 3) {
      this.estatusClaseCRM = "bg-primary";
    } else if (this.selectEstatusCrm == 4) {
      this.estatusClaseCRM = "bg-secondary";
    } else if (this.selectEstatusCrm == 5) {
      this.estatusClaseCRM = "bg-success";
    }
    this.selectPrioridadCrm = this.clienteSeleccionado.prioridad;
    this.consultNotas(this.clienteSeleccionado.id);
    this.consultContactos(this.clienteSeleccionado.id);
    this.getExpoSelected = 2;
    this.getResExpoSelected = res;
    this.getHistorialCrm(this.carteraExpositor.id);
  }

  // CHANGE Status CRM y Prioridad
  cambiarStatusCrm() {

    this.ventasService.updateStatusCrm(this.clienteSeleccionado.estatusCrm, this.selectEstatusCrm, this.clienteSeleccionado.id, this.carteraExpositor.id).subscribe((result) => {
      if (result) {
        if (this.infoExpositor == true) {
          if (this.getExpoSelected == 1) {
            this.clienteSeleccionado.estatusCrm = this.selectEstatusCrm;
            for (var i = 0; i < this.misClientes2.length; i++) {
              if (this.misClientes2[i].expositor.id === this.clienteSeleccionado.id) {
                this.miExpositorSelected(i);
              }
            }
          } else if (this.getExpoSelected == 2) {
            this.clienteSeleccionado.estatusCrm = this.selectEstatusCrm;
            for (var i = 0; i < this.clientesGenerales2.length; i++) {
              if (this.clientesGenerales2[i].expositor.id === this.clienteSeleccionado.id) {
                this.genExpositorSelected(i);
              }
            }
          }
          this.getAllExpositores();
        }
        Swal.fire('Estatus actualizado.', ``, 'success');
      }
    }, error => {
      this.errorHTTP(error.status);
    })
  }

  cambiarPrioridadCrm() {
    this.ventasService.updatePrioridad(this.clienteSeleccionado.prioridad, this.selectPrioridadCrm, this.clienteSeleccionado.id, this.carteraExpositor.id).subscribe((result) => {
      if (result) {
        if (this.infoExpositor == true) {
          if (this.getExpoSelected == 1) {
            this.clienteSeleccionado.prioridad = this.selectPrioridadCrm;
            for (var i = 0; i < this.misClientes2.length; i++) {
              if (this.misClientes2[i].expositor.id === this.clienteSeleccionado.id) {
                this.miExpositorSelected(i);
              }
            }
          } else if (this.getExpoSelected == 2) {
            this.clienteSeleccionado.prioridad = this.selectPrioridadCrm;
            for (var i = 0; i < this.clientesGenerales2.length; i++) {
              if (this.clientesGenerales2[i].expositor.id === this.clienteSeleccionado.id) {
                this.genExpositorSelected(i);
              }
            }
          }
        }
        this.getAllExpositores();
        Swal.fire('Estatus actualizado.', ``, 'success');
      }
    }, error => {
      this.errorHTTP(error.status);
    })
  }

  // Notas del expositor seleccionado
  consultNotas(res) {
    this.ventasService.getNotasExpositor(res).subscribe((result) => {
      if (result.length == 0) {
        return this.notasCliente = null;
      }
      this.notasCliente = result;
    }, error => {
      this.errorHTTP(error.status);
    })
  }

  guardarNewNota() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success ml-1',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: '¿Registrar nota?',
      text: this.inptNewNota,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.ventasService.createNewNota(this.inptNewNota, this.clienteSeleccionado.id).subscribe((result) => {
          this.consultNotas(this.clienteSeleccionado.id);
          this.inptNewNota = null;
          swalWithBootstrapButtons.fire(
            '¡Registrada!',
            '',
            'success'
          )
        }, error => {
          this.errorHTTP(error.status);
        })
      }
    })
  }

  // Contactos del expositor seleccionado
  consultContactos(res) {
    this.ventasService.getContactoExpositor(res).subscribe((result) => {
      if (result.length == 0) {
        return this.contactoCliente = null;
      }

      this.contactoCliente = result;
    }, error => {
      this.errorHTTP(error.status);
    })
  }

  eliminarContacto(res) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success ml-1',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: '¿Eliminar contacto?',
      text: '¡No podrás revertir cambios!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.ventasService.deleteContacto(this.contactoCliente[res].id).subscribe((result) => {
          this.consultContactos(this.clienteSeleccionado.id);
          swalWithBootstrapButtons.fire(
            '¡Contacto eliminado!',
            '',
            'success'
          )
        }, error => {
          this.errorHTTP(error.status);
        })
      }
    })
  }

  enviarDatosContactoEditar(res) {
    this.borrarImgInciG();
    this.nombreEditContacto = this.contactoCliente[res].nombre;
    this.puestoEditContacto = this.contactoCliente[res].puesto;
    this.idEditContacto = this.contactoCliente[res].id;
    this.telefonoEditContacto = this.contactoCliente[res].telefono;
    this.emailEditContacto = this.contactoCliente[res].email;
  }

  updateContacto() {
    if (!this.fotoEvidencia) {

      this.ventasService.uploadContacto(this.idEditContacto, this.nombreEditContacto, this.telefonoEditContacto, this.emailEditContacto, this.puestoEditContacto).subscribe((result) => {
        if (result) {
          this.consultContactos(this.clienteSeleccionado.id);
          var x = document.getElementById("btnCloseModalContacto");
          x.click();
          Swal.fire('¡Contacto editado!', ``, 'success');
        }
      }, error => {
        this.errorHTTP(error.status);
      })
    } else {

      this.ventasService.uploadFotoContacto(this.idEditContacto, this.fotoEvidencia, this.nombreEditContacto, this.telefonoEditContacto, this.emailEditContacto, this.puestoEditContacto).subscribe((result) => {
        if (result) {
          this.consultContactos(this.clienteSeleccionado.id);
          var x = document.getElementById("btnCloseModalContacto");
          x.click();
          Swal.fire('¡Contacto editado!', ``, 'success');
          this.fotoEvidencia = this.emptyFile;
          $("#subirImg").val("");
        }
      }, error => {
        this.errorHTTP(error.status);
      })
    }
    document.getElementById("btnSubirFoto").style.display = "block";
    document.getElementById("btnEliminarFoto").style.display = "none";
  }

  seleccionarFoto(event) {
    this.fotoEvidencia = event.target.files[0];
    if (this.fotoEvidencia.type.indexOf('image') < 0) {
      Swal.fire('Error', 'Debe de seleccionar una foto', 'error');
      this.fotoEvidencia = this.emptyFile;
    } else {
      var reader = new FileReader();
      reader.readAsDataURL(this.fotoEvidencia);
      reader.onload = (e) => {
        this.ShowFoto = reader.result;

        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success ml-1',
            cancelButton: 'btn btn-danger'
          },
          buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
          title: '¿Subir imagen de contacto?',
          html: '<img src="' + this.ShowFoto + '" style="width: 300px;">',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            document.getElementById("btnSubirFoto").style.display = "none";
            document.getElementById("btnEliminarFoto").style.display = "block";
          } else {
            this.fotoEvidencia = this.emptyFile;
          }
          $("#subirImg").val("");
        })
      }
    }
  }

  borrarImgInciG() {
    $("#subirImg").val("");
    this.fotoEvidencia = this.emptyFile;
    document.getElementById("btnEliminarFoto").style.display = 'none';
    document.getElementById("btnSubirFoto").style.display = "block";
  }

  /** C A R L O S */
  fechasH: string[] = [];
  getSmsW(res) {
    this.fechasH = [];
    this.ventasService.getsmsWhast(res).subscribe((result) => {
      if (result.length == 0) {
        return this.smsWhats = null;
      }
      this.smsWhats = result;
      this.smsWhats.forEach(element => {
        let x = formatDate(element.creacion, 'dd-MM-yyyy', 'en');
        let exist = this.fechasH.includes(x);
        if (!exist) {
          this.fechasH.push(x);
        }
      });
    }, error => {
      this.errorHTTP(error.status);
    })
  }

  getSmsWFecha(fecha) {
    let mensajes: any[] = [];
    mensajes = this.smsWhats.filter(h => formatDate(h.creacion, 'dd-MM-yyyy', 'en') == fecha);
    return mensajes;
  }
  // FUNCIÓN PARA CARLOS
  enviarContacto(res) {
    // console.log(this.contactoCliente[res]);

    this.contactoCliente[res].telefono;
    this.contactoCliente[res].expositor.id;
    this.contactoCliente[res].expositor.nombre_comercial;
    this.contactoCliente[res].expositor.telefono;
    this.nuevoCliente = this.contactoCliente[res];
    this.nuevoEmail = this.contactoCliente[res];
    this.getSmsW(this.contactoCliente[res].id);
    this.getshowEmail(this.contactoCliente[res].id);
    //console.log( this.getEmail(this.contactoCliente[res].id));
  }


  /** F i n  C A R L O S */


  // Actividades
  consultActividades(res1, res2) {
    this.ventasService.getActividadExpositor(res1, res2).subscribe((result) => {
      if (result.length == 0) {
        this.actividades = false;
        return this.actividadesExpositor = null;
      }
      this.actividadesExpositor = result;
      this.actividades = true;
    }, error => {
      this.errorHTTP(error.status);
    })
  }

  registrarActividad() {

    var selectTemporal;
    if (this.selectTipoActividad == "5") {
      selectTemporal = "0";
    } else {
      selectTemporal = this.selectTipoActividad;
    }

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-sm btn-success m-1',
        cancelButton: 'btn btn-sm btn-danger'
      },
      buttonsStyling: false
    })

    this.ventasService.createNewActividad(selectTemporal, this.inptDescripcionAct, this.inptAccionTomar, this.carteraExpositor.id).subscribe((actividad) => {
      this.consultActividades(this.clienteSeleccionado.id, this.idEventoSelected);

      swalWithBootstrapButtons.fire({
        title: '¡Actividad registrada!',
        text: "¿Deseas agregar esta actividad al Calendario?",
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Si, agregar',
        cancelButtonText: 'No',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.ventasService.getListasCalendario(this.authService.user.id, this.idEventoSelected).subscribe((result) => {
            if (result) {
              this.listCalendario = result.lstEventoCalendario;

            }
          }, error => {
            this.errorHTTP(error.status);
          })
          this.actividadCalendario = actividad;
          let fecha = new Date();
          this.minDate = formatDate(fecha, 'yyyy-MM-dd', 'es-MX');
          let f = fecha.getFullYear() + 1 + '-12-31';
          this.maxDate = formatDate(f, 'yyyy-MM-dd', 'es-MX');
          this.selectListas = 0;
          this.tituloTarea = "";
          this.notas = "";
          this.subtarea = "";
          this.listSubtarea = [];
    
          var z = document.getElementById("abrirModalCalendario");
          z.click();
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) { }
      })
      this.selectTipoActividad = "1";
      this.inptAccionTomar = null;
      this.inptDescripcionAct = null;
      this.getHistorialCrm(this.carteraExpositor.id);
    }, error => {
      this.errorHTTP(error.status);
    })
  }

  asignColor(color) {
    this.selectedColor = color;
  }

  asignIcon(icon) {
    this.selectedIcon.selected = false;
    this.selectedIcon = icon;
    icon.selected = true;
  }

  changeListas(event) {
    this.listCalendario.forEach(element => {
      if (element.id == event.value) {
        this.tituloLista = element.titulo;
        this.selectedColor = this.coloresForm[element.color];
        this.selectedIcon.icon = element.icono;
        this.selectedLista = element;
      }
    });
  }

  saveNewLista() {
    let lis: ListaCalendario = new ListaCalendario();
    lis.id = null;
    lis.bootstrapColor = this.selectedColor;
    lis.titulo = this.tituloLista;
    lis.icono = this.selectedIcon.icon;
    lis.lstEventoCalendario = [];
    lis.eventosToday = 0;
    lis.color = this.selectedColor.id;
    this.ventasService.saveListaCalendario(lis, this.authService.user.id).subscribe((result) => {
      if (result) {
        Swal.fire({
          icon: 'success',
          title: 'Lista creada!',
          showConfirmButton: false,
          timer: 1000
        })
        this.listCalendario.push(result);
        this.selectedLista = result;
        this.selectListas = result.id;
        this.formularioLista = false;
        document.getElementById("crearLista").style.display = 'none';
        document.getElementById("crearEvento").style.display = 'block';
      }
    }, error => {
      this.errorHTTP(error.status);
    })
  }

  newLista() {
    if (this.formularioLista == true) {
      this.formularioLista = false;
      document.getElementById("crearLista").style.display = 'none';
      document.getElementById("crearEvento").style.display = 'block';
    } else {
      this.formularioLista = true;
      document.getElementById("crearLista").style.display = 'block';
      document.getElementById("crearEvento").style.display = 'none';
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
      if (this.selectedEvento.secSubtareas[pos].id != null) this.deletedSubTareas.push(this.selectedEvento.secSubtareas[pos]);
      this.selectedEvento.secSubtareas.splice(pos, 1);
    }
  }

  seleccionarFotoTarea(event, opc: number) {
    this.fotoEvidencia = event.target.files[0];
    if (this.fotoEvidencia != null) {
      if (this.fotoEvidencia.type.indexOf('image') < 0) {
        Swal.fire('Error', 'Debe de seleccionar una foto', 'error');
        this.fotoEvidencia = this.emptyFile;
      } else {
        var reader = new FileReader();
        reader.readAsDataURL(this.fotoEvidencia);
        reader.onload = (e) => {
          this.ShowFoto = reader.result;
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-sm m-1 btn-success',
              cancelButton: 'btn btn-sm btn-danger'
            },
            buttonsStyling: false
          })

          swalWithBootstrapButtons.fire({
            title: '¿Subir foto de la tarea?',
            html:
              '<br><img src="' +
              this.ShowFoto +
              '" style="max-width: 350px; max-height:350px;">',
            showCancelButton: true,
            icon: 'question',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
          }).then((result) => {
            if (result.value) {
              this.lstFileFotos.push(this.fotoEvidencia);
              this.picturesAdded.push(this.ShowFoto);
            }
          });
        }; ///End reader onload
      }
    }
  }

  public addEvento(opc: number) {

    let eve = new EventoCalendario();
    eve.id = null;
    eve.estatus = false;
    eve.notas = this.notas;
    eve.titulo = this.tituloTarea;
    let s;
    switch (this.actividadCalendario.tipo) {
      case "1":
        s = "Llamada telefónica";
        break;
      case "5":
        s = "Cita con el cliente";
        break;
      case "2":
        s = "Correo electrónico";
        break;
      case "3":
        s = "WhatsApp";
        break;
    }
    for (var i = 0; i < 3; i++) {
      let subT1 = new SubTareaCalendario();
      if (i == 0) {
        subT1.titulo = "Tipo de actividad: " + s;
      } else if (i == 1) {
        subT1.titulo = "Descripción: " + this.actividadCalendario.descripcion;
      } else if (i == 2) {
        subT1.titulo = "Acción a tomar: " + this.actividadCalendario.accion;
      }
      subT1.estatus = false;
      subT1.id = null;
      this.listSubtarea.push(subT1);
    }
    eve.lstSubTareaCalendario = this.listSubtarea;
    eve.ubicacion = "EVE-/CAL-/CRM=" + this.carteraExpositor.id;
    eve.hora = this.fecha + 'T' + this.hora;
    this.selectedLista.bootstrapColor = extUtilities.getBootstrapColor(this.selectedLista.color);
    eve.className = this.selectedLista.bootstrapColor.class;
    if (eve.notas == undefined) eve.notas = '';

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-sm m-1 btn-success',
        cancelButton: 'btn btn-sm btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Desea confirmar la nueva tarea?',
      html: '<span class="font-italic">' + this.tituloTarea + '</span>',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      icon: 'question',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.selectedLista.lstEventoCalendario.push(eve);
        this.ventasService.saveListaCalendario(this.selectedLista, this.authService.user.id).subscribe(
          Respuesta => {
            if (Respuesta) {
              Respuesta.lstEventoCalendario.forEach((element) => {
                let existe = false;
                this.selectedLista.lstEventoCalendario.forEach((evP) => {
                  if (evP.id == element.id) existe = true;
                });
                if (!existe) {
                  eve.id = element.id;
                  eve.lstSubTareaCalendario = element.lstSubTareaCalendario;
                }
              })
              if (this.lstFileFotos.length > 0) this.subirFoto(this.selectedLista.id, eve.id);
              this.selectListas = 0;
              this.tituloTarea = "";
              this.notas = "";
              this.subtarea = "";
              this.listSubtarea = [];
              this.fecha = null;
              this.hora = null;
              this.picturesAdded = [];
              this.selectedIcon = this.defaultIcon;
              this.selectedColor = this.defaultColor;
            }
          });
        var x = document.getElementById("btnCloseCalendario");
        x.click();
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
          this.selectedLista.eventosToday += 1;
        }

      }
    });
  }

  public subirFoto(idLista: number, idEvento: number) {
    let lstImg: ImgEventoCalendario[] = [];
    if (this.fotoEvidencia) {
      this.ventasService.uploadFotoEventoCalendario(this.lstFileFotos, idLista, idEvento).subscribe(
        Respuesta => {
          if (Respuesta.type === HttpEventType.Response) {
            let response: any = Respuesta.body;
            response.registro.lstEventoCalendario.forEach(element => {
              if (element.id == idEvento) lstImg = element.lstImgEventoCalendario;
            });
            this.listCalendario.forEach(lista => {
              if (lista.id == idLista) {
                lista.lstEventoCalendario.forEach(evC => {
                  if (evC.id == idEvento) {
                    evC.lstImgEventoCalendario = lstImg;
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

  // Borrar Expositor
  borrarExpositor() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success ml-1',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Eliminar expositor?',
      text: '¡No podrás revertir cambios!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.ventasService.deleteExpo(this.clienteSeleccionado.id).subscribe((result) => {
          this.infoExpositor = false;
          this.actividades = false;
          this.historial = false;
          this.clienteSeleccionado = null;
          this.filtroCartera('b');
          swalWithBootstrapButtons.fire(
            '¡Expositor eliminado!',
            '',
            'success'
          )
        }, error => {
          this.errorHTTP(error.status);
        })
      }
    })
  }

  // Vendedores (ROL ADMIN)
  consVendedores() {
    this.ventasService.consVendedores(this.idEventoSelected).subscribe((result) => {
      if (result.length == 0) {
        this.vendedores = null;
      }
      this.vendedores = result;
    }, error => {
      this.errorHTTP(error.status);
    })
  }

  consAsignacionVendedor(res) {
    this.ventasService.consRelacionVendedor(res).subscribe((result) => {
      if (result.length == 0) {
        document.getElementById("asignarVendedor").style.display = "block";
        document.getElementById("vendedorAsignado").style.display = "none";
      } else {
        this.relacionVendedor = result;
        document.getElementById("asignarVendedor").style.display = "none";
        document.getElementById("vendedorAsignado").style.display = "block";
      }
    }, error => {
      this.errorHTTP(error.status);
    })
  }

  eliminarRelacion(res) {
    this.idCartera = res;
    Swal.fire('¡Asignación cancelada!', ``, 'success');
    document.getElementById("asignarVendedor").style.display = "block";
    document.getElementById("vendedorAsignado").style.display = "none";
  }

  registrarRelacion(res, res2, event) {
    let x;
    if (event.value == 0) {
      x = this.authService.user.id;
    } else {
      x = event.value;
    }
    this.ventasService.saveCartera(x, res, this.idEventoSelected, res2).subscribe((result) => {
      if (result) {
        if (event.value == 0) {
          Swal.fire('¡Vendedor des asignado!', ``, 'success');
        } else {
          Swal.fire('¡Vendedor asignado!', ``, 'success');
        }

      }
    }, error => {
      this.errorHTTP(error.status);
    })
  }

  // Editar Expositor
  enviarDatosExpositorEdit() {

    this.filteredOptionsEstadoEditar = this.estadoEditar.valueChanges.pipe(
      startWith(''),
      map(value => this._filtroEstadoEdit(value))
    );
    this.filteredOptionsPaisEditar = this.paisEditar.valueChanges.pipe(
      startWith(''),
      map(value => this._filtroPaisEdit(value))
    );

    this.razonSocial = this.clienteSeleccionado.razon_social;
    this.nombreComercial = this.clienteSeleccionado.nombre_comercial;
    if (this.clienteSeleccionado.direccion) {
      this.direccion = this.clienteSeleccionado.direccion;
    }
    if (this.clienteSeleccionado.rfc) {
      this.rfc = this.clienteSeleccionado.rfc;
    }
    if (this.clienteSeleccionado.telefono) {
      this.telefono = this.clienteSeleccionado.telefono;
    }
    if (this.clienteSeleccionado.telefono2) {
      this.telefono2 = this.clienteSeleccionado.telefono2;
    }
    if (this.clienteSeleccionado.email) {
      this.correo = this.clienteSeleccionado.email;
    }
    if (this.clienteSeleccionado.pagina_web) {
      this.paginaWeb = this.clienteSeleccionado.pagina_web;
    }
    if (this.clienteSeleccionado.pais) {
      this.paisEditar.setValue(this.clienteSeleccionado.pais);
    }
    if (this.clienteSeleccionado.estado) {
      this.estadoEditar.setValue(this.clienteSeleccionado.estado);
    }
    if (this.clienteSeleccionado.acercaDe) {
      this.acercaDe = this.clienteSeleccionado.acercaDe;
    }

    this.idExpoEdit = this.clienteSeleccionado.id;

  }

  updateExpositor() {
    if (this.paisEditar.value) {
      this.pais = this.paisEditar.value.trim();
    }
    if (this.estadoEditar.value) {
      this.estado = this.estadoEditar.value.trim();
    }

    if (this.pais == "" || !this.pais) {
      this.pais = "Sin país";
    }

    if (this.estado == "" || !this.estado) {
      this.estado = "Sin estado";
    }

    if (this.fotoEditExpositor == null) {
      this.ventasService.uploadExpositor(this.idExpoEdit, this.razonSocial, this.nombreComercial,
        this.direccion, this.rfc, this.telefono, this.telefono2, this.correo, this.paginaWeb, this.pais, this.estado, this.acercaDe).subscribe((result) => {
          if (result) {
            var s;
            s = result;
            this.clienteSeleccionado = s.expositor;
            this.miCartera();
            var x = document.getElementById("btnCloseModalExpositor");
            x.click();
            Swal.fire('¡Expositor editado!', ``, 'success');
          }
        }, error => {
          this.errorHTTP(error.status);
        })
    } else {

      this.ventasService.uploadFotoExpositor(this.idExpoEdit, this.fotoEditExpositor, this.razonSocial, this.nombreComercial,
        this.direccion, this.rfc, this.telefono, this.telefono2, this.correo, this.paginaWeb, this.pais, this.estado, this.acercaDe).subscribe((result) => {
          if (result) {
            var s;
            s = result;
            let img$ = timer(1000);
            img$.subscribe(h => this.clienteSeleccionado = s.expositor);
            this.miCartera();
            var x = document.getElementById("btnCloseModalExpositor");
            x.click();
            Swal.fire('¡Expositor editado!', ``, 'success');
          }
        }, error => {
          this.errorHTTP(error.status);
        })
    }
    document.getElementById("imgEditExpositor").style.display = "block";
    document.getElementById("elimImgEditExpositor").style.display = "none";
    $("#subirImgEditExpositor").val("");
    this.fotoEditExpositor = null;
  }

  verificarRfcEdit(event: any) {
    if (event.target.value.length > 0) {
      if (this.clienteSeleccionado.rfc != event.target.value.trim()) {
        this.ventasService.consRfc(event.target.value.trim()).subscribe((result) => {
          if (result > 0) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              html:
                'El rfc: <b>' + event.target.value + '</b>, ' +
                'ya está en uso.'
            })
            event.target.value = '';
            this.rfc = '';
          }
        }, error => {
          this.errorHTTP(error.status);
        })
      }
    }
  }

  seleccionarFotoEditExpositor(event) {
    this.fotoEditExpositor = event.target.files[0];
    if (this.fotoEditExpositor.type.indexOf('image') < 0) {
      Swal.fire('Error', 'Debe de seleccionar una foto', 'error');
      this.fotoEditExpositor = this.emptyFile;
    } else {
      var reader = new FileReader();
      reader.readAsDataURL(this.fotoEditExpositor);
      reader.onload = (e) => {
        this.ShowFoto = reader.result;

        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success ml-1',
            cancelButton: 'btn btn-danger'
          },
          buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
          title: '¿Subir imagen del expositor?',
          html: '<img src="' + this.ShowFoto + '" style="width: 300px;">',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            document.getElementById("imgEditExpositor").style.display = "none";
            document.getElementById("elimImgEditExpositor").style.display = "block";
          } else {
            this.fotoEditExpositor = this.emptyFile;
          }
          $("#subirImgEditExpositor").val("");
        })
      }
    }
  }

  borrarImgEditExpo() {
    $("#subirImgEditExpositor").val("");
    this.fotoEditExpositor = this.emptyFile;
    document.getElementById("elimImgEditExpositor").style.display = 'none';
    document.getElementById("imgEditExpositor").style.display = "block";
  }

  // Guardar Contacto
  addContacto(f: NgForm) {
    this.contacto = new ContactoExpositor;
    this.contacto.nombre = f.value.contactoNombre;
    this.contacto.telefono = f.value.contactoWhats;
    this.contacto.email = f.value.contactoCorreo;
    this.contacto.puesto = f.value.contactoPuesto;
    if (this.fotoContacto == this.emptyFile) {
      this.contacto.img = "nouser.png";
      this.imagenesContactos.push(this.emptyFile);
    } else {
      this.contacto.img = "1";
      this.imagenesContactos.push(this.fotoContacto);
      this.fotoContacto = this.emptyFile;
      $("#subirImgContactoExpositor").val("");
    }
    this.arrayContactos.push(this.contacto);
    this.hayContactos = true;
    f.resetForm();
    document.getElementById("imgContactoExpositor").style.display = "block";
    document.getElementById("elimImgContactoExpositor").style.display = "none";
  }

  seleccionarFotoContactoExpo(event) {
    this.fotoContacto = event.target.files[0];
    if (this.fotoContacto.type.indexOf('image') < 0) {
      Swal.fire('Error', 'Debe de seleccionar una foto', 'error');
      this.fotoContacto = this.emptyFile;
    } else {
      var reader = new FileReader();
      reader.readAsDataURL(this.fotoContacto);
      reader.onload = (e) => {
        this.ShowFoto = reader.result;

        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success ml-1',
            cancelButton: 'btn btn-danger'
          },
          buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
          title: '¿Subir imagen de contacto?',
          html: '<img src="' + this.ShowFoto + '" style="width: 300px;">',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            document.getElementById("imgContactoExpositor").style.display = "none";
            document.getElementById("elimImgContactoExpositor").style.display = "block";
          } else {
            this.fotoContacto = this.emptyFile;
          }
          $("#subirImgContactoExpositor").val("");
        })
      }
    }
  }

  eliminarImgContacto() {
    document.getElementById("imgContactoExpositor").style.display = "block";
    document.getElementById("elimImgContactoExpositor").style.display = "none";
    $("#subirImgContactoExpositor").val("");
    this.fotoContacto = this.emptyFile;
  }

  deleteContacto(res) {
    this.arrayContactos.splice(res, 1);
    this.imagenesContactos.splice(res, 1);
    if (this.arrayContactos.length == 0) {
      this.hayContactos = false;
    }
  }

  // Guardar Expositor
  resetFormExpositor(f: NgForm, fc: NgForm) {
    this.arrayContactos = [];
    this.imagenesContactos = [];
    this.hayContactos = false;
    this.eliminarImgContacto();
    this.eliminarImgExpositor();
    f.resetForm();
    fc.resetForm();
    this.myControl.reset('');
  }

  seleccionarFotoExpositor(event) {
    this.fotoExpositor = event.target.files[0];
    if (this.fotoExpositor.type.indexOf('image') < 0) {
      Swal.fire('Error', 'Debe de seleccionar una foto', 'error');
      this.fotoExpositor = this.emptyFile;
    } else {
      var reader = new FileReader();
      reader.readAsDataURL(this.fotoExpositor);
      reader.onload = (e) => {
        this.ShowFoto = reader.result;

        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success ml-1',
            cancelButton: 'btn btn-danger'
          },
          buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
          title: '¿Subir imagen del expositor?',
          html: '<img src="' + this.ShowFoto + '" style="width: 300px;">',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            document.getElementById("subirImgExpositor").style.display = "none";
            document.getElementById("eliminarImgExpositor").style.display = "block";
          } else {
            this.fotoExpositor = this.emptyFile;
          }
          $("#subirImgExpositor").val("");
        })
      }
    }
  }

  eliminarImgExpositor() {
    document.getElementById("subirImgExpositor").style.display = "block";
    document.getElementById("eliminarImgExpositor").style.display = "none";
    $("#subirImgExpositor").val("");
    this.fotoExpositor = null;
  }

  verificarRfc(event: any) {
    if (event.target.value.length > 0) {
      this.ventasService.consRfc(event.target.value.trim()).subscribe((result) => {
        if (result > 0) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            html:
              'El rfc: <b>' + event.target.value + '</b>, ' +
              'ya está en uso.'
          })
          event.target.value = '';
          this.varRfc = true;
        } else {
          this.varRfc = false;
        }
      }, error => {
        this.errorHTTP(error.status);
      })
    }
  }

  saveExpositor(f: NgForm, fc: NgForm) {
    let expo = new Expositor();
    expo.razon_social = f.value.razonSocial;
    expo.nombre_comercial = f.value.nombreComercial;
    expo.telefono = f.value.telefono;
    expo.telefono2 = f.value.telefono2;
    expo.email = f.value.correo;
    expo.rfc = f.value.rfc.trim();
    expo.estatus_crm = "0";
    expo.prioridad = "0";
    expo.direccion = f.value.direccion;
    expo.pagina_web = f.value.paginaWeb;
    expo.acercaDe = f.value.acercaDe;
    expo.pais = f.value.pais.trim();
    if (expo.pais == "") {
      expo.pais = "Sin país";
    }
    var estado = this.formD.controls['estado'].value.trim();
    if (estado.length > 0) {
      expo.estado = f.value.estado;
    } else {
      expo.estado = this.myControl.value;
    }

    if (expo.estado == "") {
      expo.estado = "Sin estado";
    }

    this.ventasService.saveExpositor(expo, this.idEventoSelected).subscribe((expositor) => {
      if (expositor) {
        this.miCartera();
        if (this.fotoExpositor != this.emptyFile) {
          this.ventasService.saveFotoExpositor(this.fotoExpositor, expositor.id).subscribe(() => {
          }, error => {
            this.errorHTTP(error.status);
          })
        }
        this.ventasService.saveContactosExpositor(expositor.id, this.arrayContactos).subscribe((result) => {
          if (result.contactos.length > 0) {
            for (var i = 0; i < result.contactos.length; i++) {
              if (result.contactos[i].img === "1") {
                this.ventasService.saveFotoContactos(this.imagenesContactos[i], result.contactos[i].id).subscribe(() => {
                }, error => {
                  this.errorHTTP(error.status);
                })
              }
              if (i == result.contactos.length) {
                this.imagenesContactos = [];
              }
            }
          }
        }, error => {
          this.errorHTTP(error.status);
        })
        Swal.fire('¡Registro Exitoso!', ``, 'success');
        this.arrayContactos = [];
        this.hayContactos = false;
        this.myControl.reset('');
        f.resetForm();
        fc.resetForm();
        this.eliminarImgContacto();
        this.eliminarImgExpositor();
      }
    }, error => {
      this.errorHTTP(error.status);
    })
  }

  // Contacto desde C R M
  abrirModalContacto(f: NgForm) {
    f.resetForm();
  }

  seleccionarFotoContactoSave(event) {
    this.fotoContactoSave = event.target.files[0];
    if (this.fotoContactoSave.type.indexOf('image') < 0) {
      Swal.fire('Error', 'Debe de seleccionar una foto', 'error');
      this.fotoContactoSave = this.emptyFile;
    } else {
      var reader = new FileReader();
      reader.readAsDataURL(this.fotoContactoSave);
      reader.onload = (e) => {
        this.ShowFoto = reader.result;

        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success ml-1',
            cancelButton: 'btn btn-danger'
          },
          buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
          title: '¿Subir imagen de contacto?',
          html: '<img src="' + this.ShowFoto + '" style="width: 300px;">',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            document.getElementById("imgContactoExpositorSave").style.display = "none";
            document.getElementById("elimImgContactoExpositorSave").style.display = "block";
          } else {
            this.fotoContactoSave = this.emptyFile;
          }
          $("#subirImgContactoExpositorSave").val("");
        })
      }
    }
  }

  borrarImgContactoSave() {
    this.fotoContactoSave = null;
    document.getElementById("imgContactoExpositorSave").style.display = "block";
    document.getElementById("elimImgContactoExpositorSave").style.display = "none";
    $("#subirImgContactoExpositorSave").val("");
  }

  saveContacto(f: NgForm) {
    var correo = f.value.contactoSaveCorreo;
    var numero = f.value.contactoSaveWhats;
    var puesto = f.value.contactoSavePuesto;

    if (correo == null) {
      correo = "";
    }
    if (numero == null) {
      numero = "";
    }
    if (puesto == null) {
      puesto = "";
    }

    if (this.fotoContactoSave != this.emptyFile) {
      this.ventasService.saveContacto(this.fotoContactoSave, this.clienteSeleccionado.id, f.value.contactoSaveNombre, numero, puesto, correo).subscribe((result) => {
        if (result) {
          this.consultContactos(this.clienteSeleccionado.id);
          this.fotoContactoSave = this.emptyFile;
          document.getElementById("imgContactoExpositorSave").style.display = "block";
          document.getElementById("elimImgContactoExpositorSave").style.display = "none";
          $("#subirImgContactoExpositorSave").val("");
          var x = document.getElementById("btnCloseModalSaveContacto");
          x.click();
          Swal.fire('¡Registro Exitoso!', ``, 'success');
          f.resetForm();
        }
      }, error => {
        this.errorHTTP(error.status);
      })
    } else {
      this.ventasService.saveContactoSinF(this.clienteSeleccionado.id, f.value.contactoSaveNombre, numero, puesto, correo).subscribe((result) => {
        if (result) {
          this.consultContactos(this.clienteSeleccionado.id);
          var x = document.getElementById("btnCloseModalSaveContacto");
          x.click();
          Swal.fire('¡Registro Exitoso!', ``, 'success');
          f.resetForm();
        }
      }, error => {
        this.errorHTTP(error.status);
      })
    }
  }

  // E X C E L 
  onFileChange(evt: any) {

    this.data = [];
    this.isExcelFile = false;
    this.dataSheet = new Subject();
    this.keys = [];
    this.numRegistros = 0;
    this.numNoRegistros = 0;
    this.numRfcRepetidos = 0;
    this.numTelefonosInvalidos = 0;
    this.numContactosRegistrados = 0;
    this.errors = "";
    this.arrayNumInvalidosExpo = [];
    this.arrayNumInvalidosContacto = [];
    this.contactosNoRegistrados = 0;
    this.loadExcel = false;

    const target: DataTransfer = <DataTransfer>(evt.target);
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (target.files.length > 1) {
      alert("No se aceptan múltiples archivos.");
    }

    if (this.isExcelFile) {
      var x = 0;
      var rows = 0;
      this.spinnerD.show("crmSpinner");
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
        rows = this.data[0].length;
        if (rows >= 15) {
          this.dataSheet.forEach(data => {
            for (let i = 1; i < this.data.length; i++) {
              if ((data[i] != undefined) && (data[i].length != 0)) {
                let exp = new Expositor();
                if (data[i][0] && data[i][1]) {
                  exp.razon_social = data[i][0];
                  exp.nombre_comercial = data[i][1];
                  exp.direccion = data[i][2];
                  exp.rfc = data[i][3];
                  exp.telefono = String(data[i][4]);
                  exp.telefono = exp.telefono.replace(/-/g, "");
                  exp.telefono = exp.telefono.replace(`+`, "");
                  exp.telefono = exp.telefono.replace(`(`, "");
                  exp.telefono = exp.telefono.replace(`)`, "");
                  exp.telefono = exp.telefono.replace(/ /g, "");
                  exp.telefono = exp.telefono.trim();
                  exp.telefono2 = String(data[i][5]);
                  exp.telefono2 = exp.telefono2.replace(/-/g, "");
                  exp.telefono2 = exp.telefono2.replace(`+`, "");
                  exp.telefono2 = exp.telefono2.replace(`(`, "");
                  exp.telefono2 = exp.telefono2.replace(`)`, "");
                  exp.telefono2 = exp.telefono2.replace(/ /g, "");
                  exp.telefono2 = exp.telefono2.trim();

                  exp.email = data[i][6];
                  exp.pagina_web = data[i][7];
                  exp.pais = data[i][8];
                  exp.estado = data[i][9];
                  if (exp.pais) {
                    exp.pais = exp.pais.trim();
                  }
                  if (exp.estado) {
                    exp.estado = exp.estado.trim();
                  }
                  exp.acercaDe = data[i][10];
                  // Contacto 1
                  exp.nombreContacto = data[i][11];
                  exp.puestoContacto = data[i][12];
                  exp.telefonoContacto = String(data[i][13]);
                  exp.telefonoContacto = exp.telefonoContacto.replace(/-/g, "");
                  exp.telefonoContacto = exp.telefonoContacto.replace('+', "");
                  exp.telefonoContacto = exp.telefonoContacto.replace("(", "");
                  exp.telefonoContacto = exp.telefonoContacto.replace(")", "");
                  exp.telefonoContacto = exp.telefonoContacto.replace(/ /g, "");
                  exp.telefonoContacto = exp.telefonoContacto.trim();
                  exp.correoContacto = data[i][14];
                  // Contacto 2
                  exp.nombreContacto2 = data[i][15];
                  exp.puestoContacto2 = data[i][16];
                  exp.telefonoContacto2 = String(data[i][17]);
                  exp.telefonoContacto2 = exp.telefonoContacto2.replace(/-/g, "");
                  exp.telefonoContacto2 = exp.telefonoContacto2.replace('+', "");
                  exp.telefonoContacto2 = exp.telefonoContacto2.replace("(", "");
                  exp.telefonoContacto2 = exp.telefonoContacto2.replace(")", "");
                  exp.telefonoContacto2 = exp.telefonoContacto2.replace(/ /g, "");
                  exp.telefonoContacto2 = exp.telefonoContacto2.trim();
                  exp.correoContacto2 = data[i][18];
                  // Contacto 3
                  exp.nombreContacto3 = data[i][19];
                  exp.puestoContacto3 = data[i][20];
                  exp.telefonoContacto3 = String(data[i][21]);
                  exp.telefonoContacto3 = exp.telefonoContacto3.replace(/-/g, "");
                  exp.telefonoContacto3 = exp.telefonoContacto3.replace('+', "");
                  exp.telefonoContacto3 = exp.telefonoContacto3.replace("(", "");
                  exp.telefonoContacto3 = exp.telefonoContacto3.replace(")", "");
                  exp.telefonoContacto3 = exp.telefonoContacto3.replace(/ /g, "");
                  exp.telefonoContacto3 = exp.telefonoContacto3.trim();
                  exp.correoContacto3 = data[i][22];
                  // Contacto 4
                  exp.nombreContacto4 = data[i][23];
                  exp.puestoContacto4 = data[i][24];
                  exp.telefonoContacto4 = String(data[i][25]);
                  exp.telefonoContacto4 = exp.telefonoContacto4.replace(/-/g, "");
                  exp.telefonoContacto4 = exp.telefonoContacto4.replace('+', "");
                  exp.telefonoContacto4 = exp.telefonoContacto4.replace("(", "");
                  exp.telefonoContacto4 = exp.telefonoContacto4.replace(")", "");
                  exp.telefonoContacto4 = exp.telefonoContacto4.replace(/ /g, "");
                  exp.telefonoContacto4 = exp.telefonoContacto4.trim();
                  exp.correoContacto4 = data[i][26];

                  if (!exp.pais || exp.pais == '') {
                    exp.pais = "Sin país";
                  }

                  if (!exp.estado || exp.estado == '') {
                    exp.estado = "Sin estado";
                  }

                  if (exp.rfc != undefined) {
                    this.ventasService.consRfc(exp.rfc).subscribe((result) => {
                      if (result > 0) {
                        this.numRfcRepetidos++;
                      } else {
                        // R E G I S T R A
                        if (exp.telefono != 'undefined' && exp.telefono != undefined) {
                          if ((exp.telefono.length > 15) || (exp.telefono.length < 10)) {
                            this.numTelefonosInvalidos++;
                            this.arrayNumInvalidosExpo.push(exp.nombre_comercial);
                            exp.telefono = "";
                          }
                          if (exp.telefono2 != 'undefined' && exp.telefono2 != undefined) {
                            if ((exp.telefono2.length > 15) || (exp.telefono2.length < 10)) {
                              this.numTelefonosInvalidos++;
                              exp.telefono2 = "";
                            }
                          } else {
                            exp.telefono2 = "";
                          }
                        } else {
                          exp.telefono = "";
                          exp.telefono2 = "";
                        }

                        exp.estatus_crm = "0";
                        exp.prioridad = "0";
                        this.ventasService.saveExpositor(exp, this.idEventoSelected).subscribe((expositor) => {
                          if (expositor) {
                            this.numRegistros++;
                            //
                            if ((exp.nombreContacto != 'undefined') && (exp.nombreContacto != undefined)) {
                              if (exp.correoContacto == 'undefined' || exp.correoContacto == undefined) {
                                exp.correoContacto = "";
                              }
                              if (exp.telefonoContacto == 'undefined' || exp.telefonoContacto == undefined) {
                                exp.telefonoContacto = "";
                              }
                              if (exp.puestoContacto == 'undefined' || exp.puestoContacto == undefined) {
                                exp.puestoContacto = "";
                              }


                              if (exp.telefonoContacto != "") {
                                if ((exp.telefonoContacto.length > 15) || (exp.telefonoContacto.length < 10)) {
                                  this.numTelefonosInvalidos++;
                                  this.arrayNumInvalidosContacto.push(exp.nombre_comercial);
                                } else {
                                  this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto, exp.telefonoContacto, exp.puestoContacto, exp.correoContacto).subscribe((contacto1) => {

                                    if (contacto1) {
                                      this.numContactosRegistrados++;

                                      if ((exp.nombreContacto2 != 'undefined') && (exp.nombreContacto2 != undefined)) {
                                        if (exp.correoContacto2 == 'undefined' || exp.correoContacto2 == undefined) {
                                          exp.correoContacto2 = "";
                                        }
                                        if (exp.telefonoContacto2 == 'undefined' || exp.telefonoContacto2 == undefined) {
                                          exp.telefonoContacto2 = "";
                                        }
                                        if (exp.puestoContacto2 == 'undefined' || exp.puestoContacto2 == undefined) {
                                          exp.puestoContacto2 = "";
                                        }

                                        if (exp.telefonoContacto2 != "") {
                                          if ((exp.telefonoContacto2.length > 15) || (exp.telefonoContacto2.length < 10)) {
                                            this.numTelefonosInvalidos++;
                                          } else {
                                            this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto2, exp.telefonoContacto2, exp.puestoContacto2, exp.correoContacto2).subscribe((contacto2) => {

                                              if (contacto2) {
                                                this.numContactosRegistrados++;
                                                if ((exp.nombreContacto3 != 'undefined') && (exp.nombreContacto3 != undefined)) {
                                                  if (exp.correoContacto3 == 'undefined' || exp.correoContacto3 == undefined) {
                                                    exp.correoContacto3 = "";
                                                  }
                                                  if (exp.telefonoContacto3 == 'undefined' || exp.telefonoContacto3 == undefined) {
                                                    exp.telefonoContacto3 = "";
                                                  }
                                                  if (exp.puestoContacto3 == 'undefined' || exp.puestoContacto3 == undefined) {
                                                    exp.puestoContacto3 = "";
                                                  }

                                                  if (exp.telefonoContacto3 != "") {
                                                    if ((exp.telefonoContacto3.length > 15) || (exp.telefonoContacto3.length < 10)) {
                                                      this.numTelefonosInvalidos++;
                                                    } else {
                                                      this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto3, exp.telefonoContacto3, exp.puestoContacto3, exp.correoContacto3).subscribe((contacto3) => {

                                                        if (contacto3) {
                                                          this.numContactosRegistrados++;

                                                          if ((exp.nombreContacto4 != 'undefined') && (exp.nombreContacto4 != undefined)) {
                                                            if (exp.correoContacto4 == 'undefined' || exp.correoContacto4 == undefined) {
                                                              exp.correoContacto4 = "";
                                                            }
                                                            if (exp.telefonoContacto4 == 'undefined' || exp.telefonoContacto4 == undefined) {
                                                              exp.telefonoContacto4 = "";
                                                            }
                                                            if (exp.puestoContacto4 == 'undefined' || exp.puestoContacto4 == undefined) {
                                                              exp.puestoContacto4 = "";
                                                            }

                                                            if (exp.telefonoContacto4 != "") {
                                                              if ((exp.telefonoContacto4.length > 15) || (exp.telefonoContacto4.length < 10)) {
                                                                this.numTelefonosInvalidos++;
                                                              } else {
                                                                this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                                  if (contacto4) { this.numContactosRegistrados++; }
                                                                }, error => {
                                                                  this.errorHTTP(error.status);
                                                                })
                                                              }
                                                            } else {
                                                              this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                                if (contacto4) { this.numContactosRegistrados++; }
                                                              }, error => {
                                                                this.errorHTTP(error.status);
                                                              })
                                                            }
                                                          }
                                                        }
                                                      }, error => {
                                                        this.errorHTTP(error.status);
                                                      })
                                                    }
                                                  } else {
                                                    this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto3, exp.telefonoContacto3, exp.puestoContacto3, exp.correoContacto3).subscribe((contacto3) => {
                                                      if (contacto3) {
                                                        this.numContactosRegistrados++;
                                                        if ((exp.nombreContacto4 != 'undefined') && (exp.nombreContacto4 != undefined)) {
                                                          if (exp.correoContacto4 == 'undefined' || exp.correoContacto4 == undefined) {
                                                            exp.correoContacto4 = "";
                                                          }
                                                          if (exp.telefonoContacto4 == 'undefined' || exp.telefonoContacto4 == undefined) {
                                                            exp.telefonoContacto4 = "";
                                                          }
                                                          if (exp.puestoContacto4 == 'undefined' || exp.puestoContacto4 == undefined) {
                                                            exp.puestoContacto4 = "";
                                                          }

                                                          if (exp.telefonoContacto4 != "") {
                                                            if ((exp.telefonoContacto4.length > 15) || (exp.telefonoContacto4.length < 10)) {
                                                              this.numTelefonosInvalidos++;
                                                            } else {
                                                              this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                                if (contacto4) { this.numContactosRegistrados++; }
                                                              }, error => {
                                                                this.errorHTTP(error.status);
                                                              })
                                                            }
                                                          } else {
                                                            this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                              if (contacto4) { this.numContactosRegistrados++; }
                                                            }, error => {
                                                              this.errorHTTP(error.status);
                                                            })
                                                          }
                                                        }
                                                      }
                                                    }, error => {
                                                      this.errorHTTP(error.status);
                                                    })
                                                  }
                                                }
                                              }
                                            }, error => {
                                              this.errorHTTP(error.status);
                                            })
                                          }
                                        } else {
                                          this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto2, exp.telefonoContacto2, exp.puestoContacto2, exp.correoContacto2).subscribe((contacto2) => {

                                            if (contacto2) {
                                              this.numContactosRegistrados++;
                                              if ((exp.nombreContacto3 != 'undefined') && (exp.nombreContacto3 != undefined)) {
                                                if (exp.correoContacto3 == 'undefined' || exp.correoContacto3 == undefined) {
                                                  exp.correoContacto3 = "";
                                                }
                                                if (exp.telefonoContacto3 == 'undefined' || exp.telefonoContacto3 == undefined) {
                                                  exp.telefonoContacto3 = "";
                                                }
                                                if (exp.puestoContacto3 == 'undefined' || exp.puestoContacto3 == undefined) {
                                                  exp.puestoContacto3 = "";
                                                }

                                                if (exp.telefonoContacto3 != "") {
                                                  if ((exp.telefonoContacto3.length > 15) || (exp.telefonoContacto3.length < 10)) {
                                                    this.numTelefonosInvalidos++;
                                                  } else {
                                                    this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto3, exp.telefonoContacto3, exp.puestoContacto3, exp.correoContacto3).subscribe((contacto3) => {

                                                      if (contacto3) {
                                                        this.numContactosRegistrados++;

                                                        if ((exp.nombreContacto4 != 'undefined') && (exp.nombreContacto4 != undefined)) {
                                                          if (exp.correoContacto4 == 'undefined' || exp.correoContacto4 == undefined) {
                                                            exp.correoContacto4 = "";
                                                          }
                                                          if (exp.telefonoContacto4 == 'undefined' || exp.telefonoContacto4 == undefined) {
                                                            exp.telefonoContacto4 = "";
                                                          }
                                                          if (exp.puestoContacto4 == 'undefined' || exp.puestoContacto4 == undefined) {
                                                            exp.puestoContacto4 = "";
                                                          }

                                                          if (exp.telefonoContacto4 != "") {
                                                            if ((exp.telefonoContacto4.length > 15) || (exp.telefonoContacto4.length < 10)) {
                                                              this.numTelefonosInvalidos++;
                                                            } else {
                                                              this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                                if (contacto4) { this.numContactosRegistrados++; }
                                                              }, error => {
                                                                this.errorHTTP(error.status);
                                                              })
                                                            }
                                                          } else {
                                                            this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                              if (contacto4) { this.numContactosRegistrados++; }
                                                            }, error => {
                                                              this.errorHTTP(error.status);
                                                            })
                                                          }
                                                        }
                                                      }
                                                    }, error => {
                                                      this.errorHTTP(error.status);
                                                    })
                                                  }
                                                } else {
                                                  this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto3, exp.telefonoContacto3, exp.puestoContacto3, exp.correoContacto3).subscribe((contacto3) => {
                                                    if (contacto3) {
                                                      this.numContactosRegistrados++;

                                                      if ((exp.nombreContacto4 != 'undefined') && (exp.nombreContacto4 != undefined)) {
                                                        if (exp.correoContacto4 == 'undefined' || exp.correoContacto4 == undefined) {
                                                          exp.correoContacto4 = "";
                                                        }
                                                        if (exp.telefonoContacto4 == 'undefined' || exp.telefonoContacto4 == undefined) {
                                                          exp.telefonoContacto4 = "";
                                                        }
                                                        if (exp.puestoContacto4 == 'undefined' || exp.puestoContacto4 == undefined) {
                                                          exp.puestoContacto4 = "";
                                                        }

                                                        if (exp.telefonoContacto4 != "") {
                                                          if ((exp.telefonoContacto4.length > 15) || (exp.telefonoContacto4.length < 10)) {
                                                            this.numTelefonosInvalidos++;
                                                          } else {
                                                            this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                              if (contacto4) { this.numContactosRegistrados++; }
                                                            }, error => {
                                                              this.errorHTTP(error.status);
                                                            })
                                                          }
                                                        } else {
                                                          this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                            if (contacto4) { this.numContactosRegistrados++; }
                                                          }, error => {
                                                            this.errorHTTP(error.status);
                                                          })
                                                        }
                                                      }
                                                    }
                                                  }, error => {
                                                    this.errorHTTP(error.status);
                                                  })
                                                }
                                              }
                                            }
                                          }, error => {
                                            this.errorHTTP(error.status);
                                          })
                                        }
                                      }
                                    }
                                  }, error => {
                                    this.errorHTTP(error.status);
                                  })
                                }
                              } else {
                                this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto, exp.telefonoContacto, exp.puestoContacto, exp.correoContacto).subscribe((contacto1) => {

                                  if (contacto1) {
                                    this.numContactosRegistrados++;

                                    if ((exp.nombreContacto2 != 'undefined') && (exp.nombreContacto2 != undefined)) {
                                      if (exp.correoContacto2 == 'undefined' || exp.correoContacto2 == undefined) {
                                        exp.correoContacto2 = "";
                                      }
                                      if (exp.telefonoContacto2 == 'undefined' || exp.telefonoContacto2 == undefined) {
                                        exp.telefonoContacto2 = "";
                                      }
                                      if (exp.puestoContacto2 == 'undefined' || exp.puestoContacto2 == undefined) {
                                        exp.puestoContacto2 = "";
                                      }

                                      if (exp.telefonoContacto2 != "") {
                                        if ((exp.telefonoContacto2.length > 15) || (exp.telefonoContacto2.length < 10)) {
                                          this.numTelefonosInvalidos++;
                                        } else {
                                          this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto2, exp.telefonoContacto2, exp.puestoContacto2, exp.correoContacto2).subscribe((contacto2) => {

                                            if (contacto2) {
                                              this.numContactosRegistrados++;

                                              if ((exp.nombreContacto3 != 'undefined') && (exp.nombreContacto3 != undefined)) {
                                                if (exp.correoContacto3 == 'undefined' || exp.correoContacto3 == undefined) {
                                                  exp.correoContacto3 = "";
                                                }
                                                if (exp.telefonoContacto3 == 'undefined' || exp.telefonoContacto3 == undefined) {
                                                  exp.telefonoContacto3 = "";
                                                }
                                                if (exp.puestoContacto3 == 'undefined' || exp.puestoContacto3 == undefined) {
                                                  exp.puestoContacto3 = "";
                                                }

                                                if (exp.telefonoContacto3 != "") {
                                                  if ((exp.telefonoContacto3.length > 15) || (exp.telefonoContacto3.length < 10)) {
                                                    this.numTelefonosInvalidos++;
                                                  } else {
                                                    this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto3, exp.telefonoContacto3, exp.puestoContacto3, exp.correoContacto3).subscribe((contacto3) => {

                                                      if (contacto3) {
                                                        this.numContactosRegistrados++;

                                                        if ((exp.nombreContacto4 != 'undefined') && (exp.nombreContacto4 != undefined)) {
                                                          if (exp.correoContacto4 == 'undefined' || exp.correoContacto4 == undefined) {
                                                            exp.correoContacto4 = "";
                                                          }
                                                          if (exp.telefonoContacto4 == 'undefined' || exp.telefonoContacto4 == undefined) {
                                                            exp.telefonoContacto4 = "";
                                                          }
                                                          if (exp.puestoContacto4 == 'undefined' || exp.puestoContacto4 == undefined) {
                                                            exp.puestoContacto4 = "";
                                                          }

                                                          if (exp.telefonoContacto4 != "") {
                                                            if ((exp.telefonoContacto4.length > 15) || (exp.telefonoContacto4.length < 10)) {
                                                              this.numTelefonosInvalidos++;
                                                            } else {
                                                              this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                                if (contacto4) { this.numContactosRegistrados++; }
                                                              }, error => {
                                                                this.errorHTTP(error.status);
                                                              })
                                                            }
                                                          } else {
                                                            this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                              if (contacto4) { this.numContactosRegistrados++; }
                                                            }, error => {
                                                              this.errorHTTP(error.status);
                                                            })
                                                          }
                                                        }
                                                      }
                                                    }, error => {
                                                      this.errorHTTP(error.status);
                                                    })
                                                  }
                                                } else {
                                                  this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto3, exp.telefonoContacto3, exp.puestoContacto3, exp.correoContacto3).subscribe((contacto3) => {
                                                    if (contacto3) {
                                                      this.numContactosRegistrados++;

                                                      if ((exp.nombreContacto4 != 'undefined') && (exp.nombreContacto4 != undefined)) {
                                                        if (exp.correoContacto4 == 'undefined' || exp.correoContacto4 == undefined) {
                                                          exp.correoContacto4 = "";
                                                        }
                                                        if (exp.telefonoContacto4 == 'undefined' || exp.telefonoContacto4 == undefined) {
                                                          exp.telefonoContacto4 = "";
                                                        }
                                                        if (exp.puestoContacto4 == 'undefined' || exp.puestoContacto4 == undefined) {
                                                          exp.puestoContacto4 = "";
                                                        }

                                                        if (exp.telefonoContacto4 != "") {
                                                          if ((exp.telefonoContacto4.length > 15) || (exp.telefonoContacto4.length < 10)) {
                                                            this.numTelefonosInvalidos++;
                                                          } else {
                                                            this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                              if (contacto4) { this.numContactosRegistrados++; }
                                                            }, error => {
                                                              this.errorHTTP(error.status);
                                                            })
                                                          }
                                                        } else {
                                                          this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                            if (contacto4) { this.numContactosRegistrados++; }
                                                          }, error => {
                                                            this.errorHTTP(error.status);
                                                          })
                                                        }
                                                      }
                                                    }
                                                  }, error => {
                                                    this.errorHTTP(error.status);
                                                  })
                                                }
                                              }
                                            }
                                          }, error => {
                                            this.errorHTTP(error.status);
                                          })
                                        }
                                      } else {
                                        this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto2, exp.telefonoContacto2, exp.puestoContacto2, exp.correoContacto2).subscribe((contacto2) => {

                                          if (contacto2) {
                                            this.numContactosRegistrados++;

                                            if ((exp.nombreContacto3 != 'undefined') && (exp.nombreContacto3 != undefined)) {
                                              if (exp.correoContacto3 == 'undefined' || exp.correoContacto3 == undefined) {
                                                exp.correoContacto3 = "";
                                              }
                                              if (exp.telefonoContacto3 == 'undefined' || exp.telefonoContacto3 == undefined) {
                                                exp.telefonoContacto3 = "";
                                              }
                                              if (exp.puestoContacto3 == 'undefined' || exp.puestoContacto3 == undefined) {
                                                exp.puestoContacto3 = "";
                                              }

                                              if (exp.telefonoContacto3 != "") {
                                                if ((exp.telefonoContacto3.length > 15) || (exp.telefonoContacto3.length < 10)) {
                                                  this.numTelefonosInvalidos++;
                                                } else {
                                                  this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto3, exp.telefonoContacto3, exp.puestoContacto3, exp.correoContacto3).subscribe((contacto3) => {

                                                    if (contacto3) {
                                                      this.numContactosRegistrados++;

                                                      if ((exp.nombreContacto4 != 'undefined') && (exp.nombreContacto4 != undefined)) {
                                                        if (exp.correoContacto4 == 'undefined' || exp.correoContacto4 == undefined) {
                                                          exp.correoContacto4 = "";
                                                        }
                                                        if (exp.telefonoContacto4 == 'undefined' || exp.telefonoContacto4 == undefined) {
                                                          exp.telefonoContacto4 = "";
                                                        }
                                                        if (exp.puestoContacto4 == 'undefined' || exp.puestoContacto4 == undefined) {
                                                          exp.puestoContacto4 = "";
                                                        }

                                                        if (exp.telefonoContacto4 != "") {
                                                          if ((exp.telefonoContacto4.length > 15) || (exp.telefonoContacto4.length < 10)) {
                                                            this.numTelefonosInvalidos++;
                                                          } else {
                                                            this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                              if (contacto4) { this.numContactosRegistrados++; }
                                                            }, error => {
                                                              this.errorHTTP(error.status);
                                                            })
                                                          }
                                                        } else {
                                                          this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                            if (contacto4) { this.numContactosRegistrados++; }
                                                          }, error => {
                                                            this.errorHTTP(error.status);
                                                          })
                                                        }
                                                      }
                                                    }
                                                  }, error => {
                                                    this.errorHTTP(error.status);
                                                  })
                                                }
                                              } else {
                                                this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto3, exp.telefonoContacto3, exp.puestoContacto3, exp.correoContacto3).subscribe((contacto3) => {
                                                  if (contacto3) {
                                                    this.numContactosRegistrados++;

                                                    if ((exp.nombreContacto4 != 'undefined') && (exp.nombreContacto4 != undefined)) {
                                                      if (exp.correoContacto4 == 'undefined' || exp.correoContacto4 == undefined) {
                                                        exp.correoContacto4 = "";
                                                      }
                                                      if (exp.telefonoContacto4 == 'undefined' || exp.telefonoContacto4 == undefined) {
                                                        exp.telefonoContacto4 = "";
                                                      }
                                                      if (exp.puestoContacto4 == 'undefined' || exp.puestoContacto4 == undefined) {
                                                        exp.puestoContacto4 = "";
                                                      }

                                                      if (exp.telefonoContacto4 != "") {
                                                        if ((exp.telefonoContacto4.length > 15) || (exp.telefonoContacto4.length < 10)) {
                                                          this.numTelefonosInvalidos++;
                                                        } else {
                                                          this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                            if (contacto4) { this.numContactosRegistrados++; }
                                                          }, error => {
                                                            this.errorHTTP(error.status);
                                                          })
                                                        }
                                                      } else {
                                                        this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                          if (contacto4) { this.numContactosRegistrados++; }
                                                        }, error => {
                                                          this.errorHTTP(error.status);
                                                        })
                                                      }
                                                    }
                                                  }
                                                }, error => {
                                                  this.errorHTTP(error.status);
                                                })
                                              }
                                            }
                                          }
                                        }, error => {
                                          this.errorHTTP(error.status);
                                        })
                                      }
                                    }
                                  }
                                }, error => {
                                  this.errorHTTP(error.status);
                                })
                              }
                            } else {
                              this.contactosNoRegistrados++;
                            }
                          }
                        }, error => {
                          this.errorHTTP(error.status);
                        })

                      }
                    }, error => {
                      this.errorHTTP(error.status);
                    })
                  } else {
                    // R E G I S T R A
                    if (exp.telefono != 'undefined' && exp.telefono != undefined) {
                      if ((exp.telefono.length > 15) || (exp.telefono.length < 10)) {
                        this.numTelefonosInvalidos++;
                        this.arrayNumInvalidosExpo.push(exp.nombre_comercial);
                        exp.telefono = "";
                      }
                      if (exp.telefono2 != 'undefined' && exp.telefono2 != undefined) {
                        if ((exp.telefono2.length > 15) || (exp.telefono2.length < 10)) {
                          this.numTelefonosInvalidos++;
                          exp.telefono2 = "";
                        }
                      } else {
                        exp.telefono2 = "";
                      }
                    } else {
                      exp.telefono = "";
                      exp.telefono2 = "";
                    }
                    exp.rfc = "";
                    exp.estatus_crm = "0";
                    exp.prioridad = "0";
                    this.ventasService.saveExpositor(exp, this.idEventoSelected).subscribe((expositor) => {
                      if (expositor) {
                        this.numRegistros++;

                        if ((exp.nombreContacto != 'undefined') && (exp.nombreContacto != undefined)) {
                          if (exp.correoContacto == 'undefined' || exp.correoContacto == undefined) {
                            exp.correoContacto = "";
                          }
                          if (exp.telefonoContacto == 'undefined' || exp.telefonoContacto == undefined) {
                            exp.telefonoContacto = "";
                          }
                          if (exp.puestoContacto == 'undefined' || exp.puestoContacto == undefined) {
                            exp.puestoContacto = "";
                          }


                          if (exp.telefonoContacto != "") {
                            if ((exp.telefonoContacto.length > 15) || (exp.telefonoContacto.length < 10)) {
                              this.numTelefonosInvalidos++;
                              this.arrayNumInvalidosContacto.push(exp.nombre_comercial);
                            } else {
                              this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto, exp.telefonoContacto, exp.puestoContacto, exp.correoContacto).subscribe((contacto1) => {

                                if (contacto1) {
                                  this.numContactosRegistrados++;

                                  if ((exp.nombreContacto2 != 'undefined') && (exp.nombreContacto2 != undefined)) {
                                    if (exp.correoContacto2 == 'undefined' || exp.correoContacto2 == undefined) {
                                      exp.correoContacto2 = "";
                                    }
                                    if (exp.telefonoContacto2 == 'undefined' || exp.telefonoContacto2 == undefined) {
                                      exp.telefonoContacto2 = "";
                                    }
                                    if (exp.puestoContacto2 == 'undefined' || exp.puestoContacto2 == undefined) {
                                      exp.puestoContacto2 = "";
                                    }

                                    if (exp.telefonoContacto2 != "") {
                                      if ((exp.telefonoContacto2.length > 15) || (exp.telefonoContacto2.length < 10)) {
                                        this.numTelefonosInvalidos++;
                                      } else {
                                        this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto2, exp.telefonoContacto2, exp.puestoContacto2, exp.correoContacto2).subscribe((contacto2) => {

                                          if (contacto2) {
                                            this.numContactosRegistrados++;
                                            if ((exp.nombreContacto3 != 'undefined') && (exp.nombreContacto3 != undefined)) {
                                              if (exp.correoContacto3 == 'undefined' || exp.correoContacto3 == undefined) {
                                                exp.correoContacto3 = "";
                                              }
                                              if (exp.telefonoContacto3 == 'undefined' || exp.telefonoContacto3 == undefined) {
                                                exp.telefonoContacto3 = "";
                                              }
                                              if (exp.puestoContacto3 == 'undefined' || exp.puestoContacto3 == undefined) {
                                                exp.puestoContacto3 = "";
                                              }

                                              if (exp.telefonoContacto3 != "") {
                                                if ((exp.telefonoContacto3.length > 15) || (exp.telefonoContacto3.length < 10)) {
                                                  this.numTelefonosInvalidos++;
                                                } else {
                                                  this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto3, exp.telefonoContacto3, exp.puestoContacto3, exp.correoContacto3).subscribe((contacto3) => {

                                                    if (contacto3) {
                                                      this.numContactosRegistrados++;

                                                      if ((exp.nombreContacto4 != 'undefined') && (exp.nombreContacto4 != undefined)) {
                                                        if (exp.correoContacto4 == 'undefined' || exp.correoContacto4 == undefined) {
                                                          exp.correoContacto4 = "";
                                                        }
                                                        if (exp.telefonoContacto4 == 'undefined' || exp.telefonoContacto4 == undefined) {
                                                          exp.telefonoContacto4 = "";
                                                        }
                                                        if (exp.puestoContacto4 == 'undefined' || exp.puestoContacto4 == undefined) {
                                                          exp.puestoContacto4 = "";
                                                        }

                                                        if (exp.telefonoContacto4 != "") {
                                                          if ((exp.telefonoContacto4.length > 15) || (exp.telefonoContacto4.length < 10)) {
                                                            this.numTelefonosInvalidos++;
                                                          } else {
                                                            this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                              if (contacto4) { this.numContactosRegistrados++; }
                                                            }, error => {
                                                              this.errorHTTP(error.status);
                                                            })
                                                          }
                                                        } else {
                                                          this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                            if (contacto4) { this.numContactosRegistrados++; }
                                                          }, error => {
                                                            this.errorHTTP(error.status);
                                                          })
                                                        }
                                                      }
                                                    }
                                                  }, error => {
                                                    this.errorHTTP(error.status);
                                                  })
                                                }
                                              } else {
                                                this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto3, exp.telefonoContacto3, exp.puestoContacto3, exp.correoContacto3).subscribe((contacto3) => {
                                                  if (contacto3) {
                                                    this.numContactosRegistrados++;
                                                    if ((exp.nombreContacto4 != 'undefined') && (exp.nombreContacto4 != undefined)) {
                                                      if (exp.correoContacto4 == 'undefined' || exp.correoContacto4 == undefined) {
                                                        exp.correoContacto4 = "";
                                                      }
                                                      if (exp.telefonoContacto4 == 'undefined' || exp.telefonoContacto4 == undefined) {
                                                        exp.telefonoContacto4 = "";
                                                      }
                                                      if (exp.puestoContacto4 == 'undefined' || exp.puestoContacto4 == undefined) {
                                                        exp.puestoContacto4 = "";
                                                      }

                                                      if (exp.telefonoContacto4 != "") {
                                                        if ((exp.telefonoContacto4.length > 15) || (exp.telefonoContacto4.length < 10)) {
                                                          this.numTelefonosInvalidos++;
                                                        } else {
                                                          this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                            if (contacto4) { this.numContactosRegistrados++; }
                                                          }, error => {
                                                            this.errorHTTP(error.status);
                                                          })
                                                        }
                                                      } else {
                                                        this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                          if (contacto4) { this.numContactosRegistrados++; }
                                                        }, error => {
                                                          this.errorHTTP(error.status);
                                                        })
                                                      }
                                                    }
                                                  }
                                                }, error => {
                                                  this.errorHTTP(error.status);
                                                })
                                              }
                                            }
                                          }
                                        }, error => {
                                          this.errorHTTP(error.status);
                                        })
                                      }
                                    } else {
                                      this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto2, exp.telefonoContacto2, exp.puestoContacto2, exp.correoContacto2).subscribe((contacto2) => {

                                        if (contacto2) {
                                          this.numContactosRegistrados++;
                                          if ((exp.nombreContacto3 != 'undefined') && (exp.nombreContacto3 != undefined)) {
                                            if (exp.correoContacto3 == 'undefined' || exp.correoContacto3 == undefined) {
                                              exp.correoContacto3 = "";
                                            }
                                            if (exp.telefonoContacto3 == 'undefined' || exp.telefonoContacto3 == undefined) {
                                              exp.telefonoContacto3 = "";
                                            }
                                            if (exp.puestoContacto3 == 'undefined' || exp.puestoContacto3 == undefined) {
                                              exp.puestoContacto3 = "";
                                            }

                                            if (exp.telefonoContacto3 != "") {
                                              if ((exp.telefonoContacto3.length > 15) || (exp.telefonoContacto3.length < 10)) {
                                                this.numTelefonosInvalidos++;
                                              } else {
                                                this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto3, exp.telefonoContacto3, exp.puestoContacto3, exp.correoContacto3).subscribe((contacto3) => {

                                                  if (contacto3) {
                                                    this.numContactosRegistrados++;

                                                    if ((exp.nombreContacto4 != 'undefined') && (exp.nombreContacto4 != undefined)) {
                                                      if (exp.correoContacto4 == 'undefined' || exp.correoContacto4 == undefined) {
                                                        exp.correoContacto4 = "";
                                                      }
                                                      if (exp.telefonoContacto4 == 'undefined' || exp.telefonoContacto4 == undefined) {
                                                        exp.telefonoContacto4 = "";
                                                      }
                                                      if (exp.puestoContacto4 == 'undefined' || exp.puestoContacto4 == undefined) {
                                                        exp.puestoContacto4 = "";
                                                      }

                                                      if (exp.telefonoContacto4 != "") {
                                                        if ((exp.telefonoContacto4.length > 15) || (exp.telefonoContacto4.length < 10)) {
                                                          this.numTelefonosInvalidos++;
                                                        } else {
                                                          this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                            if (contacto4) { this.numContactosRegistrados++; }
                                                          }, error => {
                                                            this.errorHTTP(error.status);
                                                          })
                                                        }
                                                      } else {
                                                        this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                          if (contacto4) { this.numContactosRegistrados++; }
                                                        }, error => {
                                                          this.errorHTTP(error.status);
                                                        })
                                                      }
                                                    }
                                                  }
                                                }, error => {
                                                  this.errorHTTP(error.status);
                                                })
                                              }
                                            } else {
                                              this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto3, exp.telefonoContacto3, exp.puestoContacto3, exp.correoContacto3).subscribe((contacto3) => {
                                                if (contacto3) {
                                                  this.numContactosRegistrados++;

                                                  if ((exp.nombreContacto4 != 'undefined') && (exp.nombreContacto4 != undefined)) {
                                                    if (exp.correoContacto4 == 'undefined' || exp.correoContacto4 == undefined) {
                                                      exp.correoContacto4 = "";
                                                    }
                                                    if (exp.telefonoContacto4 == 'undefined' || exp.telefonoContacto4 == undefined) {
                                                      exp.telefonoContacto4 = "";
                                                    }
                                                    if (exp.puestoContacto4 == 'undefined' || exp.puestoContacto4 == undefined) {
                                                      exp.puestoContacto4 = "";
                                                    }

                                                    if (exp.telefonoContacto4 != "") {
                                                      if ((exp.telefonoContacto4.length > 15) || (exp.telefonoContacto4.length < 10)) {
                                                        this.numTelefonosInvalidos++;
                                                      } else {
                                                        this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                          if (contacto4) { this.numContactosRegistrados++; }
                                                        }, error => {
                                                          this.errorHTTP(error.status);
                                                        })
                                                      }
                                                    } else {
                                                      this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                        if (contacto4) { this.numContactosRegistrados++; }
                                                      }, error => {
                                                        this.errorHTTP(error.status);
                                                      })
                                                    }
                                                  }
                                                }
                                              }, error => {
                                                this.errorHTTP(error.status);
                                              })
                                            }
                                          }
                                        }
                                      }, error => {
                                        this.errorHTTP(error.status);
                                      })
                                    }
                                  }
                                }
                              }, error => {
                                this.errorHTTP(error.status);
                              })
                            }
                          } else {
                            this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto, exp.telefonoContacto, exp.puestoContacto, exp.correoContacto).subscribe((contacto1) => {

                              if (contacto1) {
                                this.numContactosRegistrados++;

                                if ((exp.nombreContacto2 != 'undefined') && (exp.nombreContacto2 != undefined)) {
                                  if (exp.correoContacto2 == 'undefined' || exp.correoContacto2 == undefined) {
                                    exp.correoContacto2 = "";
                                  }
                                  if (exp.telefonoContacto2 == 'undefined' || exp.telefonoContacto2 == undefined) {
                                    exp.telefonoContacto2 = "";
                                  }
                                  if (exp.puestoContacto2 == 'undefined' || exp.puestoContacto2 == undefined) {
                                    exp.puestoContacto2 = "";
                                  }

                                  if (exp.telefonoContacto2 != "") {
                                    if ((exp.telefonoContacto2.length > 15) || (exp.telefonoContacto2.length < 10)) {
                                      this.numTelefonosInvalidos++;
                                    } else {
                                      this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto2, exp.telefonoContacto2, exp.puestoContacto2, exp.correoContacto2).subscribe((contacto2) => {

                                        if (contacto2) {
                                          this.numContactosRegistrados++;

                                          if ((exp.nombreContacto3 != 'undefined') && (exp.nombreContacto3 != undefined)) {
                                            if (exp.correoContacto3 == 'undefined' || exp.correoContacto3 == undefined) {
                                              exp.correoContacto3 = "";
                                            }
                                            if (exp.telefonoContacto3 == 'undefined' || exp.telefonoContacto3 == undefined) {
                                              exp.telefonoContacto3 = "";
                                            }
                                            if (exp.puestoContacto3 == 'undefined' || exp.puestoContacto3 == undefined) {
                                              exp.puestoContacto3 = "";
                                            }

                                            if (exp.telefonoContacto3 != "") {
                                              if ((exp.telefonoContacto3.length > 15) || (exp.telefonoContacto3.length < 10)) {
                                                this.numTelefonosInvalidos++;
                                              } else {
                                                this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto3, exp.telefonoContacto3, exp.puestoContacto3, exp.correoContacto3).subscribe((contacto3) => {

                                                  if (contacto3) {
                                                    this.numContactosRegistrados++;

                                                    if ((exp.nombreContacto4 != 'undefined') && (exp.nombreContacto4 != undefined)) {
                                                      if (exp.correoContacto4 == 'undefined' || exp.correoContacto4 == undefined) {
                                                        exp.correoContacto4 = "";
                                                      }
                                                      if (exp.telefonoContacto4 == 'undefined' || exp.telefonoContacto4 == undefined) {
                                                        exp.telefonoContacto4 = "";
                                                      }
                                                      if (exp.puestoContacto4 == 'undefined' || exp.puestoContacto4 == undefined) {
                                                        exp.puestoContacto4 = "";
                                                      }

                                                      if (exp.telefonoContacto4 != "") {
                                                        if ((exp.telefonoContacto4.length > 15) || (exp.telefonoContacto4.length < 10)) {
                                                          this.numTelefonosInvalidos++;
                                                        } else {
                                                          this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                            if (contacto4) { this.numContactosRegistrados++; }
                                                          }, error => {
                                                            this.errorHTTP(error.status);
                                                          })
                                                        }
                                                      } else {
                                                        this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                          if (contacto4) { this.numContactosRegistrados++; }
                                                        }, error => {
                                                          this.errorHTTP(error.status);
                                                        })
                                                      }
                                                    }
                                                  }
                                                }, error => {
                                                  this.errorHTTP(error.status);
                                                })
                                              }
                                            } else {
                                              this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto3, exp.telefonoContacto3, exp.puestoContacto3, exp.correoContacto3).subscribe((contacto3) => {
                                                if (contacto3) {
                                                  this.numContactosRegistrados++;

                                                  if ((exp.nombreContacto4 != 'undefined') && (exp.nombreContacto4 != undefined)) {
                                                    if (exp.correoContacto4 == 'undefined' || exp.correoContacto4 == undefined) {
                                                      exp.correoContacto4 = "";
                                                    }
                                                    if (exp.telefonoContacto4 == 'undefined' || exp.telefonoContacto4 == undefined) {
                                                      exp.telefonoContacto4 = "";
                                                    }
                                                    if (exp.puestoContacto4 == 'undefined' || exp.puestoContacto4 == undefined) {
                                                      exp.puestoContacto4 = "";
                                                    }

                                                    if (exp.telefonoContacto4 != "") {
                                                      if ((exp.telefonoContacto4.length > 15) || (exp.telefonoContacto4.length < 10)) {
                                                        this.numTelefonosInvalidos++;
                                                      } else {
                                                        this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                          if (contacto4) { this.numContactosRegistrados++; }
                                                        }, error => {
                                                          this.errorHTTP(error.status);
                                                        })
                                                      }
                                                    } else {
                                                      this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                        if (contacto4) { this.numContactosRegistrados++; }
                                                      }, error => {
                                                        this.errorHTTP(error.status);
                                                      })
                                                    }
                                                  }
                                                }
                                              }, error => {
                                                this.errorHTTP(error.status);
                                              })
                                            }
                                          }
                                        }
                                      }, error => {
                                        this.errorHTTP(error.status);
                                      })
                                    }
                                  } else {
                                    this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto2, exp.telefonoContacto2, exp.puestoContacto2, exp.correoContacto2).subscribe((contacto2) => {

                                      if (contacto2) {
                                        this.numContactosRegistrados++;

                                        if ((exp.nombreContacto3 != 'undefined') && (exp.nombreContacto3 != undefined)) {
                                          if (exp.correoContacto3 == 'undefined' || exp.correoContacto3 == undefined) {
                                            exp.correoContacto3 = "";
                                          }
                                          if (exp.telefonoContacto3 == 'undefined' || exp.telefonoContacto3 == undefined) {
                                            exp.telefonoContacto3 = "";
                                          }
                                          if (exp.puestoContacto3 == 'undefined' || exp.puestoContacto3 == undefined) {
                                            exp.puestoContacto3 = "";
                                          }

                                          if (exp.telefonoContacto3 != "") {
                                            if ((exp.telefonoContacto3.length > 15) || (exp.telefonoContacto3.length < 10)) {
                                              this.numTelefonosInvalidos++;
                                            } else {
                                              this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto3, exp.telefonoContacto3, exp.puestoContacto3, exp.correoContacto3).subscribe((contacto3) => {

                                                if (contacto3) {
                                                  this.numContactosRegistrados++;

                                                  if ((exp.nombreContacto4 != 'undefined') && (exp.nombreContacto4 != undefined)) {
                                                    if (exp.correoContacto4 == 'undefined' || exp.correoContacto4 == undefined) {
                                                      exp.correoContacto4 = "";
                                                    }
                                                    if (exp.telefonoContacto4 == 'undefined' || exp.telefonoContacto4 == undefined) {
                                                      exp.telefonoContacto4 = "";
                                                    }
                                                    if (exp.puestoContacto4 == 'undefined' || exp.puestoContacto4 == undefined) {
                                                      exp.puestoContacto4 = "";
                                                    }

                                                    if (exp.telefonoContacto4 != "") {
                                                      if ((exp.telefonoContacto4.length > 15) || (exp.telefonoContacto4.length < 10)) {
                                                        this.numTelefonosInvalidos++;
                                                      } else {
                                                        this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                          if (contacto4) { this.numContactosRegistrados++; }
                                                        }, error => {
                                                          this.errorHTTP(error.status);
                                                        })
                                                      }
                                                    } else {
                                                      this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                        if (contacto4) { this.numContactosRegistrados++; }
                                                      }, error => {
                                                        this.errorHTTP(error.status);
                                                      })
                                                    }
                                                  }
                                                }
                                              }, error => {
                                                this.errorHTTP(error.status);
                                              })
                                            }
                                          } else {
                                            this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto3, exp.telefonoContacto3, exp.puestoContacto3, exp.correoContacto3).subscribe((contacto3) => {
                                              if (contacto3) {
                                                this.numContactosRegistrados++;

                                                if ((exp.nombreContacto4 != 'undefined') && (exp.nombreContacto4 != undefined)) {
                                                  if (exp.correoContacto4 == 'undefined' || exp.correoContacto4 == undefined) {
                                                    exp.correoContacto4 = "";
                                                  }
                                                  if (exp.telefonoContacto4 == 'undefined' || exp.telefonoContacto4 == undefined) {
                                                    exp.telefonoContacto4 = "";
                                                  }
                                                  if (exp.puestoContacto4 == 'undefined' || exp.puestoContacto4 == undefined) {
                                                    exp.puestoContacto4 = "";
                                                  }

                                                  if (exp.telefonoContacto4 != "") {
                                                    if ((exp.telefonoContacto4.length > 15) || (exp.telefonoContacto4.length < 10)) {
                                                      this.numTelefonosInvalidos++;
                                                    } else {
                                                      this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                        if (contacto4) { this.numContactosRegistrados++; }
                                                      }, error => {
                                                        this.errorHTTP(error.status);
                                                      })
                                                    }
                                                  } else {
                                                    this.ventasService.saveContactoSinF(expositor.id, exp.nombreContacto4, exp.telefonoContacto4, exp.puestoContacto4, exp.correoContacto4).subscribe((contacto4) => {
                                                      if (contacto4) { this.numContactosRegistrados++; }
                                                    }, error => {
                                                      this.errorHTTP(error.status);
                                                    })
                                                  }
                                                }
                                              }
                                            }, error => {
                                              this.errorHTTP(error.status);
                                            })
                                          }
                                        }
                                      }
                                    }, error => {
                                      this.errorHTTP(error.status);
                                    })
                                  }
                                }
                              }
                            }, error => {
                              this.errorHTTP(error.status);
                            })
                          }
                        } else {
                          this.contactosNoRegistrados++;
                        }
                      }
                    }, error => {
                      this.errorHTTP(error.status);
                    })
                  }
                } else {
                  this.numNoRegistros++;
                }
              }
            }
          });
          setTimeout(() => {
            this.spinnerD.hide("crmSpinner");
            this.loadExcel = true;
            $("#subirExcelFile").val("");
            this.miCartera();
          }, 2000);

        } else {
          this.errors = "Existen columnas en el archivo no especificadas.";
          setTimeout(() => {
            this.spinnerD.hide("crmSpinner");
            this.loadExcel = true;
            $("#subirExcelFile").val("");
          }, 1500);
        }
      };
      reader.readAsBinaryString(target.files[0]);
      reader.onloadend = (e) => {
        this.keys = Object.keys(this.data[0]);
        this.dataSheet.next(this.data);
      }
    }
  }

  limpiarContadores() {
    this.countProspecto = 0;
    this.countContactado = 0;
    this.countPosibleCliente = 0;
    this.countCotizado = 0;
    this.countCotizacionR = 0;
    this.countCotizacionA = 0;
  }

  getHistorialCrm(x) {
    this.historial = false;
    this.historialExpH = [];
    this.ventasService.getHistorialExpositorH(x).subscribe(h => {
      if (h.length > 0) {
        this.historial = true;
        this.historialExpH = h;
      }
    }, error => {
      this.errorHTTP(error.status);
    })
  }


  /**************** C A R L O S ********************************************/

  // N u e v a  f u n c i o n e s  29/01/20
  private validaFormH() {
    this.formTems = this.fb.group({
      descripcion: ['',],
      fecha_programado: ['', Validators.required],
      hora_programado: ['', Validators.required]

    })
  }

  public envioYa() {

    this.envioY = true;
    this.tTratar.forEach(element => {


      var num = this.nuevoCliente.telefono;
      var body = element.temas;
      this.newInsert.phone = num;
      this.newInsert.body = body;

      const idExpo = this.nuevoCliente.id;
      const fecha = new Date();

      this.saveSms.tipo = 0;
      this.saveSms.descripcion = element.temas;
      this.saveSms.fecha_programado = fecha;
      this.saveSms.status = "1";
      this.ventasService.createsmsWhats(this.saveSms, idExpo)
        .subscribe((res) => {
          Swal.fire('Buen Trabajo!',
            'Mensaje Entregado y Guardado con Exito',
            'success')
          this.getSmsW(idExpo);
          this.formTems.reset();
          this.tTratar = [];
          this.Pdf = [];
          this.archivos = [];
        });
      this.wApp.sendWhatsApp(this.newInsert)
        .subscribe(c => {

        });
    });
    this.enviarto();

  }
  public envioP() {

    this.envioY = true;
    let count = 0;
    let fecha = '';


    const idExpo = this.nuevoCliente.id;
    const fCha = this.formTems.controls['fecha_programado'].value;
    const hRa = this.formTems.controls['hora_programado'].value;
    const año = fCha.slice(0, 4);
    const mes = fCha.slice(5, 7);
    const dia = fCha.substr(-2);
    const hr = hRa.slice(0, 2);
    const min = hRa.slice(3, 5);
    const horaA = new Date(año, mes - 1, dia, hr, min, 0);
    let fechaR = formatDate(horaA, 'yyyy-MM-dd HH:mm:ss.SSS', 'es-MX');


    this.tTratar.forEach(element => {
      let saveSmsR = new WhatsAppContacto();
      saveSmsR.tipo = 0;
      saveSmsR.descripcion = element.temas;
      saveSmsR.fecha_programado = horaA;
      saveSmsR.status = "0";

      if (this.Pdf.length == 0) {

        this.ventasService.createsmsWhats(saveSmsR, idExpo)
          .subscribe((res) => {

            this.getSmsW(idExpo);
            this.formTems.reset();
            this.tTratar = [];
            this.Pdf = [];

            this.envioY = false;
            document.getElementById('datetime').style.display = 'none';
          });
      } else {
        this.listSms.push(saveSmsR);
        count = count + 1;

      }
    });
    if (this.tTratar.length == 0 && this.Pdf.length > 0) {
      this.archivos.forEach(archivo => {
        this.ventasService.upload(archivo, fechaR, this.nuevoCliente.id)
          .subscribe(c => {
            this.getSmsW(idExpo);
            this.Pdf = [];
            this.listSms = [];
            this.formTems.reset();
            this.tTratar = [];
            this.archivos = [];
            this.envioY = false;
            document.getElementById('datetime').style.display = 'none';
          });
      })
      this.envioY = false;
      this.envioY = true;
      Swal.fire(
        'Buen Trabajo !',
        'El mensaje sera enviado el día ' + this.formatDate(fechaR) + ' a las ' + this.Hora(fechaR.slice(11, 16)) + ' !',
        'success'
      )

    } else {
      this.envioY = false;
      this.envioY = true;
      Swal.fire(
        'Buen Trabajo !',
        'El mensaje sera enviado el día ' + this.formatDate(this.formTems.controls['fecha_programado'].value) + ' a las ' + this.Hora(this.formTems.controls['hora_programado'].value) + ' !',
        'success'
      )
    }
    if (this.tTratar.length > 0 && this.Pdf.length > 0) {
      if (this.listSms.length == count) {

        this.enviartwo();

      } else {

        this.AgregarMensajes();
        this.Pdf = [];
        this.listSms = [];
        this.formTems.reset();
        this.tTratar = [];

      }
    }

  }
  public loadPdf: boolean = false;
  public envioY: boolean = false;

  private AgregarMensajes() {
    this.envioY = true;
    let fecha = '';



    const idExpo = this.nuevoCliente.id;
    this.listSms.forEach(element => {

      if (element.tipo != undefined) {
        ////////////////Mensajes
        this.ventasService.createsmsWhats(element, idExpo)
          .subscribe((res) => {

            this.getSmsW(idExpo);
            this.formTems.reset();
            this.tTratar = [];
            this.Pdf = [];
            this.listSms = [];
            this.archivos = [];
            this.envioY = false;
            document.getElementById('datetime').style.display = 'none';
          });
      } else {
        ////////////////PDF
        fecha = element.fecha;


      }
    });

    this.archivos.forEach(archivo => {
      this.ventasService.upload(archivo, fecha, this.nuevoCliente.id)

        .subscribe(c => {
          this.getSmsW(idExpo);
          this.Pdf = [];
          this.listSms = [];
          this.formTems.reset();
          this.tTratar = [];
        });
    })
    Swal.fire(
      'Buen Trabajo !',
      'El mensaje sera enviado el día ' + this.formatDate(fecha) + ' a las ' + this.Hora(fecha.slice(11, 16)) + ' !',
      'success'
    )
  }
  private formatDate(x): any {
    const fecha = x;


    moment.locale('es');
    const dateTime = moment(fecha);
    const full2 = dateTime.format('LL');
    return full2;
  }
  private Hora(x): any {

    let time = x.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [x];

    if (time.length > 1) {
      time = time.slice(1);
      time[5] = +time[0] < 12 ? '\tA.M.' : '\tP.M.';
      time[0] = +time[0] % 12 || 12;
    }
    return time.join('');

  }

  // E N V I O  D E  P D F  A  B A C K
  public enviartwo() {
    let count = 0;
    const idExpo = this.nuevoCliente.id;
    this.Pdf.forEach(element => {
      const fCha = this.formTems.controls['fecha_programado'].value;
      const hRa = this.formTems.controls['hora_programado'].value;
      const año = fCha.slice(0, 4);
      const mes = fCha.slice(5, 7);
      const dia = fCha.substr(-2);
      const hr = hRa.slice(0, 2);
      const min = hRa.slice(3, 5);
      let newSalida = new Date(año, mes - 1, dia, hr, min, 0);
      let fechaR = formatDate(newSalida, 'yyyy-MM-dd HH:mm:ss.SSS', 'es-MX');

      var num = this.nuevoCliente.telefono;
      const body = element.archivo;

      const filename = element.name;
      let pdfN = new EnviowPdfComponent();
      pdfN.phone = num;
      pdfN.body = body;
      pdfN.filename = filename;
      pdfN.fecha = fechaR;

      if (this.tTratar.length == 0) {
        this.ventasService.upload(this.pdFile, fechaR, this.nuevoCliente.id)
          .subscribe(c => {
            this.formTems.reset();
            this.tTratar = [];
            this.Pdf = [];
            this.getSmsW(idExpo);
            this.listSms = [];
            this.envioY = false;
            document.getElementById('datetime').style.display = 'none';

          });
      } else {
        this.listSms.push(pdfN);
        count = count + 1;
      }
    });
    if (this.Pdf.length > 0 && this.tTratar.length > 0) {
      if (this.listSms.length == count) {
        this.envioP();
        this.listSms = [];
        this.Pdf = [];
        this.formTems.reset();
        this.tTratar = [];
        this.envioY = false;
      } else {
        this.AgregarMensajes();
        this.listSms = [];
        this.Pdf = [];
        this.formTems.reset();
        this.tTratar = [];
        this.envioY = false;
      }
    }

  }

  // F I N  E N V I O  D E  P D F  A  B A C K

  public AgregaP() {
    this.tTratar.push({
      temas: this.saveSms.descripcion = this.formTems.controls['descripcion'].value
    });
    this.formTems.controls['descripcion'].reset();
  }
  AgregaPrevi(): string {
    let a = '';
    this.tTratar.forEach(element => {
      a += `${element.temas}\n`;
      // alert(element.temas);
    });
    return a;
  }

  btn(i: number) {
    this.tTratar.splice(i, 1);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Texto Eliminado !!',
      showConfirmButton: false,
      timer: 1500
    })

  }

  // Nueva funciones 29/01/20

  /**Fin Temas a Tratar */
  /********************************************Convercion de pdf a base64 ****************************************/

  public formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));



    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  public handleFileSelect(evt) {
    // document.querySelector("div").innerHTML = JSON.stringify(this.archivos);
    this.base64textString = "";
    this.nombrePdf = "";
    this.size = "";

    var files = evt.target.files;
    var file = files[0];

    var extensiones_permitidas = new Array(".pptx", ".xls", ".docx", ".pdf");
    let extension = file.name.substring(file.name.lastIndexOf('.'), file.name.length);
    let permitida = false;

    for (var i = 0; i < extensiones_permitidas.length; i++) {
      if (extensiones_permitidas[i] == extension) {
        permitida = true;
        break;
      }
    }
    if (!permitida) {

      Swal.fire({
        icon: 'error',
        text: 'Extensión no permitida.  \nSólo se pueden subir archivos con extensiones: ' + extensiones_permitidas.join()
      })
    } else if (file.size > "104857600") {
      Swal.fire({
        icon: 'error',
        text: '1 Documento que intentaste añadir es mayor al límite de 100 MB.'
      })

    } else if (file.size <= "104857600") {
      this.loadPdf = true;
      if (files && file) {

        this.pdFile = evt.target.files[0];
        this.pdFile = evt.target.files[0];
        this.archivos.push(evt.target.files[0]);

        this.nombrePdf = file.name;
        this.size = file.size;
        this.tipoAr = extension;

        var reader = new FileReader();
        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);

        return 1;
      }

    }

  }

  public _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    this.loadPdf = false;
    this.createPdf();

  }
  public createPdf() {
    $("#uploadCaptureInputFile").val('');
    const eje = this.base64textString;
    let pdfs = "data:application/pdf;base64," + eje;

    this.formatBytes(this.size);
    this.Pdf.push({
      archivo: pdfs,
      name: this.nombrePdf,
      size: this.formatBytes(this.size),
      tipoAr: this.tipoAr
    });
  }

  deletePdf(i: number) {
    this.Pdf.splice(i, 1);
    this.archivos.splice(i, 1);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Archivo Eliminado !!',
      showConfirmButton: false,
      timer: 1500
    })

  }

  /*****************************************************Fin convercion de pdf a base64 ***************************************************/
  /**enviartwo envia pdf´s */

  public enviarto() {

    this.envioY = false;

    this.Pdf.forEach(element => {

      var num = this.nuevoCliente.telefono;
      const body = element.archivo;
      const filename = element.name;

      this.pdfInsert.phone = num;
      this.pdfInsert.body = body;
      this.pdfInsert.filename = filename;


      this.Pdfs.createPdf(this.pdfInsert)
        .subscribe(c => {


          this.Pdf = [];
          this.archivos = [];
        });
    });
  }

  /**Valida el dia  */
  mostrartime() {
    var f = new Date();
    this.validaDia = new Date(f.getTime() - (f.getTimezoneOffset() * 60000))
      .toISOString()
      .split("T")[0];
  }

  mostrardatetime() {
    var f = new Date();

    this.validaDia = new Date(f.getTime() - (f.getTimezoneOffset() * 60000))
      .toISOString()
      .split("T")[0];

    this.envioY = true;
    document.getElementById('datetime').style.display = 'block';
  }
  ocultardatetime() {
    document.getElementById('datetime').style.display = 'none';
    this.envioY = false;
    this.formTems.reset();
  }
  /**Fin Carlos */

  /**************** M E T O D O S   C A R L O S ********************************************/

  /** M E T O D O S  E M A I L ' S */
  public dataEmail: Array<EmailContacto> = new Array<EmailContacto>();
  public dataEmailP: Array<EmailContacto> = new Array<EmailContacto>();

  getshowEmail(res) {
    this.emailsele = null;
    this.dataEmail = [];
    this.dataEmailP = [];

    this.ventasService.getemailContacto(res).subscribe((result) => {
      this.dataEmail = result.filter(e => e.status == 0);
      this.dataEmailP = result.filter(e => e.status == 1);
    });
  }

  /** METODO PARA VER FIRMAS  */

  // public editFirma: Array<FirmaEmail> = new Array<FirmaEmail>();
  public verFirma() {
    this.ventasService.getFirmas().subscribe((result) => {

      if (result.length == 0) {
        return this.showFirma = null;
      }
      this.showFirma = result;
      //this.editFirma = result;

    })
  }
  /**METODO PARA VER QUE PDF LE CORRESPONDE AL EMAILCONTACTO */
  public verPdf() {
    let showPdf = this.nuvoPdf;
    this.ventasService.getPdfs(showPdf).subscribe(
      archivosPdf => this.archivosPdf = archivosPdf
    );
  }

  /**MOSTRAR DETALLES EMAIL */
  genEmails(res: EmailContacto) {
    this.emailsele = res;
    this.nuvoPdf = res.id;
    this.firmasele = res.firma;
    this.verPdf();
    this.otrapantalla = false;
    // console.log(this.urlPdfs);
    // console.log(this.emailsele  = this.emailContact[res].firma);
  }


  /**************** Email ********************************************/

  /** Envio Email Programados */
  private validaFormEmailProgramado() {
    this.formemailPro = this.fb.group({
      fecha_programado: ['', Validators.required],
      hora_programado: ['Hora', Validators.required],
      minuto_programado: ['Minuto', Validators.required]
    })
  }

  /** Envion Email Programado*/
  public horaPro() {

    var fechaHo = new Date();
    let idFirma = this.formEmail.controls.firma.value;
    if (idFirma === null) {
      idFirma = 1;
    }
    var horaP = this.formemailPro.controls.hora_programado.value;
    var minutoP = this.formemailPro.controls.minuto_programado.value;
    var diaP = this.formemailPro.controls.fecha_programado.value;

    const año = diaP.slice(0, 4);
    const mes = diaP.slice(5, 7);
    const dia = diaP.substr(-2);

    const horaPr = new Date(año, mes - 1, dia, horaP, minutoP, 0);
    const horaA = new Date(año, mes - 1, dia, horaP, minutoP, 0);

    this.saveEmail.contacto_expositor = this.nuevoCliente.id;
    this.saveEmail.firma = this.showFirma.find(f => f.id == idFirma);
    this.saveEmail.asunto = this.formEmail.controls.asunto.value;
    this.saveEmail.descripcion = this.formEmail.controls.descripcion.value;
    this.saveEmail.fecha_programado = horaPr;
    this.saveEmail.status = 1;

    var horas = fechaHo.getHours();
    var minutos = fechaHo.getMinutes();

    horaA.setHours(0, 0, 0, 0);
    fechaHo.setHours(0, 0, 0, 0);

    if (fechaHo.getTime() == horaA.getTime()) {
      if (horas >= horaP && minutos >= minutoP) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'info',
          title: 'No puedes mandar el correo a una hora menor ??',
          showConfirmButton: false,
          timer: 1500
        })

      } else {
        this.ventasService.createCorreo(this.saveEmail, this.nuevoCliente.id, this.authService.user.id)
          .subscribe((result) => {
            Swal.fire('Buen Trabajo!',
              'Email Programado con Exito',
              'success')
            this.getshowEmail(this.nuevoCliente.id);
            this.formEmail.reset();
            this.formemailPro.reset();
            this.validaFormEmailProgramado();
            let idAx = result.Email.id;

            if (!this.fotoSeleccionada) {
              this.formEmail.reset();
              this.archivosE = [];
              this.archivosFirma = [];

            } else {
              this.archivosE.forEach(archivo => {
                this.ventasService.createarchivoContacto(archivo, idAx)
                  .subscribe((result) => {
                    if (result.type === HttpEventType.UploadProgress) {
                      this.progreso = Math.round((result.loaded / result.total) * 100);
                    } else if (result.type === HttpEventType.Response) {
                      let response: any = result.body;
                      this.saveEmail = response.saveEmail as EmailContacto;
                    }
                    this.formEmail.reset();
                    this.validaFormEmailProgramado();
                    this.archivosE = [];
                    this.archivosFirma = [];

                  })

              })
            }


          })
      }
    } else {
      this.ventasService.createCorreo(this.saveEmail, this.nuevoCliente.id, this.authService.user.id)
        .subscribe((result) => {
          Swal.fire('Buen Trabajo!',
            'Email Programado con Exito',
            'success')
          this.getshowEmail(this.nuevoCliente.id);
          this.formEmail.reset();
          this.formemailPro.reset();
          this.validaFormEmailProgramado();
          let idAx = result.Email.id;

          if (!this.fotoSeleccionada) {
            this.formEmail.reset();
            this.archivosE = [];
            this.archivosFirma = [];

          } else {
            this.archivosE.forEach(archivo => {
              this.ventasService.createarchivoContacto(archivo, idAx)
                .subscribe((result) => {
                  if (result.type === HttpEventType.UploadProgress) {
                    this.progreso = Math.round((result.loaded / result.total) * 100);
                  } else if (result.type === HttpEventType.Response) {
                    let response: any = result.body;
                    this.saveEmail = response.saveEmail as EmailContacto;
                  }
                  this.formEmail.reset();
                  this.validaFormEmailProgramado();

                  this.archivosE = [];
                  this.archivosFirma = [];

                })

            })
          }


        })
    }



  }

  /** Envio Email Normal */
  private validateFormEmail() {
    this.formEmail = this.fb.group({
      firma: ['', Validators.required],
      asunto: ['', Validators.required],
      descripcion: ['', Validators.required],

    })
  }

  /** Envio Email Normales */

  public envioEmail() {
    const fecha = new Date();
    let idFirma = this.formEmail.controls.firma.value;
    if (idFirma === null) {
      idFirma = 6;
    }
    //console.log(idFirma);


    this.saveEmail.firma = this.showFirma.find(f => f.id == idFirma);
    this.saveEmail.asunto = this.formEmail.controls.asunto.value;
    this.saveEmail.descripcion = this.formEmail.controls.descripcion.value;
    this.saveEmail.fecha_programado = fecha;
    this.saveEmail.status = 0;

    /**Guarda mensaje a BD */
    this.ventasService.createCorreo(this.saveEmail, this.nuevoCliente.id, this.authService.user.id)
      .subscribe((result) => {
        let idcEx = result.Email.id;
        //console.log(result);
        /**Guarda Archivos en BD */
        this.archivosE.forEach(archivo => {
          this.ventasService.createarchivoContacto(archivo, idcEx)
            .subscribe((result) => {

            })
        })
        /**Manda Mensaje y Archivos a Email */
        this.ventasService.sendEmailProgramed(idcEx)
          .subscribe((result) => {
            //console.log(result);

          }, error => {
            if (error.status == 500) {
              Swal.fire({
                icon: 'info',
                title: 'Error al enviar email.',
                showConfirmButton: false,
                timer: 1500
              })
              this.ventasService.deleteEmail(idcEx)
                .subscribe((res) => {
                  this.getshowEmail(this.nuevoCliente.id);

                })
            }

          })
        Swal.fire('Buen Trabajo!',
          'Email Enviado con Exito',
          'success')
        this.getshowEmail(this.nuevoCliente.id);
        this.formEmail.reset();
        this.archivosE = [];
        this.archivosFirma = [];

      })




  }

  /** Save Firmas */
  private validateFormFirma() {
    this.formFirma = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    })
  }
  /** Guardar Firmas */
  public saveFirmas() {

    const nombre = this.formFirma.controls.nombre.value;
    const descripcion = this.formFirma.controls.descripcion.value;
    const archivo = this.imgUpdate;

    if (!archivo) {
      this.ventasService.createfirmaImg(descripcion, nombre).subscribe((res) => {
        if (res) {
          Swal.fire('Buen Trabajo!',
            'Firma Guardada con Exito',
            'success')
          this.formFirma.reset();
          this.verFirma();

        }
      }, error => {
        this.errorHTTP(error.status);
      });
    } else {
      this.ventasService.createFirmas(archivo, nombre, descripcion).subscribe((res) => {
        if (res) {
          Swal.fire('Buen Trabajo!',
            'Firma Guardada con Exito',
            'success')
          this.formFirma.reset();
          this.verFirma();

        }
      }, error => {
        this.errorHTTP(error.status);
      });
    }
    $("#Firmas").val('');
  }

  /**Ver Firmas */
  public onEditClick(c) {
    this.btnActulizar = false;
    this.ventasService.getFirma(c).subscribe((result) => {
      this.firmaEmail = result;
      this.nombreEditFirma = result.nombre;
      this.nombreEditdescrip = result.descripcion;

      this.updaFirma.patchValue({
        nombre:this.nombreEditFirma,
        descripcion:this.nombreEditdescrip
      })
    });
  }

  /**Editar Firma*/

  /** Borrar Email */
  
  public borrarE(sts) {    
    if (sts == 0) {
      this.dataEmail.forEach((element, index:number) => {
        if (element.checked) {
          this.ventasService.deleteEmail(element.id).subscribe((res) => {
            this.getshowEmail(this.nuevoCliente.id);
          });
          //console.log(element.id);

        }
        if(index+1 == this.dataEmail.length){
          Swal.fire('EMAIL!',
          'Borrado con éxito',
          'warning')
        }
      })

    } else if (sts == 1) {
      this.dataEmailP.forEach((element, inde:number) => {
        if (element.checked) {
          this.ventasService.deleteEmail(element.id).subscribe((res) => {
            this.getshowEmail(this.nuevoCliente.id);
          });
          // console.log(element.id);

        }
        if(inde+1 == this.dataEmailP.length){
          Swal.fire('EMAIL!',
          'Borrado con éxito',
          'warning')
        }
      })
    }
  
  }

  /**Seleccionar todos Email Normales*/
  public deleteE = false; 
  public checkTrue: Array<EmailContacto> = new Array<EmailContacto>();
  getEmailId(e: any, sts: number, x: EmailContacto) {
    let o = document.getElementById("myDIV");
    if(e.checked === true){
      $("#myDIV").hide();
      this.deleteE = true;
    }
    
   
    let email: EmailContacto = null;
    if (sts == 0) {
      email = this.dataEmail.find(de => de.id == x.id);
      email.checked = e.checked;
      

    } else if (sts == 1) {
      email = this.dataEmailP.find(dep => dep.id == x.id);
      email.checked = e.checked;
    }
  }
   
  seleccionarTodo(e: any, sts) {     
        if (sts == 0) {         
      this.dataEmail.forEach(element => {
        element.checked = e.checked;
        
      });
    } else if (sts == 1) {
      this.dataEmailP.forEach(element => {
        element.checked = e.checked;
      });
    }
    // console.log(this.dataEmail);

  }
  eCheckedAll(sts): boolean {
    let veri = 0;
    if (sts == 0) {
      this.dataEmail.forEach(x => {
        if (x.checked) {                    
          veri += 1;
        }
      });
      if (veri === this.dataEmail.length) { 
        this.deleteE=true;       
        return true;
        
      }
    } else if (sts == 1) {
      this.dataEmailP.forEach(x => {
        if (x.checked) {
          veri += 1;
        }
      });
      if (veri === this.dataEmailP.length) {
        this.deleteE=true;  
        return true;
      }
    }
    this.deleteE=false; 
    return false;
  }
  /**Subida de Archivos */
  save(evt) {
    this.nombrePdf = "";
    this.size = "";

    var files = evt.target.files;
    var file = files[0];



    var extensiones_permitidas = new Array(".pptx", ".ppsx", ".pps", ".xlsx", ".odt", ".xls", ".docx", ".doc", ".txt", ".pdf", ".svg", ".ico", ".gif", ".jpeg", ".jpg", ".png");
    let extension = file.name.substring(file.name.lastIndexOf('.'), file.name.length);
    let permitida = false;

    for (var i = 0; i < extensiones_permitidas.length; i++) {
      if (extensiones_permitidas[i] == extension) {
        permitida = true;
        break;
      }
    } if (!permitida) {

      Swal.fire({
        icon: 'error',
        text: 'Extensión no permitida.'
      })
    } else if (file.size > "104857600") {
      Swal.fire({
        icon: 'error',
        text: '1 Documento que intentaste añadir es mayor al límite de 100 MB.'
      })

    } else if (file.size <= "104857600") {
      this.loadPdf = true;
      if (files && file) {

        this.fotoSeleccionada = evt.target.files[0];
        this.progreso = 0;
        this.archivosE.push(evt.target.files[0]);

        this.nombrePdf = file.name;
        this.size = file.size;
        this.tipoAr = extension;
        this.archivoFirma();
        //console.log("Nombre: "+ this.nombrePdf + " Peso Archivo: " + this.size + " Tipo: " + this.tipoAr );


        return 1;
      }

    }
  }
  /**Input Update */
  public updateF(evt) {
    this.imgUpdate = evt.target.files[0];

    //console.log(this.imgUpdate);

  }
  /** */

  public archivoFirma() {
    $("#ArchivoEmail").val('');
    this.formatBytes(this.size);
    this.archivosFirma.push({
      archivo: this.fotoSeleccionada,
      name: this.nombrePdf,
      size: this.formatBytes(this.size),
      tipoAr: this.tipoAr
    });
  }

  deleteArchivo(i: number) {
    this.archivosFirma.splice(i, 1);
    this.archivosE.splice(i, 1);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Archivo Eliminado !!',
      showConfirmButton: false,
      timer: 1500
    })

  }

  /**UpdateFirmas */
  private validateUpdateFirma() {
    this.updaFirma = this.fb.group({
      firma: [],
      nombre: ["", Validators.required],
      descripcion: ["", Validators.required]
    })
   
  }
  public updateFirmas() {
    const nombre = this.updaFirma.controls.nombre.value;
    const descripcion = this.updaFirma.controls.descripcion.value;
    const idFirma = this.updaFirma.controls.firma.value;
    const archivo = this.imgUpdate;

    if (!this.imgUpdate) {
      this.ventasService.updSign(idFirma, nombre, descripcion).subscribe((res) => {
        if (res) {
          this.verFirma();
          this.updaFirma.reset();
          this.btnActulizar = true;
          Swal.fire('¡Firma editada!', ``, 'success');
        }
      }, error => {
        this.errorHTTP(error.status);
      })
    } else {
      this.ventasService.updFirmas(idFirma, nombre, descripcion, archivo).subscribe((res) => {
        if (res) {
          this.verFirma();
          this.updaFirma.reset();
          this.btnActulizar = true;
          Swal.fire('¡Firma editada!', ``, 'success');

        }
      }, error => {
        this.errorHTTP(error.status);
      });
    }
    $("#Firmas").val('');
  }
  //console.log("Nombre: " + nombre + " Descripcion: " + descripcion + " Firma: " + idFirma + " Img: " + archivo);






  /**Validaciones  */


  public borrarMat() {
    this.btnDelete = true;
  }
  public borrarMat2() {
    this.btnDelete = false;
  }
  public cambio() {
    this.otrapantalla = true;
  }
  public cambios() {
    this.otrapantalla = false;
  }

  /**************** Email ********************************************/


  //ErrorHTTP
  private errorHTTP(status: number) {
    if (status == 401) {
      this.authService.logout();
      this.router.navigate(['/']);
    } else if (status == 500) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success btn-sm'
        },
        buttonsStyling: false
      })
      Swal.fire({
        customClass: {
          confirmButton: 'btn btn-info btn-sm'
        },
        title: "Server Error.",
        buttonsStyling: false,
        html: "<img src='./assets/img_project/excepciones/error500.jpg' class='img-fluid' alt='Server Error'>",
        confirmButtonText: 'Entiendo'
      })
    } else if (status == 0) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success btn-sm'
        },
        buttonsStyling: false
      })
      Swal.fire({
        customClass: {
          confirmButton: 'btn btn-info btn-sm'
        },
        title: "",
        buttonsStyling: false,
        html: "<img src='./assets/img_project/excepciones/errorConexion.jpg' class='img-fluid' alt='Error de conexion'>",
        confirmButtonText: 'Entiendo'
      })
    }
  }
}
