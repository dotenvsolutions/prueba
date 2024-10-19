import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  try {
    //  debugger
    const cookie = inject(CookieService)
    const token = cookie.get('token')
    let newRequest = req.clone({
      setHeaders:{
        authorization: 'Bearer ' + token
      }
    })
    return next(newRequest);
  } catch (error) {
    return next(req);
  }

  
};
