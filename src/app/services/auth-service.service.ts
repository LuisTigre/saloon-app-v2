import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../types/login-response.type';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string = 'http://localhost:8000/api';

  // BehaviorSubject to track login state
  private loggedIn = new BehaviorSubject<boolean>(this.hasSession());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private httpClient: HttpClient) {}

  private hasSession(): boolean {
    return this.hasToken();
  }

  hasToken(): boolean {
    return !!sessionStorage.getItem('auth-token');
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.httpClient
      .post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          if (response.token) {
            sessionStorage.setItem('auth-token', response.token);
            sessionStorage.setItem('user-role', response.user?.role || '');
            this.loggedIn.next(true); // Update login state
          }
        })
      );
  }

  signup(
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
    role: string
  ): Observable<LoginResponse> {
    return this.httpClient
      .post<LoginResponse>(`${this.apiUrl}/register`, {
        name,
        email,
        password,
        password_confirmation,
        role
      })
      .pipe(
        tap((response) => {
          if (response.token) {
            sessionStorage.setItem('auth-token', response.token);
            sessionStorage.setItem('user-role', response.user?.email || '');
            this.loggedIn.next(true); // Update login state
          }
        })
      );
  }

  logout(): void {
    const token = sessionStorage.getItem('auth-token'); // Get the token

    console.log('Token:', token);

    if (!token) {
      console.error('No token found.');
      return;
    }

    this.httpClient
      .post(
        `${this.apiUrl}/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }, // Send token in the request
        }
      )
      .subscribe({
        next: () => {
          sessionStorage.removeItem('auth-token');
          sessionStorage.removeItem('user-role');
          this.loggedIn.next(false); // Update login state
        },
        error: (error) => {
          console.error('Logout error:', error); // Log the error for debugging
        },
      });
  }

  isLoggedIn(): boolean {
    return this.loggedIn.getValue();
  }

  hasRole(): string | null {
    return sessionStorage.getItem('user-role') || null;
  }
}
