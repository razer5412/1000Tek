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
import { Checkout } from './checkout/checkout';
import { AuthService } from './auth';
import { Compte } from './compte/compte';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'contact', component: Contact },
  { path: 'service', component: Service },
  { 
    path: 'product/:id', 
    component: Detail,
    title: 'Détail Produit - 1000 TEK'
  },
  { path: 'checkout', component: Checkout },
  { path: 'about', component: About },
    { 
    path: 'checkout', 
    component: Checkout,
    canActivate: [AuthService]  // ← Protects this route
  },
  { 
    path: 'compte', 
    component: Compte,
    canActivate: [AuthService]  // Protected route
  },
  { path: 'panier', component: Panier },
  { path: 'login', component: LoginComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'category/:name', component: ProductsComponent },
  {path:'signup',component:SignupComponent}
];

