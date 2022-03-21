export interface Track {
  idx: number,
  playedAt: string,
  artistName: string,
  artistId: string,
  artistURI: string,
  id: string,
  duration: number,
  uri: string,
  previewURL: string,
  name: string,
  albumId: string,
  albumName: string,
  albumImg: string,
  albumURI: string,
  pfw: string,

}

export class TrackModal {

  constructor(
    private idx: number,
    private playedAt: string,
    private artistName: string,
    private artistId: string,
    private artistURI: string,
    private id: string,
    private duration: number|string,
    private uri: string,
    private previewURL: string,
    private name: string,
    private albumId: string,
    private albumName: string,
    private albumImg: string,
    private albumURI: string,
    private pfw: string,
    private popularity:number,
  ) {

  }
}
