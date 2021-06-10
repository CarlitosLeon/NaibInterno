import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import Swal from "sweetalert2";
import { AuthService } from "../../users/service/auth.service";
import { environment } from "src/environments/environment.prod";
import { ListaCalendario } from "src/app/models/ListaCalendario";
import { EventoCalendario } from "src/app/models/EventoCalendario";
import { SubTareaCalendario } from "src/app/models/SubTareaCalendario";



@Injectable({
    providedIn: 'root'
  })


export class CalendarioService{

  constructor(private http: HttpClient, private ruta: Router, private authService: AuthService, private router:Router){ }


  private addAuthorizationheader() {
    let token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer' + token);
    }
    return this.httpHeaders;
  }

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  
  private _urlEndPoint =`${environment.endPointBack}/calendar`;
  


  getCalendarInfo(idUsuario:number,idEvento:number): Observable<any> {
    return this.http.post<any>(`${this._urlEndPoint}/datos/${idUsuario}/${idEvento}`,null, { headers: this.addAuthorizationheader()}).pipe(
      catchError(e=>{
        if(e.status==0){
          Swal.mixin({
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
            html: "<img src='./assets/img_project/excepciones/errorConexion.jpg' class='img-fluid' alt='Error de conexión'>",
            confirmButtonText: 'Entiendo'
          })
        }else if(e.status==401){
          this.authService.logout();
          this.router.navigate(['/']);
        }
        return throwError(e);
      }),
      )
  }

  saveListaCalendario(listaC:ListaCalendario,idUsuario:number):Observable<any>{
    return this.http.post<any>(`${this._urlEndPoint}/info/guardar/${idUsuario}`,listaC, { headers: this.addAuthorizationheader()});
  }

  updateListaCalendario(listaC:ListaCalendario):Observable<any>{
    return this.http.put<any>(`${this._urlEndPoint}/info/update/`,listaC, { headers: this.addAuthorizationheader()});
  }

  updateEstatusEventoCalendario(lista:ListaCalendario):Observable<any>{
    return this.http.put<any>(`${this._urlEndPoint}/info/update/eventoCalendario/`,lista, { headers: this.addAuthorizationheader()});
  }

  updateEstatusSubTareaCalendario(subT:EventoCalendario):Observable<any>{
    return this.http.put<any>(`${this._urlEndPoint}/info/update/subTareaCalendario/`,subT, { headers: this.addAuthorizationheader()});
  }

  deleteEventoCalendario(evento:EventoCalendario): Observable<any> {
    return this.http.put<any>(`${this._urlEndPoint}/info/turnOff/eventoCalendario/`,evento, { headers: this.addAuthorizationheader() });
  }

  deleteSubTareaCalendario(subTareas:SubTareaCalendario[]): Observable<any> {
    return this.http.put<any>(`${this._urlEndPoint}/info/turnOff/subTareaCalendario/`,subTareas, { headers: this.addAuthorizationheader() });
  }

  uploadFotoEventoCalendario(fotos:File[],idListaCalendario, idEventoCalendario): Observable<HttpEvent<{}>> {
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    let formData = new FormData();
    for(let i=0; i<fotos.length;i++){
      formData.append("foto", fotos[i]);
    }
      //lstData.push(formData);
    const req = new HttpRequest('POST', `${this._urlEndPoint}/upload/uploadFotoEventoCalendario/${idListaCalendario}/${idEventoCalendario}`, formData, {
      reportProgress: true, headers: httpHeaders
    });
    return this.http.request(req);
  }

  deleteListaCalendario(idListaCalendario): Observable<HttpEvent<{}>> {
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    let formData = new FormData();
    formData.append("idLista", idListaCalendario);
    const req = new HttpRequest('DELETE', `${this._urlEndPoint}/calendario/listaCalendario/User/Delete/`, formData, {
      reportProgress: true, headers: httpHeaders
    });
    return this.http.request(req);
  }
}