import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/users/service/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/users/models/user';
import Swal from 'sweetalert2';
import { IncidenciaService } from './service/incidencia.service';
import { EventoVendedor } from '../users/models/EventoVendedor';
import { VentasProspectosService } from '../crm/ventas-prospectos/ventas-prospectos.component.service';
declare const App: any;

@Component({
  selector: 'app-menu-fm',
  templateUrl: './menu-fm.component.html',
  styleUrls: ['./menu-fm.component.css']

})
export class MenuFMComponent implements OnInit {

  public nombrePantalla;
  public opened: boolean;
  public vR: string = "";
  public idEventoSeleccionado: number;
  eventoEV: Array<EventoVendedor> = new Array<EventoVendedor>();
  public nombreEvento = "";

  constructor(private authService: AuthService, private router: Router, private spinner: NgxSpinnerService, private incidenciaService: IncidenciaService, private ventasService: VentasProspectosService) {

    this.classMenu();
  }
  dataUser: User;

  ngOnInit(): void {
    this.vR = this.authService.user.rol;
    this.dataUser = this.authService.user;
    this.nombrePantalla = this.incidenciaService.nombrePantalla;
    App.initAdminLTE();
    this.getSalonesVendedor();
   
    if(this.authService.user.rol == "ROLE_ADMIN_NAIB" || this.authService.user.rol=="ROLE_NAIB"){
      this.incidenciaService.openEvent.emit(this.authService.eventosVendedor[0].evento.id);
      this.idEventoSeleccionado = this.authService.eventosVendedor[0].evento.id;
      this.getEvento(this.authService.eventosVendedor[0].evento.id);
    }
  }

  openSideBar(): void {
    this.opened = this.opened ? false : true;
    this.incidenciaService.sideBarExpositoresMapa.emit(this.opened);
  }

  getSalonesVendedor() {
    this.authService.userEventoVendedor().subscribe((h) => {
      if (h.values == null) {
        return this.eventoEV = null;
      }
      this.eventoEV = h;
    }, error => {
      this.errorHTTP(error.status);
    })
  }

  mandarValor(res) {
    // this.ventasService.setEventoSeleccionado(res.target.value);  
    this.incidenciaService.openEvent.emit(res.target.value);
    this.idEventoSeleccionado = res.target.value;
    this.getEvento(res.target.value);
  }

  getEvento(id){
    let x = this.authService.eventosVendedor.find(h => h.evento.id == id);
    if(x != null){
      this.nombreEvento = x.evento.nombre;
    }else{
      this.nombreEvento = "";
    }
  }
  
  logout() {
    this.spinner.show();
    this.authService.logout();
    this.router.navigate(['/']);
    this.spinner.hide();
  }

  //ErrorHTTP
  errorHTTP(status: number) {
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

  classMenu() {
    document.body.style.background = '#f4f6f9';
    document.body.classList.add('hold-transition');
    document.body.classList.add('sidebar-mini');
    document.body.classList.add('layout-navbar-fixed');
    document.body.classList.add('layout-fixed');
    document.body.classList.add('sidebar-closed');
    document.body.classList.add('sidebar-collapse');
  }

}
