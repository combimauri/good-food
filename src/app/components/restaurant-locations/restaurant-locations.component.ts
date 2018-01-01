import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MapStyleService } from '../../services/map-style/map-style.service';

declare const google: any;

@Component({
  selector: 'food-restaurant-locations',
  templateUrl: './restaurant-locations.component.html',
  styleUrls: ['./restaurant-locations.component.scss']
})
export class RestaurantLocationsComponent implements AfterViewInit {

  private map: any;
  private currentPositionMarker: any;
  private cochabamba: Object;

  constructor(private styleService: MapStyleService) {
    this.cochabamba = { lat: -17.393695, lng: -66.157126 };
  }

  ngAfterViewInit() {
    let styles;
    this.styleService.getJSON().subscribe(
      response => {
        styles = response;
        let styledMap = new google.maps.StyledMapType(styles, { name: "Styled Map" });
        this.initMap(styledMap);
      },
      error => {
        styles = [
          {
            featureType: "poi",
            stylers: [
              { visibility: "off" }
            ]
          }
        ];
        var styledMap = new google.maps.StyledMapType(styles, { name: "Styled Map" });
        this.initMap(styledMap);
      }
    );
  }

  initMap(styledMap) {
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17,
      center: this.cochabamba,
      mapTypeControl: false,
      mapTypeControlOptions: {
        mapTypeId: 'styled_map'
      }
    });
    this.map.mapTypes.set('styled_map', styledMap);
    this.map.setMapTypeId('styled_map');

    let currentPositionIcon = './assets/current-human-location.png';
    this.currentPositionMarker = new google.maps.Marker({
      map: this.map,
      icon: currentPositionIcon
    });

    let locationControlDiv = document.getElementById('location-control-div');
    this.centerControl();

    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(locationControlDiv);

    this.centerCurrentLocation(this.map, this.currentPositionMarker);
  }

  centerControl() {
    let controlUI = document.getElementById('location-button');
    controlUI.onclick = () => {
      this.centerCurrentLocation(this.map, this.currentPositionMarker);
    }
  }

  centerCurrentLocation(map, marker) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        marker.setPosition(pos);
        map.setCenter(pos);
      }, function () {
        this.handleLocationError(true, marker, map.getCenter());
      });
    } else {
      this.handleLocationError(false, marker, map.getCenter());
    }
  }

  handleLocationError(browserHasGeolocation, marker, pos) {
    marker.setPosition(pos);
    let errorMessage = browserHasGeolocation ?
      'Error: El servicio de Geolocalización falló.' :
      'Error: Tu navegador no soporta geolocalización.'
    console.error(errorMessage);
  }

}
