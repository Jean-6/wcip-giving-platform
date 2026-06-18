import { Routes } from '@angular/router';
import {Donation} from './features/donation/donation';
import {TransactionReceipt} from './features/transaction-receipt/transaction-receipt';
import {Home} from './features/home/home';


export const routes: Routes = [


  {
    path: '',
    component: Home
  },
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
