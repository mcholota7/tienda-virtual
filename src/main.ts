import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing.module'; // Importa las rutas
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Importar HttpClientModule

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Proveer las rutas aquí
    importProvidersFrom(HttpClientModule)
  ]
}).catch(err => console.error(err));
