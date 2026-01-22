import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Contact } from './contact/contact';
import { Service } from './service/service';
import { About } from './about/about';
import { Panier } from './panier/panier';
import { ProductsComponent } from './product/product';
import { Detail } from './detail/detail';
import { LoginComponent } from './login/login';
import { SignupComponent } from './signup/signup';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'contact', component: Contact },
  { path: 'service', component: Service },
  { 
    path: 'product/:id', 
    component: Detail,
    title: 'Détail Produit - 1000 TEK'
  },
  { path: 'about', component: About },
  { path: 'panier', component: Panier },
  { path: 'login', component: LoginComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'category/:name', component: ProductsComponent }
];

