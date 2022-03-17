import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatExpansionModule} from '@angular/material/expansion';

const MatComponents = [
  MatProgressSpinnerModule,
  MatIconModule,
  MatButtonModule,
  MatExpansionModule,
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
