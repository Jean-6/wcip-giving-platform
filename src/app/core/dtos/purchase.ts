import {UserPrivilege} from './user-profile';

export type PurchaseStatus = 'DELIVERED' | 'PROCESSING' | 'CANCELLED';

export interface PurchaseItem{
  id: number;
  title: string;
  quantity: number;
  unitPrice: number;
}

export interface Purchase {
  id: string;
  items: PurchaseItem[];
  total: number;
  status: PurchaseStatus;
  date: String;
  invoiceUrl?: string;
}
