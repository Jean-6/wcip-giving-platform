import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';
import {AuthService} from '../../services/auth-service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  //401 - 403 - 409 - 500

  constructor(private readonly authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authReq = req.clone({
      setHeaders: {
        Authorization: this.authService.getAuthorizationHeader()
      }
    })
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        let msg = 'Une erreur technique est survenue';
        if(error.status == 409 ){
          msg = 'Username et/ou email existent déjà.';
        }else if(error.status === 401 || error.status === 403) {
          msg = 'Identifiants incorrects ou seession expiree';
        }else{
          msg = 'Service temporairement indisponible';
        }
        const wrapperError = {
          success:  false,
          data: null,
          msg: msg,
          status : error.status,
          path: req.url,
          timestamp: new Date().toISOString()
        };

        return throwError(() => wrapperError);

      })
    );
  }
}
