import { Component, Renderer2, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { fromEvent, interval, takeUntil } from 'rxjs';
import { AudioPlayerService } from 'src/app/Services/audio-player.service';
import { TimeFormattingService } from 'src/app/Services/time-formatting.service';
import { RadioList, SongList } from 'src/assets/Songs';
 
@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],

})
export class AudioPlayerComponent implements OnInit, AfterViewInit {
  timerFun: any
  @ViewChild('audioElement', { static: true })
  private audioElement!: ElementRef;
  rangeVal:number = 0
  volRange:number = 50
  idx:number = 0
  showVR:boolean= false
  audioList = [SongList,RadioList]
  constructor(private renderer: Renderer2, public service: AudioPlayerService, private timeService: TimeFormattingService) {


  }
  ngAfterViewInit(): void {
    this.renderer.listen(this.audioElement.nativeElement, 'play', (event) => {
      // this.service.setCurrentTime(this.audioElement.nativeElement.currentTime)

    })
    this.renderer.listen(this.audioElement.nativeElement, 'pause', (event) => {
      // this.service.setCurrentTime(this.audioElement.nativeElement.currentTime)

    })
    this.renderer.listen(this.audioElement.nativeElement, 'playing', (event) => {
      this.service.setCurrentTime(this.audioElement.nativeElement.currentTime)
      const source = interval(1000);
      const playingAudio = fromEvent(this.audioElement.nativeElement, 'playing');
      const result = source.pipe(takeUntil(playingAudio));
     result.subscribe(
       ()=>{
         this.service.setCurrentTime(this.audioElement.nativeElement.currentTime)

       }
     )




    })
    this.audioElement.nativeElement.onloadedmetadata = () => {
      this.service.setDuration(this.audioElement.nativeElement.duration)


      this.service.setCurrentTime(this.audioElement.nativeElement.currentTime)
    }

  }

  ngOnInit(): void {
    this.service.getSubject().subscribe((val)=>{
      this.playSong()
      console.log(val);

    })
  }

  showVolumeRange(){
    this.showVR = !this.showVR



  }
  onVolSroll(event: any){
    this.volRange = event.target.value
    console.log(this.volRange);

    this.audioElement.nativeElement.volume = event.target.value/100

  }
  get ShowVolumeState(){
    return this.showVR
  }
  get range():number{
    this.service.getState().subscribe((state)=>{
      this.rangeVal = Math.floor(state.currentTime/state.duration*100)

    })
   return this.rangeVal
  }
  get getIdx():number{

    this.service.getState().subscribe((state)=>{
      this.idx = state.currentIdx
    })
    return this.idx
  }

  get isPlaying(): boolean {
    let iconPlayState = false
    this.service.getState().subscribe((state) => {
      iconPlayState = state.playing
    })
    return iconPlayState
  }
  get timeLeft(): string {
    return this.timeService.secondsToString(this.audioElement.nativeElement.currentTime)
  }
  get timeRight(): string {
    return this.timeService.secondsToString(this.audioElement.nativeElement.duration)
  }
  get audioType(){
    let t = 0
   this.service.getState().subscribe((state)=>{
        state.AudioType ? t =0:t=1
    })
    return t
  }
  playSong() {
    this.service.play(this.audioElement.nativeElement)
    this.service.getState().subscribe((state) => {


    });

  }
  playNext(){
     this.audioList[this.audioType][this.getIdx].src
    this.service.playNext(this.audioElement.nativeElement)

  }
  playPrevious(){
    this.service.playPrevious()
  }
  replay30(){

    this.audioElement.nativeElement.currentTime -=30
    this.service.setCurrentTime(this.audioElement.nativeElement.currentTime)
  }
  forward30(){

    this.audioElement.nativeElement.currentTime +=30
    this.service.setCurrentTime(this.audioElement.nativeElement.currentTime)
  }
  onSlide(event: any) {

      const rangeVal = event.target.value
      const currentVal = (this.audioElement.nativeElement.duration * rangeVal)/100
      this.service.setCurrentTime(currentVal)
      this.audioElement.nativeElement.currentTime = currentVal





  }

}
