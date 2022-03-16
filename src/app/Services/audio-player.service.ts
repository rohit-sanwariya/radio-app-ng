import { AfterViewInit, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { RadioList, SongList } from 'src/assets/Songs';
import { AudioState } from '../Interfaces/audio-state';
import { TimeFormattingService } from './time-formatting.service';

@Injectable({
  providedIn: 'root'
})

export class AudioPlayerService implements OnInit,AfterViewInit {
  audio = new Audio()
  private  subject = new Subject()
  private songListSubject = new BehaviorSubject([])
  radioList = RadioList
  songList = SongList
  audioState:AudioState = {
    title:'',
    playing:false,
    duration:0,
    rangeValue:0,
    currentTime:0,
    timeLeft:'00:00',
    timeRight:'00:00',
    currentIdx:0,
    AudioType:true,
    artist:'',
    src:'',
    pfw:'',
  }




  constructor(private timeService:TimeFormattingService) {

   }
  ngAfterViewInit(): void {


  }
  ngOnInit(): void {

  }


  setAudio(track:any){
    console.log(track.previewURL);

    this.audioState.src = track.previewURL
    this.audioState.title = track.name
    this.audioState.duration = track.duration
    this.audioState.artist = track.artistName
    this.audioState.pfw = track.pfw
   if(this.audioState.src === '' || this.audioState.src === null ){
      return
   }
   if(this.audioState.pfw !=="Recently Played"){
   
    this.callPlay()
   }

  }
  setSongList(songs:any){
    this.songListSubject.next(songs)
  }
  getSongList(){
    return this.songListSubject.asObservable()
  }

  getSubject(){
    return this.subject.asObservable()
  }
  callPlay(){
    this.subject.next(null)
  }
  playSpotify(){

  }

  play(audio:any,playedFrom:string){
    console.log(playedFrom,audio);
   if(playedFrom=='fromPlayer'){
    this.audioState.playing ? audio.pause():audio.play();
    this.audioState.playing = !this.audioState.playing;
   }
   else{
    this.audioState.playing = true
    audio.autoplay = true
     audio.play()
   }
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
  setArtist(artist:string){
    this.audioState.artist = artist
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
