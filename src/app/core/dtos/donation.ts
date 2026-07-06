export type DonationStatus = 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';

export interface Donation{
  id: string;
  amount: number;          // in euros
  currency: string;
  designation: string;
  frequency: 'once' | 'monthly';
  status: DonationStatus;
  date: Date;//string;            // ISO date
  receiptUrl?: string;
  stripeSessionId?: string;
}
