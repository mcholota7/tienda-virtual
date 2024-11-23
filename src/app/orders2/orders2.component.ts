import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../services/pedidos.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-orders2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders2.component.html',
  styleUrl: './orders2.component.css'
})
export class Orders2Component implements OnInit {
  orders: any[] = [];

  constructor(private pedidosService: PedidosService, private router: Router) {}

  ngOnInit(): void {
    this.pedidosService.getOrdenesFiltradas2().subscribe(
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
