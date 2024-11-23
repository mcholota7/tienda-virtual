import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RepuestoService } from '../repuesto.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { Marca, Modelo, Repuesto } from '../modelos'; // Importar interfaces
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-repuesto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actualizar-repuesto.component.html',
  styleUrls: ['./actualizar-repuesto.component.css'],
})
export class ActualizarRepuestoComponent implements OnInit {
  repuesto: Repuesto = {
    idrepuesto: null,
    nombre_repuesto: '',
    precio: null,
    idmodelo: null,
    cantidad: null,
    imagen_url: '', 
  };

  modelos: any[] = [];
  marcas: any[] = [];
  selectedMarca: number | null = null;
  imagenSeleccionada: File | null = null; 

  constructor(
    private repuestoService: RepuestoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarRepuesto(parseInt(id, 10));
    }
    this.cargarMarcas();
  }

  cargarMarcas(): void {
    this.repuestoService.getMarcas().subscribe({
      next: (data) => {
        if (data && Array.isArray(data.marcasMongo)) {
          this.marcas = data.marcasMongo;
        } else {
          console.error('La estructura de la respuesta no es válida:', data);
        }
      },
      error: (err) => {
        console.error('Error al cargar las marcas:', err);
      }
    });
  }

  cargarRepuesto(id: number): void {
    this.repuestoService.obtenerRepuestoPorId(id).subscribe({
      next: (data) => {
        this.repuesto = {
          idrepuesto: data._id,
          nombre_repuesto: data.nombre_repuesto,
          precio: data.precio,
          idmodelo: data.modelo._id,
          cantidad: data.cantidad,
          imagen_url: data.imagen_url, 
        };
        this.selectedMarca = data.marca._id || null;
        if (this.selectedMarca !== null) {
          this.cargarModelos(this.selectedMarca);
        }
      },
      error: (err) => {
        console.error('Error al cargar el repuesto:', err);
        alert('No se pudo cargar el repuesto.');
        this.router.navigate(['/admin']);
      },
    });
  }

  cargarModelos(marcaId: number): void {
    this.repuestoService.getModelos(marcaId).subscribe({
      next: (data) => {
        if (Array.isArray(data.modelosMongo)) {
          this.modelos = data.modelosMongo;
        } else {
          console.error('La respuesta de modelos no es válida:', data);
        }
      },
      error: (err) => {
        console.error('Error al cargar los modelos:', err);
      }
    });
  }

  actualizarRepuesto(): void {
    if (!this.imagenSeleccionada) {
      this.repuesto.imagen_url = this.repuesto.imagen_url; 
    }

    this.repuestoService.actualizarRepuesto(this.repuesto).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Repuesto actualizado con éxito',
          confirmButtonText: 'Aceptar',
        });
        this.router.navigate(['/admin/select-product']);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al actualizar el repuesto',
          confirmButtonText: 'Aceptar',
        });
        console.error(err);
      },
    });
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
      this.repuesto.imagen_url = this.repuesto.imagen_url;
    }
  }

  onMarcaChange(selectedMarca: number): void {
    this.selectedMarca = selectedMarca;
    this.cargarModelos(selectedMarca);
  }
}
