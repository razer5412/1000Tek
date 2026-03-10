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
    this.loadMenu();
  }

  loadMenu(): void {
    // Use structured menu from your categories
    this.menuItems = [
      {
        name: 'Informatique',
        displayName: 'Informatique',
        icon: '💻',
        slug: 'informatique',
        sections: [
          {
            title: 'Ordinateurs',
            items: [
              { name: 'PC portable', slug: 'pc-portable', category: 'pc-portable' },
              { name: 'Ordinateur de Bureau', slug: 'ordinateur-bureau', category: 'ordinateur-bureau' },
              { name: 'Tablettes', slug: 'tablettes', category: 'tablettes' },
              { name: 'Serveur', slug: 'serveur', category: 'serveur' },
              { name: 'Stockage', slug: 'stockage', category: 'stockage' },
              { name: 'Périphérique et Accessoires', slug: 'peripherique-accessoires', category: 'peripherique-accessoires' },
              { name: 'Composants Serveur', slug: 'composants-serveur', category: 'composants-serveur' },
              { name: 'Logiciels', slug: 'logiciels', category: 'logiciels' }
            ]
          }
        ]
      },
      {
        name: 'Gaming',
        displayName: 'Gaming',
        icon: '🎮',
        slug: 'gaming',
        sections: [
          {
            title: 'Gaming',
            items: [
              { name: 'PC Gaming', slug: 'pc-gaming', category: 'pc-gaming' },
              { name: 'Composant Pc Gamer', slug: 'composant-pc-gamer', category: 'composant-pc-gamer' },
              { name: 'Console de jeux', slug: 'console-jeux', category: 'console-jeux' }
            ]
          }
        ]
      },
      {
        name: 'Téléphonie',
        displayName: 'Téléphonie',
        icon: '📱',
        slug: 'telephonie',
        sections: [
          {
            title: 'Téléphones & Accessoires',
            items: [
              { name: 'Smartphone & Mobile', slug: 'smartphone-mobile', category: 'smartphone-mobile' },
              { name: 'Smart Watch', slug: 'smart-watch', category: 'smart-watch' },
              { name: 'Téléphone Fixe', slug: 'telephone-fixe', category: 'telephone-fixe' },
              { name: 'Accessoires Téléphonie', slug: 'accessoires-telephonie', category: 'accessoires-telephonie' }
            ]
          }
        ]
      },
      {
        name: 'TV | Photo & Son',
        displayName: 'TV | Photo & Son',
        icon: '📺',
        slug: 'tv-photo-son',
        sections: [
          {
            title: 'Télévision & Multimédia',
            items: [
              { name: 'Téléviseurs', slug: 'televiseurs', category: 'televiseurs' },
              { name: 'Photos & Caméscopes', slug: 'photos-camescopes', category: 'photos-camescopes' },
              { name: 'Accessoires Téléviseurs', slug: 'accessoires-televiseurs', category: 'accessoires-televiseurs' },
              { name: 'Son Numérique', slug: 'son-numerique', category: 'son-numerique' },
              { name: 'Accessoires Appareil Photo', slug: 'accessoires-appareil-photo', category: 'accessoires-appareil-photo' },
              { name: 'Récepteurs Numériques', slug: 'recepteurs-numeriques', category: 'recepteurs-numeriques' },
              { name: 'Projection', slug: 'projection', category: 'projection' }
            ]
          }
        ]
      },
      {
        name: 'Électroménager',
        displayName: 'Électroménager',
        icon: '🧺',
        slug: 'electromenager',
        sections: [
          {
            title: 'Électroménager',
            items: [
              { name: 'Gros Electroménager', slug: 'gros-electromenager', category: 'gros-electromenager' },
              { name: 'Préparation culinaire', slug: 'preparation-culinaire', category: 'preparation-culinaire' }
            ]
          }
        ]
      },
      {
        name: 'Impression',
        displayName: 'Impression',
        icon: '🖨️',
        slug: 'impression',
        sections: [
          {
            title: 'Impression & Scan',
            items: [
              { name: 'Imprimantes', slug: 'imprimantes', category: 'imprimantes' },
              { name: 'Photocopieurs', slug: 'photocopieurs', category: 'photocopieurs' },
              { name: 'Scanners', slug: 'scanners', category: 'scanners' },
              { name: 'Consommables', slug: 'consommables', category: 'consommables' },
              { name: 'Accessoires Imprimantes', slug: 'accessoires-imprimantes', category: 'accessoires-imprimantes' }
            ]
          }
        ]
      },
      {
        name: 'Vidéosurveillance & Sécurité',
        displayName: 'Vidéosurveillance & Sécurité',
        icon: '🔹',
        slug: 'videosurveillance-securite',
        sections: [
          {
            title: 'Sécurité',
            items: [
              { name: 'Vidéo Surveillance', slug: 'video-surveillance', category: 'video-surveillance' },
              { name: 'Caméra de Surveillance HD', slug: 'camera-surveillance-hd', category: 'camera-surveillance-hd' },
              { name: 'Caméra de Surveillance IP', slug: 'camera-surveillance-ip', category: 'camera-surveillance-ip' },
              { name: 'Enregistreur DVR/ NVR', slug: 'enregistreur-dvr-nvr', category: 'enregistreur-dvr-nvr' },
              { name: 'Kit Vidéo Surveillance', slug: 'kit-video-surveillance', category: 'kit-video-surveillance' },
              { name: 'Accessoires de Vidéo Surveillance', slug: 'accessoires-video-surveillance', category: 'accessoires-video-surveillance' }
            ]
          }
        ]
      }
    ];
  }

  showMegaMenu(menuSlug: string): void {
    this.activeMenu = menuSlug;
  }

  hideMegaMenu(): void {
    this.activeMenu = null;
  }

  navigateToCategory(category: string): void {
    console.log('Navigating to subcategory:', category);
    this.dataService.setSelectedCategory(category);
    this.router.navigate(['/products'], { 
      queryParams: { category: category } 
    });
    this.hideMegaMenu();
  }

  // THIS IS THE KEY FIX - Navigate to main category
// Updated method in menu.ts
navigateToMainCategory(menuSlug: string): void {
  console.log('Navigating to main category:', menuSlug);
  this.dataService.setSelectedCategory(menuSlug);
  this.router.navigate(['/products'], { 
    queryParams: { 
      category: menuSlug,
      parent: 'true' // Add this flag
    } 
  });
  this.hideMegaMenu();
}
}