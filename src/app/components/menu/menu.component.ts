import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/takeUntil';

import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { IappUser } from '../../interfaces/iapp-user';

declare const $: any;
const noPhotoURL: string = './assets/img/nophoto.png';

@Component({
    selector: 'food-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
    currentUser: IappUser;

    userPhotoURL: string;

    userRestaurants: IappUser[];

    @ViewChild('toggleButton') private toggleButtonElement: ElementRef;

    constructor(
        public authService: AuthenticationService,
        private restaurantService: RestaurantService,
        private subscriptions: SubscriptionsService
    ) {
        this.userPhotoURL = noPhotoURL;
        this.userRestaurants = [];
        this.getCurrentUser();
    }

    ngOnInit(): void {
        $(this.toggleButtonElement.nativeElement).pushMenu('toggle');
    }

    private getCurrentUser(): void {
        this.authService.authUser
            .takeUntil(this.subscriptions.unsubscribe)
            .subscribe(
                user => {
                    this.currentUser = user;
                    this.userPhotoURL = user.photoURL;
                    this.getUserRestaurants();
                },
                error => {
                    console.error(error);
                }
            );
    }

    private getUserRestaurants(): void {
        this.restaurantService
            .getBusinessOwnerRestaurants(this.currentUser.id)
            .subscribe(restaurants => {
                this.userRestaurants = [];
                restaurants.forEach(restaurant => {
                    if (restaurant.hasProfilePic) {
                        this.restaurantService
                            .getRestaurantProfilePic(restaurant.id)
                            .subscribe(
                                url => {
                                    this.buildAppUser(
                                        restaurant.id,
                                        restaurant.name,
                                        url
                                    );
                                },
                                () => {
                                    this.buildAppUser(
                                        restaurant.id,
                                        restaurant.name,
                                        noPhotoURL
                                    );
                                }
                            );
                    } else {
                        this.buildAppUser(
                            restaurant.id,
                            restaurant.name,
                            noPhotoURL
                        );
                    }
                });
            });
    }

    private buildAppUser(
        userId: string,
        userName: string,
        userPhotoURL: string
    ): void {
        const appUser: IappUser = {
            id: userId,
            name: userName,
            photoURL: userPhotoURL
        };

        this.addRestaurantToUserRestaurants(appUser);
    }

    private addRestaurantToUserRestaurants(appUser: IappUser): void {
        let isRestaurantInArray: boolean = false;
        for (let userRestaurant of this.userRestaurants) {
            if (appUser.id === userRestaurant.id) {
                isRestaurantInArray = true;
            }
        }
        if (!isRestaurantInArray) {
            this.userRestaurants.push(appUser);
        }
    }
}
