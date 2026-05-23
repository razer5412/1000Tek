import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService, Product, Category } from '../data';
import { CartService } from '../cart';

import { ToastService } from '../shared/cart-toast.service';

// Extend Category interface locally to add displayName
interface DisplayCategory extends Category {
  displayName: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.html',
  styleUrls: ['./product.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  allProducts: Product[] = [];
  categories: DisplayCategory[] = [];
  selectedCategory: string = '';
  categoryDisplayName: string = 'Tous les produits';
  isLoading = true;
  searchQuery: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private cartService: CartService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.dataService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.map(cat => ({
          ...cat,
          displayName: cat.name,
          icon: cat.icon || '📦'
        })) as DisplayCategory[];
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categories = [];
      }
    });
  }

  loadProducts(): void {
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      const isParent = params['parent'] === 'true';
      this.selectedCategory = category || '';

      const search = params['search'];
      if (search) {
        this.searchQuery = search;
      }

      if (category) {
        // Check if it's a parent category
        if (isParent) {
          // Load all products from parent category and subcategories
          this.dataService.getProductsByParentCategory(category).subscribe({
            next: (products) => {
              this.products = products;
              this.allProducts = products;
              this.updateCategoryDisplayName(category);
              this.isLoading = false;
              if (search) this.searchProducts();
            },
            error: (error) => {
              console.error('Error loading products:', error);
              this.products = [];
              this.allProducts = [];
              this.isLoading = false;
            }
          });
        } else {
          // Load products from specific subcategory
          this.dataService.getProductsByCategory(category).subscribe({
            next: (products) => {
              this.products = products;
              this.allProducts = products;
              this.updateCategoryDisplayName(category);
              this.isLoading = false;
              if (search) this.searchProducts();
            },
            error: (error) => {
              console.error('Error loading products:', error);
              this.products = [];
              this.allProducts = [];
              this.isLoading = false;
            }
          });
        }
      } else {
        // Load all products
        this.dataService.getProducts().subscribe({
          next: (products) => {
            this.products = products;
            this.allProducts = products;
            this.categoryDisplayName = search ? `Résultats pour: "${search}"` : 'Tous les produits';
            this.isLoading = false;
            if (search) this.searchProducts();
          },
          error: (error) => {
            console.error('Error loading products:', error);
            this.products = [];
            this.allProducts = [];
            this.isLoading = false;
          }
        });
      }
    });
  }

  updateCategoryDisplayName(categoryName: string): void {
    const category = this.categories.find(c =>
      c.name.toLowerCase() === categoryName.toLowerCase() ||
      c.slug === categoryName
    );
    this.categoryDisplayName = category ? category.displayName : categoryName;
  }

  filterByCategory(categoryName: string): void {
    this.router.navigate(['/products'], {
      queryParams: { category: categoryName }
    });
  }

  showAllProducts(): void {
    this.router.navigate(['/products']);
  }

  viewProductDetail(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  addToCart(product: Product): void {
    if (!product.inStock) {
      alert('Ce produit n\'est pas disponible en stock!');
    }

    this.cartService.addToCart(product);
    this.toast.show(
      'Produit ajouté au panier',
      'success'
    );
  }

  searchProducts(): void {
    if (!this.searchQuery.trim()) {
      this.products = this.allProducts;
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.products = this.allProducts.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query)
    );
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