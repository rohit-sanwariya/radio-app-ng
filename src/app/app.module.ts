import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http'
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AudioPlayerComponent } from './Components/audio-player/audio-player.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './modules/angular-material/angular-material.module';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { MainContentComponent } from './Components/main-content/main-content.component';


@NgModule({
  declarations: [
    AppComponent,
    AudioPlayerComponent,
    NavbarComponent,
    MainContentComponent,


  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
