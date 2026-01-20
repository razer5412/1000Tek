import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService,Product,Category } from '../data';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.html',
  styleUrls: ['./product.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  allProducts: Product[] = [];
  categories: Category[] = [];
  selectedCategory: string = '';
  categoryDisplayName: string = 'Tous les produits';
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.dataService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadProducts(): void {
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      this.selectedCategory = category || '';

      if (category) {
        // Load products by category
        this.dataService.getProductsByCategory(category).subscribe({
          next: (products) => {
            this.products = products;
            this.allProducts = products;
            this.updateCategoryDisplayName(category);
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading products:', error);
            this.isLoading = false;
          }
        });
      } else {
        // Load all products
        this.dataService.getProducts().subscribe({
          next: (products) => {
            this.products = products;
            this.allProducts = products;
            this.categoryDisplayName = 'Tous les produits';
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading products:', error);
            this.isLoading = false;
          }
        });
      }
    });
  }

  updateCategoryDisplayName(categoryName: string): void {
    const category = this.categories.find(c => c.name === categoryName);
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

  addToCart(product: Product): void {
    console.log('Adding to cart:', product);
    alert(`${product.name} ajouté au panier!`);
    // TODO: Implement cart service
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