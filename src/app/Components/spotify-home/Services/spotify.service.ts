import { Injectable, OnInit } from '@angular/core';
import { LoginService } from 'src/app/Services/login.service';
import SpofityWebApi from 'spotify-web-api-node'
import { Playlist, User } from '../Interfaces/user';
import { catchError, from, map, Observable, of, Subject } from 'rxjs';
import { AudioPlayerService } from 'src/app/Services/audio-player.service';
import { Auth } from 'src/app/Interfaces/auth';
import { Router } from '@angular/router';
import { Track, TrackModal } from 'src/app/Interfaces/track';

import { TimeFormattingService } from 'src/app/Services/time-formatting.service';


@Injectable({
  providedIn: 'root'
})
export class SpotifyService implements OnInit {
  audio = new Audio()
  user: User = {
    username: '',
    displayName: ''
  }
  playlists!: Playlist[]
  subject = new Subject()
  artistSubject = new Subject()
  artistTopTracks = new Subject()
  authObject!: Auth
  currentId:String = ''

  spotify = new SpofityWebApi({
    clientId: '792083897a9e487ca8186284678cf0b3',
  })
  constructor(private loginService: LoginService,
    private timeService:TimeFormattingService,
    private audioService: AudioPlayerService, private router: Router) {

    this.loginService.getAuthSubject().subscribe((auth) => {
      // console.log(auth);

      this.spotify.setAccessToken(localStorage.getItem('token')!)
      this.authObject = auth

    })
    this.spotify.setAccessToken(localStorage.getItem('token')!)
    this.spotify.getMe().then((data) => {
      this.user.username = data.body.id
      this.user.displayName = data.body.display_name!
    }).catch((err) => {
      console.error(`${err} from getMe spotify service`)
      if (this.router.url !== '/') {
        window.history.pushState({}, '', '/spotify')
        window.location.reload()
      }
    })
  }
  ngOnInit(): void {

  }
  getCurrentId(){
    return of(this.currentId)
  }
  trackGenerator(tracks:any):TrackModal[]{
    console.log(tracks);

    const mapper:TrackModal[] =  tracks?.items.map((item:any, index:number) => {

      const InstanceTrack:Track = new TrackModal(
        index,'',item.artists[0].name,
        item.artists[0].id,item.artists[0].uri,
        item.id,item.duration_ms, item.uri,
        item.preview_url!,item.name,item.album.id,
        item.album.name,this.findSmallesImage(item.album).url,
        item.album.uri,"Playlist",-1
      )
      return InstanceTrack
    })!
    this.subject.next(mapper)
    return mapper

  }
  updateContentOnSearch(search: string) {
    const expiresAt = localStorage.getItem('expiresAt')
    // console.log(this.authObject.refreshToken);
    if (parseInt(localStorage.getItem('expiresAt')!) < Date.now()) {
      this.loginService.refreshToken(localStorage.getItem('refreshToken')!);
    }
    if (search === '') {
      this.getRecentlyPlayedTracks()
      return
    }
    from(this.spotify.searchTracks(search)).pipe(map((data) => {
     const  mapper= this.trackGenerator(data.body.tracks)

      this.subject.next(mapper)
      return mapper
    })).subscribe()

  }
  getArtistInformation(artistId: string) {

    from(this.spotify.getArtist(artistId)).subscribe((data) => {
      const arttistInfo = data.body;
      const images = arttistInfo.images
      const largest = images.reduce((largest: any, current: any) => {
        if (largest.height < current) { return current; }
        return largest
      }, images[0])
      const artist = {
        name:arttistInfo.name,
        popularity:arttistInfo.popularity,
        image: largest.url,
        id: arttistInfo.id,
        followers: arttistInfo.followers.total,
      }
      this.artistSubject.next(artist)
    })
    from(this.spotify.getArtistTopTracks(artistId, 'IN')).pipe(
      map((data) => data.body.tracks)).subscribe((tracks) => {
      const mapper = tracks.map((item: any, index: number) => {
      const track = new TrackModal(index, '', item.artists[0].name, item.artists[0].id, item.artists[0].uri, item.id, this.timeService.secondsToString(item.duration_ms/1000), item.uri, item.preview_url, item.name, item.album.id, item.album.name, this.findSmallesImage(item.album).url, item.album.uri, "Details",item.popularity);
      return track
      })


      this.artistTopTracks.next(mapper)
    })
  }
  getAlbumInforamtion(albumId:string){
    console.log('ablumId before call',albumId);
    from(this.spotify.getAlbum(albumId)).pipe(map((data)=>{
      return data.body
    })).subscribe((album)=>{
      const images = album.images;
      console.log(images);

      const largest = album.images.reduce((largest: any, current: any) => {
        if (largest.height < current) { return current; }
        return largest

      }, album.images[0])
      const currentAlbum = {
        name:album.name,
        image:largest.url,
        popularity:album.popularity,
        id: album.id,
        followers: null,
      }
      this.artistSubject.next(currentAlbum)
      const mapper = album.tracks.items.map((item,index)=>{

        const track = new TrackModal(
         index, '', item.artists[0].name, item.artists[0].id,
         item.artists[0].uri, item.id, this.timeService.secondsToString(item.duration_ms/1000),
         item.uri, item.preview_url!, item.name, currentAlbum.id, currentAlbum.name,
         this.findSmallesImage(album).url, '', "Details",-1);
        return track
      })
      this.artistTopTracks.next(mapper)

    })
  }

