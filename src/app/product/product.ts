// src/app/components/products/products.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../service';
import { Product,Category } from '../model/product.model'; 
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-products',
   imports:  [CommonModule],
  templateUrl: './product.html',
  styleUrls: ['./product.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategory: string = 'all';
  loading: boolean = true;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get categories
    this.productService.getCategories().subscribe(cats => {
      this.categories = cats;
    });

    // Subscribe to route params to get category
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] || 'all';
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProductsByCategory(this.selectedCategory)
      .subscribe(products => {
        this.products = products;
        this.loading = false;
      });
  }

  onCategoryChange(category: string): void {
    this.router.navigate(['/products'], { 
      queryParams: { category: category } 
    });
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/product', productId]);
  }
}
