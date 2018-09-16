import {Component, EventEmitter, NgZone, Output} from '@angular/core';
import {icon, latLng, marker, tileLayer, Layer, Map, Marker, LayerGroup} from 'leaflet';
import {MapService} from '../../services/map.service';
import {HttpService} from "../../services/http.service";
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, Event} from "@angular/router";
import {Point} from "../../models/Point";
import {PointMarker} from "../../models/PointMarker";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent {
  @Output() myEvent: EventEmitter<any> = new EventEmitter();

  layers: Layer[] = [];
  map: Map;
  pickMode: boolean = false;
  pointIcon: string = 'assets/podstawowa_wysokosciowa.png';
  isLoading = false;

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

  constructor(private zone: NgZone,
              private mapService: MapService,
              private httpService: HttpService,
              private router: Router) {
    router.events.subscribe((routerEvent: Event) => {
      this.checkEvent(routerEvent);
    });


    // router.events.subscribe((routerEvent) => {
    //   this.checkEvent(routerEvent);
    // });

    // Prześle z PANELU PUNKTU informację i ustawiamy, że jesteśmy w trybie pobierania kliknięć
    this.mapService.getTurningOnPickMode().subscribe(() => {
      this.pickMode = true;
    });

    // Prześle z PANELU PUNKTU zmienione współrzędne i wrzuci je do funkcji displayPoint()
    this.mapService.getChangeCords().subscribe((cords: Array<number>) => {
      this.displayPoint(cords);
    });

    // Prześle z PAMELU PUNKTU informację o zmianie klasy i zmieni ikonkę w pointIcon na MAPIE
    this.mapService.setIcon().subscribe(icon => {
      this.pointIcon = icon.toString();
    });
  }

  // checkEvent(routerEvent: Event): void {
  //   if (routerEvent instanceof NavigationStart) {
  //     this.isLoading = true;
  //   } else if (routerEvent instanceof NavigationEnd || routerEvent instanceof NavigationCancel || routerEvent instanceof NavigationError) {
  //     this.isLoading = false;
  //   }
  // }

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
            this.pointIcon = 'assets/podstawowa_pozioma.png';
          }

          const newPoint = marker([onePointFromDB.X_WGS84, onePointFromDB.Y_WGS84], {
            icon: this.createIcon(),
            clickable: true,
          })
            .on('click', () => {
              // alert("I have a click." + value.Y_WGS84);
              // this.router.navigate(['home/
              this.zone.run(() => {

                this.router.navigate(['home/detail/' + onePointFromDB.id]).then(() => {
                  // this.mapService.clickPoint(value);
                  setTimeout(() => {
                  }, 40000)
                });
              });
            });
          const pointMarker: PointMarker = new PointMarker(onePointFromDB.id, newPoint);
          this.pointMarkers.push(pointMarker);
        }

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

        this.layers[0] = pointsFromDB;
      });

    });

    // odfiltrowuje się wszystkie znaczniki, które nie znajdują się w bieżących granicach widoku mapy
    // następnie ustawia wynikową kolekcję znaczników jako nowy zestaw warstw mapy.
    //zone.run potrzebne, żeby Angular zaktualizował widok

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
    this.map = map;
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
        const coordinates: Array<number> = [cords.latlng.lat, cords.latlng.lng];
        // wywołujemy funkcję pickCords() i jako jej argumenty przekazujemy 2 wartości (coordinates)
        this.mapService.pickCords(coordinates);
        this.getAndDisplayPointsFromDB();
      }
    });
  }

  displayPoint(cords) {
    const newMarker: Marker = marker([cords[0], cords[1]], {
      icon: this.createIcon()
    });
    let newPoint: LayerGroup = new LayerGroup();

    // Nadpisujemy poprzedni wyświetlany na mapie punkt
    newPoint.addLayer(newMarker);
    this.layers[1] = newPoint;

    this.map.setView(latLng([cords[0], cords[1]]), 19);
  }
}
