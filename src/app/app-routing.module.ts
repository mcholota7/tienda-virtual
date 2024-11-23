import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { HomeComponent } from './home/home.component'; // Importa el componente de inicio
import { ProductListComponent } from './product-list/product-list.component'; // Importa tu componente de productos
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { OrdersComponent } from './orders/orders.component';
import { Orders2Component } from './orders2/orders2.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { CartComponent } from './cart/cart.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { ActualizarUsuarioComponent } from './actualizar-usuario/actualizar-usuario.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  //{ path: '', component: HomeComponent }, 
  { path: 'productos', component: ProductListComponent }, 
  { path: 'product-detail/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'ordenes', component: OrdersComponent },
  { path: 'ordenes2', component: Orders2Component },
  { path: 'detalle-pedido/:id', component: OrderDetailComponent },
  { path: 'actualizar-contrasena', component: UpdatePasswordComponent },
  { path: 'actualizar-usuario', component: ActualizarUsuarioComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((m) => m.RegisterComponent),
  },
  { 
    path: 'admin', 
    loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
    canActivate: [AuthGuard] 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
