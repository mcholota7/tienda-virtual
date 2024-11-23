import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageInventoryComponent } from './manage-inventory/manage-inventory.component';
import { RouterModule } from '@angular/router'; // Asegúrate de importar RouterModule
import { CreateProductComponent } from './create-product/create-product.component';
import { ProductManageComponent } from './product-manage/product-manage.component';
import { ActualizarRepuestoComponent } from './actualizar-repuesto/actualizar-repuesto.component';
import { ReporteVentasComponent } from './reporte-ventas/reporte-ventas.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    ManageInventoryComponent,
    CreateProductComponent,
    ProductManageComponent,
    ActualizarRepuestoComponent,
    ReporteVentasComponent
  ],
  imports: [
    RouterModule,
    CommonModule 
  ]
})
export class AdminModule { }
