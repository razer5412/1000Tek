import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataService,Product } from '../data';

interface StoreAvailability {
  store: string;
  available: boolean;
}

interface PaymentPlan {
  months: number;
  selected: boolean;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './detail.html',
  styleUrls: ['./detail.css']
})
export class Detail implements OnInit {
  product: Product | null = null;
  selectedImage: string = '';
  productImages: string[] = [];
  quantity: number = 1;
  isLoading = true;

  storeAvailability: StoreAvailability[] = [
    { store: 'Boutique Tunis', available: true },
    { store: 'Sousse', available: true },
    { store: 'Sfax', available: true },
    { store: 'Tunis Drive-in', available: true }
  ];

  paymentPlans: PaymentPlan[] = [
    { months: 12, selected: false },
    { months: 9, selected: false },
    { months: 6, selected: false },
    { months: 3, selected: true }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.loadProduct(productId);
    });
  }

  loadProduct(id: number): void {
    this.dataService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.selectedImage = product.image;
        // Generate multiple images (in real app, these would come from API)
        this.productImages = [
          product.image,
          product.image,
          product.image,
          product.image
        ];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.isLoading = false;
      }
    });
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  selectPaymentPlan(months: number): void {
    this.paymentPlans.forEach(plan => {
      plan.selected = plan.months === months;
    });
  }

  addToCart(): void {
    if (this.product) {
      console.log('Adding to cart:', this.product, 'Quantity:', this.quantity);
      alert(`${this.product.name} ajouté au panier!`);
    }
  }

  addToFavorites(): void {
    if (this.product) {
      console.log('Adding to favorites:', this.product);
      alert('Ajouté aux favoris!');
    }
  }

  compareProduct(): void {
    if (this.product) {
      console.log('Compare product:', this.product);
      alert('Produit ajouté à la comparaison!');
    }
  }

  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '★'.repeat(fullStars) + 
           (halfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
  }

  calculateDiscount(): number {
    if (!this.product) return 0;
    const originalPrice = this.product.price * 1.5; // Simulate original price
    return Math.round(originalPrice - this.product.price);
  }

  getOriginalPrice(): number {
    if (!this.product) return 0;
    return this.product.price * 1.5; // Simulate original price
  }
}