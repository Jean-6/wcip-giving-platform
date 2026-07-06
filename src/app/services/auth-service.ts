import {Injectable, signal} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {RegisterRequest} from '../core/dtos/register-request';
import {Observable} from 'rxjs';
import {ResponseWrapper} from '../core/dtos/response-wrapper';
import {RegisterResponse} from '../core/dtos/register-response';
import {UserProfile} from '../core/dtos/user-profile';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly API_URL = environment.apiUrl;

  private readonly  _user = signal<UserProfile | null>(null);
  private readonly _token = signal <string | null>(null);



  /*authHeader(): string{
    const credentials = btoa(`${environment.basicAuthUser}:${environment.basicAuthPassword}`);
    return `Basic ${credentials}`;
  }*/

  constructor(private readonly http: HttpClient, private readonly router: Router) {}

  setToken(token: string, userProfile: UserProfile) {
    localStorage.setItem('token', token);
    this._token.set(token);
    this._user.set(userProfile);

  }

  logout(): void {
    localStorage.removeItem('token');
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/']);
  }

  setUser(user: UserProfile):void{
    this._user.set(user);
  }

  registration(payload: RegisterRequest): Observable<ResponseWrapper<RegisterResponse>>{
    console.log(`${environment.apiUrl}/api/auth/signup`);
    return this.http.post<ResponseWrapper<RegisterResponse>>(`${environment.apiUrl}/api/auth/signup`, payload);
  }
}
