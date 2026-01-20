import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SubCategory {
  name: string;
  url: string;
}

export interface CategorySection {
  title: string;
  items: SubCategory[];
}

export interface Category {
  name: string;
  url: string;
  sections?: CategorySection[];
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'http://localhost:3000/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  getCategoryByUrl(url: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}?url=${url}`);
  }
}