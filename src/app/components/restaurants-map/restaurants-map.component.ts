import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/takeUntil';

import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';
import { MapStyleService } from '../../services/maps/map-style.service';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { RestaurantCategoryService } from '../../services/restaurant/restaurant-category.service';
import { IrestaurantId } from '../../interfaces/irestaurant-id';
import { Restaurant } from '../../models/restaurant';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { UserService } from '../../services/user/user.service';

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

    @ViewChild('locationElement') private locationControlElement: ElementRef;

    @ViewChild('restaurantPictureElement')
    private restaurantPictureElement: ElementRef;

    constructor(
        public restaurantService: RestaurantService,
        public restaurantCategoryService: RestaurantCategoryService,
        private userService: UserService,
        private authService: AuthenticationService,
        private styleService: MapStyleService,
        private subscriptions: SubscriptionsService
    ) {
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

        this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
            this.locationControlElement.nativeElement
        );
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
            this.newRestaurant.hasProfilePic = true;
            this.newRestaurant.profilePic = picture;
            this.pictureFileReader.readAsDataURL(this.newRestaurant.profilePic);
        } else {
            this.newRestaurant.hasProfilePic = false;
            this.restaurantPictureElement.nativeElement.src = noPhotoURL;
        }
    }

    saveRestaurant(): void {
        this.loaderPercent = 1;
        this.authService.authUser
            .takeUntil(this.subscriptions.destroyUnsubscribe)
            .subscribe(user => {
                this.newRestaurant.addUserId = user.id;
                if (this.newRestaurant.hasOwner) {
                    this.newRestaurant.ownerId = user.id;
                }
                this.restaurantService
                    .saveRestaurant(this.newRestaurant)
                    .subscribe(restaurantDoc => {
                        if (this.newRestaurant.hasOwner) {
                            this.userService.updateUserToFoodBusinessOwner(
                                user
                            );
                        }
                        if (this.newRestaurant.hasProfilePic) {
                            this.saveRestaurantProfilePic(restaurantDoc.id);
                        } else {
                            this.loaderPercent = 100;
                        }
                        this.newRestaurant = new Restaurant();
                        this.restaurantPictureElement.nativeElement.src = noPhotoURL;
                    });
            });
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
                }
            );
        } else {
            this.handleLocationError(false);
        }
    }

    private saveRestaurantProfilePic(restaurantId: string): void {
        const task: any = this.restaurantService.saveRestaurantProfilePic(
            restaurantId,
            this.newRestaurant.profilePic
        );
        task.percentageChanges().subscribe(
            percent => {
                if (percent > 1 && percent < 100) {
                    this.loaderPercent = percent;
                }
            },
            error => {
                this.loaderPercent = 100;
                console.error(error);
            }
        );
        task.downloadURL().subscribe(url => {
            if (!url) {
                console.error('Error retrieving the URL.');
            } else {
                this.restaurantService.restaurantPhotoSubject.next({
                    restaurantId: restaurantId,
                    photoURL: url
                });
            }
            this.loaderPercent = 100;
        });
    }

    private setMapStyle(): void {
        this.styleService.getStyles().subscribe(
            response => {
                this.styles = response;
            },
            error => {
                this.styles = [
                    {
                        featureType: 'poi',
                        stylers: [{ visibility: 'off' }]
                    }
                ];
            }
        );
    }

    private handleLocationError(browserHasGeolocation: boolean): void {
        this.lat = cochaLat;
        this.lng = cochaLng;
        let errorMessage = browserHasGeolocation
            ? 'Error: El servicio de Geolocalización falló.'
            : 'Error: Tu navegador no soporta Geolocalización.';

        this.map.setCenter({ lat: this.lat, lng: this.lng });
        console.error(errorMessage);
    }
}
