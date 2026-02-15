import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IntentRequest} from '../core/dtos/intent-request';
import {CheckoutSessionRes} from '../core/dtos/checkoutSessionRes';
import {Session} from '../core/dtos/session';
import {Intent} from '../core/dtos/intent';
import {ResponseWrapper} from '../core/dtos/response-wrapper';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {

  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createPaymentIntent(payload: IntentRequest) : Observable<ResponseWrapper<IntentRequest>>{
    return this.http.post<ResponseWrapper<IntentRequest>>(`${this.API_URL}/api/payment/`, payload);
  }

  getPaymentIntent(id: string): Observable<ResponseWrapper<Intent>> {
    return this.http.get<ResponseWrapper<Intent>>(`${this.API_URL}/api/stripe/payment-intent/${id}`);
  }

  createCheckoutSession(payload: IntentRequest): Observable<ResponseWrapper<CheckoutSessionRes>>{
    return this.http.post<ResponseWrapper<CheckoutSessionRes>>(`${this.API_URL}/api/payment/create-session`, payload);
  }

  getSession(sessionId: string): Observable<ResponseWrapper<Session>>{
    return this.http.get<ResponseWrapper<Session>>(`${this.API_URL}/api/stripe/session/${sessionId}`);
  }


}
