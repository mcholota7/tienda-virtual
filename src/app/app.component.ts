import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { BannerComponent } from './banner/banner.component';
import { ProductListComponent } from './product-list/product-list.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',  // Este debe ser 'app-root' para el componente principal
  standalone: true,
  imports: [CommonModule, NavbarComponent, BannerComponent, ProductListComponent, FooterComponent, RouterModule], // Asegúrate de importar NavbarComponent aquí
  templateUrl: './app.component.html', // Cambia a app.component.html
  styleUrls: ['./app.component.css'] // Cambia a app.component.css
})
export class AppComponent {
  title = 'tu-aplicacion';

  constructor(public router: Router) {}
}

