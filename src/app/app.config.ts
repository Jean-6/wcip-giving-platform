import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi
} from '@angular/common/http';
import {BasicAuthInterceptor} from './core/interceptors/basic-auth-interceptor';
import {ErrorInterceptor} from './core/interceptors/error-interceptor';
import localeFr from '@angular/common/locales/fr';
import {registerLocaleData} from '@angular/common';
import {provideNgxStripe} from 'ngx-stripe';
import {provideAnimations} from '@angular/platform-browser/animations';



registerLocaleData(localeFr);
  export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'fr' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BasicAuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    MessageService,
    ToastModule,
    provideAnimations(),
    provideAnimationsAsync(),
    providePrimeNG({
        //  locale: fr,
      theme: {
        preset: Aura,
        options:{
          prefix: 'p',
          darkModeSelector: 'none'
        }
      },
      // Translation config
      translation: {
        dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
        dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
        dayNamesMin: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
        monthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
        monthNamesShort: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"],
        today: 'Aujourd\'hui',
        clear: 'Effacer',
        dateFormat: 'dd/mm/yy',
        firstDayOfWeek: 1
      }
    }),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNgxStripe('')
  ]
};
