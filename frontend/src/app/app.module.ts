import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';


import {AppComponent} from './app.component';
// import {PointDetailsComponent} from './components/point-details/point-details.component';
// import {AppRoutingModule} from "./app.routing.module";
// import {HomeComponent} from './components/home/home.component';
import {MapComponent} from './components/map/map.component';
import {HeaderComponent} from './components/header/header.component';
import {MatButtonModule, MatCheckboxModule, MatInputModule, MatIconModule, MatFormFieldModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    // PointDetailsComponent,
    // HomeComponent,
    MapComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    // AppRoutingModule,
    LeafletModule.forRoot(),
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatFormFieldModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
