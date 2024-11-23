import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product';
import { CartItem } from './cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: CartItem[] = [];
  private cartCountSource = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSource.asObservable();
  private apiUrl = 'http://localhost:5000/api/pedidos/crear'; 

  constructor(private http: HttpClient) {
    this.cart = this.loadCartFromStorage();
    this.updateCartCount();
  }

  private loadCartFromStorage(): CartItem[] {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  }

  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  private syncCart(): void {
    // Actualiza tanto el almacenamiento local como el contador de ítems.
    this.saveCartToStorage();
    this.updateCartCount();
  }

  addToCart(product: Product): boolean {
    const existingItemIndex = this.cart.findIndex(item => item.product._id === product._id);

    if (existingItemIndex !== -1) {
      this.cart[existingItemIndex].quantity++;
    } else {
      this.cart.push({ product, quantity: 1 });
    }

    this.syncCart();
    return true;
  }

  removeFromCart(productId: number): void {
    const index = this.cart.findIndex(item => item.product._id === productId);
    if (index !== -1) {
      this.cart.splice(index, 1);
      this.syncCart();
    }
  }

  updateQuantity(productId: number, quantity: number): void {
    const cartItem = this.cart.find(item => item.product._id === productId);
    if (cartItem) {
      cartItem.quantity = quantity;
      if (cartItem.quantity <= 0) {
        this.removeFromCart(productId); 
      }
      this.syncCart();
    }
  }

  getCartItems(): CartItem[] {
    return [...this.cart]; 
  }

  private updateCartCount(): void {
    const totalQuantity = this.cart.reduce((total, item) => total + item.quantity, 0);
    this.cartCountSource.next(totalQuantity);
  }

  getCartCount(): number {
    return this.cartCountSource.value;
  }

  saveCartToApi(userId: number, token: string): Observable<any> {
    const detalles = this.cart.map(item => ({
      idrespuesto: item.product._id,
      cantidad: item.quantity,
    }));

    const pedido = {
      idusuario: userId,
      idestado: 1,
      observacion: 'En proceso',
      detalles: detalles,
    };
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, pedido, { headers });
  }

  clearCart(): void {
    this.cart = []; 
    localStorage.removeItem('cart'); 
    this.cartCountSource.next(0); 
    console.log('Carrito eliminado y sincronizado.');
  }

  restoreCart(cartItems: CartItem[]): void {
    if (cartItems && cartItems.length > 0) {
      this.cart = cartItems.map(item => ({
        product: item.product,
        quantity: item.quantity,
      }));
      this.syncCart();
      console.log('Carrito restaurado:', this.cart);
    } else {
      console.warn('Intento de restaurar carrito vacío.');
    }
  }
}
