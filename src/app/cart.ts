
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  maxStock: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    // Charger le panier depuis le localStorage au démarrage
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        this.cartItemsSubject.next(items);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    }
  }

  private saveCartToStorage(items: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(items));
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addToCart(product: any): void {
    const currentItems = this.cartItemsSubject.value;
    
    // Vérifier si le produit est déjà dans le panier
    const existingItem = currentItems.find(item => item.id === product.id);
    
    if (existingItem) {
      // Augmenter la quantité si pas encore au maximum
      if (existingItem.quantity < existingItem.maxStock) {
        existingItem.quantity++;
        this.updateCart([...currentItems]);
      } else {
        alert('Quantité maximale atteinte pour ce produit!');
      }
    } else {
      // Ajouter un nouvel item au panier
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        maxStock: 10 // Par défaut, ou depuis le produit si disponible
      };
      
      this.updateCart([...currentItems, newItem]);
    }
  }

  updateCart(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    this.saveCartToStorage(items);
  }

  removeItem(itemId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter(item => item.id !== itemId);
    this.updateCart(updatedItems);
  }

  updateQuantity(itemId: number, quantity: number): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: Math.max(1, Math.min(quantity, item.maxStock)) };
      }
      return item;
    });
    this.updateCart(updatedItems);
  }

  clearCart(): void {
    this.updateCart([]);
  }

  getTotal(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + (item.price * item.quantity), 
      0
    );
  }

  getTotalItems(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + item.quantity, 
      0
    );
  }
}