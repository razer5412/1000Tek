import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class Footer {
  currentYear: number = new Date().getFullYear();
  
  contactInfo = {
    phone: '50813034',
    email: 'commercial@1000tek.tn',
    address: '38 RUE DE NIGER MONTPLAISIR, TUNIS, tunis Tunisie 1002',
    hours: 'Lundi – Vendredi : 08:00 - 17:00'
  };

  links = {
    conditions: [
      { label: 'A propos', url: '/about' },
      { label: 'Déclaration de confidentialité', url: '/confidentialite' },
      { label: 'Mentions légales', url: '/mentions-legales' }
    ]
  };
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}