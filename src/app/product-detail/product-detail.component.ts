import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { CartService } from '../cart.service';
import { ProductService } from '../product.service';
import { Product } from '../product';
import { NgxImageZoomModule } from 'ngx-image-zoom';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule,  NgxImageZoomModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  productId: number | null = null;
  product: Product | undefined;
  message: string | null = null;


  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private cartService: CartService,
    private repuestoService: ProductService // Inyecta el servicio de repuestos
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.productId) {
      this.fetchProduct(this.productId);
    }
  }

  fetchProduct(id: number): void {
    this.repuestoService.getRepuestoById(id).subscribe(
      (productData) => {
        this.product = {
          _id: productData._id,
          nombre_repuesto: productData.nombre_repuesto,
          precio: productData.precio,
          imagen_url: productData.imagen_url,
          cantidad: productData.cantidad,
          marca: {
            _id: productData.marca._id,
            nombre_marca: productData.marca.nombre_marca
          },
          modelo: {
            _id: productData.modelo._id,
            nombre_modelo: productData.modelo.nombre_modelo
          }
        } as Product;
      },
      (error) => {
        console.error('Error al cargar el producto:', error);
      }
    );
  }

  addToCart(): void {
    if (this.product) {
      const added = this.cartService.addToCart(this.product);
      this.message = added ? 'Producto agregado al carrito!' : 'El producto ya está en el carrito.';
      setTimeout(() => (this.message = null), 3000);
    }
  }

  goBack(): void {
    this.location.back();
  }
}