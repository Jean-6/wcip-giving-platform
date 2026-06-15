import { Injectable } from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReceiptService {

  private readonly API_URL = environment.apiUrl;

  authHeader(): string{
    const credentials = btoa(`${environment.basicAuthUser}:${environment.basicAuthPassword}`);
    return `Basic ${credentials}`;
  }

  constructor(private readonly http: HttpClient) {
  }


  sendReceipt(payload: any): Observable<any> {
    return this.http.post(`${this.API_URL}/api/receipt/send`, payload);
  }

}
