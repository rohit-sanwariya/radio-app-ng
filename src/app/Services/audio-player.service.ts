import { Injectable, OnInit } from '@angular/core';
import { AudioState } from '../Interfaces/audio-state';

@Injectable({
  providedIn: 'root'
})

export class AudioPlayerService implements OnInit {
  audioState:AudioState = {
    playing:false
  }
  constructor() {


   }
  ngOnInit(): void {

  }
  play(audio:any){
    this.audioState.playing ? audio.pause():audio.play()
    this.audioState.playing = !this.audioState.playing
  }
  getState(){
    return this.audioState
  }
}
