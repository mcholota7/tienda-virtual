import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageInventoryComponent } from './manage-inventory/manage-inventory.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { ProductManageComponent } from './product-manage/product-manage.component';
import { ActualizarRepuestoComponent } from './actualizar-repuesto/actualizar-repuesto.component';
import { ReporteVentasComponent } from './reporte-ventas/reporte-ventas.component';
import { ReportePedidosComponent } from './reporte-pedidos/reporte-pedidos.component';
import { DetalleOrdenComponent } from './detalle-orden/detalle-orden.component';


const routes: Routes = [
  { path: '', component: AdminDashboardComponent},
  { path: 'inventory', component: ManageInventoryComponent },
  { path: 'create-product', component: CreateProductComponent },
  { path: 'select-product', component: ProductManageComponent },
  { path: 'update-product/:id', component: ActualizarRepuestoComponent },
  { path: 'sales-report', component: ReporteVentasComponent },
  { path: 'orders-client', component: ReportePedidosComponent },
  { path: 'orders-client-detail/:id', component: DetalleOrdenComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
