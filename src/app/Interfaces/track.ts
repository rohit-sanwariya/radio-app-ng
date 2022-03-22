export interface Track {
   idx: number,
   playedAt: string,
   artistName: string,
   artistId: string,
   artistURI: string,
   id: string,
   duration: number|string,
   uri: string,
   previewURL: string,
   name: string,
   albumId: string,
   albumName: string,
   albumImg: string,
   albumURI: string,
   pfw: string,
  popularity:number,
}

export class TrackModal {

  constructor(
    public idx: number,
    public playedAt: string,
    public artistName: string,
    public artistId: string,
    public artistURI: string,
    public id: string,
    public duration: number|string,
    public uri: string,
    public previewURL: string,
    public name: string,
    public albumId: string,
    public albumName: string,
    public albumImg: string,
    public albumURI: string,
    public pfw: string,
    public popularity:number,
  ) {

  }
}
