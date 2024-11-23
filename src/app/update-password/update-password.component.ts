import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css'],
})
export class UpdatePasswordComponent {
  contrasenaActual: string = '';
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';
  mensajeError: string = '';
  mensajeExito: string = '';

  private apiUrl: string = 'http://localhost:5000/api/auth/actualizar-contrasena';

  constructor(private http: HttpClient, private authService: AuthService,) {}

  actualizarContrasena(): void {
    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.mensajeError = 'Las contraseñas no coinciden.';
      return;
    }

    const datos = {
      idusuario: this.authService.getUserId(), 
      contrasenaActual: this.contrasenaActual,
      nuevaContrasena: this.nuevaContrasena,
    };
    console.log(datos);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.put(this.apiUrl, datos, { headers }).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: '¡Contraseña actualizada!',
          text: 'Tu contraseña ha sido actualizada correctamente.',
          confirmButtonColor: '#007bff',
        });
        this.mensajeError = '';
        this.limpiarFormulario();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar la contraseña. Intenta nuevamente.',
          confirmButtonColor: '#d33',
        });
        this.mensajeExito = '';
        console.error('Error:', error);
      }
    );
  }


  limpiarFormulario(): void {
    this.contrasenaActual = '';
    this.nuevaContrasena = '';
    this.confirmarContrasena = '';
    this.mensajeError = '';
  }
}
