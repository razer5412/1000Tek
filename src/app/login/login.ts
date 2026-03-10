import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;
  returnUrl: string = '/';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] ;
    
    // If already logged in, redirect
    if (this.authService.isLoggedIn) {
      this.router.navigate([this.returnUrl]);
    }
  }

  // Email validation function
  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  login(): void {
    this.errorMessage = '';
    
    // Validation
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

    this.isLoading = true;

    // Call login service
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login response:', response);
        if (response.success) {
          alert('Connexion réussie!');
          // Redirect to return URL or home
          this.router.navigate([this.returnUrl]);
        } else {
          this.errorMessage = 'Email ou mot de passe invalide';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = error.error?.message || 'Email ou mot de passe invalide';
        this.isLoading = false;
      }
    });
  }
}