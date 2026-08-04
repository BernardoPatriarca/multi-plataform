import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.model';
import { Usuario } from '../models/usuario.model';

/**
 * O token JWT nunca fica acessivel via JavaScript: ele viaja em um cookie
 * HttpOnly definido pelo backend (imune a roubo via XSS). Aqui guardamos
 * apenas uma flag de sessao e os dados nao sensiveis do usuario para exibicao.
 */
const SESSION_KEY = 'sistema_sessao_ativa';
const USER_KEY = 'sistema_usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly apiUrl = `${environment.apiUrl}/auth`;

  currentUser = signal<Usuario | null>(this.readStoredUser());

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => this.setSession(response.usuario))
    );
  }

  register(request: RegisterRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/register`, request);
  }

  logout(): void {
    this.clearSession();
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({ error: () => undefined });
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(SESSION_KEY) === '1';
  }

  updateStoredUser(usuario: Usuario): void {
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));
    this.currentUser.set(usuario);
  }

  private setSession(usuario: Usuario): void {
    localStorage.setItem(SESSION_KEY, '1');
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));
    this.currentUser.set(usuario);
  }

  private clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
  }

  private readStoredUser(): Usuario | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as Usuario) : null;
  }
}
