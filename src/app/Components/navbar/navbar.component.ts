import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LoginService } from 'src/app/Services/login.service';
import { distinctUntilChanged } from 'rxjs/operators';
// @ts-ignore
import SpofityWebApi from 'spotify-web-api-node'
import { Auth } from 'src/app/Interfaces/auth';
import { AudioPlayerService } from 'src/app/Services/audio-player.service';
import { SpotifyService } from '../spotify-home/Services/spotify.service';
import { User } from '../spotify-home/Interfaces/user';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user$!:Observable<User>
  showSpotifyIcon:boolean = true
  spotify = new SpofityWebApi({
    clientId: '792083897a9e487ca8186284678cf0b3',
  })
  searchResults: any = []
  search: FormControl = new FormControl('')
  authObject!: Auth
  AUTH_URI: string =
    `https://accounts.spotify.com/authorize?
client_id=792083897a9e487ca8186284678cf0b3&
response_type=code&
redirect_uri=http://localhost:4200/&
scope=streaming%20
user-read-email%20
user-read-private%20
user-library-read%20
user-library-modify%20
user-read-playback-state%20
user-modify-playback-state`

  constructor(private service: LoginService,private spotifyService:SpotifyService, private audioService: AudioPlayerService) {
    const url = new URLSearchParams(window.location.search)

    const code = url.get('code')
    const currentPath = window.location.pathname
    if(currentPath == '/spotify'){
        this.showSpotifyIcon = false
        this.spotifyService.getUser().subscribe((val)=>{
          console.log(val);

        })
       this.user$ = this.spotifyService.getUser()
       this.user$.subscribe(val=>console.log(val))


    }

    if (code) {
      this.service.setCode(code)
    }

  }

  ngOnInit(): void {
    this.service.getAuthSubject().pipe(distinctUntilChanged()).subscribe((auth) => {

      if (auth.accessToken !== '') {
        this.spotify.setAccessToken(auth.accessToken)
        console.log('.....',this.spotify);

        this.service.setSpotifyWebApi(this.spotify)


        this.authObject = auth
        console.log('in change token', auth.accessToken,this.authObject);
      }

    })
    this.search.valueChanges.subscribe((searchTerm) => {



      if (searchTerm === '') { this.searchResults = []; return; }
      if (!this.authObject) return


      this.spotify.searchTracks(searchTerm).then((res) => {
        this.searchResults = res.body.tracks?.items.map(track => {



          const smallestAlbumImage = track.album.images.reduce((smallest: any, image: any) => {
            if (image.height < smallest.height) { return image }
            return smallest
          }
            , track.album.images[0])
          return {
            artist: track.artists[0].name,
            title: track.name,
            src: track.uri,
            // albumUrl:smallestAlbumImage

          }
        })
        const target = this.searchResults[0].src.split(':').splice(2)[0]
        this.spotify.getTrack(target).then((res) => {
          console.log(res);

        })
        this.audioService.setSongList(this.searchResults)

      });

    })
  }
}



