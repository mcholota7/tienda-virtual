import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-inventory.component.html',
  styleUrls: ['./manage-inventory.component.css']
})
export class ManageInventoryComponent implements OnInit {
  inventario: any[] = [];
  searchTerm: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchInventario();
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  fetchInventario() {
    const token = this.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any[]>('http://localhost:5000/api/inventario/listar', { headers })
      .subscribe(data => {
        this.inventario = data;
      }, error => {
        console.error('Error al obtener el inventario:', error);
      });
  }

  search() {
    if (this.searchTerm) {
      this.inventario = this.inventario.filter(item => 
        item.nombre_repuesto.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.fetchInventario(); 
    }
  }
}

