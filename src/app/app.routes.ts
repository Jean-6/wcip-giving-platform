import { Routes } from '@angular/router';
import {Donation} from './features/donation/donation';
import {TransactionReceipt} from './features/transaction-receipt/transaction-receipt';


export const routes: Routes = [

  {
    path: 'donation',
    component: Donation
  },
  {
    path: 'transaction-receipt',
    component: TransactionReceipt,
  },
  {
    path: '',
    redirectTo: 'donation',
    pathMatch: 'full',
  },

];
