import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private marcasUrl = 'http://localhost:5000/api/marcas/listar';
  private modelosUrl = 'http://localhost:5000/api/modelos/marca/';
  private crearMarcaUrl = 'http://localhost:5000/api/marcas/crear';
  private crearModeloUrl = 'http://localhost:5000/api/modelos';

  constructor(private http: HttpClient) {}

  getMarcas(): Observable<any> {
    return this.http.get<any>(this.marcasUrl);
  }

  getModelos(marcaId: number): Observable<any> {
    return this.http.get<any>(`${this.modelosUrl}${marcaId}`);
  }

  createMarca(nombreMarca: string): Observable<any> {
    return this.http.post<any>(this.crearMarcaUrl, { nombre_marca: nombreMarca });
  }

  createModelo(idMarca: number, nombreModelo: string): Observable<any> {
    return this.http.post<any>(this.crearModeloUrl, { idmarca: idMarca, nombre_modelo: nombreModelo });
  }
}
