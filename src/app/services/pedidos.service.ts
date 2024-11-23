import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  private apiUrl = 'http://localhost:5000/api/pedidos/mis-pedidos';
  private apiUrl2 = 'http://localhost:5000/api/pedidos/mis-pedidos-anteriores';

  constructor(private http: HttpClient) {}

  getOrdenesFiltradas(): Observable<any[]> {
    const token = localStorage.getItem('token');

  
    const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      });

      return this.http.get<any[]>(this.apiUrl, { headers });
    }

    getOrdenesFiltradas2(): Observable<any[]> {
      const token = localStorage.getItem('token');
  
      const headers = new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        });
  
        return this.http.get<any[]>(this.apiUrl2, { headers });
      }

    getDetalleOrden(id: number): Observable<any> {
        const headers = new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        });
      
        const url = `http://localhost:5000/api/pedidos/detalle/${id}`;
        return this.http.get<any>(url, { headers }); 
      }
}
