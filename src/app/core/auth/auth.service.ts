import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreateUserPayload, LoginUserPayload, UserInterface } from '../../shared/types/user';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly loggedUser = signal<UserInterface | null>(null);

  private readonly tokenKey = 'auth_token';
  private readonly http = inject(HttpClient);

  constructor() {
    const token = this.getToken();
    if (token) {
      this.getMe().subscribe();
    }
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  private clearToken() {
    localStorage.removeItem(this.tokenKey);
  }

  login(credentials: LoginUserPayload) {
    const body = new HttpParams()
      .set('username', credentials.username)
      .set('password', credentials.password)
      .set('grant_type', 'password');

    return this.http.post<{ access_token: string, token_type: string }>(
      'http://localhost:8000/api/login',
      body.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    ).pipe(
      tap(({ access_token }) => this.setToken(access_token)),
      switchMap(() => this.getMe()),
    );
  }

  register(user: CreateUserPayload) {
    return this.http.post<{ token: string, user: UserInterface }>(
      'http://localhost:8000/api/register', user)
      .pipe(
        tap((user) => {
          this.setToken(user.token);
          this.loggedUser.set(user.user);
        })
      );
  }

  getMe() {
    return this.http.get<UserInterface>('http://localhost:8000/api/me')
      .pipe(tap((user) => this.loggedUser.set(user)));
  }

  logout() {
    this.clearToken();
    this.loggedUser.set(null);
  }
}