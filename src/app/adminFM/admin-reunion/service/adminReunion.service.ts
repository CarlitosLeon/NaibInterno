import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminReunionService {

  constructor(private http: HttpClient) {
  }

  sendWhatsApp(message: any): Observable<any> {
    const httpHeaders = new HttpHeaders({ 'content-type': 'application/json' });
    const url: string = `http://api.chat-api.com/instance188024/sendMessage?token=dht9qbqnr1pw1jen`;
    return this.http.post<any>(url, message, { headers: httpHeaders });
  }
}
