import { Injectable } from '@angular/core';
import { Auth } from '../Interfaces/auth';
import { HttpClient } from '@angular/common/http';
import axios from 'axios'
import { Location } from '@angular/common';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  code!:string;

  auth:Auth = {
    accessToken:'',
    refreshToken:'',
    expiresIn:0
  }
  authSubject = new BehaviorSubject<Auth>(this.auth)
  spotifySubject = new Subject()
  constructor(private http: HttpClient,private router:Router) {



  }

  getAuthSubject():Observable<Auth>{
    return this.authSubject.asObservable()
  }
  getSpotifyWebApi():Observable<any>{
    this.spotifySubject.subscribe((val)=>{
      console.log(val,'.....val');

    })

    return this.spotifySubject.asObservable()
  }
  setSpotifyWebApi(spotifyWebApi:any){


    this.spotifySubject.next(spotifyWebApi)


  }

  setCode(code:string){
    console.log('hello');

    this.code = code;
    console.log(this.code);
    axios.post('http://localhost:3000/login',{
      code:this.code,
    }).then((res) => {
      const auth:Auth = {
        accessToken:res.data.accessToken,
        refreshToken:res.data.accessToken,
        expiresIn:res.data.expiresIn
      }

      this.authSubject.next(auth)
      window.history.pushState({},'','/')
      this.router.navigate(['/spotify'])
      localStorage.setItem('token',auth.accessToken)

    }).catch((err)=>{
        // window.location.replace('/')
        console.log(err);
    })

  }
}
