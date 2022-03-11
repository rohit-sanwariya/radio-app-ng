
import { Component, OnInit } from '@angular/core';
import { AudioPlayerService } from 'src/app/Services/audio-player.service';
import { RadioList, SongList } from 'src/assets/Songs';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {
  currentSelection = null
  radioChannels = RadioList
  songChannels = SongList

  constructor(private service:AudioPlayerService) {
    this.service.getSongList().subscribe((songs:any)=>{



     if(songs.length>0){
      console.log(songs[0].artist);
      this.songChannels = songs
     }
    })
   }
  showMusic:boolean = true
  ngOnInit(): void {
  }
   showMe(isMusic:boolean){
      this.showMusic = isMusic
      console.log(this.showMusic);
      this.service.setAudioType(this.showMusic)

   }
   selected(event:any){
     console.log(event);
      this.service.setIdx(event)

   }
   get getIdx(){
      let a;
      this.service.getState().subscribe((state)=>{
          a = state.currentIdx
      })
      return a
   }
   get isPlaying(){
     console.log(this.service.audioState.playing);

     return this.service.audioState.playing
   }

}
