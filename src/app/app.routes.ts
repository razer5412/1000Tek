import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Contact } from './contact/contact';
import { Service } from './service/service';
import { About } from './about/about';
import { Panier } from './panier/panier';

export const routes: Routes = [
   { path: '', component: Home }, 
  { path: 'contact', component: Contact },
  { path: 'service', component: Service },
  { path: 'about', component: About },
  { path: 'panier', component: Panier },

];


