import {Component, EventEmitter, NgZone, Output} from '@angular/core';
import {icon, latLng, marker, tileLayer, Layer, Map, Marker} from 'leaflet';
import {MapService} from '../../services/map.service';
import {HttpService} from "../../services/http.service";
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, Event} from "@angular/router";
import {Point} from "../../models/Point";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent {
  @Output() myEvent: EventEmitter<any> = new EventEmitter();

  layers: Layer[] = [];
  existPoints: Point[] = [];
  map: Map;
  pickMode: boolean = false;
  pointIcon: string = 'assets/podstawowa_wysokosciowa.png';
  firstAddPoint: boolean = true;
  isLoading = false;

  // tablica ze znacznikami
  markers: Marker[] = [];

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
    router.events.subscribe((routerEvent : Event) => {
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

  checkEvent(routerEvent : Event) : void {
    if (routerEvent instanceof NavigationStart) {
      this.isLoading = true;
    }

    else if (routerEvent instanceof NavigationEnd ||
             routerEvent instanceof NavigationCancel ||
             routerEvent instanceof NavigationError) {
      this.isLoading = false;
    }
  }

  displayPoint(cords) {
    const newPoint = marker([cords[0], cords[1]], {
      icon: this.createIcon()
    });

    // Wyrzucamy poprzedni wyświetlany na mapie punkt
    if (this.markers.length > 0 && !this.firstAddPoint) {
      this.markers.splice(this.markers.length - 1, 1);
      console.log(this.markers.length);
    }
    this.map.addLayer(newPoint);

    this.firstAddPoint = false;

    this.markers.push(newPoint);
    this.map.setView(latLng([cords[0], cords[1]]), 19);
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

  updateMarkers() {

    let north = this.map.getBounds().getNorth();
    let south = this.map.getBounds().getSouth();
    let east = this.map.getBounds().getEast();
    let west = this.map.getBounds().getWest();

    this.httpService.viewPoints(north, south, east, west).subscribe(points => {
      console.log(points);


      pointsFromDB:
        for (let value of points) {
          for (let point of this.existPoints) {
            if (value.id === point.id) {
              break pointsFromDB;
            }
          }

          {
            if (value.controlType === 'pozioma' && (value.controlClass === '1' || value.controlClass === '2')) {
              this.pointIcon = 'assets/podstawowa_pozioma.png';
            } else if (value.controlType === 'wysokosciowa' && (value.controlClass === '1' || value.controlClass === '2')) {
              this.pointIcon = 'assets/podstawowa_wysokosciowa.png';
            } else if (value.controlType === 'dwufunkcyjna' && (value.controlClass === '1' || value.controlClass === '2')) {
              this.pointIcon = 'assets/podstawowa_xyh.png';
            } else if (value.controlType === 'pozioma' && value.controlClass === '3') {
              this.pointIcon = 'assets/szczegolowa_pozioma.png';
            } else if (value.controlType === 'wysokosciowa' && value.controlClass === '3') {
              this.pointIcon = 'assets/szczegolowa_wysokosciowa.png';
            } else if (value.controlType === 'dwufunkcyjna' && value.controlClass === '3') {
              this.pointIcon = 'assets/szczegolowa_xyh.png';
            } else {
              this.pointIcon = 'assets/podstawowa_pozioma.png';
            }
          }
          const newPoint = marker([value.X_WGS84, value.Y_WGS84], {
            icon: this.createIcon(),
            clickable: true
          })
            .on('click', () => {
              // alert("I have a click." + value.Y_WGS84);
              // this.router.navigate(['home/
              this.zone.run(() => {

                this.router.navigate(['home/detail/' + value.id]).then(() => {
                  // this.mapService.clickPoint(value);
                  setTimeout(() => {
                  }, 40000)

                });
              });


              console.log(value);

            })

            // .bindPopup("<b>Numer: </b>"+ value.catalog_number + "<br/>" + "<b>Wsp.: </b>" + value.X_WGS84 + ", " + value.Y_WGS84 +"<br/>" + "<a [routerLink]=\"['/points']\">Zobacz szczegóły</a>"
            // )
            .addTo(this.map);
          this.markers.push(newPoint);
          this.existPoints.push(value);
          console.log('this.existPoints: ', this.existPoints);
        }
      // this.updateMarkers();
    });

    // odfiltrowuje się wszystkie znaczniki, które nie znajdują się w bieżących granicach widoku mapy
    // następnie ustawia wynikową kolekcję znaczników jako nowy zestaw warstw mapy.
    this.zone.run(() => {
      this.layers = this.markers.filter((m: Marker) => this.map.getBounds().contains(m.getLatLng()));
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
    this.map = map;
    // Aktualizuje wyświetlane punkty w chwili pierwszego wyświetlenia mapy
    this.updateMarkers();

    // obserwuje, czy przesunęliśmy, zrobiliśmy zoom lub kliknęliśmy na mapę
    // Jeśli zaobserwuje te zdarzenia wykona funkcje
    this.map.on('moveend', this.updateMarkers.bind(this));
    this.map.on('zoomend', this.updateMarkers.bind(this));

    this.map.on('click', (cords: any) => {
      this.updateMarkers.bind(this);
      // Jeśli jesteśmy w trybie wybierania punktu z mapy
      if (this.pickMode) {
        const newPoint = marker([cords.latlng.lat, cords.latlng.lng], {
          icon: this.createIcon()
        });

        this.markers.push(newPoint);
        map.setView(latLng([cords.latlng.lat, cords.latlng.lng + 0.00037]), 19);

        this.pickMode = false;
        const coordinates: Array<number> = [cords.latlng.lat, cords.latlng.lng];
        // wywołujemy funkcję pickCords() i jako jej argumenty przekazujemy 2 wartości (coordinates)
        this.mapService.pickCords(coordinates);
        this.updateMarkers();
      }
    });

  }
}
