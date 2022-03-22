import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { RadioList } from 'src/assets/Songs';
import { TrackContainerDataSource, TrackContainerItem } from './track-container-datasource';

@Component({
  selector: 'app-track-container',
  templateUrl: './track-container.component.html',
  styleUrls: ['./track-container.component.scss']
})
export class TrackContainerComponent implements AfterViewInit,OnChanges {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TrackContainerItem>;
   dataSource: TrackContainerDataSource;
   @Input() data!:TrackContainerItem[]

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['title', 'artist'];

  constructor() {
    this.dataSource = new TrackContainerDataSource();
    console.log(this.data);

    if(this.data){
      this.dataSource.data = this.data
    }


  }
  ngOnChanges(changes: SimpleChanges): void {
   console.log(changes);

  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
