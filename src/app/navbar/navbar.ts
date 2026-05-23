import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../cart';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  searchQuery: string = '';

  constructor(public cartService: CartService, private router: Router) { }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], {
        queryParams: { search: this.searchQuery }
      });
      this.searchQuery = '';
    }
  }

  onSearchKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.performSearch();
    }
  }
}
