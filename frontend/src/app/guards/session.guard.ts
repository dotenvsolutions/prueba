import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const sessionGuard: CanActivateFn = (route, state) => {
  const cookie = inject(CookieService)
  const cookieExists: boolean = cookie.check('token');
  //console.log(cookieExists)
  const router = inject(Router)
  if(!cookieExists){
    const url = router.createUrlTree([""])
    return url
  }
  return cookieExists
};

 
