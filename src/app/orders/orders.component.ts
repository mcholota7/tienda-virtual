import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../services/pedidos.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private pedidosService: PedidosService, private router: Router) {}

  ngOnInit(): void {
    this.pedidosService.getOrdenesFiltradas().subscribe(
      (data) => {
        console.log('Órdenes recibidas:', data);
        this.orders = data;
      },
      (error) => {
        console.error('Error al obtener órdenes:', error);
      }
    );
  }

  verDetalles(idPedido: number): void {
    this.router.navigate(['/detalle-pedido', idPedido]);
  }
}
