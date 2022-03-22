import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeFormattingService {

  constructor() { }

  secondsToString(duration: number): string {
    let durationAudio = ''
      // console.log(duration);


      const min = Math.floor(duration / 60)
      const sec = '00000' + Math.floor(duration - min * 60).toString()
      const lenSec = sec.length
      const lenMin = ('00000' + min.toString()).length


      durationAudio = `${('00000' + min.toString()).slice(lenMin - 2, lenMin)}:${sec.slice(lenSec - 2, lenSec)}`

    return isFinite(duration)?durationAudio:''
  }
}
