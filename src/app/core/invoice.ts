export type InvoiceType = 'DONATION_RECEIPT' | 'PURCHASE_INVOICE';

export interface Invoice {
  id: string;
  type: InvoiceType;
  label: string;
  amount: number;
  date: string;
  downloadUrl: string;
}
