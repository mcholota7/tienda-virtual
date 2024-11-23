import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pedido } from '../modelos';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reporte-pedidos',
  standalone: true,
  imports: [
    CommonModule, FormsModule
  ],
  templateUrl: './reporte-pedidos.component.html',
  styleUrls: ['./reporte-pedidos.component.css']
})
export class ReportePedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  idestado: number = 1;
  fechaDesde: string = '';
  fechaHasta: string = '';

  estados = [
    { nombre: 'Procesado', id: 1 },
    { nombre: 'Enviado', id: 2 },
    { nombre: 'Entregado', id: 3 },
    { nombre: 'Anulado', id: 4 }
  ];

  transiciones: { [key: number]: { id: number; nombre: string }[] } = {
    1: [ 
      { id: 2, nombre: 'Enviado' },
      { id: 4, nombre: 'Anulado' }
    ],
    2: [ 
      { id: 3, nombre: 'Entregado' },
      { id: 4, nombre: 'Anulado' }
    ],
    3: [], 
    4: []  
  };

  constructor(private http: HttpClient,  private router: Router) {}

  ngOnInit(): void {
    this.obtenerPedidos(); 
  }

  obtenerPedidos() {
    const url = 'http://localhost:5000/api/pedidos/pedido';
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    const params = new URLSearchParams({
      idestado: this.idestado.toString(),
      fechaDesde: this.fechaDesde,
      fechaHasta: this.fechaHasta
    });

    this.http.get<Pedido[]>(`${url}?${params.toString()}`, { headers }).subscribe(
      (data) => {
        this.pedidos = data;
        this.pedidos.forEach(pedido => {
          if (pedido.selectedEstado === undefined) {
            pedido.selectedEstado = this.idestado; 
          }
        });
      },
      (error) => {
        console.error('Error al obtener los pedidos', error);
      }
    );
  }

  cambiarEstado(id: number, nuevoEstado: number) {
    const url = `http://localhost:5000/api/pedidos/estado/${id}`;
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const body = { nuevoEstado };

    this.http.put(url, body, { headers }).subscribe(
      () => {
        console.log(`Estado del pedido ${id} actualizado a ${nuevoEstado}`);
        this.obtenerPedidos(); 
      },
      (error) => {
        console.error('Error al cambiar el estado', error);
      }
    );
  }

  obtenerOpcionesEstado(actualIdEstado: number) {
    return this.transiciones[actualIdEstado] || [];
  }

  

  verDetalles(idPedido: number): void {
    console.log('numero: ',idPedido);
    this.router.navigate(['admin/orders-client-detail', idPedido]);
  }

  onChangeEstado(event: Event, idPedido: number): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = Number(selectElement.value); 
    this.cambiarEstado(idPedido, selectedValue);
  }

  actualizarObservacion(idPedido: number, nuevaObservacion: string, nuevoEstado: number) {
    const url = 'http://localhost:5000/api/pedidos/actualizar-estado';
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    
    const body = {
      idencabezado_pedido: idPedido,
      idestado: nuevoEstado,
      observacion: nuevaObservacion
    };
    console.log(body);
  
    this.http.put(url, body, { headers }).subscribe(
      () => {
        console.log(`Estado y observación del pedido ${idPedido} actualizados`);
        
        Swal.fire({
          icon: 'success',
          title: 'Actualización Exitosa',
          text: `El estado y la observación del pedido ${idPedido} han sido actualizados correctamente.`,
          confirmButtonText: 'Aceptar',
        });
  
        this.obtenerPedidos(); 
      },
      (error) => {
        console.error('Error al actualizar estado y observación del pedido', error);
        
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: 'Hubo un problema al intentar actualizar el pedido. Por favor, inténtalo nuevamente.',
          confirmButtonText: 'Aceptar',
        });
      }
    );
  }
}
