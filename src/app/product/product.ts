
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService, Category, Product } from '../data';
import { CartService } from '../cart';

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
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // Catégories par défaut en cas d'erreur
        this.categories = [
          { id: '1', name: 'laptop', displayName: 'Laptops', icon: '💻' },
          { id: '2', name: 'pc', displayName: 'Desktop PCs', icon: '🖥️' },
          { id: '3', name: 'informatique', displayName: 'Accessoires Informatique', icon: '⌨️' },
          { id: '4', name: 'telephonie', displayName: 'Téléphonie', icon: '📱' },
          { id: '5', name: 'tv', displayName: 'TV & Vidéo', icon: '📺' },
          { id: '6', name: 'audio', displayName: 'Audio', icon: '🎧' },
          { id: '7', name: 'electromenager', displayName: 'Électroménager', icon: '🧺' },
          { id: '8', name: 'securite', displayName: 'Sécurité', icon: '📹' }
        ];
      }
    });
  }

  loadProducts(): void {
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      this.selectedCategory = category || '';

      if (category) {
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
      } else {
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

  viewProductDetail(productId: string): void {  // Changé à string
    this.router.navigate(['/product', productId]);
  }

  addToCart(product: Product): void {
    if (!product.inStock) {
      alert('Ce produit n\'est pas disponible en stock!');
      return;
    }

    // Créer un objet compatible avec CartItem
    const cartProduct = {
      id: product.id,  // ID est maintenant string
      name: product.name,
      price: product.price,
      image: product.image,
      maxStock: 10
    };

    this.cartService.addToCart(cartProduct);
    
    // Afficher un message de confirmation
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
