
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Product {
  id: string;  // Changé de number à string car dans db.json les IDs sont des strings
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  brand: string;
  inStock: boolean;
  rating: number;
}

export interface Category {
  id: string;  // Changé de number à string
  name: string;
  displayName: string;
  icon: string;
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
  private apiUrl = 'http://localhost:3200';  // Assurez-vous que json-server est en cours d'exécution
  
  private selectedCategorySubject = new BehaviorSubject<string>('');
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get menu structure
  getMenuStructure(): MenuItem[] {
    return [
      {
        name: 'Informatique',
        displayName: 'Informatique',
        icon: '',
        slug: 'informatique',
        sections: [
          {
            title: 'Ordinateurs',
            items: [
              { name: 'PC Portables', slug: 'laptop', category: 'laptop' },
              { name: 'PC de Bureau', slug: 'pc', category: 'pc' },
            ]
          },
          {
            title: 'Accessoires',
            items: [
              { name: 'Souris & Claviers', slug: 'informatique', category: 'informatique' },
              { name: 'Casques & Audio', slug: 'audio', category: 'audio' },
            ]
          }
        ]
      },
      {
        name: 'Téléphonie & Tablette',
        displayName: 'Téléphonie',
        icon: '',
        slug: 'telephonie',
        sections: [
          {
            title: 'Téléphones',
            items: [
              { name: 'Smartphones', slug: 'telephonie', category: 'telephonie' },
            ]
          }
        ]
      },
      {
        name: 'TV-Son-Photos',
        displayName: 'TV & Audio',
        icon: '',
        slug: 'tv-audio',
        sections: [
          {
            title: 'Télévision',
            items: [
              { name: 'Smart TV', slug: 'tv', category: 'tv' },
            ]
          },
          {
            title: 'Audio',
            items: [
              { name: 'Enceintes & Haut-parleurs', slug: 'audio', category: 'audio' },
            ]
          }
        ]
      },
      {
        name: 'Electroménager',
        displayName: 'Electroménager',
        icon: '',
        slug: 'electromenager',
        sections: [
          {
            title: 'Gros Électroménager',
            items: [
              { name: 'Machine à laver', slug: 'electromenager', category: 'electromenager' },
            ]
          }
        ]
      },
      {
        name: 'Sécurité',
        displayName: 'Sécurité',
        icon: '',
        slug: 'securite',
        sections: [
          {
            title: 'Vidéosurveillance',
            items: [
              { name: 'Caméras de surveillance', slug: 'securite', category: 'securite' },
            ]
          }
        ]
      }
    ];
  }

  // Get all products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      catchError(error => {
        console.error('Error fetching products:', error);
        return of([]); // Retourne un tableau vide en cas d'erreur
      })
    );
  }

  // Get product by ID
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching product ${id}:`, error);
        throw error;
      })
    );
  }

  // Get products by category
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?category=${category}`).pipe(
      catchError(error => {
        console.error(`Error fetching products for category ${category}:`, error);
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

  // Search products
  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      map(products => products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase())
      )),
      catchError(error => {
        console.error('Error searching products:', error);
        return of([]);
      })
    );
  }

  // Set selected category
  setSelectedCategory(category: string): void {
    this.selectedCategorySubject.next(category);
  }
}
