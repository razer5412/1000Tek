import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../cart';
import { AuthService } from '../auth';
import { HttpClient } from '@angular/common/http';

interface CheckoutData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  delivery_method: 'delivery' | 'pickup'; // NEW
  payment_method: string;
  notes: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class Checkout implements OnInit {
  cartSummary: any;
  isProcessing = false;
  
  // Store location info
  storeInfo = {
    name: '1000 TEK',
    address: 'Avenue Habib Bourguiba, Tunis',
    phone: '+216 71 XXX XXX',
    hours: 'Lun-Sam: 9h-18h'
  };

  checkoutData: CheckoutData = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    delivery_method: 'delivery', // Default to delivery
    payment_method: 'cash',
    notes: ''
  };

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cartSummary = this.cartService.getCartSummary();
    
    // Pre-fill user data if logged in
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.checkoutData.name = currentUser.name;
      this.checkoutData.email = currentUser.email;
    }

    // Redirect if cart is empty
    if (this.cartSummary.items.length === 0) {
      alert('Votre panier est vide!');
      this.router.navigate(['/products']);
    }
  }

  // Update shipping cost based on delivery method
  onDeliveryMethodChange(): void {
    if (this.checkoutData.delivery_method === 'pickup') {
      // Pickup = no shipping cost
      this.cartSummary = this.cartService.getCartSummary();
      this.cartSummary.shipping = 0;
      this.cartSummary.total = this.cartSummary.subtotal + this.cartSummary.tax;
    } else {
      // Recalculate with shipping
      this.cartSummary = this.cartService.getCartSummary();
    }
  }

  async submitOrder(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.isProcessing = true;

    try {
      const currentUser = this.authService.getCurrentUser();
      
      // Prepare order data
      const orderData = {
        user_id: currentUser ? currentUser.id : null,
        total: this.cartSummary.total,
        subtotal: this.cartSummary.subtotal,
        tax: this.cartSummary.tax,
        shipping: this.checkoutData.delivery_method === 'pickup' ? 0 : this.cartSummary.shipping,
        delivery_method: this.checkoutData.delivery_method, // NEW
        products: this.cartSummary.items.map((item: any) => ({
          id: item.id,
          qty: item.quantity
        })),
        customer_info: {
          name: this.checkoutData.name,
          email: this.checkoutData.email,
          phone: this.checkoutData.phone,
          address: this.checkoutData.delivery_method === 'delivery' ? this.checkoutData.address : null,
          city: this.checkoutData.delivery_method === 'delivery' ? this.checkoutData.city : null,
          postal_code: this.checkoutData.delivery_method === 'delivery' ? this.checkoutData.postal_code : null
        },
        payment_method: this.checkoutData.payment_method,
        notes: this.checkoutData.notes
      };

      // Send to backend
      const response = await this.http.post('http://localhost:3000/api/commandes/create', orderData).toPromise();

      // Clear cart
      this.cartService.clearCart();

      // Show success message with delivery info
      const deliveryMessage = this.checkoutData.delivery_method === 'pickup' 
        ? `\n\n📍 Retrait en magasin:\n${this.storeInfo.name}\n${this.storeInfo.address}\n${this.storeInfo.hours}\n\nVeuillez attendre la confirmation par email/SMS avant de vous présenter.`
        : `\n\n🚚 Livraison à domicile\nAdresse: ${this.checkoutData.address}, ${this.checkoutData.city}\n\nVous serez contacté pour confirmer la date de livraison.`;

      alert(
        `✅ Commande passée avec succès!\n` +
        `Numéro de commande: ${(response as any).order_number}\n` +
        `\n⏳ Votre commande est en attente de validation par notre équipe.\n` +
        `Vous recevrez une confirmation par email dans les plus brefs délais.` +
        deliveryMessage
      );

      // Redirect to order confirmation page
      this.router.navigate(['/order-confirmation'], { 
        queryParams: { 
          orderId: (response as any).id,
          orderNumber: (response as any).order_number
        }
      });

    } catch (error: any) {
      console.error('Error creating order:', error);
      alert('Erreur lors de la création de la commande: ' + (error.error?.message || 'Erreur inconnue'));
    } finally {
      this.isProcessing = false;
    }
  }

  validateForm(): boolean {
    if (!this.checkoutData.name) {
      alert('Veuillez entrer votre nom');
      return false;
    }

    if (!this.checkoutData.email) {
      alert('Veuillez entrer votre email');
      return false;
    }

    if (!this.checkoutData.phone) {
      alert('Veuillez entrer votre téléphone');
      return false;
    }

    // Only validate address fields if delivery method is "delivery"
    if (this.checkoutData.delivery_method === 'delivery') {
      if (!this.checkoutData.address) {
        alert('Veuillez entrer votre adresse de livraison');
        return false;
      }

      if (!this.checkoutData.city) {
        alert('Veuillez entrer votre ville');
        return false;
      }
    }

    return true;
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  backToCart(): void {
    this.router.navigate(['/panier']);
  }
}