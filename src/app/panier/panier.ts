
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService,CartItem } from '../cart';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './panier.html',
  styleUrls: ['./panier.css']
})
export class Panier implements OnInit {
  cartItems: CartItem[] = [];
  
  constructor(
    private cartService: CartService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // S'abonner aux changements du panier
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
    
    // Initialiser avec les données actuelles
    this.cartItems = this.cartService.getCartItems();
  }

  // Calculate subtotal for an item
  getItemSubtotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  // Calculate total price
  getTotal(): number {
    return this.cartService.getTotal();
  }

  // Get total items count
  getTotalItems(): number {
    return this.cartService.getTotalItems();
  }

  // Increase quantity
  increaseQuantity(item: CartItem): void {
    if (item.quantity < item.maxStock) {
      this.cartService.updateQuantity(item.id, item.quantity + 1);
    }
  }

  // Decrease quantity
  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.id, item.quantity - 1);
    }
  }

  // Update quantity manually
  updateQuantity(item: CartItem, quantity: number): void {
    const qty = Math.max(1, Math.min(quantity, item.maxStock));
    this.cartService.updateQuantity(item.id, qty);
  }

  // Remove item from cart
  removeItem(itemId: string): void {  // Changé à string
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      this.cartService.removeItem(itemId);
    }
  }

  // Clear entire cart
  clearCart(): void {
    if (confirm('Êtes-vous sûr de vouloir vider le panier ?')) {
      this.cartService.clearCart();
    }
  }

  // Proceed to checkout
  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      alert('Votre panier est vide');
      return;
    }
    // Navigate to checkout page
    this.router.navigate(['/checkout']);
    console.log('Proceeding to checkout...');
  }

  // Continue shopping
  continueShopping(): void {
    // Navigate back to shop
    this.router.navigate(['/products']);
    console.log('Continue shopping...');
  }
}
