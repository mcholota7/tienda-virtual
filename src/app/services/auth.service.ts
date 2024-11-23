import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../cart.service';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

interface LoginResponse {
  token: string;
  user: {
    idtipo_usuario: number;
    idusuario: number;
    [key: string]: any; 
  };
}

interface RegisterResponse {
  message: string;
  user: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth/login'; 
  private registerUrl = 'http://localhost:5000/api/auth/register'; 

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkInitialAuthState());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private userRoleSubject = new BehaviorSubject<number | null>(null);
  private currentUserSubject = new BehaviorSubject<any>(null); 

  constructor(private http: HttpClient, private cartService: CartService) {
    this.loadUserRole();
    this.loadCurrentUser();
  }

  private checkInitialAuthState(): boolean {
    const token = localStorage.getItem('token');
    return token !== null;
  }

  private loadUserRole(): void {
    const userRole = localStorage.getItem('userRole');
    this.userRoleSubject.next(userRole ? parseInt(userRole, 10) : null);
  }

  private loadCurrentUser(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.currentUserSubject.next(user);
  }

  getUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    const loginPayload = {
      nombre_usuario: credentials.username,
      contrasena: credentials.password,
    };

    console.log('Intentando iniciar sesión con:', loginPayload);

    return this.http.post<LoginResponse>(this.apiUrl, loginPayload).pipe(
      tap((response) => {
        console.log('Respuesta recibida del servidor:', response);

        localStorage.setItem('token', response.token);
        localStorage.setItem('userRole', response.user.idtipo_usuario.toString());
        localStorage.setItem('user', JSON.stringify(response.user));

        this.isAuthenticatedSubject.next(true);
        this.userRoleSubject.next(response.user.idtipo_usuario);
        this.currentUserSubject.next(response.user);

        console.log('Token y datos del usuario guardados en localStorage.');

        const cartBeforeLogin = localStorage.getItem('cartBeforeLogin');
        if (cartBeforeLogin) {
          console.log('CartBeforeLogin encontrado:', cartBeforeLogin);
          const cartItems = JSON.parse(cartBeforeLogin);
          this.cartService.restoreCart(cartItems); // Restaurar carrito
          localStorage.removeItem('cartBeforeLogin');
          console.log('CartBeforeLogin restaurado y eliminado de localStorage.');
        } else {
          console.log('No se encontró CartBeforeLogin.');
        }
      }),
      catchError((error) => {
        console.error('Error durante el inicio de sesión:', error);
        return throwError(() => new Error('Error en el inicio de sesión.'));
      })
    );
  }

  register(userData: any): Observable<RegisterResponse> {
    const registerPayload = {
      nombre_usuario: userData.nombre_usuario,
      contrasena: userData.contrasena,
      nombres: userData.nombres,
      apellidos: userData.apellidos,
      telefono: userData.telefono,
      tipo_documento: userData.tipo_documento,
      numero_documento: userData.numero_documento,
      provincia: userData.provincia,
      ciudad: userData.ciudad,
      direccion: userData.direccion,
      idTipo_usuario: userData.idTipo_usuario,
    };

    return this.http.post<RegisterResponse>(this.registerUrl, registerPayload).pipe(
      tap((response) => {
        console.log('Usuario registrado con éxito:', response.message);
      }),
      catchError((error) => {
        console.error('Error en el registro:', error);
        return throwError(() => new Error('Error en el registro.'));
      })
    );
  }

  isAdmin(): boolean {
    return this.userRoleSubject.value === 1;
  }

  logout(): void {
    console.log('Cerrando sesión...');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    this.cartService.clearCart();
    this.userRoleSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    console.log('Sesión cerrada y carrito limpiado.');
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getUserId(): number | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).idusuario : null;
  }
}
