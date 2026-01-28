import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MenuCategory {
  id: number;
  name: string;         // ex: "laptop"
  displayName: string;  // ex: "Laptops"
  icon: string;         // ex: 💻
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'http://localhost:3200/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<MenuCategory[]> {
    return this.http.get<MenuCategory[]>(this.apiUrl);
  }

  getCategoryByName(name: string): Observable<MenuCategory[]> {
    return this.http.get<MenuCategory[]>(`${this.apiUrl}?name=${name}`);
  }
}
