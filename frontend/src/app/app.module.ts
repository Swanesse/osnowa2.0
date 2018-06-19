import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';


import {AppComponent} from './app.component';
import {PointDetailsComponent} from './components/point-details/point-details.component';
import {AppRoutingModule} from "./app.routing.module";
import {HomeComponent} from './components/home/home.component';
import {MapComponent} from './components/map/map.component';
import {HeaderComponent} from './components/header/header.component';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatInputModule,
  MatIconModule,
  MatFormFieldModule,
  MatDialogModule,
  MatSelectModule, MatRadioModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {ReactiveFormsModule} from "@angular/forms";
import {FormsModule} from "@angular/forms";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TextMaskModule } from 'angular2-text-mask';
import proj4 from "proj4";
import {MapService} from "./services/map.service";
// import * as proj4 from "proj4";
// import * as proj4 from 'proj4';
// import {proj4} from 'proj4';


@NgModule({
  declarations: [
    AppComponent,
    PointDetailsComponent,
    HomeComponent,
    MapComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule.forRoot(),
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    TextMaskModule,
    MatRadioModule,
    NgxMatSelectSearchModule,
  ],
  providers: [MapService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
