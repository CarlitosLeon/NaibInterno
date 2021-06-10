import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IncidenciaService } from 'src/app/menu-fm/service/incidencia.service';
import { CarteraEvento } from 'src/app/models/CarteraEvento';
import { EmailContacto } from 'src/app/models/EmailContacto';
import { FirmaEmail } from 'src/app/models/FirmaEmail';
import { AuthService } from 'src/app/users/service/auth.service';
import { VentasProspectosService } from '../ventas-prospectos/ventas-prospectos.component.service';
import Swal from 'sweetalert2';
import $ from 'jquery';
import { environment } from 'src/environments/environment.prod';
import { Router } from '@angular/router';
import { ContactoExpositor } from 'src/app/models/ContactoExpositor';
import { element } from 'protractor';

@Component({
  selector: 'app-email-masivos',
  templateUrl: './email-masivos.component.html',
  styleUrls: ['./email-masivos.component.css']
})
export class EmailMasivosComponent implements OnInit {

  public nuevoEmail: any;
  /** V A L I D A  E L  D I A */
  public validaDia: string;
  /**Ver Firmas con ID */
  urlPdfs: string = `${environment.endPointBack}/ventasProspectos/getImgFirma/`;
  public firmaEmail: FirmaEmail = new FirmaEmail();
  public nombreEditFirma: string = "";
  public nombreEditdescrip: string = "";
  public ArchivoEdit: string = "";
  /**Subir y editar Archivos Firmas */
  private imgUpdate: File;
  /** Subir Archivos */
  private fotoSeleccionada: File;
  private archivosE: File[] = [];
  public nombrePdf: string = "";
  public tipoAr: string = "";
  public archivosFirma: Array<{ archivo: File, name: string, tipoAr: string }> = [];
  /**Pais y ciudad */
  public misPaises: any = [];
  public misEstados: any = [];
  public Car: any = [];
  // ID EVENTO SELECCIONADO
  public idEventoSelected: number = null;
  /**Ver Firmas */
  firmasEmail: FirmaEmail[];
  /** F o r m  Envio Email */
  formemailM: FormGroup;
  saveEmail: EmailContacto = new EmailContacto();
  /** F o r m  e n v i o  e m a i l  p r o g r a m a d o */
  formemailPro: FormGroup;
  /** F O R M Subir y Editar Firma */
  formFirmas: FormGroup;
  updaFirma: FormGroup;
  /**Nuevas Lineas */
  vaPais: FormGroup;



  /** C O M B O  H O R A  Y  M I N U T O*/
  public listaHrs: string[] = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
  public listaMnts: string[] = ["00", "15", "30", "45"];

  /**SUMMERNOTE Editar Firmas */

