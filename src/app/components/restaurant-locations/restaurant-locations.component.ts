import { Component, OnInit } from '@angular/core';

declare const google: any;

@Component({
  selector: 'food-restaurant-locations',
  templateUrl: './restaurant-locations.component.html',
  styleUrls: ['./restaurant-locations.component.scss']
})
export class RestaurantLocationsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 17
    });
    var infoWindow = new google.maps.InfoWindow({ map: map });

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
