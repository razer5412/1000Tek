import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataService,MenuItem } from '../data';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class MenuComponent implements OnInit {
  menuItems: MenuItem[] = [];
  activeMenu: string | null = null;

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.menuItems = this.dataService.getMenuStructure();
  }

  showMegaMenu(menuSlug: string): void {
    this.activeMenu = menuSlug;
  }

  hideMegaMenu(): void {
    this.activeMenu = null;
  }

  navigateToCategory(category: string): void {
    this.dataService.setSelectedCategory(category);
    this.router.navigate(['/products'], { 
      queryParams: { category: category } 
    });
    this.hideMegaMenu();
  }

  navigateToMainCategory(menuSlug: string): void {
    this.router.navigate(['/products']);
    this.hideMegaMenu();
  }
}