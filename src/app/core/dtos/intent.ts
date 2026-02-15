export interface Intent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  chargeId: string;
  receiptUrl: string;
  cardBrand: string;
  cardLast4: string;
  created: number;
}

