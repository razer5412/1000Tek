import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService, Product, Category } from '../data';
import { CartService } from '../cart';
import { Subscription, forkJoin } from 'rxjs';
import { ToastService } from '../shared/cart-toast.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit, OnDestroy {
  // Products
  nouveautes: Product[] = [];
  topCategories: Product[] = [];
  dealsOfDay: Product[] = [];
  bestSellers: Product[] = [];
  
  // Categories
  categories: Category[] = [];
  activeCategoryTab = '';
  categoryProducts: { [key: string]: Product[] } = {};
  
  // Brands
  brands = [
    { name: 'ASUS', slug: 'asus', logo: 'asus.png' },
    { name: 'Acer', slug: 'acer', logo: 'acer.png' },
    { name: 'Dell', slug: 'dell', logo: 'dell.png' },
    { name: 'Apple', slug: 'apple', logo: 'apple.png' },
    { name: 'Samsung', slug: 'samsung', logo: 'samsung.png' },
    { name: 'MSI', slug: 'msi', logo: 'msi.png' },
  ];

  // UI States
  isLoading = true;
  fadeIn = false;
  scrollY = 0;
  errorMessage = '';

  // Subscriptions
  private subscriptions: Subscription[] = [];
  

  constructor(
    private router: Router,
    private dataService: DataService,
    private cartService: CartService,
    private toast: ToastService
  ) {}

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  ngOnInit(): void {
    this.loadAllData();
    setTimeout(() => this.fadeIn = true, 100);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  loadAllData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Load categories
    const categorySub = this.dataService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.filter(cat => 
          cat.parent_id !== null && cat.parent_id === 1
        ).slice(0, 6);
        
        if (this.categories.length > 0) {
          this.activeCategoryTab = this.categories[0].slug;
          this.loadCategoryProducts(this.activeCategoryTab);
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.errorMessage = 'Erreur de chargement des catégories';
      }
    });
    this.subscriptions.push(categorySub);

    // Load all products
    const productsSub = this.dataService.getProducts().subscribe({
      next: (products) => {
        // NOUVEAUTÉS - Plus récents d'abord
        this.nouveautes = [...products]
          .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, 4);

        // TOP CATEGORIES - PC portables par défaut
        this.topCategories = products
          .filter(p => p.category_id === 8)
          .slice(0, 4);

        // DEALS OF THE DAY - 20% de réduction simulé
        this.dealsOfDay = products
          .filter(p => p.inStock)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4)
          .map(p => ({
            ...p,
            discountPrice: Number((p.price * 0.8).toFixed(3)),
            discount: 20
          }));

        // BEST SELLERS - Meilleures notes
        this.bestSellers = [...products]
          .filter(p => p.rating >= 4.5)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 4);

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Erreur de chargement des produits';
        this.isLoading = false;
        this.loadFallbackData();
      }
    });
    this.subscriptions.push(productsSub);
  }

  loadCategoryProducts(categorySlug: string): void {
    const category = this.categories.find(c => c.slug === categorySlug);
    if (!category) return;

    const sub = this.dataService.getProductsByCategoryId(category.id).subscribe({
      next: (products) => {
        this.categoryProducts[categorySlug] = products.slice(0, 4);
        this.topCategories = this.categoryProducts[categorySlug];
      },
      error: (error) => {
        console.error(`Error loading products for category ${categorySlug}:`, error);
        this.loadProductsByParentCategory(categorySlug);
      }
    });
    this.subscriptions.push(sub);
  }

  loadProductsByParentCategory(parentSlug: string): void {
    const sub = this.dataService.getProductsByParentCategory(parentSlug).subscribe({
      next: (products) => {
        this.categoryProducts[parentSlug] = products.slice(0, 4);
        this.topCategories = this.categoryProducts[parentSlug];
      },
      error: (error) => {
        console.error(`Error loading products by parent category ${parentSlug}:`, error);
      }
    });
    this.subscriptions.push(sub);
  }

  loadFallbackData(): void {
    this.nouveautes = [];
    this.topCategories = [];
    this.dealsOfDay = [];
    this.bestSellers = [];
  }

  changeCategory(categorySlug: string): void {
    this.activeCategoryTab = categorySlug;
    this.loadCategoryProducts(categorySlug);
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  viewCategory(categorySlug: string): void {
    this.router.navigate(['/category', categorySlug]);
  }

  viewBrand(brandSlug: string): void {
    this.router.navigate(['/brand', brandSlug]);
  }

  addToCart(product: Product, event: Event): void {
  event.stopPropagation();
  event.preventDefault();
  
  if (!product.inStock) {
    alert(`❌ ${product.name} n'est pas disponible`);
    return;
  }

  this.cartService.addToCart(product);
  this.toast.show(
    'Produit ajouté au panier',
    'success'
  );
}

  addToWishlist(product: Product, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!wishlist.some((p: any) => p.id === product.id)) {
      wishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      
    } 
  }

  quickView(product: Product, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.viewProduct(product.id);
  }

  subscribeNewsletter(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const input = form.querySelector('.newsletter-input') as HTMLInputElement;
    const email = input?.value;

    if (email && this.isValidEmail(email)) {
      this.showNotification(`✅ Merci pour votre inscription!`, 'success');
      input.value = '';
    } else {
      this.showNotification(`❌ Veuillez entrer un email valide`, 'error');
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(price).replace('TND', '').trim() + ' TND';
  }

  getRatingStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
  }

  getDiscountPercentage(original: number, discounted: number): number {
    return Math.round(((original - discounted) / original) * 100);
  }

  isNewProduct(product: Product): boolean {
    if (!product.createdAt) return false;
    const created = new Date(product.createdAt).getTime();
    const now = new Date().getTime();
    const daysDiff = (now - created) / (1000 * 60 * 60 * 24);
    return daysDiff <= 30;
  }

  private showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    const colors = {
      success: '#22c55e',
      error: '#ef4444',
      info: '#3b82f6'
    };

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 14px 28px;
      background: ${colors[type]};
      color: white;
      border-radius: 50px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 10px;
      animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(255,255,255,0.2);
    `;

    document.body.appendChild(notification);

    if (!document.querySelector('#notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        .cart-bounce {
          animation: bounce 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `;
      document.head.appendChild(style);
    }

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  private animateCartIcon(): void {
    const cartIcon = document.querySelector('.cart-icon, .fa-shopping-cart, [routerLink="/cart"]');
    if (cartIcon) {
      cartIcon.classList.add('cart-bounce');
      setTimeout(() => cartIcon.classList.remove('cart-bounce'), 500);
    }
  }

  private isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  trackByCategoryId(index: number, category: Category): number {
    return category.id;
  }

  trackByBrandName(index: number, brand: any): string {
    return brand.slug;
  }
  
  
}