  correoEdit: any = {

    tabsize: 2,
    height: '100px',
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
  /** SUMMERNOTE REGISTRO FIRMA */
  Firma: any = {

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

  /**SUMMERNOTE Envio Email */
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
  constructor(private fb: FormBuilder,
    private menu: IncidenciaService,
    private ventasService: VentasProspectosService,
    private authService: AuthService,
    private router: Router,) { }

  ngOnInit(): void {
    this.menu.openEvent.subscribe(h => {
      //console.log(h);

      this.idEventoSelected = h;
      //console.log(this.idEventoSelected);
      if (this.idEventoSelected != null && this.idEventoSelected != undefined && this.idEventoSelected != 0) {
        /**Nuevas Lineas */
        this.ValidEmail();
        this.verFirmas();
        this.seletCiudad();
        this.validarsubidaFirmas();
        this.validateUpdateFirma();
        this.validaFormEmailProgramado();
        this.mostrartime();
        this.validStatusP();
        this.borrarPC();

      }

    });
  }


  /** Ver Firmas */
  public verFirmas() {
    this.ventasService.getFirmas().subscribe((result) => {
      if (result.length == 0) {
        return this.firmasEmail = null;
      }
      this.firmasEmail = result;
    }

    );

  }

  /**Ver Ciudad y Pais */
  public misestadoS: any = [];
  misPaisesC: string[] = [];
  misEstadosC: string[] = [];
  public da: any = [];

  public dataEmail: Array<ContactoExpositor> = new Array<ContactoExpositor>();
  public dataContacto: Array<ContactoExpositor> = new Array<ContactoExpositor>();
  /**Nuevas Lineas */
  borrarPC() {
    this.misEstados = [];
    this.misEstadosC = [];
    this.misPaises = [];
    this.misPaisesC = [];
    this.misEstadosCP = [];

  }

  public validStatusP() {
    this.vaPais = this.fb.group({
      valPais: [''],
      valEstado: ['']

    })
  }
  /** Fin de nuevas Lineas */

  seletCiudad() {
    this.borrarPC();
    this.dataEmail = [];
    /**Borra Arreglo cuando se cambia de evento */
    this.dataContacto = [];

    this.ventasService.getMisExpositores(this.idEventoSelected).subscribe((res) => {
    
      this.misPaises = res;
      this.misEstados = res;
      this.Car = res;

      /**Ver Email */
      res.map((e: any) => {
        e.expositor.contactoExpositor.map((item) => {
          this.dataEmail.push({ idContacto: item.id, expositor: item.expositor, puesto: item.puesto, nombre: item.nombre, telefono: item.telefono, email: item.email, img: item.img, checked: false, msjWhats: item.msjWhats });
            
        })
      });     


      /** Ver Paises */
      let car = this.misPaises.map(pc => pc.expositor.pais);
      let col = car.filter(Boolean);
      col.forEach(element => {
        let x = element;
        let exist = this.misPaisesC.includes(x);
        if (!exist) {
          this.misPaisesC.push(x);
        }
      });

      this.checkTrue = this.dataEmail;
      this.dataContacto = this.dataEmail;
      
     // console.log(this.dataContacto);
      
    })
  }

  /**Buscador */  
  
  limpiar() {
    this.dataEmai = [];
    this.vaPais.reset();

  }

  searchContact(x: string) {
    this.limpiar();
    this.dataContacto = this.dataEmail;
    if (x !== '') {
      this.dataContacto = this.dataContacto.filter(p => p.email.toLowerCase().includes(x.toLowerCase()) ||
        p.nombre.toLowerCase().includes(x.toLowerCase()));
    }
  }
  /**Busqueda Paises */

  public dataEmai: Array<ContactoExpositor> = new Array<ContactoExpositor>();
  misEstadosCP: string[] = [];

  public paises(c) {    
      
    this.misEstadosCP = [];      
    this.dataEmai = [];
    //console.log(this.dataContacto);  
   
    if (c == 0) {
      this.dataContacto = this.dataEmail;  
      
    } else { 
      let Paises = this.Car.filter(p => p.expositor.pais === c);   
     
      Paises.map((e: any) => {
        e.expositor.contactoExpositor.map((item) => {
          this.dataEmai.push({idContacto: item.id, expositor: item.expositor, puesto: item.puesto, nombre: item.nombre, telefono: item.telefono, email: item.email, img: item.img, checked: false, msjWhats: item.msjWhats });           
          })
      });
      this.dataContacto = this.dataEmai;
     
      /**Nuevas Lineas */
      let Paises2 = Paises.map(pc => pc.expositor.estado);
      let myArrCleanE = Paises2.filter(Boolean);
      myArrCleanE.forEach(element => {
        let x = element;
        let exist = this.misEstadosCP.includes(x);
        if (!exist) {
          this.misEstadosCP.push(x);
        }
    
    
    
      });


    }
  }
  

  /**Busqueda Estados */

  public estados(c) {
    this.dataEmai = [];
    this.dataContacto = [];   


    /**Nuevas Lineas */
    if (c == 0) {
      this.dataContacto = this.dataEmail;
    } else {
      let estados = this.Car.filter(e => e.expositor.estado === c);
      estados.map((e: any) => {
        e.expositor.contactoExpositor.map((est) => {
          this.dataEmai.push({ idContacto: est.id, expositor: est.expositor, puesto: est.puesto, nombre: est.nombre, telefono: est.telefono, email: est.email, img: est.img, checked: false, msjWhats: est.msjWhats });
          
        });
      });
      this.dataContacto = this.dataEmai;
    }


  }

  /**Envio Email Normal */
  public loadEmail = true;
  private ValidEmail() {
    this.formemailM = this.fb.group({
      firma: [],
      asunto: ['', Validators.required],
      descripcion: ['', Validators.required],
    })
  }
  idExposi: number[] = [];
  public envioemailMasivo() {
    const fecha = new Date();
    let idFirmas = this.formemailM.controls.firma.value;
    if (idFirmas === null) {
      idFirmas = 1;
    }
    this.dataEmail.forEach((c, index: number) => {
      const idExpo = c.idContacto;
      if (c.checked) {
        this.saveEmail.firma = this.firmasEmail.find(f => f.id == idFirmas);
        this.saveEmail.asunto = this.formemailM.controls.asunto.value;
        this.saveEmail.descripcion = this.formemailM.controls.descripcion.value;
        this.saveEmail.fecha_programado = fecha;
        this.saveEmail.status = 0;

        /**Guarda mensaje a BD */
        this.ventasService.createCorreo(this.saveEmail, idExpo, this.authService.user.id)
          .subscribe((result) => {
            this.idExposi = [result.Email.id];
            this.idExposi.forEach((obj, inde: number) => {
              this.archivosE.forEach((archivo) => {
                this.ventasService.createarchivoContacto(archivo, obj)
                  .subscribe((result) => {
                    this.loadEmail = false;
                  }, error => {
                    this.errorHTTP(error.status);
                  });
                  
              });
              this.formemailM.reset();
              this.desmarcar();
              this.archivosFirma = [];
              $("#ArchivoEmail").val('');
              this.dataContacto = this.dataEmail;
              this.loadEmail = false;
              /**Manda Mensaje y Archivos a Email */
              this.ventasService.sendEmailProgramed(obj).subscribe((result) => {
                if(result){
                  console.log(index + 1 );                
                  console.log(inde + 1 );  
                  this.archivosE = [];
                  this.loadEmail = true;
                  if (index + 1 === inde + 1) {
                    Swal.fire('Buen Trabajo!',
                      'Email Enviado con Exito',
                      'success')
  
                  }else{
                    Swal.fire('Buen Trabajo!',
                    'Email Enviado con Exito',
                    'success')
                  }
                }
              

              }, error => {
                if (error.status == 500) {
                  Swal.fire({
                    icon: 'info',
                    title: 'Error al enviar email.',
                    showConfirmButton: false,
                    timer: 1500
                  })
                  this.ventasService.deleteEmail(obj)
                    .subscribe((result) => {
                      this.loadEmail = true;

                    })
                }
              })
            });

          }, error => {
            this.errorHTTP(error.status);
          });;
      }
    })

  }
  desmarcar() {
    this.dataEmail.forEach(element => {
      const indexArrayEjemplo = this.dataEmail.findIndex(ejemplo => ejemplo.email === element.email);
      this.dataEmail[indexArrayEjemplo].checked = false;
    });
    /**Nuevas Lineas */
    this.vaPais.reset();
    this.programScreen = false;
  }

  /** Valida check */
  valiarChe() {
    return !this.dataEmail.some(checkTrue => checkTrue.checked);
  }
  fileToUpload: File = null;
  saveArchivos(files: FileList) {
    this.fileToUpload = files.item(0);

    let extensiones_permitidas = new Array(".pptx", ".ppsx", ".pps", ".xlsx", ".odt", ".xls", ".docx", ".doc", ".txt", ".pdf", ".svg", ".ico", ".gif", ".jpeg", ".jpg", ".png");
    let extension = this.fileToUpload.name.substring(this.fileToUpload.name.lastIndexOf('.'), this.fileToUpload.name.length);
    let permitida = false;

    for (var i = 0; i < extensiones_permitidas.length; i++) {
      if (extensiones_permitidas[i] == extension) {
        permitida = true;
        break;
      }
    } if (!permitida) {
      $("#ArchivoEmail").val('');
      Swal.fire({
        icon: 'error',
        text: 'Extensión no permitida.'
      })
    } else if (this.fileToUpload.size > 104857600) {
      Swal.fire({
        icon: 'error',
        text: '1 Documento que intentaste añadir es mayor al límite de 100 MB.'
      })

    } else if (this.fileToUpload.size <= 104857600) {
      if (this.fileToUpload) {
        this.nombrePdf = this.fileToUpload.name;

        this.archivosE.push(this.fileToUpload);
        this.fotoSeleccionada = this.fileToUpload;
        this.archivosFirma.push({
          archivo: this.fileToUpload,
          name: this.nombrePdf,
          tipoAr: extension
        });
        return 1;

      }

    }
  }
  deleteArchivo(i: number) {
    this.archivosFirma.splice(i, 1);
    this.archivosE.splice(i, 1);
    $("#ArchivoEmail").val('');
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Archivo Eliminado !!',
      showConfirmButton: false,
      timer: 1500
    })

  }

