import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

const MatComponents = [
  MatProgressSpinnerModule,
  MatIconModule,
  MatButtonModule,
  MatTableModule,
  MatSortModule,
]
@NgModule({

  imports: [
    MatComponents
  ],
  exports:[
    MatComponents
  ]
})
export class AngularMaterialModule { }
