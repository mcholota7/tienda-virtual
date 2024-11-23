import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReporteVentasService } from '../reporte-ventas.service';
import flatpickr from 'flatpickr';

@Component({
  selector: 'app-reporte-ventas',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './reporte-ventas.component.html',
  styleUrls: ['./reporte-ventas.component.css']
})
export class ReporteVentasComponent implements OnInit, AfterViewInit {

  reporteVentas: any[] = [];
  fechaDesde: string = '';
  fechaHasta: string = '';
  cargando: boolean = false;
  token: string = localStorage.getItem('token') || '';

  constructor(private reporteVentasService: ReporteVentasService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    flatpickr('#fechaDesde', {
      dateFormat: 'Y-m-d',
      defaultDate: this.fechaDesde
    });
    flatpickr('#fechaHasta', {
      dateFormat: 'Y-m-d',
      defaultDate: this.fechaHasta
    });
  }

  obtenerReporte(): void {
    if (!this.fechaDesde || !this.fechaHasta) {
      alert('Por favor selecciona ambas fechas.');
      return;
    }

    this.cargando = true;

    this.reporteVentasService.obtenerReporteVentas(this.fechaDesde, this.fechaHasta, this.token)
      .subscribe(
        (data) => {
          this.reporteVentas = data;
          this.cargando = false;
          console.log(data);
        },
        (error) => {
          console.error('Error al obtener el reporte de ventas:', error);
          this.cargando = false;
        }
      );
  }
}
