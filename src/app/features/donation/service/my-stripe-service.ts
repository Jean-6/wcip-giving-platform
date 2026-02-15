import { Injectable } from '@angular/core';
import {IntentRequest} from '../../../core/dtos/intent-request';
import {
  loadStripe,
  Stripe,
  StripeElements
} from '@stripe/stripe-js';
import {from, map, Observable, of, switchMap, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MyStripeService {

  key= 'pk_test_51Lgb1fFC4qwBoSWoWyYTcS2IzqymsC3hUT8QtqT8VK5RZ83vNh9gwrSA9IbII6q9pu7pwc8hgnN4llWM56NYJAXR00psBabhKJ';

  private readonly API_URL = environment.apiUrl;

  private stripe!: Stripe;
  private elements!: StripeElements;

  private cardNumber!: any;
  private cardExpiry!: any;
  private cardCvc!: any;

  isLoading = false;

  constructor(private http: HttpClient) {}

  /*Init stripe once*/

  init$(): Observable<void> {

    if(this.stripe) return from(Promise.resolve());

    return from (loadStripe(this.key)).pipe(
      tap(stripe => {
        if(!stripe) throw  new Error('Stripe was not loaded');
        this.stripe = stripe;
        this.elements = stripe.elements();
        this.createElementsOnce();
      }),
      switchMap(() => from(Promise.resolve()))
    );

  }

  private createElementsOnce(){

    if(this.cardNumber) return;

    const style = this.baseStyle();

    this.cardNumber = this.elements.create('cardNumber', { style} );
    this.cardExpiry = this.elements.create('cardExpiry', { style} );
    this.cardCvc = this.elements.create('cardCvc', { style} );

  }

  private mounted = false;

  mountAll(
    numberEl: HTMLElement,
    expiryEl: HTMLElement,
    cvcEl: HTMLElement
  ){

    if(this.mounted) return;

    this.cardNumber!.mount(numberEl);
    this.cardExpiry!.mount(expiryEl);
    this.cardCvc!.mount(cvcEl);

    this.mounted = true;
  }


  /**
   * Shared style
   */

  private baseStyle(){
    return {
      base: {
        fontSize: '16px',
        color: '#1f2937',
        fontFamily: '"Inter", "system-ui", sans-serif',
        '::placeholder': {
          color:'#9ca3af'
        }
      },
      invalid: {
        color: '#dc2626'
      }
    }
  }

  /**
   * Unmount all
   */

  unmountAll(){
    this.cardNumber?.unmount();
    this.cardExpiry?.unmount();
    this.cardCvc?.unmount();
  }


  /**
   * Confirm payment (Observable)
   */


  confirmPayment$(payload: IntentRequest): Observable<{
    success: boolean;
    paymentIntentId: string | null;
    error: string | null }> {

    if (!this.mounted || !this.cardNumber) {
      return of({ success: false, paymentIntentId:null, error: 'Stripe card not mounted' });
    }

    if(!payload.clientSecret){
      return of({ success: false, paymentIntentId: null, error: 'Client secret manquant' });
    }
    return from(
      this.stripe.confirmCardPayment(payload.clientSecret, {
        payment_method: {
          card: this.cardNumber,
          billing_details: {
            name: `${payload.billingDetails.firstname} ${payload.billingDetails.lastname}`,
            email: payload.billingDetails.email,
            phone: payload.billingDetails.phone,
            address: {
              line1: payload.billingDetails.address.line1,
              line2: payload.billingDetails.address.line2,
              city: payload.billingDetails.address.city,
              postal_code: payload.billingDetails.address.postal_code,
              state: payload.billingDetails.address.state,
              country: payload.billingDetails.address.country
            }
          }
        }
      })
    ).pipe(
      map(result => {
        console.log("result :, {} ",result)

        const paymentIntentId =
          result.paymentIntent?.id ||
          result.error?.payment_intent?.id ||
          null;

        if (result.error) {
          return {
            success: false,
            paymentIntentId,
            error: result.error.message ?? null
          };
      }

        return {
          success: true,
          paymentIntentId,
          error: null
        };
      })
    );
  }




  /**
   * Full cleaning
   */

  destroy(): void {
    this.unmountAll();
    this.cardNumber = undefined;
    this.cardExpiry = undefined;
    this.cardCvc = undefined;
  }

}
