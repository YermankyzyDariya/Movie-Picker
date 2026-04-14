import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: any, next: any) {
    const token = localStorage.getItem('token');

    if (token) {
      const cloned = req.clone({
        setHeaders: { Authorization: `Token ${token}`}
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}