import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';


@Injectable()
export class ResponseWrapperInterceptor implements HttpInterceptor {


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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
