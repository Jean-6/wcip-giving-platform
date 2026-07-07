import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthService} from '../../services/auth-service';


@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

   //const authHeader = this.authService.getAuthorizationHeader();
    const cloned =   req.clone({
      setHeaders : {
      //  Authorization: authHeader
      }
    })
    return next.handle(cloned);
  }

}
