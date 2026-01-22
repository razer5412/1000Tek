import { Component } from '@angular/core';
import { AuthService } from '../auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports:[FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.email, this.password).subscribe(users => {
      if (users.length > 0 &&   this.email!="") {
        localStorage.setItem('user', JSON.stringify(users[0]));
        alert('Login successful');
        this.router.navigate(['/']);
      } else {
        alert('Invalid email or password');
      }
    });
  }
}
