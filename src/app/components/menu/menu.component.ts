import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/takeUntil';

import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { IappUser } from '../../interfaces/iapp-user';
import { HomeService } from '../../services/home/home.service';

declare const $: any;
const noPhotoURL: string = './assets/img/nophoto.png';

@Component({
    selector: 'food-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
    currentUser: IappUser;

    loggedUser: IappUser;

    userRestaurants: IappUser[];

    isCurrentUserARestaurant: boolean;

    @ViewChild('toggleButton') private toggleButtonElement: ElementRef;

    constructor(
        public homeService: HomeService,
        public authService: AuthenticationService,
        private restaurantService: RestaurantService,
        private subscriptions: SubscriptionsService
    ) {
        this.currentUser = this.authService.buildAppUser(
            '',
            '',
            noPhotoURL
        );
        this.loggedUser = this.authService.buildAppUser(
            '',
            '',
            ''
        );
        this.userRestaurants = [];
        this.isCurrentUserARestaurant = true;
        this.getCurrentUser();
    }

    ngOnInit(): void {
        $(this.toggleButtonElement.nativeElement).pushMenu('toggle');
    }

    changeCurrentAppUser(user: IappUser): void {
        this.authService.changeCurrentAppUser(user);
        this.currentUser = user;
        this.homeService.goHome();
        this.setIsAppUserARestaurant();
    }

    private getCurrentUser(): void {
        this.authService.authUser
            .takeUntil(this.subscriptions.unsubscribe)
            .subscribe(user => {
                this.loggedUser = this.authService.buildAppUser(
                    user.id,
                    user.name,
                    user.photoURL
                );
                this.getUserRestaurants();
            });

        this.authService.getCurrentAppUser().subscribe(user => {
            this.currentUser = user;
        });
        this.setIsAppUserARestaurant();
    }

    private setIsAppUserARestaurant(): void {
        this.authService.isAppUserARestaurant().subscribe(isRestaurant => {
            this.isCurrentUserARestaurant = isRestaurant;
        });
    }

    private getUserRestaurants(): void {
        this.authService.userRestaurants.subscribe(restaurants => {
            this.userRestaurants = [];
            restaurants.forEach(restaurant => {
                if (restaurant.hasProfilePic) {
                    this.restaurantService
                        .getRestaurantProfilePic(restaurant.id)
                        .subscribe(
                            url => {
                                this.buildRestaurantAppUser(
                                    restaurant.id,
                                    restaurant.name,
                                    url
                                );
                            },
                            () => {
                                this.buildRestaurantAppUser(
                                    restaurant.id,
                                    restaurant.name,
                                    noPhotoURL
                                );
                            }
                        );
                } else {
                    this.buildRestaurantAppUser(
                        restaurant.id,
                        restaurant.name,
                        noPhotoURL
                    );
                }
            });
        });
    }

    private buildRestaurantAppUser(
        userId: string,
        userName: string,
        userPhotoURL: string
    ): void {
        const appUser: IappUser = this.authService.buildAppUser(
            userId,
            userName,
            userPhotoURL
        );

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
