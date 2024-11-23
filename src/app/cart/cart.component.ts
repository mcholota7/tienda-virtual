import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { AuthService } from '../services/auth.service';
import { CartItem } from '../cart-item';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  iva: number = 0;
  total: number = 0;
  isAuthenticated$: Observable<boolean>;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  ngOnInit(): void {
    this.updateCartItems();
    
    const purchaseSuccess = localStorage.getItem('purchaseSuccess');
    if (purchaseSuccess) {
      localStorage.removeItem('purchaseSuccess');
    }
  }

  private updateCartItems(): void {
    this.cartItems = this.cartService.getCartItems(); 
    this.calculateTotals(); 
  }

  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => {
      const priceWithoutIVA = item.product.precio * (1 - 0.13); 
      return sum + priceWithoutIVA * item.quantity; 
    }, 0);

    this.iva = this.cartItems.reduce((sum, item) => {
      const priceIVA = item.product.precio * 0.13; 
      return sum + priceIVA * item.quantity; 
    }, 0);

    this.total = this.subtotal + this.iva;
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.updateCartItems(); 
  }

  updateQuantity(productId: number, quantity: number): void {
    const product = this.cartItems.find(item => item.product._id === productId);
    if (product && quantity <= product.product.cantidad && quantity > 0) {
      this.cartService.updateQuantity(productId, quantity);
      this.updateCartItems(); 
    } else if (quantity > product!.product.cantidad) {
      alert('La cantidad solicitada supera el stock disponible.');
    } else if (quantity <= 0) {
      alert('La cantidad no puede ser cero o negativa.');
    }
  }

  onQuantityChange(event: Event, productId: number): void {
    const inputElement = event.target as HTMLInputElement;
    const newQuantity = parseInt(inputElement.value, 10);

    if (!isNaN(newQuantity) && newQuantity > 0) {
      this.updateQuantity(productId, newQuantity);
    } else {
      const currentItem = this.cartItems.find(item => item.product._id === productId);
      if (currentItem) {
        inputElement.value = currentItem.quantity.toString();
      }
    }
  }

  onFinishPurchase() {
    this.isAuthenticated$.subscribe(isAuthenticated => {
      if (!isAuthenticated) {
        const cartItems = this.cartService.getCartItems();
        localStorage.setItem('cartBeforeLogin', JSON.stringify(cartItems));
        this.router.navigate(['/login']);
      } else if (this.cartItems.length === 0) { 
        alert('El carrito está vacío. No se puede procesar el pedido.');
        return; 
      } else { 
        this.checkout();
      }
    });
  }  
  
  private checkout(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo obtener la información del usuario. Por favor, intente iniciar sesión nuevamente.',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
  
    if (this.cartItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Carrito vacío',
        text: 'No hay productos en el carrito para procesar.',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
  
    const token = localStorage.getItem('token');
    if (token) {
      this.cartService.saveCartToApi(userId, token).subscribe(
        (response) => {
          this.cartService.clearCart();
          this.updateCartItems(); 
          Swal.fire({
            icon: 'success',
            title: '¡Pedido registrado!',
            text: 'Su pedido ha sido procesado exitosamente.',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigate(['/']);
          });
        },
        (error) => {
          console.error('Error al guardar el pedido:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error al procesar el pedido',
            text: 'Hubo un problema al guardar su pedido. Por favor, intente nuevamente.',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Token no encontrado. Por favor, inicie sesión para procesar su pedido.',
        confirmButtonText: 'Aceptar'
      });
      console.error('Token no encontrado. El usuario debe iniciar sesión.');
    }
  }
  
}  