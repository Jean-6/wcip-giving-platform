import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {BasicAuthInterceptor} from './core/interceptors/basic-auth-interceptor';
import {ResponseWrapperInterceptor} from './core/interceptors/response-wrapper-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BasicAuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseWrapperInterceptor,
      multi: true
    },
    provideHttpClient(withInterceptorsFromDi()),
    MessageService,
    ToastModule,
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options:{
          prefix: 'p',
          darkModeSelector: 'none'
        }
      }
    }),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
