import { AfterViewInit, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { RadioList, SongList } from 'src/assets/Songs';
import { SpotifyService } from '../Components/spotify-home/Services/spotify.service';
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
  currentContentSubject = new Subject()
  currentContent:any = []
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
    cover:'',

  }




  constructor(private timeService:TimeFormattingService,private router:Router) {



   }
  ngAfterViewInit(): void {


  }
  ngOnInit(): void {
    console.log(this.router.url);


  }

  setCurrentContentSubject(content:any){
    this.currentContentSubject.next(content)
    this.currentContent = content

  }
  getcurrentContentSubject(){
    return this.currentContentSubject.asObservable()
  }
  setAudio(track:any ){
    this.audioState.currentIdx = track.idx
    this.audioState.src = track.previewURL
    this.audioState.title = track.name
    this.audioState.duration = track.duration
    this.audioState.artist = track.artistName
    this.audioState.pfw = track.pfw
    this.audioState.cover = track.albumImg
   if(this.audioState.src === '' || this.audioState.src === null ){
      return
   }

    const showMusic = this.audioState.currentIdx !== 0
    if(!showMusic){


      this.currentContentSubject.next(this.songList)
    }

   if(this.audioState.pfw !=="Recently Played"  ){

    this.callPlay(true)
   }


   else if(this.audioState.pfw ==="Recently Played" && this.audioState.currentIdx !== this.findIdxFirstPlayable()){
     this.callPlay(true)
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
  callPlay(autoplay:boolean){

    this.subject.next(autoplay)
  }
  playSpotify(){

  }
  setIsPlaying(playing:boolean){
    this.audioState.playing = playing
  }
  play(audio:any,playedFrom:string){

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
    console.log(this.currentContent,'hell');

    if(this.audioState.AudioType){
      const track = {

        previewURL:SongList[this.audioState.currentIdx].src,
        name:SongList[this.audioState.currentIdx].title,
        duration:0,
        artistName:SongList[this.audioState.currentIdx].artist,
        pfw:"Home",
        audioType:true,
      }
      this.setAudio(track)

      if(this.audioState.playing){
        audio.autoplay = true
      }
    }
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
    if(!type){
      this.currentContent = this.radioList
    }
    else if(type){
      this.currentContent = this.songList
    }
  }
  setArtist(artist:string){
    this.audioState.artist = artist
  }
  setIdx(idx:number){
    this.audioState.currentIdx = idx
    this.audioState.playing = false
    this.callPlay(false)


  }
  findIdxFirstPlayable(){
    const currentTrack = this.currentContent.find((track:any)=>track.previewURL !== null)
    const idx = this.currentContent.findIndex((track:any)=>track.previewURL !== null)
    return idx




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
