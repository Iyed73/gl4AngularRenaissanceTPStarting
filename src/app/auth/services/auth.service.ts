import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { CredentialsDto } from '../dto/credentials.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { HttpClient } from '@angular/common/http';
import { API } from '../../../config/api.config';
import { fromEvent, Observable, tap } from 'rxjs';
import { AuthState } from '../interfaces/interfaces';
import { CONSTANTES } from 'src/config/const.config';
import { Router } from '@angular/router';
import { APP_ROUTES } from 'src/config/routes.config';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  

  private authState = signal<AuthState>({ user: null, token: null });

  public currentUser = computed(() => this.authState().user);
  public currentToken = computed(() => this.authState().token);
  public isAuthenticated = computed(() => !!this.authState().user);

  constructor() {
    this.loadStateFromStorage();

    if (isPlatformBrowser(this.platformId)) {
      fromEvent<StorageEvent>(window, 'storage')
        .subscribe((event) => {
          if (event.key === CONSTANTES.authStateKey) {
            this.loadStateFromStorage();
          }
        });
    }
  }

  private loadStateFromStorage() {
    const savedState = localStorage.getItem(CONSTANTES.authStateKey);
    if (savedState) {
      try {
        this.authState.set(JSON.parse(savedState));
      } catch (e) {
        console.error(e);
        this.clearState(); 
      }
    }
    else {
      this.authState.set({ user: null, token: null });
    }
  }

  private saveState(state: AuthState) {
    this.authState.set(state);
    localStorage.setItem(CONSTANTES.authStateKey, JSON.stringify(state));
  }

  private clearState() {
    this.authState.set({ user: null, token: null });
    localStorage.removeItem(CONSTANTES.authStateKey);
  }

  login(credentials: CredentialsDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(API.login, credentials).pipe(
      tap((response)=>{
        const newState: AuthState = {
          user: {
            id: response.userId,
            email: credentials.email, 
          },
          token: response.id, 
        }
        this.saveState(newState);
      })
    );
  }

  logout() {
    this.clearState();
    this.router.navigate([APP_ROUTES.login]);
  }
}
