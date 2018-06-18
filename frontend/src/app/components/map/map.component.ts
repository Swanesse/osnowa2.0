import {Component} from '@angular/core';
import {circle, latLng, marker, polygon, tileLayer} from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent {

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }),
      marker([ 50.06585, 19.92022 ])
    ],
    zoom: 16,
    center: latLng([50.06585, 19.92022])
  };

  layersControl = {
    overlays: {
      'Big Circle': circle([50.06585, 19.92022], {radius: 5000}),
      'Big Square': polygon([[46.8, -121.55], [46.9, -121.55], [46.9, -121.7], [46.8, -121.7]]),
      'marker': marker([50.06585, 19.92022])
    }
  }
}
