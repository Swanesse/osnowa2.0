import {ChangeDetectorRef, Component, EventEmitter, NgZone, Output} from '@angular/core';
import {icon, latLng, marker, tileLayer, Layer, Map, Marker, point, polyline} from 'leaflet';
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
  catchClicks: boolean = true;

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
    center: latLng([50.0537961783603, 19.93534952402115])
  };

  constructor(private zone: NgZone, private _mapService: MapService, private cdr: ChangeDetectorRef) {
    this._mapService.listen().subscribe((m: any) => {
      this.catchClicks = m;
      this.cdr.detectChanges();
    });

    this._mapService.listen2().subscribe((e: any) => {
      this.displayPoint(e);
    });
  }

  displayPoint(e) {
    const newPoint = marker([e[0], e[1]], {
      icon: this.createIcon()
    });

    this.map.addLayer(newPoint);
    this.markers.push(newPoint);
    this.map.setView(latLng([e[0], e[1]]), 19);
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

  getCrosshair() {
    if (this.catchClicks === false) {
      return 'crosshair';
    } else if (this.catchClicks) {
      return 'move';
    }
  }

  onMapReady(map: Map) {
    this.map = map;

    this.map.on('moveend', this.updateMarkers.bind(this));
    this.map.on('zoomend', this.updateMarkers.bind(this));
    this.map.on('click', this.updateMarkers.bind(this));

    this.updateMarkers();

    this.map.on('click', (e: any) => {
      if (!this.catchClicks) {
        const newPoint = marker([e.latlng.lat, e.latlng.lng], {
          icon: this.createIcon()
        });

        this.map.addLayer(newPoint);
        this.markers.push(newPoint);
        map.setView(latLng([e.latlng.lat, e.latlng.lng + 0.00037]), 19);

        this.catchClicks = true;
        const tab = [true, e.latlng.lat, e.latlng.lng];
        this._mapService.filter(tab);
      }
    });
  }
}
