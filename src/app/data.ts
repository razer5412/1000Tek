import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Product {
  id: number;
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
  id: number;
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
  private apiUrl = 'http://localhost:3000';
  
  private selectedCategorySubject = new BehaviorSubject<string>('');
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  // Menu structure with subcategories
  private menuStructure: MenuItem[] = [
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

  constructor(private http: HttpClient) {}

  // Get menu structure
  getMenuStructure(): MenuItem[] {
    return this.menuStructure;
  }

  // Get all products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  // Get product by ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  // Get products by category
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      map(products => products.filter(p => p.category === category))
    );
  }

  // Get all categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  // Search products
  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      map(products => products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }

  // Set selected category
  setSelectedCategory(category: string): void {
    this.selectedCategorySubject.next(category);
  }
}