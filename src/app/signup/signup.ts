
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from '../auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
  imports: [RouterModule,FormsModule]
})
export class SignupComponent {
  user = {
    name: '',
    email: '',
    password: '',
    role: 'user'
  };
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  // Email validation function
  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  signup() {
    this.errorMessage = '';
    
    if (!this.user.name) {
      this.errorMessage = 'Veuillez entrer votre nom';
      return;
    }
    
    if (!this.user.email) {
      this.errorMessage = 'Veuillez entrer votre email';
      return;
    }
    
    if (!this.isValidEmail(this.user.email)) {
      this.errorMessage = 'Veuillez entrer un email valide';
      return;
    }
    
    if (!this.user.password) {
      this.errorMessage = 'Veuillez entrer votre mot de passe';
      return;
    }
    
    if (this.user.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    this.auth.signup(this.user).subscribe(() => {
      alert('Compte créé avec succès');
      this.router.navigate(['/login']);
    }, error => {
      this.errorMessage = 'Erreur lors de la création du compte';
    });
  }
}