import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading: boolean = false;  
  errorMessage: string = '';  

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required], 
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.loading = true;
      this.authService.login({ username, password }).subscribe({
        next: (response) => {
          if (response.user?.idtipo_usuario === 1) {
            this.router.navigate(['/']);
          } else {
            this.router.navigate(['/']);
          }

          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Error en el inicio de sesión. Verifique sus credenciales.';
          console.error('Error en el inicio de sesión:', err);
          
          this.loading = false;
        }
      });
    } else {
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
    }
  }
}
