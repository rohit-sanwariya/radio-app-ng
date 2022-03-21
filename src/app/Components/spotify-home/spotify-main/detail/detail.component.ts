import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TimeFormattingService } from 'src/app/Services/time-formatting.service';
import { SpotifyService } from '../../Services/spotify.service';
import {MatSort, Sort} from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router  } from '@angular/router';
import { AudioPlayerService } from 'src/app/Services/audio-player.service';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit,AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'popularity','Preview Available', 'duration'];
  tracks!:any;
  dataSource = new MatTableDataSource( );
  info!:any
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private route:ActivatedRoute,private _liveAnnouncer: LiveAnnouncer,
    private router:Router,
    private audioService:AudioPlayerService, private spotifyService:SpotifyService,private timeService:TimeFormattingService) { }
  ngAfterViewInit() {
   if(this.tracks){
    this.tracks.sort = this.sort;
   }
  }
  ngOnInit(): void {


      const id = this.route.snapshot.params['id'];
      if(this.router.url.split('/').includes('artist')){
        this.spotifyService.getArtistInformation(id)
        console.log('artist route');

      }
      else if (this.router.url.split('/').includes('album')){
        console.log('album route');
        this.spotifyService.getAlbumInforamtion(id);

      }

    this.spotifyService.getArtistContent().info.subscribe((val)=>{
      this.info = val
      if(!this.info){
        console.log('hello');

      }

    })
    this.spotifyService.getArtistContent().tracks.subscribe((val:any)=>{
      this.tracks = val
      this.dataSource = new MatTableDataSource(val)



    })
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  selected(val:any){
      this.audioService.setAudio(val)

  }


}
