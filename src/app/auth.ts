import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  signup(user: any): Observable<any> {
    return this.http.post(this.API, user);
  }

  login(email: string, password: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}?email=${email}&password=${password}`);
  }
}
