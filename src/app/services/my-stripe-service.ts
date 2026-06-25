import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {CheckoutSessionRequest} from '../core/dtos/checkout-session-request';
import {Observable} from 'rxjs';
import {ResponseWrapper} from '../core/dtos/response-wrapper';
import {CheckoutSessionResponse} from '../core/dtos/checkout-session-response';

@Injectable({
  providedIn: 'root'
})
export class MyStripeService {
  private readonly API_URL = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  createCheckoutSession(payload: CheckoutSessionRequest): Observable<ResponseWrapper<CheckoutSessionResponse>>{
    return this.http.post<ResponseWrapper<CheckoutSessionResponse>>(`${this.API_URL}/api/payment/create-anonymous-session`, payload);
  }

}
