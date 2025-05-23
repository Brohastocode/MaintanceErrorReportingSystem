import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = 'http://localhost:8080/auth/login';

  constructor(private http: HttpClient) {
  }

  login(username: string, password: string): Observable<{ token: string, role: string }> {
    return this.http.post<{ token: string, role: string }>(this.loginUrl, {username, password})
      .pipe(
        tap(response => {
          if (response && response.token && response.role) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userRole', response.role);
            console.log('Login successful! Token and role stored.');
          } else {
            console.warn('Login response missing token or role:', response);
          }
        })
      );
  }
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    console.log('Logged out. Token and role removed.');
  }
}
