import { routes } from './../app.routes';
import { Injectable } from '@angular/core';
import {settings} from '../settings/appsettings'
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { ApiResponse } from '../interfaces/ApiResponse';
import { Login } from '../interfaces/Login';
import {CookieService} from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AccessService {
  private readonly serviceUrl:string = settings.apiURL
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private cookie: CookieService, private routes: Router) { }

  loginUser(user: Login): Observable<ApiResponse>{
    return this.http.post<ApiResponse>(this.serviceUrl+'/login', user).pipe(
      tap((dataRaw:ApiResponse)=>{
        const {success,msg,token,data} = dataRaw
        console.log(data)
        this.cookie.set('token',token,1,'/')
        this.currentUserSubject.next(data);
        localStorage.setItem('user', JSON.stringify(data));
      }),
      map((dataRaw: ApiResponse) => dataRaw)
    )
  }

  getAllUsers(): Observable<any>{
    return this.http.get(this.serviceUrl).pipe(map((dataRaw: any) => dataRaw ))
  }

  logOutUser(id:number,sessionId:number): Observable<ApiResponse>{
    return this.http.post<ApiResponse>(this.serviceUrl+'logout',{id:id,sessionId:sessionId}).pipe(
      tap((dataRaw:ApiResponse)=>{
        //console.log(dataRaw)
        localStorage.clear()
        this.currentUserSubject.next({});
        this.cookie.deleteAll('/');
        this.routes.navigate(['/auth/login'])
      }),
      map((dataRaw: any) => dataRaw ))
  }

  createMasiveUsers(data:any): Observable<ApiResponse>{
    return this.http.post<ApiResponse>(this.serviceUrl+'generate', data).pipe(
      map((dataRaw: any) => dataRaw ))
  }

  updateDatauser(id:number,user: any): Observable<ApiResponse>{
    return this.http.post<ApiResponse>(this.serviceUrl+'updateUser/'+id, user).pipe(
      
    map((dataRaw: any) => dataRaw ))
  }

  isAdmin(): boolean {
    let user:any = localStorage.getItem('user')
    let data = JSON.parse(user)
    if(data.rolName!=='ADMINISTRADOR'){
      return false
    }
    return true
  }
}
