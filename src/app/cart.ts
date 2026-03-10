import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: number;  // Changed to number to match MySQL database
  name: string;
  price: number;
  quantity: number;
  image: string;
  maxStock: number;
  brand?: string;
  category?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  constructor() {
    // Load cart from localStorage on initialization
    this.loadCartFromStorage();
  }

  /**
   * Load cart from localStorage
   */
  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        this.cartItemsSubject.next(items);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
        localStorage.removeItem('cart');
      }
    }
  }

  /**
   * Save cart to localStorage
   */
  private saveCartToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  /**
   * Get current cart items
   */
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  /**
   * Add product to cart
   */
  addToCart(product: any, quantity: number = 1): void {
    const currentItems = this.cartItemsSubject.value;
    
    // Check if product already exists in cart
    const existingItemIndex = currentItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
      // Product exists, update quantity
      const existingItem = currentItems[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;
      
      if (newQuantity <= existingItem.maxStock) {
        currentItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity
        };
        this.updateCart(currentItems);
      } else {
        console.warn(`Cannot add more. Maximum stock (${existingItem.maxStock}) reached for ${product.name}`);
        alert(`Quantité maximale atteinte pour ce produit! (Max: ${existingItem.maxStock})`);
      }
    } else {
      // New product, add to cart
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image,
        maxStock: product.inStock ? 10 : 0, // Default max stock
        brand: product.brand,
        category: product.category
      };
      
      this.updateCart([...currentItems, newItem]);
    }
  }

  /**
   * Update entire cart
   */
  updateCart(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    this.saveCartToStorage(items);
  }

  /**
   * Remove item from cart
   */
  removeItem(itemId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter(item => item.id !== itemId);
    this.updateCart(updatedItems);
  }

  /**
   * Update item quantity
   */
  updateQuantity(itemId: number, quantity: number): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.map(item => {
      if (item.id === itemId) {
        // Ensure quantity is within valid range
        const newQuantity = Math.max(1, Math.min(quantity, item.maxStock));
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    this.updateCart(updatedItems);
  }

  /**
   * Increase item quantity
   */
  increaseQuantity(itemId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find(i => i.id === itemId);
    if (item && item.quantity < item.maxStock) {
      this.updateQuantity(itemId, item.quantity + 1);
    } else {
      alert('Quantité maximale atteinte!');
    }
  }

  /**
   * Decrease item quantity
   */
  decreaseQuantity(itemId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find(i => i.id === itemId);
    if (item && item.quantity > 1) {
      this.updateQuantity(itemId, item.quantity - 1);
    }
  }

  /**
   * Clear entire cart
   */
  clearCart(): void {
    this.updateCart([]);
  }

  /**
   * Get cart total price
   */
  getTotal(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + (item.price * item.quantity), 
      0
    );
  }

  /**
   * Get total number of items in cart
   */
  getTotalItems(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + item.quantity, 
      0
    );
  }

  /**
   * Get total unique products in cart
   */
  getUniqueItemsCount(): number {
    return this.cartItemsSubject.value.length;
  }

  /**
   * Check if product is in cart
   */
  isInCart(productId: number): boolean {
    return this.cartItemsSubject.value.some(item => item.id === productId);
  }

  /**
   * Get item quantity by product ID
   */
  getItemQuantity(productId: number): number {
    const item = this.cartItemsSubject.value.find(i => i.id === productId);
    return item ? item.quantity : 0;
  }

  /**
   * Validate cart items (check stock availability)
   * This would typically check against backend
   */
  validateCart(): Observable<boolean> {
    // In a real app, this would call the backend to validate stock
    // For now, just return true
    return new Observable(observer => {
      const items = this.cartItemsSubject.value;
      const isValid = items.every(item => item.quantity <= item.maxStock);
      observer.next(isValid);
      observer.complete();
    });
  }

  /**
   * Get cart summary
   */
  getCartSummary(): {
    items: CartItem[];
    totalItems: number;
    uniqueItems: number;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  } {
    const items = this.cartItemsSubject.value;
    const subtotal = this.getTotal();
    const tax = subtotal * 0.19; // 19% TVA in Tunisia
    const shipping = subtotal > 200 ? 0 : 7; // Free shipping over 200 TND
    const total = subtotal + tax + shipping;

    return {
      items,
      totalItems: this.getTotalItems(),
      uniqueItems: this.getUniqueItemsCount(),
      subtotal,
      tax,
      shipping,
      total
    };
  }
}