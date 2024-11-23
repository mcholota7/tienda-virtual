// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ResponseModels } from './response-models.interface'; 
import { Product } from './product';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/api'; 

  constructor(private http: HttpClient) {}

  searchSpareParts(nombre_repuesto?: string, idmarca?: number, idmodelo?: number): Observable<any[]> {
    let params = new HttpParams();

    if (nombre_repuesto) params = params.set('nombre_repuesto', nombre_repuesto);
    if (idmarca) params = params.set('idmarca', idmarca.toString());
    if (idmodelo) params = params.set('idmodelo', idmodelo.toString());

    return this.http.get<any[]>(`${this.apiUrl}/repuestos/buscar`, { params });
  }

  getBrands(): Observable<{ name: string; id: number; }[]> {
    return this.http.get<any>(`${this.apiUrl}/marcas/listar`).pipe(
      map(response => 
        response.marcasMongo.map((marca: any) => ({
          name: marca.nombre_marca,
          id: marca._id
        }))
      )
    );
  }


  
  getModelsByBrandId(brandId: number): Observable<ResponseModels> {
    return this.http.get<ResponseModels>(`${this.apiUrl}/modelos/marca/${brandId}`);
  }

  getRepuestoById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/repuestos/${id}`);
  }
  
}
