import { Injectable, OnInit } from '@angular/core';
import { Auth } from '../Interfaces/auth';
import { HttpClient } from '@angular/common/http';
import axios from 'axios'

import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class LoginService implements OnInit {
  code!:string;

  auth:Auth = {
    accessToken:'',
    refreshToken:'',
    expiresIn:0,
    expiresAt:0,
  }
  authSubject = new BehaviorSubject<Auth>({
    accessToken:'',
    refreshToken:'',
    expiresIn:0,
    expiresAt:0,
  })
  subject = new Subject()
  spotifySubject = new Subject()
  constructor(private http: HttpClient,private router:Router) {



  }
  ngOnInit(): void {
   console.log('init');

  }
  getSubject(){
    return this.subject.asObservable()
  }
  getAuthSubject():Observable<Auth>{
    console.log('get auth sub called');
    this.authSubject.subscribe(val=>console.log(val))
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
        refreshToken:res.data.refreshToken,
        expiresIn:res.data.expiresIn,
        expiresAt:res.data.expiresIn+Date.now(),
      }

      this.authSubject.next(auth)
      this.subject.next(auth)
      this.authSubject.subscribe((val)=>{
        console.log('from auth subject',val);

      })
      window.history.pushState({},'','/')
      this.router.navigate(['/spotify'])
      localStorage.setItem('token',auth.accessToken)
      localStorage.setItem('refreshToken',auth.refreshToken)
      localStorage.setItem('expiresAt',auth.expiresAt.toString())

    }).catch((err)=>{
        // window.location.replace('/')
        console.log(err);
    })

  }
  refreshToken(refreshToken:string){


    from(axios.post('http://localhost:3000/refresh',{refreshToken:refreshToken})).subscribe((res)=>{
      const auth:Auth = {
        accessToken:res.data.accessToken,
        refreshToken:res.data.refreshToken,
        expiresIn:res.data.expiresIn,
        // expiresAt:res.data.expiresIn+Date.now(),
        expiresAt:60+Date.now(),
      }

      this.authSubject.next(auth)
      this.subject.next(auth)
      localStorage.setItem('token',auth.accessToken)
    
      localStorage.setItem('expiresAt',auth.expiresAt.toString())
    })
  }
}
