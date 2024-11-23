import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PedidosService } from '../services/pedidos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
})
export class OrderDetailComponent implements OnInit {
  orderDetail: any;
  subtotal: number = 0;
  iva: number = 0;
  total: number = 0;

  constructor(
    private route: ActivatedRoute,
    private pedidosService: PedidosService
  ) {}

  ngOnInit(): void {
    const orderId = Number(this.route.snapshot.paramMap.get('id'));

    this.pedidosService.getDetalleOrden(orderId).subscribe(
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
}
