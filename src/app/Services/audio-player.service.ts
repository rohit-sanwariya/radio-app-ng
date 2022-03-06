import { ElementRef, Injectable, OnInit } from '@angular/core';

import { Observable, of, Subject } from 'rxjs';
import { RadioList, SongList } from 'src/assets/Songs';
import { AudioState } from '../Interfaces/audio-state';
import { TimeFormattingService } from './time-formatting.service';

@Injectable({
  providedIn: 'root'
})

export class AudioPlayerService implements OnInit {
  private  subject = new Subject()
  radioList = RadioList
  songList = SongList
  audioState:AudioState = {
    playing:false,
    duration:0,
    rangeValue:0,
    currentTime:0,
    timeLeft:'00:00',
    timeRight:'00:00',
    currentIdx:0,
    AudioType:true
  }
  constructor(private timeService:TimeFormattingService) {


   }
  ngOnInit(): void {

  }
  getSubject(){
    return this.subject.asObservable()
  }
  callPlay(){
    this.subject.next(1)
  }

  play(audio:any){

    this.audioState.playing ? audio.pause():audio.play();
    this.audioState.playing = !this.audioState.playing;


  }

  playNext(audio:any){
    this.audioState.currentIdx++
    audio.src = this.radioList[this.audioState.currentIdx].src
    audio.autoplay = true
  //   this.audioState.playing = true
  //  console.log( audio.load());

  //   audio.play()

  }
  playPrevious(){
    this.audioState.currentIdx--
  }

  getState():Observable<AudioState>{
    return of(this.audioState);
  }
  setDuration(duration:number){
    this.audioState.duration = duration;

    const str = this.timeService.secondsToString(duration)
    this.audioState.timeRight = str;
  }
  setAudioType(type:boolean){
    this.audioState.AudioType = type

    
  }
  setIdx(idx:number){
    this.audioState.currentIdx = idx
    this.audioState.playing = false
    this.callPlay()

    console.log(this.audioState);
  }
  setRange(val:number){
    this.audioState.rangeValue = val


  }
  setCurrentTime(duration:number){
    this.audioState.currentTime = duration
    const str = this.timeService.secondsToString(duration)
    this.audioState.timeLeft = str;
    this.audioState.currentTime = duration
  }
}
