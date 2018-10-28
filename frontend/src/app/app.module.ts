import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';


import {AppComponent} from './app.component';
import {PointAddComponent} from './components/point-add/point-add.component';
import {AppRoutingModule} from './app.routing.module';
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
  MatSelectModule,
  MatRadioModule,
  MatBadgeModule,
  MatTooltipModule,
  MatMenuModule,
  MatExpansionModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {ReactiveFormsModule} from '@angular/forms';
import {FormsModule} from '@angular/forms';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {TextMaskModule} from 'angular2-text-mask';
import {MapService} from './services/map.service';
import {HttpClientModule} from '@angular/common/http';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {PointDetailComponent} from "./components/point-detail/point-detail.component";
import {PointResolveService} from "./services/point-resolve.service";
// import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
// import {InMemoryDataService} from "./services/in-memory-data-service";
// import {HttpService} from "./services/http.service";
import { NgxGalleryModule } from 'ngx-gallery';
import {PhotosAddComponent} from "./components/photos-add/photos-add.component";
import {PointEditComponent} from "./components/point-edit/point-edit.component";
import {SidePanelHeaderComponent} from "./components/side-panel-header/side-panel-header.component";
import {PhotosDisplayComponent} from "./components/photos-display/photos-display.component";
import {ChooseCoordinatesComponent} from "./components/choose-coordinates/choose-coordinates.component";
import {ChooseLocalCoordinatesComponent} from "./components/choose-local-coordinates/choose-local-coordinates.component";



@NgModule({
  declarations: [
    AppComponent,
    PointAddComponent,
    PointDetailComponent,
    HomeComponent,
    MapComponent,
    HeaderComponent,
    PhotosAddComponent,
    PointEditComponent,
    SidePanelHeaderComponent,
    PhotosDisplayComponent,
    ChooseCoordinatesComponent,
    ChooseLocalCoordinatesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule.forRoot(),
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    MatBadgeModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatSelectModule,
    MatMenuModule,
    MatExpansionModule,
    ReactiveFormsModule,
    FormsModule,
    TextMaskModule,
    MatRadioModule,
    NgxMatSelectSearchModule,
    HttpClientModule,
    FontAwesomeModule,
    NgxGalleryModule,
    // InMemoryWebApiModule.forRoot(InMemoryDataService, {delay: 2500}),

  ],
  providers: [MapService, PointResolveService],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {
}
