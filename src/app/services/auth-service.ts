import { Injectable } from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  authHeader(): string{
    const credentials = btoa(`${environment.basicAuthUser}:${environment.basicAuthPassword}`);
    return `Basic ${credentials}`;
  }

  constructor(private readonly http: HttpClient) {
  }
}
