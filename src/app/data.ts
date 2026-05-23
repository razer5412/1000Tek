import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Product {
  id: number;
  name: string;
  category: string;
  category_id: number;
  category_name?: string;
  price: number;
  discount?: number;        // Ajouté - pourcentage de réduction
  discountPrice?: number;   // Ajouté - prix après réduction
  image: string;
  description: string;
  brand: string;
  inStock: boolean;
  rating: number;
  reviews?: number;         // Ajouté - nombre d'avis
  soldCount?: number;       // Ajouté - nombre vendus
  createdAt?: string;
  updatedAt?: string;
}

export interface Commande {
  id: number;
  order_number: string;
  user_id: number;

  total: number;
  subtotal: number;
  tax: number;
  shipping: number;

  delivery_method: 'delivery' | 'pickup';
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

  payment_method: string;
  payment_status: 'unpaid' | 'paid' | 'refunded';

  customer_name: string;
  customer_email: string;
  customer_phone: string;

  customer_address: string;
  customer_city: string;
  customer_postal_code: string;

  notes?: string;

  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  icon: string | null;
  position: number;
}

export interface SubMenuItem {
  name: string;
  slug: string;
  category: string;
}

export interface MenuSection {
  title: string;
  items: SubMenuItem[];
}

export interface MenuItem {
  name: string;
  displayName: string;
  icon: string;
  slug: string;
  sections: MenuSection[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000/api';

  private selectedCategorySubject = new BehaviorSubject<string>('');
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  constructor(private http: HttpClient) { }

  // Get menu structure based on categories from database
  getMenuStructure(): Observable<MenuItem[]> {
    return this.getCategories().pipe(
      map(categories => {
        // Build dynamic menu from database categories
        const menuItems: MenuItem[] = [];

        // Get parent categories (parent_id = null)
        const parentCategories = categories.filter(cat => cat.parent_id === null);

        parentCategories.forEach(parent => {
          // Get children of this parent
          const children = categories.filter(cat => cat.parent_id === parent.id);

          const menuItem: MenuItem = {
            name: parent.name,
            displayName: parent.name,
            icon: parent.icon || '📦',
            slug: parent.slug,
            sections: []
          };

          if (children.length > 0) {
            menuItem.sections.push({
              title: parent.name,
              items: children.map(child => ({
                name: child.name,
                slug: child.slug,
                category: child.slug
              }))
            });
          }

          menuItems.push(menuItem);
        });

        return menuItems;
      }),
      catchError(error => {
        console.error('Error building menu structure:', error);
        return of([]);
      })
    );
  }

  // Get all products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      catchError(error => {
        console.error('Error fetching products:', error);
        return of([]);
      })
    );
  }
  // Add this method after getProductsByCategory()

  // Get products by parent category (includes all subcategories)
  getProductsByParentCategory(parentSlug: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/by-parent-category/${parentSlug}`).pipe(
      catchError(error => {
        console.error(`Error fetching products for parent category ${parentSlug}:`, error);
        return of([]);
      })
    );
  }

  // Get product by ID
  getProductById(id: number | string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching product ${id}:`, error);
        throw error;
      })
    );
  }

  // Get products by category (using category slug or name)
  getProductsByCategory(categorySlug: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => products.filter(p => {
        // Match by category name or slug
        const categoryLower = p.category?.toLowerCase() || '';
        const slugLower = categorySlug.toLowerCase();
        return categoryLower.includes(slugLower) || categoryLower === slugLower;
      })),
      catchError(error => {
        console.error(`Error fetching products for category ${categorySlug}:`, error);
        return of([]);
      })
    );
  }

  // Get products by category ID
  getProductsByCategoryId(categoryId: number): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => products.filter(p => p.category_id === categoryId)),
      catchError(error => {
        console.error(`Error fetching products for category ID ${categoryId}:`, error);
        return of([]);
      })
    );
  }

  // Get all categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`).pipe(
      catchError(error => {
        console.error('Error fetching categories:', error);
        return of([]);
      })
    );
  }

  // Get category by ID
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/categories/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching category ${id}:`, error);
        throw error;
      })
    );
  }

  // Search products
  searchProducts(query: string): Observable<Product[]> {
    if (!query || query.trim() === '') {
      return of([]);
    }

    return this.getProducts().pipe(
      map(products => products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )),
      catchError(error => {
        console.error('Error searching products:', error);
        return of([]);
      })
    );
  }

  // Filter products
  filterProducts(filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    brand?: string;
  }): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => {
        let filtered = products;

        if (filters.category) {
          filtered = filtered.filter(p =>
            p.category?.toLowerCase() === filters.category?.toLowerCase()
          );
        }

        if (filters.minPrice !== undefined) {
          filtered = filtered.filter(p => p.price >= filters.minPrice!);
        }

        if (filters.maxPrice !== undefined) {
          filtered = filtered.filter(p => p.price <= filters.maxPrice!);
        }

        if (filters.inStock !== undefined) {
          filtered = filtered.filter(p => p.inStock === filters.inStock);
        }

        if (filters.brand) {
          filtered = filtered.filter(p =>
            p.brand?.toLowerCase() === filters.brand?.toLowerCase()
          );
        }

        return filtered;
      }),
      catchError(error => {
        console.error('Error filtering products:', error);
        return of([]);
      })
    );
  }

  // Get featured products (highest rated)
  getFeaturedProducts(limit: number = 8): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => {
        return products
          .filter(p => p.inStock)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, limit);
      }),
      catchError(error => {
        console.error('Error fetching featured products:', error);
        return of([]);
      })
    );
  }

  // Get products by brand
  getProductsByBrand(brand: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => products.filter(p =>
        p.brand?.toLowerCase() === brand.toLowerCase()
      )),
      catchError(error => {
        console.error(`Error fetching products for brand ${brand}:`, error);
        return of([]);
      })
    );
  }

  // Set selected category
  setSelectedCategory(category: string): void {
    this.selectedCategorySubject.next(category);
  }

  // Get selected category
  getSelectedCategory(): string {
    return this.selectedCategorySubject.value;
  }
  // Get commandes by user ID
getCommandesByUser(userId: number): Observable<Commande[]> {
  return this.http.get<Commande[]>(`${this.apiUrl}/commandes/user/${userId}`).pipe(
    catchError(error => {
      console.error(`Error fetching commandes for user ${userId}:`, error);
      return of([]);
    })
  );
}
}