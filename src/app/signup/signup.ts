import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth';  // ← FIXED PATH

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {
  user = {
    name: '',
    email: '',
    password: ''
  };
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Email validation function
  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  signup(): void {
    this.errorMessage = '';
    
    // Validation
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

    this.isLoading = true;

    // Call signup service
    this.authService.signup(this.user).subscribe({
      next: (response) => {
        console.log('Signup response:', response);
        if (response.success) {
          alert('Compte créé avec succès!');
          this.router.navigate(['/']);
        } else {
          this.errorMessage = 'Erreur lors de la création du compte';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Signup error:', error);
        this.errorMessage = error.error?.message || 'Erreur lors de la création du compte';
        this.isLoading = false;
      }
    });
  }
}