
import { RouterModule } from '@angular/router';

import { Component } from '@angular/core';
import { AuthService } from '../auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterModule,FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  // Email validation function
  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  login() {
    this.errorMessage = '';
    
    if (!this.email) {
      this.errorMessage = 'Veuillez entrer votre email';
      return;
    }
    
    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Veuillez entrer un email valide';
      return;
    }
    
    if (!this.password) {
      this.errorMessage = 'Veuillez entrer votre mot de passe';
      return;
    }

    this.auth.login(this.email, this.password).subscribe(users => {
      if (users.length > 0 && this.email != "") {
        localStorage.setItem('user', JSON.stringify(users[0]));
        alert('Connexion réussie');
        this.router.navigate(['/']);
      } else {
        this.errorMessage = 'Email ou mot de passe invalide';
      }
    });
  }
}