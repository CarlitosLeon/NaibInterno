import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/users/service/auth.service';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {

  @Output() openEvent: EventEmitter<number> = new EventEmitter<number>();

  private urlEndPoint: string;
  public idS: number;
  public idU: number;
  public idEventoSeleccionadoService: number;

  private _nombrePantalla: string = "";
  private _sideBarExpositoresMapa = new EventEmitter<any>();

  public get nombrePantalla() {
    return this._nombrePantalla;
  }

  public setNombrePantalla(nombre: string): void {
    this._nombrePantalla = nombre;
  }

  public get sideBarExpositoresMapa(): EventEmitter<any> {
    return this._sideBarExpositoresMapa;
  }

  constructor(private http: HttpClient, private authService: AuthService) {
    this.urlEndPoint = environment.endPointBack;
  }

  

}
