import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CheckoutSessionRequest} from '../core/dtos/checkout-session-request';
import {CheckoutSessionResponse} from '../core/dtos/checkout-session-response';
import {Session} from '../core/dtos/session';
import {Intent} from '../core/dtos/intent';
import {ResponseWrapper} from '../core/dtos/response-wrapper';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {

  private readonly API_URL = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  createPaymentIntent(payload: CheckoutSessionRequest) : Observable<ResponseWrapper<CheckoutSessionRequest>>{
    return this.http.post<ResponseWrapper<CheckoutSessionRequest>>(`${this.API_URL}/api/payment/`, payload);
  }

  getPaymentIntent(id: string): Observable<ResponseWrapper<Intent>> {
    return this.http.get<ResponseWrapper<Intent>>(`${this.API_URL}/api/stripe/payment-intent/${id}`);
  }

  createCheckoutSession(payload: CheckoutSessionRequest): Observable<ResponseWrapper<CheckoutSessionResponse>>{
    return this.http.post<ResponseWrapper<CheckoutSessionResponse>>(`${this.API_URL}/api/payment/create-session`, payload);
  }

  getSession(sessionId: string): Observable<ResponseWrapper<Session>>{
    return this.http.get<ResponseWrapper<Session>>(`${this.API_URL}/api/stripe/session/${sessionId}`);
  }


}
