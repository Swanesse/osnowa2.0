import {Marker} from "leaflet";

export class PointMarker {
  constructor(id, marker){
    this.id = id;
    this.marker = marker;
  }

  id: number;
  marker: Marker;
}
