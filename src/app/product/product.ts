import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService,Product,Category } from '../data';
import { CartService } from '../cart';

// Extend Category interface locally to add displayName
interface DisplayCategory extends Category {
  displayName: string;
}

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
  categories: DisplayCategory[] = [];
  selectedCategory: string = '';
  categoryDisplayName: string = 'Tous les produits';
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private cartService: CartService
  ) {}

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
          this.categoryDisplayName = 'Tous les produits';
          this.isLoading = false;
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
      return;
    }

    this.cartService.addToCart(product);
    alert(`${product.name} a été ajouté au panier!`);
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