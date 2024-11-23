import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../cart.service';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule, RouterModule] 
})
export class NavbarComponent implements OnInit {
  cartCount: number = 0;
  isAuthenticated = false;
  isAdmin = false;
  userName: string = '';
  private inactivityTimeout: any;

  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });

    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (this.isAuthenticated) {
        this.authService.getUser().subscribe(user => {
          if (user) {
            this.userName = user.nombre_usuario;  
            this.isAdmin = user.idtipo_usuario === 1;  
          }
        });
      } else {
        this.userName = '';
        this.isAdmin = false;
      }
    });

    this.checkInactivityTimeout();

    this.resetInactivityTimer();
  }

  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  resetInactivityTimer() {
    localStorage.setItem('lastActivity', new Date().toISOString());
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      this.logout(); 
    }, 300000); 
  }

  private checkInactivityTimeout() {
    const lastActivity = localStorage.getItem('lastActivity');
    if (lastActivity) {
      const lastActivityTime = new Date(lastActivity).getTime();
      const currentTime = new Date().getTime();
      const inactivityDuration = currentTime - lastActivityTime;

      if (inactivityDuration > 300000) { 
        this.logout();
      }
    }
  }


  logout(): void {
    this.cartService.clearCart();
    this.authService.logout(); 
    this.router.navigate(['/']); 
  }
}