  getArtistContent() {
    return { info: this.artistSubject.asObservable(), tracks: this.artistTopTracks.asObservable() }
  }

  getMyTopTracks() {
    from(this.spotify.getMyTopTracks({ limit: 20 })).pipe(map(data => {
      const mapper:Track[] = data.body.items.map((item, index) => {
        const InstanceTrack = new TrackModal(
          index,'',item.artists[0].name,
          item.artists[0].id,item.artists[0].uri,
          item.id,item.duration_ms, item.uri,
          item.preview_url!,item.name,item.album.id,
          item.album.name,this.findSmallesImage(item.album).url,
          item.album.uri,"Top Tracks",-1
        )

        return InstanceTrack

      })
      this.subject.next(mapper)
      return mapper
    })).subscribe((val) => {
      // console.log(val);

    })
  }

  getUser() {
    return of(this.user)
  }

  findSmallesImage(array: any) {


    const smallestImg = array.images.reduce((img: any, small: any) => {
      if (img && img.height < small.height) {
        return img
      }
      return small
    }, array.images[0])
    // console.log(smallestImg);

    return smallestImg
  }

  fetchPlaylist(): Observable<any> {
    if (parseInt(localStorage.getItem('expiresAt')!) < Date.now()) {
      this.loginService.refreshToken(localStorage.getItem('refreshToken')!);

    }
    const ob = from(this.spotify.getUserPlaylists('21mxrckvt5fvsgubpbz3kcpuq')).pipe(catchError(err => {
      return err;
    }), map((data: any, index) => data.body.items), map((items, index) => {
      const mapper = items.map((item: any) => {
        return { name: item.name, description: item.description, id: item.id }
      })
      return mapper
    }))
    return ob
  }

  getRecentlyPlayedTracks() {

    // console.log('recently',localStorage.getItem('refreshToken')!);
    if (parseInt(localStorage.getItem('expiresAt')!) < Date.now()) {

      this.loginService.refreshToken(localStorage.getItem('refreshToken')!);

    }
    from(this.spotify.getMyRecentlyPlayedTracks({ limit: 20 })).pipe(map(data => {
      const mapper:Track[] = data.body.items.map((item, index) => {
        const album = Object.entries(item.track)[0][1]
        const InstanceTrack = new TrackModal(
          index,item.played_at,item.track.artists[0].name,
          item.track.artists[0].id,item.track.artists[0].uri,
          item.track.id,item.track.duration_ms, item.track.uri,
          item.track.preview_url!,item.track.name,album.id,
          album.name,this.findSmallesImage(album).url,
          album.uri,"Recently Played",-1
        )
        return InstanceTrack

      })
      this.subject.next(mapper)
      this.audioService.setAudio(mapper.find((track) => track.previewURL))
      return mapper
    })).subscribe((val) => {
    })
  }
  setPlaylistTracks(playlistId: string) {
    if (parseInt(localStorage.getItem('expiresAt')!) < Date.now()) {
      this.loginService.refreshToken(localStorage.getItem('refreshToken')!);

    }
    from(this.spotify.getPlaylistTracks(playlistId, { limit: 20 })).pipe(map(data => {
      const mapper:Track[] = data.body.items.map((item, index) => {

        const InstanceTrack = new TrackModal(
          index,'',item.track.artists[0].name,
          item.track.artists[0].id,item.track.artists[0].uri,
          item.track.id,item.track.duration_ms, item.track.uri,
          item.track.preview_url!,item.track.name,item.track.album.id,
          item.track.album.name,this.findSmallesImage(item.track.album).url,
          item.track.album.uri,"Playlist",-1
        )
        return InstanceTrack
      })

      this.subject.next(mapper)
      // this.audioService.setAudio(mapper[0])

      return mapper

    })).subscribe()
  }


  setCurrentTrack(track: any, autoplay: boolean) {
    this.audioService.setAudio(track)
    if (autoplay) {

    }

  }
  getPlaylist() {

    return this.subject
  }

}
