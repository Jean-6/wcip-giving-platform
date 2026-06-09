import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';
import {AuthService} from '../services/auth-service';


@Injectable()
export class ResponseWrapperInterceptor implements HttpInterceptor {

  constructor(private readonly authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authReq = req.clone({
      setHeaders: {
        Authorization: this.authService.getAuthorizationHeader()
      }
    })
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const wrapperError = {
          success:  false,
          data: null,
          msg: error.error?.error || error.message || 'Erreur inconnue' ,
          status : error.status,
          path: req.url,
          timestamp: new Date().toISOString()
        };

        return throwError(() => wrapperError);

      })
    );
  }
}
