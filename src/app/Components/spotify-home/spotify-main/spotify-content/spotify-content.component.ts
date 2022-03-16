import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SpotifyService } from '../../Services/spotify.service';

@Component({
  selector: 'app-spotify-content',
  templateUrl: './spotify-content.component.html',
  styleUrls: ['./spotify-content.component.scss']
})
export class SpotifyContentComponent implements OnInit {
  currentContent$!:Observable<any>
  playedFrom:string='Recently Played'

  constructor(private spotifyService:SpotifyService) {
    this.spotifyService.getRecentlyPlayedTracks()

   }

  ngOnInit(): void {
  this.currentContent$ = this.spotifyService.getPlaylist()
  this.currentContent$.subscribe((val)=>{
    if(this.currentContent$){
      this.currentContent$.subscribe((val)=>{
       this.playedFrom = val[0].pfw

      })
    }

  })
  }
  setCurrent(track:any){
    this.spotifyService.setCurrentTrack(track)
  }

}
