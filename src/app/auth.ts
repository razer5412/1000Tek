import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router
    // ❌ REMOVED: private authService: AuthService (circular dependency!)
  ) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // Get current user value
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user is logged in
  public get isLoggedIn(): boolean {
    return !!this.currentUserValue && !!this.getToken();
  }

  // Check if user is admin
  public get isAdmin(): boolean {
    return this.currentUserValue?.role === 'admin';
  }

  // Get stored token
  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Auth Guard
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.isLoggedIn) {
      return true;
    }

    this.router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });

    return false;
  }

  // User signup
  signup(signupData: SignupData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, signupData).pipe(
      tap(response => {
        if (response.success && response.token) {
          this.setSession(response);
        }
      })
    );
  }

  // User login
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { 
      email, 
      password 
    }).pipe(
      tap(response => {
        if (response.success && response.token) {
          this.setSession(response);
        }
      })
    );
  }

  // Admin login
  adminLogin(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/login`, { 
      email, 
      password 
    }).pipe(
      tap((response: any) => {
        if (response.token) {
          const loginResponse: LoginResponse = {
            success: true,
            token: response.token,
            user: response.admin || response.user
          };
          this.setSession(loginResponse);
        }
      })
    );
  }

  // Logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Verify token
  verifyToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return new Observable(observer => {
        observer.next(false);
        observer.complete();
      });
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/verify`, { headers }).pipe(
      map(response => {
        if (response.valid && response.user) {
          const currentUser = this.currentUserValue;
          if (!currentUser || currentUser.id !== response.user.id) {
            this.currentUserSubject.next(response.user);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
          return true;
        }
        return false;
      }),
      tap(isValid => {
        if (!isValid) {
          this.logout();
        }
      })
    );
  }

  // Get current user info
  getCurrentUser(): User | null {
    return this.currentUserValue;
  }

  // Update user info in local storage
  updateCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  // Set session data
  private setSession(authResult: LoginResponse): void {
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('currentUser', JSON.stringify(authResult.user));
    this.currentUserSubject.next(authResult.user);
  }

  // Check if email exists (for validation)
  checkEmailExists(email: string): Observable<boolean> {
    return new Observable(observer => {
      observer.next(false);
      observer.complete();
    });
  }
}