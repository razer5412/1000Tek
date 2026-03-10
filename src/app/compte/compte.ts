import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService,User } from '../auth';
import { HttpClient } from '@angular/common/http';

interface UpdateProfileData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-compte',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compte.html',
  styleUrls: ['./compte.css']
})
export class Compte implements OnInit {
  currentUser: User | null = null;
  isLoading = false;
  activeTab: 'profile' | 'password' | 'orders' = 'profile';

  // Profile data
  profileData: UpdateProfileData = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: ''
  };

  // Password change data
  passwordData: PasswordChangeData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  // User orders
  userOrders: any[] = [];

  // Messages
  successMessage = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Check if user is logged in
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Load user profile
    this.loadUserProfile();
    this.loadUserOrders();
  }

  loadUserProfile(): void {
    if (!this.currentUser) return;

    this.profileData = {
      name: this.currentUser.name,
      email: this.currentUser.email,
      phone: '',
      address: '',
      city: '',
      postal_code: ''
    };

    // Fetch additional user data from backend
    const token = this.authService.getToken();
    if (!token) return;

    this.http.get<any>(`http://localhost:3000/api/users/${this.currentUser.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
      next: (user) => {
        this.profileData = {
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          city: user.city || '',
          postal_code: user.postal_code || ''
        };
      },
      error: (error) => {
        console.error('Error loading profile:', error);
      }
    });
  }

  loadUserOrders(): void {
    if (!this.currentUser) return;

    const token = this.authService.getToken();
    if (!token) return;

    this.http.get<any[]>(`http://localhost:3000/api/users/${this.currentUser.id}/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
      next: (orders) => {
        this.userOrders = orders;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.userOrders = [];
      }
    });
  }

  setActiveTab(tab: 'profile' | 'password' | 'orders'): void {
    this.activeTab = tab;
    this.clearMessages();
  }

  updateProfile(): void {
    this.clearMessages();
    this.isLoading = true;

    if (!this.currentUser) return;

    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      this.isLoading = false;
      return;
    }

    this.http.put(`http://localhost:3000/api/users/${this.currentUser.id}`, this.profileData, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
      next: (response: any) => {
        this.successMessage = 'Profil mis à jour avec succès!';
        
        // Update current user in auth service
        if (response.name !== this.currentUser?.name) {
          const updatedUser = { ...this.currentUser!, name: response.name };
          this.authService.updateCurrentUser(updatedUser);
          this.currentUser = updatedUser;
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.errorMessage = error.error?.message || 'Erreur lors de la mise à jour du profil';
        this.isLoading = false;
      }
    });
  }

  changePassword(): void {
    this.clearMessages();

    // Validation
    if (!this.passwordData.currentPassword) {
      this.errorMessage = 'Veuillez entrer votre mot de passe actuel';
      return;
    }

    if (!this.passwordData.newPassword) {
      this.errorMessage = 'Veuillez entrer un nouveau mot de passe';
      return;
    }

    if (this.passwordData.newPassword.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (!this.currentUser) return;

    this.isLoading = true;
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      this.isLoading = false;
      return;
    }

    this.http.put(`http://localhost:3000/api/users/${this.currentUser.id}/password`, {
      currentPassword: this.passwordData.currentPassword,
      newPassword: this.passwordData.newPassword
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.successMessage = 'Mot de passe modifié avec succès!';
        this.passwordData = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error changing password:', error);
        this.errorMessage = error.error?.message || 'Erreur lors du changement de mot de passe';
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    if (confirm('Voulez-vous vraiment vous déconnecter?')) {
      this.authService.logout();
    }
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'pending': 'status-pending',
      'confirmed': 'status-confirmed',
      'processing': 'status-processing',
      'shipped': 'status-shipped',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled'
    };
    return statusClasses[status] || 'status-pending';
  }

  getStatusText(status: string): string {
    const statusTexts: { [key: string]: string } = {
      'pending': '⏳ En attente',
      'confirmed': '✅ Confirmée',
      'processing': '🔄 En traitement',
      'shipped': '🚚 Expédiée',
      'delivered': '📦 Livrée',
      'cancelled': '❌ Annulée'
    };
    return statusTexts[status] || status;
  }
}