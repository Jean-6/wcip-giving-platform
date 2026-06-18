import { Routes } from '@angular/router';
import {TransactionReceipt} from './features/transaction-receipt/transaction-receipt';
import {Home} from './features/home/home';
import {DonatePage} from './components/donate-page/donate-page';


export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Chapelle des Vainqueurs Intl. Paris',
  },
  {
    path: 'donner',
    component: DonatePage,
    title: 'Faire un don - chapelle des Vainqueurs Intl.',
  },
  /*
  {
    path: 'donation',
    component: Donation
  },*/
  {
    path: 'transaction-receipt',
    component: TransactionReceipt,
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },

];
