import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface SubCategory {
  name: string;
  url: string;
}

interface CategorySection {
  title: string;
  items: SubCategory[];
}

interface Category {
  name: string;
  url: string;
  sections?: CategorySection[];
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class Menu {
  categories: Category[] = [
    {
      name: 'Informatique',
      url: '/informatique',
      sections: [
        {
          title: 'Ordinateur Portable',
          items: [
            { name: 'Pc Portable', url: '/pc-portable' },
            { name: 'Pc Portable Gamer', url: '/pc-portable-gamer' },
            { name: 'Pc Portable Pro', url: '/pc-portable-pro' }
          ]
        },
        {
          title: 'Ordinateur de Bureau',
          items: [
            { name: 'Ecran', url: '/ecran' },
            { name: 'Pc de bureau', url: '/pc-bureau' },
            { name: 'Pc de Bureau Gamer', url: '/pc-bureau-gamer' },
            { name: 'Pc Tout en un', url: '/pc-tout-en-un' }
          ]
        },
        {
          title: 'Accessoires',
          items: [
            { name: 'Souris', url: '/souris' },
            { name: 'Claviers', url: '/claviers' },
            { name: 'Casque & Écouteurs', url: '/casque-ecouteurs' },
            { name: 'Webcam', url: '/webcam' }
          ]
        },
        {
          title: 'Composants',
          items: [
            { name: 'Processeur', url: '/processeur' },
            { name: 'Carte graphique', url: '/carte-graphique' },
            { name: 'Barrette mémoire', url: '/barrette-memoire' },
            { name: 'Disque dur Interne', url: '/disque-dur-interne' }
          ]
        }
      ]
    },
    {
      name: 'Téléphonie & Tablette',
      url: '/telephonie-tablette',
      sections: [
        {
          title: 'Téléphones',
          items: [
            { name: 'Smartphone', url: '/smartphone' },
            { name: 'Téléphone Portable', url: '/telephone-portable' },
            { name: 'Téléphone Fixe', url: '/telephone-fixe' }
          ]
        },
        {
          title: 'Tablettes',
          items: [
            { name: 'Tablette tactile', url: '/tablette' },
            { name: 'Tablette Graphique', url: '/tablette-graphique' },
            { name: 'SmartWatch', url: '/smartwatch' }
          ]
        },
        {
          title: 'Accessoires',
          items: [
            { name: 'Etui de protection', url: '/etui-protection' },
            { name: 'Chargeurs et Câbles', url: '/chargeurs-cables' },
            { name: 'Power Bank', url: '/power-bank' }
          ]
        }
      ]
    },
    {
      name: 'Stockage',
      url: '/stockage',
      sections: [
        {
          title: 'Disques',
          items: [
            { name: 'Disque Dur externe', url: '/disque-dur-externe' },
            { name: 'Disque SSD', url: '/disque-ssd' },
            { name: 'Serveur de stockage', url: '/serveur-stockage' }
          ]
        },
        {
          title: 'Mémoire',
          items: [
            { name: 'Clé USB', url: '/cle-usb' },
            { name: 'Carte mémoire', url: '/carte-memoire' }
          ]
        }
      ]
    },
    {
      name: 'Impression',
      url: '/impression',
      sections: [
        {
          title: 'Imprimantes',
          items: [
            { name: 'Imprimante Jet d\'encre', url: '/imprimante-jet-encre' },
            { name: 'Imprimante Laser', url: '/imprimante-laser' },
            { name: 'Imprimante réservoir intégré', url: '/imprimante-reservoir' }
          ]
        },
        {
          title: 'Photocopieurs',
          items: [
            { name: 'Photocopieurs A4 | A3', url: '/photocopieurs' },
            { name: 'Scanners', url: '/scanners' }
          ]
        },
        {
          title: 'Consommables',
          items: [
            { name: 'Cartouche', url: '/cartouche' },
            { name: 'Toner', url: '/toner' },
            { name: 'Papier', url: '/papier' }
          ]
        }
      ]
    },
    {
      name: 'TV-Son-Photos',
      url: '/tv-son-photos',
      sections: [
        {
          title: 'TV & Vidéo',
          items: [
            { name: 'Téléviseurs', url: '/televiseurs' },
            { name: 'Vidéoprojecteurs', url: '/videoprojecteurs' },
            { name: 'Récepteur', url: '/recepteur' }
          ]
        },
        {
          title: 'Audio',
          items: [
            { name: 'Casque & Écouteurs', url: '/casque-ecouteurs' },
            { name: 'Barre de son', url: '/barre-son' },
            { name: 'Home Cinéma', url: '/home-cinema' }
          ]
        },
        {
          title: 'Gaming',
          items: [
            { name: 'Consoles', url: '/consoles' },
            { name: 'Manettes de Jeux', url: '/manettes' },
            { name: 'Accessoires', url: '/accessoires-console' }
          ]
        }
      ]
    },
    {
      name: 'Electroménager',
      url: '/electromenager',
      sections: [
        {
          title: 'Gros Électro Cuisine',
          items: [
            { name: 'Réfrigérateurs', url: '/refrigerateurs' },
            { name: 'Congélateurs', url: '/congelateurs' },
            { name: 'Cuisinière', url: '/cuisiniere' },
            { name: 'Four encastrable', url: '/four-encastrable' }
          ]
        },
        {
          title: 'Gros Électro Lavage',
          items: [
            { name: 'Machine à laver', url: '/machine-laver' },
            { name: 'Lave vaisselle', url: '/lave-vaisselle' },
            { name: 'Sèche linge', url: '/seche-linge' }
          ]
        },
        {
          title: 'Petit Électro',
          items: [
            { name: 'Micro-onde', url: '/micro-onde' },
            { name: 'Cafetières', url: '/cafetieres' },
            { name: 'Blenders', url: '/blenders' },
            { name: 'Friteuse', url: '/friteuse' }
          ]
        },
        {
          title: 'Climatisation',
          items: [
            { name: 'Climatisation', url: '/climatisation' },
            { name: 'Ventilateurs', url: '/ventilateurs' },
            { name: 'Chauffage', url: '/chauffage' }
          ]
        }
      ]
    },
    {
      name: 'Sécurité',
      url: '/securite',
      sections: [
        {
          title: 'Vidéosurveillance',
          items: [
            { name: 'Caméra de surveillance', url: '/camera-surveillance' },
            { name: 'Kit sécurité', url: '/kit-securite' },
            { name: 'Enregistreur', url: '/enregistreur' }
          ]
        },
        {
          title: 'Alarme',
          items: [
            { name: 'Alarme Filaire', url: '/alarme-filaire' },
            { name: 'Alarme sans fil', url: '/alarme-sans-fil' }
          ]
        },
        {
          title: 'Protection',
          items: [
            { name: 'Onduleur', url: '/onduleur' }
          ]
        }
      ]
    },
    {
      name: 'Bureautique',
      url: '/bureautique',
      sections: [
        {
          title: 'Matériel de Bureau',
          items: [
            { name: 'Calculatrices', url: '/calculatrices' },
            { name: 'Destructeurs de papiers', url: '/destructeurs' },
            { name: 'Plastifieuses', url: '/plastifieuses' }
          ]
        },
        {
          title: 'Écriture',
          items: [
            { name: 'Stylos', url: '/stylos' },
            { name: 'Marqueurs', url: '/marqueurs' },
            { name: 'Crayons', url: '/crayons' }
          ]
        },
        {
          title: 'Classement',
          items: [
            { name: 'Classeurs', url: '/classeurs' },
            { name: 'Chemises', url: '/chemises' },
            { name: 'Boîtes de classement', url: '/boites-classement' }
          ]
        }
      ]
    },
    {
      name: 'Réseau & Connectiques',
      url: '/reseau-connectiques',
      sections: [
        {
          title: 'Réseau',
          items: [
            { name: 'Routeurs', url: '/routeurs' },
            { name: 'Switch', url: '/switch' },
            { name: 'Clé Wifi', url: '/cle-wifi' }
          ]
        },
        {
          title: 'Câbles',
          items: [
            { name: 'Câbles HDMI', url: '/cables-hdmi' },
            { name: 'Câbles USB', url: '/cables-usb' },
            { name: 'Câbles Réseau', url: '/cables-reseau' }
          ]
        }
      ]
    }
  ];

  activeCategory: string | null = null;

  showMegaMenu(category: string): void {
    this.activeCategory = category;
  }

  hideMegaMenu(): void {
    this.activeCategory = null;
  }
}