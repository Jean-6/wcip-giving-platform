import { Routes } from '@angular/router';
import {TransactionReceipt} from './features/transaction-receipt/transaction-receipt';
import {Home} from './features/home/home';
import {DonatePage} from './components/donate-page/donate-page';
import {SignupPage} from './features/signup-page/signup-page';
import {LoginPage} from './features/login-page/login-page';
import {ContactPage} from './features/contact-page/contact-page';
import {EventPage} from './features/event-page/event-page';
import {ResourcePage} from './features/resource-page/resource-page';
import {ShopPage} from './features/shop-page/shop-page';
import {Dashboard} from './features/dashboard/dashboard';


export const routes: Routes = [
  {path: '',component: Home, title: 'Chapelle des Vainqueurs Intl. Paris'},
  {path: 'donner', component: DonatePage, title: 'Faire un don - Chapelle des Vainqueurs Intl.',},
  {path: 'transaction-receipt', component: TransactionReceipt},
  { path: 'donner', component: DonatePage, title: 'Faire un don — Chapelle des Vainqueurs' },
  { path: 'inscription', component: SignupPage, title: 'Créer un compte — Chapelle des Vainqueurs' },
  { path: 'connexion', component: LoginPage, title: 'Connexion — Chapelle des Vainqueurs' },
  { path: 'shop', component: ShopPage, title: 'Boutique en ligne — Chapelle des Vainqueurs' },
  { path: 'contact', component: ContactPage, title: 'Contactez-nous — Chapelle des Vainqueurs' },
  { path: 'event', component: EventPage, title: 'Nos evenements — Chapelle des Vainqueurs' },
  { path: 'resource', component: ResourcePage, title: 'Téléchargements & ressources — Chapelle des Vainqueurs' },
  { path: 'contact', component: ContactPage, title: 'Contact — Chapelle des Vainqueurs' },
  { path: 'dashboard', component: Dashboard, title: 'Dashboard — Chapelle des Vainqueurs' },

];
