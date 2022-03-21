import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http'
import { AppComponent } from './app.component';

import { AudioPlayerComponent } from './Components/audio-player/audio-player.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './modules/angular-material/angular-material.module';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { MainContentComponent } from './Components/main-content/main-content.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './Components/home/home.component';
import { SpotifyHomeComponent } from './Components/spotify-home/spotify-home.component';
import { AuthGuard } from './Guards/auth.guard';
import { SpotifyMainComponent } from './Components/spotify-home/spotify-main/spotify-main.component';
import { SpotifySidebarComponent } from './Components/spotify-home/spotify-main/spotify-sidebar/spotify-sidebar.component';
import { SpotifyContentComponent } from './Components/spotify-home/spotify-main/spotify-content/spotify-content.component';
import { DetailComponent } from './Components/spotify-home/spotify-main/detail/detail.component';

const routes:Routes = [
  {path:'',component:HomeComponent },
  {path:'spotify',component:SpotifyHomeComponent,canActivate:[AuthGuard],children:[
    {path:'',component:SpotifyContentComponent},
    {path:'details/artist/:id',component:DetailComponent},
    {path:'details/album/:id',component:DetailComponent},
  ]},
]

@NgModule({
  declarations: [
    AppComponent,
    AudioPlayerComponent,
    NavbarComponent,
    MainContentComponent,
    HomeComponent,
    SpotifyHomeComponent,
    SpotifyMainComponent,
    SpotifySidebarComponent,
    SpotifyContentComponent,
    DetailComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
