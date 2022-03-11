import { Injectable } from '@angular/core';
import { Auth } from '../Interfaces/auth';
import { HttpClient } from '@angular/common/http';
import axios from 'axios'
import { Location } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
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

  constructor(private http: HttpClient,private location:Location) {
    const bearer = `Bearer BQBayIUv8P3lG943k76YWWzHwLirOWxBwVuheALsLayG6ERwJApEFr3MSh8_GjQrXVrfb2XVaXVQC5CkChsX065_cMvVwcSFkSqu8k8wle30lKKRGF2snPQ4dmKlXfXgxdXJpFz8KvpidqvbOy-h-3tLoUILViI0XA3EjqRjbPbJhW1c8S_x6_KClsorx6XCvaIxU6KOPrBvC7D7`
    fetch('https://api.spotify.com/v1/tracks/2ozqIKiasvsIDm4YQHUACn?si=977977dba97c4462&nd=1',{
        headers:{
            'Authorization': bearer,
        }
    }).then((data)=>{

        return data.json()
    }).then((res)=>{
      console.log(res);

    })


  }

  getAuthSubject():BehaviorSubject<Auth>{
    return this.authSubject
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
      console.log(this.auth);
      window.history.pushState({},'','/')
    }).catch((err)=>{
        // window.location.replace('/')
        console.log(err);
    })

  }
}
