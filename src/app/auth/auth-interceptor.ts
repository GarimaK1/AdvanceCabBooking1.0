import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // this method is called for all "http requests" leaving angular. So kind of middleware on front-end.
    // injecting token into outgoing requests.
    // The Basic Authentication Interceptor intercepts http requests from the application to add
    // basic authentication credentials to the Authorization header if the user is logged in.
    const authToken = this.authService.getToken();
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });
    // console.log('AuthInterceptor used, authToken: ' + authToken + ' , authReq: ' + JSON.stringify(authReq));
    return next.handle(authReq);
  }
}
