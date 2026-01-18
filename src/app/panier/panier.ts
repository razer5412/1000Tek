import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  maxStock: number;
}

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './panier.html',
  styleUrls: ['./panier.css']
})
export class Panier implements OnInit {
  cartItems: CartItem[] = [];
  
  ngOnInit(): void {
    // Sample cart items - In real app, get from service
    this.cartItems = [
      {
        id: 1,
        name: 'Pc Portable Asus X515EP I7-11ème, 8Go, 512 Ssd Ecran 15.6" FHD',
        price: 2299.000,
        quantity: 1,
        image: 'assets/images/products/asus-x515ep.jpg',
        maxStock: 10
      },
      {
        id: 2,
        name: 'PC Portable Gamer MSI Katana GF66 12UC-052FR',
        price: 3299.000,
        quantity: 2,
        image: 'assets/images/products/msi-katana.jpg',
        maxStock: 5
      }
    ];
  }

  // Calculate subtotal for an item
  getItemSubtotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  // Calculate total price
  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + this.getItemSubtotal(item), 0);
  }

  // Get total items count
  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Increase quantity
  increaseQuantity(item: CartItem): void {
    if (item.quantity < item.maxStock) {
      item.quantity++;
    }
  }

  // Decrease quantity
  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  // Update quantity manually
  updateQuantity(item: CartItem, quantity: number): void {
    const qty = Math.max(1, Math.min(quantity, item.maxStock));
    item.quantity = qty;
  }

  // Remove item from cart
  removeItem(itemId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
  }

  // Clear entire cart
  clearCart(): void {
    if (confirm('Êtes-vous sûr de vouloir vider le panier ?')) {
      this.cartItems = [];
    }
  }

  // Proceed to checkout
  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      alert('Votre panier est vide');
      return;
    }
    // Navigate to checkout page
    console.log('Proceeding to checkout...');
  }

  // Continue shopping
  continueShopping(): void {
    // Navigate back to shop
    console.log('Continue shopping...');
  }
}