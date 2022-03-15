import { Injectable } from '@angular/core';
import { LoginService } from 'src/app/Services/login.service';
import SpofityWebApi from 'spotify-web-api-node'
import { Playlist, User } from '../Interfaces/user';
import { from, map, Observable, of, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  user: User = {
    username: '',
    displayName: ''
  }
  playlists!: Playlist[]
  subject = new Subject()
  obserable!:Observable<any>
  spotify = new SpofityWebApi({
    clientId: '792083897a9e487ca8186284678cf0b3',
  })
  constructor(private loginService: LoginService) {

    this.loginService.getAuthSubject().subscribe((auth) => {


      this.spotify.setAccessToken(localStorage.getItem('token')!)
    })
    this.spotify.getMe().then((data) => {


      this.user.username = data.body.id
      this.user.displayName = data.body.display_name!



    })
  }
  getUser() {
    console.log(this.user.username);

    return of(this.user)
  }

  fetchPlaylist(): Observable<any> {

    const ob =from(this.spotify.getUserPlaylists('21mxrckvt5fvsgubpbz3kcpuq')).pipe(map((data, index) => data.body.items),map((items,index)=>{

      const mapper = items.map((item)=>{ return {name:item.name,description:item.description,id:item.id}
      })


      return mapper

    }))


    return ob
  }
  setPlaylistTracks(playlistId:string){
     from(this.spotify.getPlaylistTracks(playlistId,{limit:20})).pipe(map(data=>{
      const mapper = data.body.items.map((item)=>{

      const smallestImg = item.track.album.images.reduce((img:any,small:any)=>{
          if(img && img.height<small.height){
            return img
          }
          return small
        },item.track.album.images[0])
        console.log(smallestImg);


        return {
          albumId:item.track.album,
          albumName:item.track.album.name,
          albumImg:smallestImg.url,
          albumURI:item.track.album.uri,
          artistName:item.track.artists[0].name,
          artistId:item.track.artists[0].name,
          artistURI:item.track.artists[0].uri,
          id:item.track.id,
          duration:item.track.duration_ms,
          uri:item.track.uri,
          previewURL :item.track.preview_url,
          name:item.track.name,


        }
        })

        this.subject.next(mapper)

        return mapper

    })).subscribe()
  }
  getPlaylist(){

    return this.subject.asObservable()
  }

}
