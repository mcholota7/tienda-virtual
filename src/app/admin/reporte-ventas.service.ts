import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteVentasService {

  private apiUrl = 'http://localhost:5000/api/pedidos/reporte';

  constructor(private http: HttpClient) { }

  obtenerReporteVentas(fechaDesde: string, fechaHasta: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = { fechaDesde, fechaHasta };
    
    return this.http.get<any[]>(this.apiUrl, { headers, params });
  }
}
