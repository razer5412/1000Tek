
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService, Product } from '../data';
import { CartService } from '../cart';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail.html',
  styleUrls: ['./detail.css']
})
export class Detail implements OnInit {
  product: Product | null = null;
  isLoading = true;
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];  // Pas besoin de convertir en number, c'est déjà string
      this.loadProduct(productId);
    });
  }

  loadProduct(id: string): void {  // Changé à string
    this.dataService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.isLoading = false;
      }
    });
  }

  addToCart(): void {
    if (!this.product) return;
    
    if (!this.product.inStock) {
      alert('Ce produit n\'est pas disponible en stock!');
      return;
    }

    const cartProduct = {
      id: this.product.id,
      name: this.product.name,
      price: this.product.price,
      image: this.product.image,
      maxStock: 10
    };

    // Ajouter la quantité sélectionnée
    for (let i = 0; i < this.quantity; i++) {
      this.cartService.addToCart(cartProduct);
    }
    
    alert(`${this.product.name} (x${this.quantity}) a été ajouté au panier!`);
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < 10) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  goToCheckout(): void {
    this.addToCart();
    this.router.navigate(['/panier']);
  }

  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '★'.repeat(fullStars) + 
           (halfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
  }
}
