import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): Observable<boolean> {
        return this.authService.isAuthenticated$.pipe(
            map(isAuthenticated => {
                if (!isAuthenticated) {
                    this.router.navigate(['/login']); // Redirige a la página de inicio de sesión
                    return false;
                }
                return true;
            })
        );
    }
}
