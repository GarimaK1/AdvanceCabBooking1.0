import { Component } from '@angular/core';
import { GoogleMap } from '@agm/core/services/google-maps-types';
import { markers } from './marker-list';
import { Marker } from './marker.model';

@Component({
  selector: 'app-areas-served',
  templateUrl: 'areas-served.component.html',
  styleUrls: ['areas-served.component.css']
})
export class AreasServedComponent {
  lat = 42.3601;
  lng = -71.0589;
  map: GoogleMap;
  markers: Marker[] = markers;

  public getMapInstance(map: GoogleMap) {
    this.map = map;
  }

  public resetMap() {
    this.map.setCenter({ lat: 42.3601, lng: -71.0589 });
    console.log('resetMap Method executed');
  }
}
