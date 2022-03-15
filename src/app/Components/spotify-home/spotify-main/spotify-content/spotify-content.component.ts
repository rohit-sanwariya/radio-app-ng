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

  constructor(private spotifyService:SpotifyService) {
    this.spotifyService.getRecentlyPlayedTracks()
   }

  ngOnInit(): void {
  this.currentContent$ = this.spotifyService.getPlaylist()
  this.currentContent$.subscribe((val)=>{
    console.log(val.albumImg);

  })
  }
  setCurrent(track:any){
    this.spotifyService.setCurrentTrack(track)
  }

}