  public formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /** Subir Firmas */

  private validarsubidaFirmas() {
    this.formFirmas = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  /** Subir Y Editar foto */
  public updateFirm(evt) {
    this.imgUpdate = evt.target.files[0];
  }

  public saveFirm() {
    const nombre = this.formFirmas.controls.nombre.value;
    const descripcion = this.formFirmas.controls.descripcion.value;
    const archivo = this.imgUpdate;

    if (!archivo) {
      this.ventasService.createfirmaImg(descripcion, nombre).subscribe((res) => {
        if (res) {
          Swal.fire('Buen Trabajo!',
            'Firma Guardada con Exito',
            'success')
          this.formFirmas.reset();
          this.verFirmas();
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
          this.formFirmas.reset();
          this.verFirmas();
        }
      }, error => {
        this.errorHTTP(error.status);
      });

    }
    $("#Firmas").val('');
  }
  /**Nuevas Lineas */
  public programScreen = false;
  public buttonSave = false;
  /**Nuevas Lineas */
  public program() {
    this.programScreen = true;
    this.buttonSave = true;
  }
  /**Update */
  public btnActulizar = false;


  public editshowFirm(c) {
    this.btnActulizar = false;
    this.ventasService.getFirma(c).subscribe((result) => {

      this.nombreEditFirma = result.nombre;
      this.nombreEditdescrip = result.descripcion;
      this.ArchivoEdit = result.archivo;

      this.updaFirma.patchValue({
        nombre: this.nombreEditFirma,
        descripcion: this.nombreEditdescrip
      })
    })


  }


  public validateUpdateFirma() {
    this.updaFirma = this.fb.group({
      firma: [],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    })
  }
  public updateFirmas() {
    this.btnActulizar = true;
    const nombre = this.updaFirma.controls.nombre.value;
    const descripcion = this.updaFirma.controls.descripcion.value;
    const idFirma = this.updaFirma.controls.firma.value;
    const archivo = this.imgUpdate;

    //console.log(nombre, ' ', descripcion, ' ', idFirma);


    if (!this.imgUpdate) {
      this.ventasService.updSign(idFirma, nombre, descripcion).subscribe((res) => {
        if (res) {
          this.verFirmas();
          this.updaFirma.reset();
          this.btnActulizar = true;
          Swal.fire('¡Firma editada!', ``, 'success');
        }
      }, error => {
        this.errorHTTP(error.status);
      });
    } else {
      this.ventasService.updFirmas(idFirma, nombre, descripcion, archivo).subscribe((res) => {
        if (res) {
          this.verFirmas();
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


  /** Mensajes Programados */
  private validaFormEmailProgramado() {
    this.formemailPro = this.fb.group({
      fecha_programado: ['', Validators.required],
      hora_programado: ['Hora', Validators.required],
      minuto_programado: ['Minuto', Validators.required]
    })
  }
  idExposip: number[] = [];
  public horaPro() {
    var fechaHo = new Date();
    let idFirma = this.formemailM.controls.firma.value;
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

    this.saveEmail.firma = this.firmasEmail.find(f => f.id == idFirma);
    this.saveEmail.asunto = this.formemailM.controls.asunto.value;
    this.saveEmail.descripcion = this.formemailM.controls.descripcion.value;
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
      } //2-If
      else {
        /** Envio para el dia en el que este*/
        this.dataEmail.forEach((c, index: number) => {
          const idExpo = c.idContacto;
          if (c.checked) {
            /**Guarda mensaje a BD */
            this.ventasService.createCorreo(this.saveEmail, idExpo, this.authService.user.id)
              .subscribe((envioYa) => {
                if (envioYa) {
                  this.idExposip = [envioYa.Email.id];
                }
                /**Valida si hay algun Documento */
                if (this.archivosE.length) {
                  this.idExposip.forEach((obj, inE: number) => {
                    this.archivosE.forEach((archivo) => {
                      this.ventasService.createarchivoContacto(archivo, obj)
                        .subscribe((result) => {
                          this.loadEmail = true;
                        }, error => {
                          this.errorHTTP(error.status);
                        });
                      if (inE + 1 == this.archivosE.length) {
                        this.validarProgramados();
                        Swal.fire('Buen Trabajo!',
                          'Email Enviado con Exito',
                          'success')
                      }
                    });//Fin_archivosE 
                  });
                }
              }, error => {
                this.errorHTTP(error.status);
              });
          }//Fin_IF
          if (!this.archivosE.length) {
            this.loadEmail = true;
            if (index + 1 == this.dataEmail.length) {
              this.validarProgramados();
              Swal.fire('Buen Trabajo!',
                'Email Enviado con Exito',
                'success')
            }
          }

        })//checkTrue
      }// Fin_else
    }//Fin_fechaH
    else {
      this.dataEmail.forEach((c,index:number) => {
        const idExpo = c.idContacto;
        if (c.checked) {
          this.ventasService.createCorreo(this.saveEmail, idExpo, this.authService.user.id)
            .subscribe((envio) => {
              if (envio) {
                this.idExposip = [envio.Email.id];
              }
                /**Valida si hay algun Documento */
                if (this.archivosE.length) {
                  this.idExposip.forEach((obj, inE: number) => {
                    this.archivosE.forEach((archivo) => {
                      this.ventasService.createarchivoContacto(archivo, obj)
                        .subscribe((result) => {
                          this.loadEmail = true;
                        }, error => {
                          this.errorHTTP(error.status);
                        });
                      if (inE + 1 == this.archivosE.length) {
                        this.validarProgramados();
                        Swal.fire('Buen Trabajo!',
                          'Email Enviado con Exito',
                          'success')
                      }
                    });//Fin_archivosE 
                  });
                }          
            }, error => {
              this.errorHTTP(error.status);
            });//Fin_ventasService          
        }//Fin_IF
        if (!this.archivosE.length) {
          this.loadEmail = true;
          if (index + 1 == this.dataEmail.length) {
            this.validarProgramados();
            Swal.fire('Buen Trabajo!',
              'Email Enviado con Exito',
              'success')
          }
        }
      });//checkTrue      
    }//Fin_2If

  }
  validarProgramados() {

    setTimeout(() => { this.archivosE = []; }, 3000);
    this.formemailM.reset();
    this.formemailPro.reset();
    //this.checkTrue = this.dataEmail;
    this.archivosFirma = [];
    this.desmarcar();
    this.validaFormEmailProgramado();
    $("#ArchivoEmail").val('');

  }
  /** Seleccionar Todos los Correos*/
  public checkTrue: Array<ContactoExpositor> = new Array<ContactoExpositor>();
  getEmailId(e:any ,x: ContactoExpositor) {  
    console.log(e);
    console.log(x);  

    let email: ContactoExpositor = null;      
    email = this.dataEmail.find(de => de.idContacto == x.idContacto);    
    //email= this.dataEmai.find(d => d.idContacto == x.idContacto);
    email.checked = e.checked;
    }

  seleccionartodoEmail(e: any) { 
    let number = 0;
      this.dataEmail.forEach(element =>{
        element.checked = e.checked;
        number = number + 1;
      });
      if (number > 151) {
        Swal.fire({
          title: '<strong>Error no puedes seleccionar: <u>' + number + '</u> contactos.</strong>',
          icon: 'info',
          html:
            'No se permite rebasar el numero de contactos ' +
            'superior a 150.'
        })
        this.desmarcar();
      }
    }

  eCheckedAll(): boolean {
    let verificar = 0;
    this.dataEmail.forEach(x => {
      if (x.checked) {
        verificar += 1;
      }
    });
    if (verificar === this.dataEmail.length) {
      return true;
    }
    return false;
  }
  
  
  mostrartime() {
    var f = new Date();
    this.validaDia = new Date(f.getTime() - (f.getTimezoneOffset() * 60000))
      .toISOString()
      .split("T")[0];
  } 

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
