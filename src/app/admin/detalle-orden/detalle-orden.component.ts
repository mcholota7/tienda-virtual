import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-detalle-orden',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-orden.component.html',
  styleUrls:  ['./detalle-orden.component.css'],
})
export class DetalleOrdenComponent implements OnInit {
  orderDetail: any;
  subtotal: number = 0;
  iva: number = 0;
  total: number = 0;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const orderId = Number(this.route.snapshot.paramMap.get('id'));

    this.getDetalleOrden(orderId).subscribe(
      (data) => {
        this.orderDetail = data;
        this.orderDetail.detalles.forEach((detalle: any) => {
          const precioTotal = detalle.precio * detalle.cantidad;
          this.subtotal += precioTotal;
        });
        this.iva = this.subtotal * 0.13;
        this.subtotal -= this.iva;
        this.total = this.subtotal + this.iva;
      },
      (error) => {
        console.error('Error al obtener los detalles del pedido:', error);
      }
    );
  }

  getDetalleOrden(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token'), 
    });
  
    const url = `http://localhost:5000/api/pedidos/detalle/${id}`;
    return this.http.get<any>(url, { headers });
  }
}
