import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CheckoutSessionRequest} from '../core/dtos/checkout-session-request';
import {CheckoutSessionResponse} from '../core/dtos/checkout-session-response';
import {Session} from '../core/dtos/session';
import {Intent} from '../core/dtos/intent';
import {ResponseWrapper} from '../core/dtos/response-wrapper';
import {environment} from '../../environments/environment';
import {AuthService} from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {

  private readonly API_URL = environment.apiUrl;

  constructor(private readonly http: HttpClient,
              private authService: AuthService) {}

  createCheckoutSession(payload: CheckoutSessionRequest): Observable<ResponseWrapper<CheckoutSessionResponse>>{
    console.log("createCheckoutSession :", this.API_URL);
    return this.http.post<ResponseWrapper<CheckoutSessionResponse>>(`${this.API_URL}/api/payment/create-session`, payload);
  }

  createPaymentIntent(payload: CheckoutSessionRequest) : Observable<ResponseWrapper<CheckoutSessionRequest>>{
    return this.http.post<ResponseWrapper<CheckoutSessionRequest>>(`${this.API_URL}/api/payment/`,payload);
  }

  getPaymentIntent(id: string): Observable<ResponseWrapper<Intent>> {
    return this.http.get<ResponseWrapper<Intent>>(`${this.API_URL}/api/stripe/payment-intent/${id}`);
  }


  verifyPayment(sessionId: string): Observable<ResponseWrapper<Session>>{
    return this.http.get<ResponseWrapper<Session>>(`${this.API_URL}/api/payment/verify/${sessionId}`);
  }
  getSession(sessionId: string): Observable<ResponseWrapper<Session>>{
    return this.http.get<ResponseWrapper<Session>>(`${this.API_URL}/api/stripe/session/${sessionId}`);
  }


}
