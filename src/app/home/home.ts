import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Define static products for home page
interface HomeProduct {
  id: number;
  name: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  // Static products matching your HTML
  nouveautes: HomeProduct[] = [
    {
      id: 1,
      name: 'pc portable lenovo v15/i5 13420h/8g/512gssd/sacoche offerte',
      price: 1200.000,
      image: 'assets/images/laptop.jpg'
    },
    {
      id: 2,
      name: 'Pc Portable Acer Aspire 3 A315 / i3 7é Gén / 4 Go / Rouge',
      price: 999.000,
      image: 'assets/images/laptop1.jpg'
    },
    {
      id: 5,
      name: 'Imprimante Multifonction à réservoir intégré 3en1 couleur Epson ECOTANK L3210 / USB',
      price: 560.000,
      image: 'assets/images/imprimente.jpg'
    },
    {
      id: 6,
      name: 'IMPRIMANTE MICRO EPSON 103 CARTOUCHE D\'ENCRE-BLACK (L3110)',
      price: 34.000,
      image: 'assets/images/cartouche.jpg'
    }
  ];

  topCategories: HomeProduct[] = [
    {
      id: 1,
      name: 'pc portable lenovo v15/i5 13420h/8g/512gssd/sacoche offerte',
      price: 1200.000,
      image: 'assets/images/laptop.jpg'
    },
    {
      id: 2,
      name: 'Pc Portable Acer Aspire 3 A315 / i3 7é Gén / 4 Go / Rouge',
      price: 999.000,
      image: 'assets/images/laptop1.jpg'
    },
    {
      id: 5,
      name: 'Imprimante Multifonction à réservoir intégré 3en1 couleur Epson ECOTANK L3210 / USB',
      price: 560.000,
      image: 'assets/images/imprimente.jpg'
    },
    {
      id: 6,
      name: 'IMPRIMANTE MICRO EPSON 103 CARTOUCHE D\'ENCRE-BLACK (L3110)',
      price: 34.000,
      image: 'assets/images/cartouche.jpg'
    }
  ];

  constructor(private router: Router) {}

  // Navigate to product detail page
  viewProduct(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  // Add to cart function
  addToCart(product: HomeProduct, event: Event): void {
    event.stopPropagation(); // Prevent navigation when clicking add to cart
    alert(`${product.name} ajouté au panier!`);
    console.log('Adding to cart:', product);
  }
}