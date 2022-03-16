import { NgModule } from '@angular/core';

import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'
import {MatInputModule} from '@angular/material/input'
import {MatSliderModule} from '@angular/material/slider'
import {MatCardModule} from '@angular/material/card'
import {MatListModule} from '@angular/material/list'
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatTabsModule} from '@angular/material/tabs'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

const MatComponents = [
  MatProgressSpinnerModule,
  MatIconModule,
  MatSliderModule,
  MatButtonModule,
  MatListModule,
  MatSliderModule,
  MatInputModule,
  MatToolbarModule,
  MatCardModule,
  MatTabsModule,


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
