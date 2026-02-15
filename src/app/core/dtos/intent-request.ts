import {BillingDetails} from './billing-details';

export interface IntentRequest {
  clientSecret?: string;
  amount: number;
  currency: string;
  reason: string;
  billingDetails: BillingDetails;
}
