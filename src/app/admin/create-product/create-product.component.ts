import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  product = {
    idmodelo: 1,
    nombre_repuesto: '',
    precio: 0,
    imagen_url: '',
    cantidad: 0,
    estado: 'activo'
  };

  marcas: any[] = [];
  modelos: any[] = [];
  selectedMarca: number = 0;
  selectedModelo: number = 0;

  selectedImage: File | null = null;

  constructor(private http: HttpClient, private productService: ProductService) {}

  ngOnInit(): void {
    this.loadMarcas();
  }

  loadMarcas(): void {
    this.productService.getMarcas().subscribe(
      response => {
        this.marcas = response.marcasMongo;
      },
      error => {
        console.error('Error loading marcas', error);
      }
    );
  }

  onMarcaChange(marcaId: number): void {
    this.selectedMarca = marcaId;
    this.selectedModelo = 0;
    if (marcaId) {
      this.productService.getModelos(marcaId).subscribe(
        response => {
          this.modelos = response.modelosMongo;
        },
        error => {
          console.error('Error loading modelos', error);
        }
      );
    } else {
      this.modelos = [];
    }
  }

  createMarca() {
    Swal.fire({
      title: 'Crear nueva marca',
      input: 'text',
      inputLabel: 'Nombre de la marca',
      inputPlaceholder: 'Ingresa el nombre de la marca',
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevaMarca = result.value;

        if (nuevaMarca) {
          this.productService.createMarca(nuevaMarca).subscribe(
            (response) => {
              Swal.fire('Marca creada', 'La marca se ha creado exitosamente.', 'success');
              this.loadMarcas(); 
            },
            (error) => {
              Swal.fire('Error', 'Hubo un error al crear la marca.', 'error');
            }
          );
        }
      }
    });
  }

  createModelo() {
    if (this.selectedMarca === 0) {
      Swal.fire('Error', 'Debe seleccionar una marca antes de crear un modelo', 'error');
      return;
    }

    Swal.fire({
      title: 'Crear nuevo modelo',
      input: 'text',
      inputLabel: 'Nombre del modelo',
      inputPlaceholder: 'Ingresa el nombre del modelo',
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevoModelo = result.value;

        if (nuevoModelo) {
          this.productService.createModelo(this.selectedMarca, nuevoModelo).subscribe(
            (response) => {
              Swal.fire('Modelo creado', 'El modelo se ha creado exitosamente.', 'success');
              this.onMarcaChange(this.selectedMarca); 
            },
            (error) => {
              Swal.fire('Error', 'Hubo un error al crear el modelo.', 'error');
            }
          );
        }
      }
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file; 
    }
  }

  onSubmit() {
    if (!this.selectedModelo) {
      Swal.fire('Error', 'Debe seleccionar un modelo antes de guardar el producto', 'error');
      return;
    }

    const url = 'http://localhost:5000/api/repuestos';

    const formData = new FormData();
    formData.append('idmodelo', String(this.selectedModelo));
    formData.append('nombre_repuesto', this.product.nombre_repuesto);
    formData.append('precio', String(this.product.precio));
    formData.append('cantidad', String(this.product.cantidad));
    formData.append('estado', this.product.estado);

    if (this.selectedImage) {
      formData.append('imagen', this.selectedImage);
      this.http.post('http://localhost:5000/upload', formData).subscribe(response => {
        console.log('Archivo subido:', response);
      });
    }

    this.http.post(url, formData).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Producto creado',
          text: 'El producto ha sido creado exitosamente.'
        });

        if (response.imagen_url) {
          this.product.imagen_url = response.imagen_url;
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al crear el producto.'
        });
      }
    );
  }
}
