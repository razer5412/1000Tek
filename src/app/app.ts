import { ApplicationConfig, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar} from './navbar/navbar';
import { Footer } from './footer/footer';
import { Menu } from './menu/menu';
import { ProductsComponent } from './product/product';  
import { ProductService } from './service';
import { provideHttpClient } from '@angular/common/http';
import { Application } from 'express';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Navbar,Footer,Menu],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('project1000');
}
// app.config.ts or main.ts


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    // ... other providers
  ]
};
