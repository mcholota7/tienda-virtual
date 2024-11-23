import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RepuestoService {
  private apiUrl = 'http://localhost:5000/api/repuestos';
  private marcasUrl = 'http://localhost:5000/api/marcas/listar';
  private modelosUrl = 'http://localhost:5000/api/modelos/marca/';

  constructor(private http: HttpClient) {}

  actualizarRepuesto(repuesto: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.put(`${this.apiUrl}/actualizar-repuesto`, repuesto, { headers });
  }

  obtenerRepuestoPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getMarcas(): Observable<any> {
    return this.http.get<any>(this.marcasUrl);
  }


  getModelos(marcaId: number): Observable<any> {
    return this.http.get<any>(`${this.modelosUrl}${marcaId}`);
  }
}
