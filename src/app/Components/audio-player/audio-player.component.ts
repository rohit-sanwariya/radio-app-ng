import { Component, Renderer2, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { fromEvent, interval, Observable, takeUntil } from 'rxjs';

import { AudioState } from 'src/app/Interfaces/audio-state';
import { AudioPlayerService } from 'src/app/Services/audio-player.service';
import { TimeFormattingService } from 'src/app/Services/time-formatting.service';
import { RadioList, SongList } from 'src/assets/Songs';
import { SpotifyService } from '../spotify-home/Services/spotify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],

})
export class AudioPlayerComponent implements OnInit, AfterViewInit {
  timerFun: any
  @ViewChild('audioElement', { static: true })
  private audioElement!: ElementRef;
  state$!: Observable<AudioState>;
  currentContent:any = []
  rangeVal: number = 0
  volRange: number = 50
  idx: number = 0
  showVR: boolean = false
  audioList = [SongList, RadioList]
  constructor(private router: Router,

              private renderer: Renderer2,
              public service: AudioPlayerService,
              private spotifyService: SpotifyService,
              private timeService: TimeFormattingService)
               {
    this.state$ = this.service.getState()

  }

  ngAfterViewInit(): void {

    this.renderer.listen(this.audioElement.nativeElement, 'play', (event) => {
      // this.service.setCurrentTime(this.audioElement.nativeElement.currentTime)

    })
    this.renderer.listen(this.audioElement.nativeElement, 'ended', (event) => {
      console.log(this.currentContent);
      const currentSongSrc = this.audioElement.nativeElement.src
      let currentTrackIdx = this.currentContent.findIndex((track:any)=>track.previewURL===currentSongSrc)+1



      if(this.currentContent[currentTrackIdx].previewURL !== null ){
        this.audioElement.nativeElement.autoplay = true
      this.service.setIsPlaying(true)
      this.service.setIdx(currentTrackIdx)
        this.spotifyService.setCurrentTrack(this.currentContent[currentTrackIdx],true)
      }
      else{
        this.audioElement.nativeElement.autoplay = false
        this.service.setIsPlaying(false)
      }




    })
    this.renderer.listen(this.audioElement.nativeElement, 'playing', (event) => {
      this.service.setCurrentTime(this.audioElement.nativeElement.currentTime)
      const source = interval(1000);
      const playingAudio = fromEvent(this.audioElement.nativeElement, 'playing');
      const result = source.pipe(takeUntil(playingAudio));
      result.subscribe(
        () => {
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
      // console.log(this.audioType);

    const onHome = this.router.url==='/'
    if(onHome){
      const track = {
        previewURL:SongList[0].src,
        name:SongList[0].title,
        duration:0,
        artistName:SongList[0].artist,
        pfw:"Home",
      }
      // console.log(track);

      this.service.setAudio(track)
    }


    this.spotifyService.getPlaylist().subscribe((playlist) => {
     this.currentContent = playlist
     this.service.setCurrentContentSubject(this.currentContent)

    })
    this.service.getSubject().subscribe((val) => {
      this.audioElement.nativeElement.autoplay = true
      this.playSong('fromList')
    })
    this.service.getSongList().subscribe((songs: any) => {
      if (songs.length > 0) {
        this.audioList[0] = songs
      }
    })
  }

  showVolumeRange() {
    this.showVR = !this.showVR
  }

  onVolSroll(event: any) {
    this.volRange = event.target.value
    console.log(this.volRange);
    this.audioElement.nativeElement.volume = event.target.value / 100
  }


  get range(): number {
    this.service.getState().subscribe((state) => {
      this.rangeVal = Math.floor(state.currentTime / state.duration * 100)

    })
    return this.rangeVal
  }
  get getIdx(): number {
    this.service.getState().subscribe((state) => {
      this.idx = state.currentIdx
    })
    return this.idx
  }




  get audioType() {
    let t = 0
    this.service.getState().subscribe((state) => {
      state.AudioType ? t = 0 : t = 1
    })
    return t
  }
  updateArtist() {
    if (this.audioType == 0) {
      this.service.setArtist(Object.entries(this.audioList[0][this.getIdx])[2][1])
    }
    else {
      this.service.setArtist('')
    }
  }

  playSong(playedFrom: string) {
    this.service.play(this.audioElement.nativeElement, playedFrom)
  }
  playNext() {
    console.log(this.audioType);

    this.audioList[this.audioType][this.getIdx].src
    this.service.playNext(this.audioElement.nativeElement)
  }
  playPrevious() {
    this.service.playPrevious()
  }
  replay30() {

    this.audioElement.nativeElement.currentTime -= 30
    this.service.setCurrentTime(this.audioElement.nativeElement.currentTime)
  }
  forward30() {

    this.audioElement.nativeElement.currentTime += 30
    this.service.setCurrentTime(this.audioElement.nativeElement.currentTime)
  }
  onSlide(event: any) {

    const rangeVal = event.target.value
    const currentVal = (this.audioElement.nativeElement.duration * rangeVal) / 100
    this.service.setCurrentTime(currentVal)
    this.audioElement.nativeElement.currentTime = currentVal
  }

}
