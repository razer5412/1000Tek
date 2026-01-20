import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Contact } from './contact/contact';
import { Service } from './service/service';
import { About } from './about/about';
import { Panier } from './panier/panier';
import { ProductsComponent } from './product/product';

export const routes: Routes = [
   { path: '', component: Home }, 
  { path: 'contact', component: Contact },
  { path: 'service', component: Service },
  { path: 'about', component: About },
  { path: 'panier', component: Panier },
   { path: 'products', component: ProductsComponent },
  // Add more routes as needed
  // { path: 'product/:id', component: ProductDetailComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }

];


