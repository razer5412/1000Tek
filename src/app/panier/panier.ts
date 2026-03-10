import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService,CartItem } from '../cart';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
    // Subscribe to cart changes
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
    
    // Initialize with current data
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

  // Get cart summary with tax and shipping
  getCartSummary() {
    return this.cartService.getCartSummary();
  }

  // Increase quantity
  increaseQuantity(item: CartItem): void {
    this.cartService.increaseQuantity(item.id);
  }

  // Decrease quantity
  decreaseQuantity(item: CartItem): void {
    this.cartService.decreaseQuantity(item.id);
  }

  // Update quantity manually
  updateQuantity(item: CartItem, quantity: number): void {
    const qty = Math.max(1, Math.min(quantity, item.maxStock));
    this.cartService.updateQuantity(item.id, qty);
  }

  // Remove item from cart
  removeItem(itemId: number): void {
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
}

  // Continue shopping
  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  // Check if cart is empty
  isCartEmpty(): boolean {
    return this.cartItems.length === 0;
  }
}