import { Injectable } from '@angular/core';
import {settings} from '../settings/appsettings'
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { ApiResponse } from '../interfaces/ApiResponse';
import { Login } from '../interfaces/Login';
import {CookieService} from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class AccessService {
  private readonly serviceUrl:string = settings.apiURL
  constructor(private http: HttpClient, private cookie: CookieService) { }

  loginUser(user: Login): Observable<ApiResponse>{
    return this.http.post<ApiResponse>(this.serviceUrl+'/login', user).pipe(
      tap((dataRaw:ApiResponse)=>{
        const {success,msg,token} = dataRaw
        this.cookie.set('token',token,1,'/')
      }),
      map((dataRaw: ApiResponse) => dataRaw)
    )
  }
}
