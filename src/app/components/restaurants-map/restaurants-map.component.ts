import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { MapStyleService } from '../../services/maps/map-style.service';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { RestaurantCategoryService } from '../../services/restaurant/restaurant-category.service';
import { UserService } from '../../services/user/user.service';
import { IrestaurantId } from '../../interfaces/irestaurant-id';
import { Restaurant } from '../../models/restaurant';

declare const google: any;
const cochaLat: number = -17.393695;
const cochaLng: number = -66.157126;
const noPhotoURL: string = './assets/img/nophoto.png';

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

  newRestaurant: Restaurant;

  private map: any;

  private pictureFileReader: FileReader;

  @ViewChild("locationElement")
  private locationControlElement: ElementRef;

  @ViewChild("restaurantPictureElement")
  private restaurantPictureElement: ElementRef;

  constructor(public restaurantService: RestaurantService, public restaurantCategoryService: RestaurantCategoryService, private userService: UserService, private styleService: MapStyleService) {
    this.isRestaurantInfoWindowOpen = false;
    this.isNewRestaurantInfoWindowOpen = false;
    this.currentRestaurant = new Restaurant();
    this.newRestaurant = new Restaurant();
    this.pictureFileReader = null;
    this.pictureFileReader = new FileReader();

    this.pictureFileReader.onloadend = () => {
      this.restaurantPictureElement.nativeElement.src = this.pictureFileReader.result;
    };
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

  setRestaurantPicture(event: any): void {
    this.newRestaurant.profilePic = event.target.files[0];

    if (this.newRestaurant.profilePic) {
      this.newRestaurant.hasProfilePic = true;
      this.pictureFileReader.readAsDataURL(this.newRestaurant.profilePic);
    } else {
      this.newRestaurant.hasProfilePic = false;
      this.restaurantPictureElement.nativeElement.src = noPhotoURL;
    }
  }

  saveRestaurant(): void {
    this.newRestaurant.addUserId = this.userService.currentUser.uid;
    this.restaurantService.saveRestaurant(this.newRestaurant).subscribe(
      (document) => {
        if (this.newRestaurant.hasProfilePic) {
          this.saveRestaurantProfilePic(document.id);
        }
        this.newRestaurant = new Restaurant();
      },
      (error) => {
        console.error(error);
      }
    );
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

  private saveRestaurantProfilePic(restaurantId) {
    this.restaurantService.saveRestaurantProfilePic(restaurantId, this.newRestaurant.profilePic).subscribe(
      () => {
        console.log('Picture saved.');
      },
      (error) => {
        console.error(error);
      }
    );
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
