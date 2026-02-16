import {BillingDetails} from './billing-details';

export interface CheckoutSessionRequest {
  clientSecret?: string;
  amount: number;
  currency: string;
  reason: string;
  billingDetails: BillingDetails;
  idempotencyKey: string;
}
