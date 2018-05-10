import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Ng2ImgMaxService } from 'ng2-img-max';
import "rxjs/add/operator/takeUntil";

import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';
import { MapStyleService } from '../../services/maps/map-style.service';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { RestaurantCategoryService } from '../../services/restaurant/restaurant-category.service';
import { IrestaurantId } from '../../interfaces/irestaurant-id';
import { Restaurant } from '../../models/restaurant';
import { AuthenticationService } from '../../services/authentication/authentication.service';

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

  loaderPercent: number;

  private map: any;

  private pictureFileReader: FileReader;

  @ViewChild("locationElement")
  private locationControlElement: ElementRef;

  @ViewChild("restaurantPictureElement")
  private restaurantPictureElement: ElementRef;

  constructor(public restaurantService: RestaurantService,
    public restaurantCategoryService: RestaurantCategoryService,
    private authService: AuthenticationService,
    private styleService: MapStyleService,
    private imgToolsService: Ng2ImgMaxService,
    private subscriptions: SubscriptionsService) {

    this.isRestaurantInfoWindowOpen = false;
    this.isNewRestaurantInfoWindowOpen = false;
    this.currentRestaurant = new Restaurant();
    this.newRestaurant = new Restaurant();
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
    let picture: File = event.target.files[0];

    if (picture) {
      this.imgToolsService.compressImage(picture, 0.04).subscribe(
        (resizedPicture) => {
          this.newRestaurant.hasProfilePic = true;
          this.newRestaurant.profilePic = resizedPicture;
          this.pictureFileReader.readAsDataURL(this.newRestaurant.profilePic);
        },
        (error) => {
          this.newRestaurant.hasProfilePic = false;
          this.restaurantPictureElement.nativeElement.src = noPhotoURL;
          console.log(error);
        }
      );
    } else {
      this.newRestaurant.hasProfilePic = false;
      this.restaurantPictureElement.nativeElement.src = noPhotoURL;
    }
  }

  saveRestaurant(): void {
    this.loaderPercent = 1;
    this.authService.authUser.takeUntil(this.subscriptions.unsubscribe).subscribe(
      (user) => {
        this.newRestaurant.addUserId = user.id;
        this.restaurantService.saveRestaurant(this.newRestaurant).subscribe(
          (document) => {
            if (this.newRestaurant.hasProfilePic) {
              this.saveRestaurantProfilePic(document.id);
            } else {
              this.loaderPercent = 100;
            }
            this.newRestaurant = new Restaurant();
            this.restaurantPictureElement.nativeElement.src = noPhotoURL;
          },
          (error) => {
            console.error(error);
          }
        );
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

  private saveRestaurantProfilePic(restaurantId: string): void {
    let task: any = this.restaurantService.saveRestaurantProfilePic(restaurantId, this.newRestaurant.profilePic);
    task.percentageChanges().subscribe(
      (percent) => {
        this.setLoaderPercent(percent, task);
      },
      (error) => {
        this.loaderPercent = 100;
        console.error(error);
      }
    );
  }

  private setLoaderPercent(percent: number, task: any): void {
    if (percent > 1) {
      if (percent === 100) {
        task.downloadURL().subscribe(
          (url) => {
            if (url) {
              this.loaderPercent = percent;
            }
          }
        );
      } else {
        this.loaderPercent = percent;
      }
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
