import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AudioPlayerService } from 'src/app/Services/audio-player.service';
import { SpotifyService } from '../../Services/spotify.service';

@Component({
  selector: 'app-spotify-content',
  templateUrl: './spotify-content.component.html',
  styleUrls: ['./spotify-content.component.scss']
})
export class SpotifyContentComponent implements OnInit {
  currentContent$!:Observable<any>
  playedFrom:string='Recently Played'

  constructor(private spotifyService:SpotifyService,private audioService: AudioPlayerService) {
    this.spotifyService.getRecentlyPlayedTracks()

   }

  ngOnInit(): void {
  this.currentContent$ = this.spotifyService.getPlaylist();
  this.currentContent$.subscribe((val)=>{
    if(this.currentContent$){
      this.currentContent$.subscribe((val)=>{
       this.playedFrom = val[0].pfw
      })}
  })
  }
  setCurrent(track:any){
    console.log(track);
    this.spotifyService.setCurrentTrack(track,false)
  }
  showDetails(track:any,callType:string){
    console.log(track);
   if(callType==='artist'){
    this.spotifyService.getArtistInformation(track.artistId)
   }
   else if(callType==='album'){
    this.spotifyService.getAlbumInforamtion(track.albumId)
   }

  }

}
