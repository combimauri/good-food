import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { MapStyleService } from '../../services/maps/map-style.service';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { RestaurantCategoryService } from '../../services/restaurant/restaurant-category.service';
import { IrestaurantId } from '../../interfaces/irestaurant-id';
import { Restaurant } from '../../models/restaurant';

declare const google: any;
const cochaLat: number = -17.393695;
const cochaLng: number = -66.157126;

@Component({
  selector: 'food-restaurants-map',
  templateUrl: './restaurants-map.component.html',
  styleUrls: ['./restaurants-map.component.scss']
})
export class RestaurantsMapComponent implements OnInit {

  lat: number;

  lng: number;

  styles: Array<any>;

  isRestaurantInfoWindowOpen: boolean;

  isNewRestaurantInfoWindowOpen: boolean;

  currentRestaurant: IrestaurantId;

  newRestaurant: IrestaurantId;

  private map: any;

  @ViewChild("locationElement")
  private locationControlElement: ElementRef;

  constructor(public restaurantService: RestaurantService, public restaurantCategoryService: RestaurantCategoryService, private styleService: MapStyleService) {
    this.isRestaurantInfoWindowOpen = false;
    this.isNewRestaurantInfoWindowOpen = false;
    this.currentRestaurant = new Restaurant();
    this.newRestaurant = new Restaurant();
  }

  ngOnInit(): void {
    this.setMapStyle();
  }

  addLocationElement(event: any): void {
    this.map = event;

    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM]
      .push(this.locationControlElement.nativeElement);
    this.centerMapOnUserLocation();
  }

  showNewRestaurantInfoWindow(event: any): void {
    this.newRestaurant.lat = event.coords.lat;
    this.newRestaurant.lng = event.coords.lng;
    this.isNewRestaurantInfoWindowOpen = true;
  }

  showNewRestaurantInfoWindowHere(): void {
    this.newRestaurant.lat = this.lat;
    this.newRestaurant.lng = this.lng;
    this.isNewRestaurantInfoWindowOpen = true;
  }

  showRestaurantInfoWindow(restaurant: IrestaurantId): void {
    this.currentRestaurant = restaurant;
    this.isRestaurantInfoWindowOpen = true;
  }

  saveRestaurant(): void {
    this.restaurantService.saveRestaurant(this.newRestaurant);
    this.closeNewRestaurantInfoWindow();
  }

  closeRestaurantInfoWindow(): void {
    this.isRestaurantInfoWindowOpen = false;
  }

  closeNewRestaurantInfoWindow(): void {
    this.isNewRestaurantInfoWindowOpen = false;
  }

  centerMapOnUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;

          this.map.setCenter({ lat: this.lat, lng: this.lng });
        },
        () => {
          this.handleLocationError(true);
        });
    } else {
      this.handleLocationError(false);
    }
  }

  private setMapStyle(): void {
    this.styleService.getStyles().subscribe(
      response => {
        this.styles = response;
      },
      error => {
        this.styles = [
          {
            featureType: "poi",
            stylers: [
              { visibility: "off" }
            ]
          }
        ];
      }
    );
  }

  private handleLocationError(browserHasGeolocation: boolean): void {
    this.lat = cochaLat;
    this.lng = cochaLng;
    let errorMessage = browserHasGeolocation ?
      'Error: El servicio de Geolocalización falló.' :
      'Error: Tu navegador no soporta Geolocalización.';

    this.map.setCenter({ lat: this.lat, lng: this.lng });
    console.error(errorMessage);
  }

}
