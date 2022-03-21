import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';

const MatComponents = [
  MatProgressSpinnerModule,
  MatIconModule,
  MatButtonModule,
  MatTableModule,
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
