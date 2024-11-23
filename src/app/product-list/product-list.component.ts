import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { RouterModule } from '@angular/router';
import { ProductService } from '../product.service';
import { ResponseModels } from '../response-models.interface';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  brand: string;
  model?: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  brands: { name: string, id: number }[] = [];
  models: { name: string, id: number }[] = [];
  selectedBrand: string = '';
  selectedModel: string = '';
  searchTerm: string = '';
  cartCount: number = 0;

  constructor(
    private router: Router,
    private cartService: CartService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadBrands();
    this.searchSpareParts();
  }

  loadBrands(): void {
    this.productService.getBrands().subscribe((brands: { name: string, id: number }[]) => {
      this.brands = brands;
    });
  }

  loadModels(brandId: number): void {
    this.productService.getModelsByBrandId(brandId).subscribe((response: ResponseModels) => {
      this.models = response.modelosMongo.map((model) => ({
        name: model.nombre_modelo,
        id: model._id,
      }));
    });
  }

  filterByBrand(): void {
    const selectedBrandObj = this.brands.find(brand => brand.name === this.selectedBrand);

    if (selectedBrandObj) {
      this.loadModels(selectedBrandObj.id);
    } else {
      this.models = [];
    }
    this.selectedModel = '';
    this.searchSpareParts();
  }

  filterByModel(): void {
    this.searchSpareParts();
  }

  searchSpareParts(): void {
    const selectedBrandObj = this.brands.find(brand => brand.name === this.selectedBrand);
    const selectedModelObj = this.models.find(model => model.name === this.selectedModel);

    this.productService.searchSpareParts(this.searchTerm, selectedBrandObj?.id, selectedModelObj?.id)
      .subscribe((results: any[]) => {
        this.filteredProducts = results.map(item => ({
          id: item._id,
          name: item.nombre_repuesto,
          price: item.precio,
          imageUrl: item.imagen_url,
          brand: item.marca.nombre_marca,
          model: item.modelo.nombre_modelo
        }));
      });
  }

  openProductDetail(product: Product): void {
    this.router.navigate(['/product', product.id]);
  }
}
