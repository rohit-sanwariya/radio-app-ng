import { Component, Renderer2, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AudioPlayerService } from 'src/app/Services/audio-player.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit, AfterViewInit {
  timerFun: any
  @ViewChild('audioElement', { static: true })
  private audioElement!: ElementRef;
  durationAudio: string = ''
  currentPlayTime: string = '00:00'
  isPlaying: boolean = false
  constructor(private renderer: Renderer2,private service : AudioPlayerService) {
    console.log(this.isPlaying);

  }
  ngAfterViewInit(): void {
    this.audioElement.nativeElement.onloadedmetadata = () => {
      const duration = this.audioElement.nativeElement.duration
      const min = Math.floor(duration / 60)
      const sec = Math.floor(duration - min * 60)
      this.durationAudio = `${min}:${sec}`


    }

  }

  ngOnInit(): void {

  }
  playSong() {
    this.service.play(this.audioElement.nativeElement)
    // this.isPlaying = !this.isPlaying
    // if (this.isPlaying) {
    //   const timeArr = this.currentPlayTime.split(':')
    //   const durArr = this.durationAudio.split(':')
    //   let upperMin = Number(durArr[0])
    //   let upperSec = Number(durArr[0])
    //   let min = Number(timeArr[0])
    //   let sec = Number(timeArr[1])
    //   let hour = 0
    //   const timer = 60
    //   this.timerFun = setInterval(() => {


    //     if (sec < timer) {
    //       sec++
    //     }
    //     else {
    //       sec = 0
    //       if (min < timer && min < upperMin) {
    //         min++
    //       }
    //       else {
    //         min = 0
    //         hour++
    //       }
    //     }
    //     this.currentPlayTime = `00:0${min}:${sec}`
    //     console.log(hour, min, sec);
    //   }, 1000);
    //   this.audioElement.nativeElement.play()
    // }
    // else {
    //   this.audioElement.nativeElement.pause()
    //   clearInterval(this.timerFun)
    // }

  }
  onSlide(event: any) {
    console.log(event.target.value);
  }

}
