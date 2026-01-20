import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuService,Category } from '../menu';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class Menu implements OnInit {
  categories: Category[] = [];
  activeCategory: string | null = null;
  loading = true;
  error: string | null = null;

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.menuService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.error = 'Failed to load menu categories';
        this.loading = false;
      }
    });
  }

  showMegaMenu(category: string): void {
    this.activeCategory = category;
  }

  hideMegaMenu(): void {
    this.activeCategory = null;
  }
}