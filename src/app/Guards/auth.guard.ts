import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { LoginService } from '../Services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private loginService:LoginService){


  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let accessToken:string = ''

      this.loginService.getAuthSubject().subscribe(val=>{
        accessToken = val.accessToken
        console.log(accessToken,' ', val.accessToken);

      });
      const hasToken = !!localStorage.getItem('token')
      const showSpotify =  accessToken===''?false:true
      console.log(showSpotify || hasToken);

      return showSpotify || hasToken

  }

}
