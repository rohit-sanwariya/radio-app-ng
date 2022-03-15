import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SpotifyService } from '../../Services/spotify.service';

@Component({
  selector: 'app-spotify-sidebar',
  templateUrl: './spotify-sidebar.component.html',
  styleUrls: ['./spotify-sidebar.component.scss']
})
export class SpotifySidebarComponent implements OnInit {
  playlists$!:Observable<any>

  constructor(private spotifyService:SpotifyService) {

   }


  ngOnInit(): void {
   this.playlists$ =  this.spotifyService.fetchPlaylist()
   this.spotifyService.fetchPlaylist().subscribe((val)=>{
     console.log(val);

   })
  }
  setCurrentPlaylist(event:Event,playlist:any){
    event.preventDefault()

    this.spotifyService.setPlaylistTracks(playlist.id)


  }

}
