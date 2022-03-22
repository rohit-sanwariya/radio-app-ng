import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SpotifyService } from '../../Services/spotify.service';

@Component({
  selector: 'app-spotify-sidebar',
  templateUrl: './spotify-sidebar.component.html',
  styleUrls: ['./spotify-sidebar.component.scss']
})
export class SpotifySidebarComponent implements OnInit {
  playlists$!:Observable<any>
  showPlaylists:boolean = false

  constructor(private spotifyService:SpotifyService,private router:Router) {
      this.spotifyService.getMyTopTracks()
   }


  ngOnInit(): void {
   this.playlists$ =  this.spotifyService.fetchPlaylist()
   this.spotifyService.fetchPlaylist().subscribe((val)=>{
     console.log(val);

   })
  }
  showTopTracks(event:Event){
      event.preventDefault()
      this.spotifyService.getMyTopTracks()
  }
  showPlaylistsToggle(){
    this.showPlaylists = !this.showPlaylists
  }
  showRecentlyPlayed(event:Event){
    event.preventDefault()
    this.spotifyService.getRecentlyPlayedTracks()
  }
  setCurrentPlaylist(event:Event,playlist:any){
    event.preventDefault()
    this.spotifyService.setPlaylistTracks(playlist.id)
    this.router.navigate(['/spotify'])
  }

}
