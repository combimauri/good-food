import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Ng2ImgMaxService } from 'ng2-img-max';
import "rxjs/add/operator/takeUntil";

import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';
import { RestaurantCategoryService } from '../../services/restaurant/restaurant-category.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { UserService } from '../../services/user/user.service';
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

  lat: number;

  lng: number;

  styles: Array<any>;

  restaurantId: string;

  newRestaurant: Restaurant;

  loaderPercent: number;

  private map: any;

  private pictureFileReader: FileReader;

  @ViewChild("restaurantPictureElement")
  private restaurantPictureElement: ElementRef;

  constructor(public restaurantService: RestaurantService,
    public restaurantCategoryService: RestaurantCategoryService,
    private authService: AuthenticationService,
    private userService: UserService,
    private styleService: MapStyleService,
    private router: Router,
    private imgToolsService: Ng2ImgMaxService,
    private subscriptions: SubscriptionsService) {

    this.lat = cochaLat;
    this.lng = cochaLng;
    this.newRestaurant = new Restaurant();
    this.pictureFileReader = new FileReader();

    this.pictureFileReader.onloadend = () => {
      this.restaurantPictureElement.nativeElement.src = this.pictureFileReader.result;
    };
  }

  ngOnInit(): void {
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

  setRestaurantLocation(event: any): void {
    this.newRestaurant.lat = event.coords.lat;
    this.newRestaurant.lng = event.coords.lng;
  }

  saveRestaurant(): void {
    this.loaderPercent = 1;
    this.authService.authUser.takeUntil(this.subscriptions.unsubscribe).subscribe(
      (user) => {
        this.newRestaurant.addUserId = user.id;
        this.newRestaurant.ownerId = user.id;
        this.restaurantService.saveRestaurant(this.newRestaurant).subscribe(
          (document) => {
            this.restaurantId = document.id;
            this.userService.updateUserToFoodBusinessOwner(user);
            if (this.newRestaurant.hasProfilePic) {
              this.saveRestaurantProfilePic();
            } else {
              this.loaderPercent = 100;
            }
          },
          (error) => {
            console.error(error);
          }
        );
      }
    );
  }

  navigateToRestaurantProfile(): void {
    this.router.navigate(['/restaurant-profile', this.restaurantId]);
  }

  private saveRestaurantProfilePic(): void {
    let task: any = this.restaurantService.saveRestaurantProfilePic(this.restaurantId, this.newRestaurant.profilePic);
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
