import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../Services/spotify.service';

@Component({
  selector: 'app-spotify-content',
  templateUrl: './spotify-content.component.html',
  styleUrls: ['./spotify-content.component.scss']
})
export class SpotifyContentComponent implements OnInit {
  currentContent = []

  constructor(private spotifyService:SpotifyService) { }

  ngOnInit(): void {
  this.spotifyService.getPlaylist().subscribe((val)=>{
    console.log(val,"blank");
  })
  }

}
