import { Injectable, OnInit } from '@angular/core';
import { LoginService } from 'src/app/Services/login.service';
import SpofityWebApi from 'spotify-web-api-node'
import { Playlist, User } from '../Interfaces/user';
import { catchError, from, map, Observable, of, Subject } from 'rxjs';
import { AudioPlayerService } from 'src/app/Services/audio-player.service';
import { Auth } from 'src/app/Interfaces/auth';
import { Router } from '@angular/router';
import { Track, TrackModal } from 'src/app/Interfaces/track';
import { log, trace } from 'console';
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
  constructor(private loginService: LoginService,private timeService:TimeFormattingService, private audioService: AudioPlayerService, private router: Router) {

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
    console.log(this.currentId);


  }
  getCurrentId(){
    return of(this.currentId)
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
      const mapper = data.body.tracks?.items.map((item, index) => {
        const smallestImg = item.album.images.reduce((img: any, small: any) => {
          if (img && img.height < small.height) {
            return img
          }
          return small
        }, item.album.images[0])
        return {
          idx: index,
          albumId: item.album,
          albumName: item.album.name,
          albumImg: smallestImg.url,
          albumURI: item.album.uri,
          artistName: item.artists[0].name,
          artistId: item.artists[0].id,
          artistURI: item.artists[0].uri,
          id: item.id,
          duration: item.duration_ms,
          uri: item.uri,
          previewURL: item.preview_url,
          name: item.name,
          pfw: `Search Results for ${search}`


        }
      })
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
        //  console.log(track);
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
      console.log(currentAlbum);

      this.artistSubject.next(currentAlbum)
      const mapper = album.tracks.items.map((item,index)=>{
        console.log(item.duration_ms);

        const track = new TrackModal(index, '', item.artists[0].name, item.artists[0].id, item.artists[0].uri, item.id, this.timeService.secondsToString(item.duration_ms/1000), item.uri, item.preview_url!, item.name, currentAlbum.id, currentAlbum.name, this.findSmallesImage(album).url, '', "Details",-1);
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
      const mapper = data.body.items.map((item, index) => {
        const track: Track = {
          idx: index,
          albumId: item.album.id,
          albumImg: this.findSmallesImage(item.album).url,
          albumName: item.album.name,
          albumURI: item.album.uri,
          artistId: item.artists[0].id,
          artistName: item.artists[0].name,
          artistURI: item.artists[0].uri,
          duration: item.duration_ms,
          id: item.id,
          name: item.name,
          previewURL: item.preview_url!,
          pfw: "Top Tracks",
          playedAt: '',
          uri: item.uri
        }
        return track

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
      const mapper = data.body.items.map((item, index) => {


        const album = Object.entries(item.track)[0][1]
        const smallestImg = album.images.reduce((img: any, small: any) => {
          if (img && img.height < small.height) {
            return img
          }
          return small
        }, album.images[0])



        return {
          idx: index,
          playedAt: item.played_at,
          artistName: item.track.artists[0].name,
          artistId: item.track.artists[0].id,
          artistURI: item.track.artists[0].uri,
          id: item.track.id,
          duration: item.track.duration_ms,
          uri: item.track.uri,
          previewURL: item.track.preview_url,
          name: item.track.name,
          track: item.track,
          albumId: album.id,
          albumName: album.name,
          albumImg: smallestImg.url,
          albumURI: album.uri,
          pfw: "Recently Played"



        }

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
      const mapper = data.body.items.map((item, index) => {


        const smallestImg = item.track.album.images.reduce((img: any, small: any) => {
          if (img && img.height < small.height) {
            return img
          }
          return small
        }, item.track.album.images[0])



        return {
          idx: index,
          albumId: item.track.album,
          albumName: item.track.album.name,
          albumImg: smallestImg.url,
          albumURI: item.track.album.uri,
          artistName: item.track.artists[0].name,
          artistId: item.track.artists[0].name,
          artistURI: item.track.artists[0].uri,
          id: item.track.id,
          duration: item.track.duration_ms,
          uri: item.track.uri,
          previewURL: item.track.preview_url,
          name: item.track.name,
          pfw: "Playlist"


        }
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
