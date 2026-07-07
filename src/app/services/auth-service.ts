import {computed, Injectable, signal} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {RegisterRequest} from '../core/dtos/register-request';
import {Observable} from 'rxjs';
import {ResponseWrapper} from '../core/dtos/response-wrapper';
import {RegisterResponse} from '../core/dtos/register-response';
import {Profile} from '../core/dtos/user-profile';
import {Router} from '@angular/router';
import {readonly} from '@angular/forms/signals';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly API_URL = environment.apiUrl;

  private readonly  _user = signal<Profile | null>(null);
  private readonly tokenSignal = signal <string | null>(localStorage.getItem('token'));

  readonly isLoggedInSignal = computed(() => !!this.tokenSignal());


  isLoggedIn(): boolean{
    return this.isLoggedInSignal();
  }

  constructor(private readonly http: HttpClient, private readonly router: Router) {}

  setToken(token: string, profile: Profile) {
    localStorage.setItem('token', token);
    //this._token.set(token);
    this._user.set(profile);

  }

  logout(): void {
    localStorage.removeItem('token');
    //this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/']);
  }

  setUser(user: Profile):void{
    this._user.set(user);
  }

  registration(payload: RegisterRequest): Observable<ResponseWrapper<RegisterResponse>>{
    console.log(`${environment.apiUrl}/api/auth/signup`);
    return this.http.post<ResponseWrapper<RegisterResponse>>(`${environment.apiUrl}/api/auth/signup`, payload);
  }

  getAuthorizationHeader(): string{
    const username = environment.basicAuthUser;
    const password = environment.basicAuthPassword;
    const token = btoa(`${username}:${password}`);
    return `Basic ${token}`;
  }

  login(token: string) {
    localStorage.setItem('token', token);
    this.tokenSignal.set(token); // Met à jour le signal, tout le monde est notifié
  }
}
