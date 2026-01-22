import { Component } from '@angular/core';
import { AuthService } from '../auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.html',
  imports:[FormsModule]
})
export class SignupComponent {
  user = {
    name: '',
    email: '',
    password: '',
    role: 'user'
  };

  constructor(private auth: AuthService, private router: Router) {}

  signup() {
    this.auth.signup(this.user).subscribe(() => {
      alert('Account created successfully');
      this.router.navigate(['/login']);
    });
  }
}
