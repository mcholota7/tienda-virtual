import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-manage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-manage.component.html',
  styleUrls: ['./product-manage.component.css']
})
export class ProductManageComponent implements OnInit {
  repuestos: any[] = [];
  filteredRepuestos: any[] = []; 
  searchQuery: string = ''; 

  constructor(private http: HttpClient, private route: ActivatedRoute,   private router: Router) {}

  ngOnInit(): void {
    this.getRepuestos(); 
  }

  getRepuestos(): void {
    let url = 'http://localhost:5000/api/repuestos/buscar';

    if (this.searchQuery.trim()) {
      url = `${url}?nombre_repuesto=${encodeURIComponent(this.searchQuery)}`;
    }

    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.repuestos = data; 
        this.filteredRepuestos = data;
      },
      (error) => {
        console.error('Error al obtener los repuestos:', error);
      }
    );
  }

  onSearch(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredRepuestos = this.repuestos.filter((repuesto) =>
      repuesto.nombre_repuesto.toLowerCase().includes(query)
    );
  }

  updateProduct(id: number): void {
    console.log(`Actualizar producto con ID: ${id}`);
    this.router.navigate(['admin/update-product', id]);
  }

  deleteProduct(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'El producto será eliminado y no podrá ser recuperado.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const url = 'http://localhost:5000/api/repuestos/actualizarEstado';
        const body = {
          idrepuesto: id,
          estado: 'eliminado'
        };
  
        this.http.put(url, body).subscribe(
          () => {
            Swal.fire({
              title: 'Eliminado',
              text: `El producto con ID ${id} fue eliminado correctamente.`,
              icon: 'success',
              confirmButtonColor: '#007bff',
            });
            this.getRepuestos(); 
          },
          (error) => {
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al intentar eliminar el producto.',
              icon: 'error',
              confirmButtonColor: '#dc3545',
            });
            console.error('Error al eliminar el producto:', error);
          }
        );
      }
    });
  }  
}
