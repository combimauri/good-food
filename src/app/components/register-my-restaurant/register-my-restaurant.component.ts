import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { RestaurantCategoryService } from '../../services/restaurant/restaurant-category.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { MapStyleService } from '../../services/maps/map-style.service';
import { Restaurant } from '../../models/restaurant';

const cochaLat: number = -17.393695;
const cochaLng: number = -66.157126;
const noPhotoURL: string = './assets/img/nophoto.png';

@Component({
  selector: 'food-register-my-restaurant',
  templateUrl: './register-my-restaurant.component.html',
  styleUrls: ['./register-my-restaurant.component.scss']
})
export class RegisterMyRestaurantComponent implements OnInit {

  lat: number = 51.678418;

  lng: number = 7.809007;

  styles: Array<any>;

  newRestaurant: Restaurant;

  private map: any;

  private pictureFileReader: FileReader;

  @ViewChild("restaurantPictureElement")
  private restaurantPictureElement: ElementRef;

  constructor(public restaurantService: RestaurantService, public restaurantCategoryService: RestaurantCategoryService, private authService: AuthenticationService, private styleService: MapStyleService) {
    this.lat = cochaLat;
    this.lng = cochaLng;
    this.newRestaurant = new Restaurant();
  }

  ngOnInit() {
    this.setMapStyle();
  }

  centerMapOnUserLocation(event: any): void {
    this.map = event;
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

  setRestaurantLocation(event: any): void {
    this.newRestaurant.lat = event.coords.lat;
    this.newRestaurant.lng = event.coords.lng;
  }

  saveRestaurant(): void {
    this.authService.authUser.subscribe(
      (user) => {
        this.newRestaurant.addUserId = user.id;
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
      }
    );
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
