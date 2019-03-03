import {Component, EventEmitter, NgZone, Output} from '@angular/core';
import {icon, latLng, marker, tileLayer, Layer, Map, Marker, LayerGroup} from 'leaflet';
import {MapService} from '../../services/map.service';
import {HttpService} from "../../services/http.service";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  Event,
  ActivatedRoute
} from "@angular/router";
import {PointMarker} from "../../models/PointMarker";
import {interval} from 'rxjs';
import "rxjs/Rx";

import * as L from 'leaflet';
import 'leaflet.markercluster';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent {
  @Output() myEvent: EventEmitter<any> = new EventEmitter();

  //layers[0] - punkty z bazy danych, layers[1] - niebieski znacznik lokalizacji, layers[2] - nowo dodawany punkt
  layers: Layer[] = [new LayerGroup(), new LayerGroup(), new LayerGroup()];
  map: Map;
  pickMode: boolean = false;
  pointIcon: string = 'assets/point.png';
  isLoading = false;
  latitude;
  longitude;
  editCoordinates;
  pointId = null;

  // tablica ze znacznikami
  pointMarkers: PointMarker[] = [];

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }),
    ],
    zoom: 16,
    // Ustawia punkt widoczny na początku - po wejściu na mapę
    center: latLng([50.0537961783603, 19.93534952402115])
  };

  markerClusterData: any[] = [];
  markerClusterOptions: L.MarkerClusterGroupOptions;

  constructor(private zone: NgZone,
              private mapService: MapService,
              private httpService: HttpService,
              private router: Router,
              private route: ActivatedRoute,) {
    router.events.subscribe((routerEvent: Event) => {
      this.checkEvent(routerEvent);
    });

    // Prześle z PANELU PUNKTU informację i ustawiamy, że jesteśmy w trybie pobierania kliknięć
    this.mapService.getTurningOnPickMode().subscribe(() => {
      this.pickMode = true;
    });

    // Prześle z PANELU PUNKTU zmienione współrzędne i wrzuci je do funkcji displayPoint()
    this.mapService.getChangeCords().subscribe((cords: Array<number>) => {
      this.displayPoint(cords);
    });

    this.mapService.getPoint().subscribe((pointId) => {
      this.pointId = pointId;
      for (let pointMarker of this.pointMarkers) {
        if (pointMarker.id.toString() == pointId.toString()) {
          pointMarker.marker.options.icon.options.iconUrl = 'assets/transparent.png';
        }
      }
    });

    this.mapService.getDeleteEditPoint().subscribe((pointId) => {
      this.pointMarkers = this.pointMarkers.filter(marker => marker.id != pointId);
    });

    this.mapService.getNewPoint().subscribe(() => {
      this.layers[2] = new LayerGroup();
    });

    this.mapService.getOldIcon().subscribe((point: any) => {
      this.pointId = null;
      for (let pointMarker of this.pointMarkers) {
        if (pointMarker.id.toString() == point.id.toString()) {


          if (point.controlType === 'pozioma' && (point.controlClass === '1' || point.controlClass === '2')) {
            console.log('point, point, point: ', point);
            pointMarker.marker.options.icon.options.iconUrl = 'assets/podstawowa_pozioma.png';

          } else if (point.controlType === 'wysokosciowa' && (point.controlClass === '1' || point.controlClass === '2')) {

            pointMarker.marker.options.icon.options.iconUrl = 'assets/podstawowa_wysokosciowa.png';
          } else if (point.controlType === 'dwufunkcyjna' && (point.controlClass === '1' || point.controlClass === '2')) {
            this.route.params.subscribe(params => {

              pointMarker.marker.options.icon.options.iconUrl = 'assets/podstawowa_xyh.png';
            });
          } else if (point.controlType === 'pozioma' && point.controlClass === '3') {
            this.route.params.subscribe(params => {

              pointMarker.marker.options.icon.options.iconUrl = 'assets/szczegolowa_pozioma.png';
            });
          } else if (point.controlType === 'wysokosciowa' && point.controlClass === '3') {
            pointMarker.marker.options.icon.options.iconUrl = 'assets/szczegolowa_wysokosciowa.png';
          } else if (point.controlType === 'dwufunkcyjna' && point.controlClass === '3') {
            pointMarker.marker.options.icon.options.iconUrl = 'assets/szczegolowa_xyh.png';
          } else {
            pointMarker.marker.options.icon.options.iconUrl = 'assets/point.png';
          }

        }
      }
      this.displayPoints();
      this.layers[2] = new LayerGroup();
    });


    this.mapService.getMapView().subscribe((cords: Array<number>) => {
      if (this.map == undefined) {
        this.editCoordinates = [cords[1], cords[0]];

      } else {
        this.map.setView(latLng([cords[1], cords[0]]), 19);
      }
    });

    // Prześle z PANELU PUNKTU informację o zmianie klasy i zmieni ikonkę w pointIcon na MAPIE
    this.mapService.setIcon().subscribe(icon => {
      this.pointIcon = icon.toString();
    });
  }

  checkEvent(routerEvent: Event): void {
    if (routerEvent instanceof NavigationStart) {
      this.isLoading = true;
    }

    else if (routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError) {
      this.isLoading = false;
    }
  }

  // Funkcja używana do tworzenia znaczników
  createIcon() {
    return icon({
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      iconUrl: this.pointIcon,
      popupAnchor: [0, -28],
    });
  }

  getAndDisplayPointsFromDB() {
    let north = this.map.getBounds().getNorth();
    let south = this.map.getBounds().getSouth();
    let east = this.map.getBounds().getEast();
    let west = this.map.getBounds().getWest();

    this.httpService.viewPoints(north, south, east, west).subscribe(pointsFromDBInBounds => {
      pointsFromDB:

        for (let onePointFromDB of pointsFromDBInBounds) {
          for (let pointMarker of this.pointMarkers) {
            if (onePointFromDB.id === pointMarker.id) {
              continue pointsFromDB;
            }
          }

          if (onePointFromDB.controlType === 'pozioma' && (onePointFromDB.controlClass === '1' || onePointFromDB.controlClass === '2')) {
            this.pointIcon = 'assets/podstawowa_pozioma.png';
          } else if (onePointFromDB.controlType === 'wysokosciowa' && (onePointFromDB.controlClass === '1' || onePointFromDB.controlClass === '2')) {
            this.pointIcon = 'assets/podstawowa_wysokosciowa.png';
          } else if (onePointFromDB.controlType === 'dwufunkcyjna' && (onePointFromDB.controlClass === '1' || onePointFromDB.controlClass === '2')) {
            this.pointIcon = 'assets/podstawowa_xyh.png';
          } else if (onePointFromDB.controlType === 'pozioma' && onePointFromDB.controlClass === '3') {
            this.pointIcon = 'assets/szczegolowa_pozioma.png';
          } else if (onePointFromDB.controlType === 'wysokosciowa' && onePointFromDB.controlClass === '3') {
            this.pointIcon = 'assets/szczegolowa_wysokosciowa.png';
          } else if (onePointFromDB.controlType === 'dwufunkcyjna' && onePointFromDB.controlClass === '3') {
            this.pointIcon = 'assets/szczegolowa_xyh.png';
          } else {
            this.pointIcon = 'assets/point.png';
          }

          const newPoint = marker([onePointFromDB.Y_WGS84, onePointFromDB.X_WGS84], {
            icon: this.createIcon(),
            clickable: true,
          })
            .on('click', () => {
              // alert("I have a click." + value.Y_WGS84);
              this.zone.run(() => {

                this.router.navigate(['home/detail/' + onePointFromDB.id]).then(() => {
                });
              });
            });
          const pointMarker: PointMarker = new PointMarker(onePointFromDB.id, newPoint);
          this.pointMarkers.push(pointMarker);
        }

      this.displayPoints()

    });
    if (this.pointId !== null) {
      for (let pointMarker of this.pointMarkers) {
        if (pointMarker.id.toString() == this.pointId.toString()) {
          pointMarker.marker.options.icon.options.iconUrl = 'assets/transparent.png';
        }
      }
    }
  }

  // odfiltrowuje się wszystkie znaczniki, które nie znajdują się w bieżących granicach widoku mapy
  // następnie ustawia wynikową kolekcję znaczników jako nowy zestaw warstw mapy.
  //zone.run potrzebne, żeby Angular zaktualizował widok
  displayPoints() {
    this.zone.run(() => {
      let markers: Marker[] = [];
      for (let pointMarker of this.pointMarkers) {
        markers.push(pointMarker.marker);
      }
      let pointsFromDB: LayerGroup = new LayerGroup();

      const markersInBounds: Marker[] = markers.filter((m: Marker) => this.map.getBounds().contains(m.getLatLng()));
      for (let marker of markersInBounds) {
        pointsFromDB.addLayer(marker);
      }

      // this.layers[0] = pointsFromDB;
      this.markerClusterData = markersInBounds;
    });
  }

  // Ustawianie wyglądu kursora podczas przesuwania po mapie.
  // Jeśli jesteśmy w trybie wyboru punktu z mapy (pickMode) to ustaw na krzyżyk.
  getCrosshair() {
    if (this.pickMode) {
      return 'crosshair';
    } else {
      return 'move';
    }
  }

  onMapReady(map: Map) {

    this.mapService.bounds(map);
    interval(1000).takeWhile(() => true).subscribe(() => this.getCoordinates());
    this.map = map;
    if (this.editCoordinates !== undefined) {
      this.map.setView(latLng(this.editCoordinates), 19);
    }
    // Aktualizuje wyświetlane punkty w chwili pierwszego wyświetlenia mapy
    this.getAndDisplayPointsFromDB();

    // obserwuje, czy przesunęliśmy, zrobiliśmy zoom lub kliknęliśmy na mapę
    // Jeśli zaobserwuje te zdarzenia wykona funkcje
    this.map.on('moveend', this.getAndDisplayPointsFromDB.bind(this));
    this.map.on('zoomend', this.getAndDisplayPointsFromDB.bind(this));

    this.map.on('click', (cords: any) => {
      // Jeśli jesteśmy w trybie wybierania punktu z mapy
      if (this.pickMode) {
        this.pickMode = false;
        const coordinates: Array<number> = [cords.latlng.lng, cords.latlng.lat];
        // wywołujemy funkcję pickCords() i jako jej argumenty przekazujemy 2 wartości (coordinates)
        this.mapService.pickCords(coordinates);
        this.getAndDisplayPointsFromDB();
      }
    });
  }

  getCoordinates() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(location => {
        this.latitude = location.coords.latitude;
        this.longitude = location.coords.longitude;
        const newMarker: Marker = marker([this.latitude, this.longitude], {
          icon: icon({
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            iconUrl: 'assets/location.png',
            popupAnchor: [0, -28],
          })
        });
        let newPoint: LayerGroup = new LayerGroup();

        // Nadpisujemy poprzedni wyświetlany na mapie znacznik lokalizacji
        newPoint.addLayer(newMarker);
        this.layers[1] = newPoint;
      });
    } else {
      alert('twoja przeglądarka nie wspiera geolokacji...');
    }
  }

  displayPoint(cords) {
    const newMarker: Marker = marker([cords[1], cords[0]], {
      icon: this.createIcon()
    });
    let newPoint: LayerGroup = new LayerGroup();

    // Nadpisujemy poprzedni wyświetlany na mapie punkt
    newPoint.addLayer(newMarker);
    this.layers[2] = newPoint;
    if (this.map == undefined) {
      this.editCoordinates = [cords[1], cords[0]];

    } else {
      this.map.setView(latLng([cords[1], cords[0]]), 19);
    }
  };

  showMyLocalization() {
    this.getCoordinates();
    this.map.setView(latLng([this.latitude, this.longitude]), 19);
  }
}
