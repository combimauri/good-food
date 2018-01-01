import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MapStyleService } from '../../services/map-style/map-style.service';

declare const google: any;
declare const LocateButton: any;

@Component({
  selector: 'food-restaurant-locations',
  templateUrl: './restaurant-locations.component.html',
  styleUrls: ['./restaurant-locations.component.scss']
})
export class RestaurantLocationsComponent implements AfterViewInit {

  private map: any;
  private infoWindow: any;
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

    this.infoWindow = new google.maps.InfoWindow({ map: this.map });

    let locationControlDiv = document.getElementById('location-control-div');
    this.centerControl();

    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationControlDiv);

    this.centerCurrentLocation(this.map, this.infoWindow);
  }

  centerControl() {
    let controlUI = document.getElementById('location-button');
    controlUI.onclick = () => {
      this.centerCurrentLocation(this.map, this.infoWindow);
    }
  }

  centerCurrentLocation(map, infoWindow) {
    // let infoWindow = new google.maps.InfoWindow({ map: map });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        map.setCenter(pos);
      }, function () {
        this.handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      this.handleLocationError(false, infoWindow, map.getCenter());
    }
  }

  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
  }

}
