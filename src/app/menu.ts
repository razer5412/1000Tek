import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface MenuCategory {
  id: number;
  name: string;
  slug: string;
  displayName: string;
  icon: string;
  parent_id: number | null;
  position: number;
  children?: MenuCategory[];
}

export interface MenuItem {
  id: number;
  name: string;
  displayName: string;
  icon: string;
  slug: string;
  parent_id: number | null;
  children: MenuItem[];
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'http://localhost:3000/api/categories';

  constructor(private http: HttpClient) {}

  /**
   * Get all categories from the database
   */
  getCategories(): Observable<MenuCategory[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(categories => categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        displayName: cat.name,
        icon: cat.icon || '📦',
        parent_id: cat.parent_id,
        position: cat.position
      }))),
      catchError(error => {
        console.error('Error fetching categories:', error);
        return of([]);
      })
    );
  }

  /**
   * Get hierarchical menu structure
   */
  getMenuStructure(): Observable<MenuItem[]> {
    return this.getCategories().pipe(
      map(categories => this.buildHierarchy(categories)),
      catchError(error => {
        console.error('Error building menu structure:', error);
        return of([]);
      })
    );
  }

  /**
   * Build hierarchical structure from flat category list
   */
  private buildHierarchy(categories: MenuCategory[]): MenuItem[] {
    const categoryMap = new Map<number, MenuItem>();
    const rootItems: MenuItem[] = [];

    // First pass: create MenuItem objects
    categories.forEach(cat => {
      categoryMap.set(cat.id, {
        id: cat.id,
        name: cat.name,
        displayName: cat.displayName,
        icon: cat.icon,
        slug: cat.slug,
        parent_id: cat.parent_id,
        children: []
      });
    });

    // Second pass: build hierarchy
    categories.forEach(cat => {
      const item = categoryMap.get(cat.id);
      if (!item) return;

      if (cat.parent_id === null) {
        // This is a root category
        rootItems.push(item);
      } else {
        // This is a child category
        const parent = categoryMap.get(cat.parent_id);
        if (parent) {
          parent.children.push(item);
        }
      }
    });

    // Sort by position
    rootItems.sort((a, b) => {
      const catA = categories.find(c => c.id === a.id);
      const catB = categories.find(c => c.id === b.id);
      return (catA?.position || 0) - (catB?.position || 0);
    });

    return rootItems;
  }

  /**
   * Get category by slug
   */
  getCategoryBySlug(slug: string): Observable<MenuCategory | undefined> {
    return this.getCategories().pipe(
      map(categories => categories.find(cat => cat.slug === slug)),
      catchError(error => {
        console.error(`Error fetching category ${slug}:`, error);
        return of(undefined);
      })
    );
  }

  /**
   * Get category by name
   */
  getCategoryByName(name: string): Observable<MenuCategory[]> {
    return this.getCategories().pipe(
      map(categories => categories.filter(cat => 
        cat.name.toLowerCase().includes(name.toLowerCase())
      )),
      catchError(error => {
        console.error(`Error searching category ${name}:`, error);
        return of([]);
      })
    );
  }

  /**
   * Get category by ID
   */
  getCategoryById(id: number): Observable<MenuCategory | undefined> {
    return this.getCategories().pipe(
      map(categories => categories.find(cat => cat.id === id)),
      catchError(error => {
        console.error(`Error fetching category ID ${id}:`, error);
        return of(undefined);
      })
    );
  }

  /**
   * Get parent categories only
   */
  getParentCategories(): Observable<MenuCategory[]> {
    return this.getCategories().pipe(
      map(categories => categories.filter(cat => cat.parent_id === null)),
      catchError(error => {
        console.error('Error fetching parent categories:', error);
        return of([]);
      })
    );
  }

  /**
   * Get children of a specific category
   */
  getChildCategories(parentId: number): Observable<MenuCategory[]> {
    return this.getCategories().pipe(
      map(categories => categories.filter(cat => cat.parent_id === parentId)),
      catchError(error => {
        console.error(`Error fetching child categories for ${parentId}:`, error);
        return of([]);
      })
    );
  }

  /**
   * Get breadcrumb trail for a category
   */
  getBreadcrumb(categoryId: number): Observable<MenuCategory[]> {
    return this.getCategories().pipe(
      map(categories => {
        const breadcrumb: MenuCategory[] = [];
        let currentId: number | null = categoryId;

        while (currentId !== null) {
          const category = categories.find(cat => cat.id === currentId);
          if (!category) break;
          
          breadcrumb.unshift(category);
          currentId = category.parent_id;
        }

        return breadcrumb;
      }),
      catchError(error => {
        console.error(`Error building breadcrumb for ${categoryId}:`, error);
        return of([]);
      })
    );
  }
}