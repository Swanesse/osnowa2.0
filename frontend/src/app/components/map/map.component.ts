import {Component, EventEmitter, NgZone, Output} from '@angular/core';
import {circle, icon, latLng, marker, polygon, tileLayer, Layer, Map, Marker, point, polyline} from 'leaflet';
import {MapService} from '../../services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent {
  @Output() myEvent: EventEmitter<any> = new EventEmitter();

  layers: Layer[] = [];
  map: Map;
  catchClicks;
  ifEvent: boolean;

  // tablica ze znacznikami
  markers: Marker[] = [
    marker([50.06585, 19.92022], {
      icon: this.createIcon()
    }),
    marker([50.06585, 19.92522], {
      icon: this.createIcon()
    }),
    marker([50.06585, 19.93022], {
      icon: this.createIcon()
    }),
    marker([50.06585, 19.93522], {
      icon: this.createIcon()
    }),
    marker([50.06585, 19.94022], {
      icon: this.createIcon()
    })
  ];

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }),
    ],
    zoom: 16,
    center: latLng([50.06585, 19.92022])
  };

  constructor(private zone: NgZone, private _mapService: MapService) {
    this._mapService.listen().subscribe((m: any) => {
      this.catchClicks = m;
      console.log(m);
      this.dziwnaFunkcja(m);
    });

  }

  dziwnaFunkcja(event) {
    // console.log('Fire onFilterClicked: ', event);
    console.log('11111111111122122122212event: ', event);

    if (event === false) {




    }

  }

  // Funkcja używana do tworzenia znaczników
  createIcon() {
    return icon({
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      iconUrl: 'assets/podstawowa_wysokosciowa.png',
      popupAnchor: [0, -28],
    });
  }

  updateMarkers() {
    // odfiltrowuje się wszystkie znaczniki, które nie znajdują się w bieżących granicach widoku mapy
    // następnie ustawia wynikową kolekcję znaczników jako nowy zestaw warstw mapy.
    this.zone.run(() => {
      this.layers = this.markers.filter((m: Marker) => this.map.getBounds().contains(m.getLatLng()));
    });
  }

  onMapReady(map: Map) {
    console.log('onMapReady');
    this.map = map;

    this.map.on('moveend', this.updateMarkers.bind(this));
    this.map.on('zoomend', this.updateMarkers.bind(this));

    this.updateMarkers();

    this.map.on('click',  (e:any) => {
      if(!this.catchClicks){
        console.log('MMMMMMMwspółrzędne: ', e.latlng);
        console.log('event: ', event);
        this.catchClicks = true;
        console.log('this.catchClicks: ', this.catchClicks);
        let tab = [true, e.latlng.lat, e.latlng.lng];
        this._mapService.filter(tab);
        }
      });

    // this.map.on('click', function (e) {
    //   console.log('współrzędne: ', e.latlng);
      // let markerer = new L.Marker(e.latlng, {draggable:true});
      // map.addLayer(markerer);
      // this.markers.push(markerer);
      // let longMarker = markers.length;
      // let test = new Array();

      // create a red polyline from an array of LatLng points
      // if (this.markers.length > 1 ){
      //   for (i = 0; i < markers.length; i++) {
      //     test.push(markers[i].getLatLng()) ;
      //   }
      //   var polyline = L.polyline(test, {color: 'red', clickable: 'true'}).addTo(map);
      // }
    // });


  }

}
