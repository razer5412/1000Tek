import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';
import { MenuComponent } from './menu/menu';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, MenuComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = signal('project1000');
}
