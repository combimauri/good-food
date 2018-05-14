import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/takeUntil";

import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { Irestaurant } from '../../interfaces/irestaurant';
import { Restaurant } from '../../models/restaurant';

const noPhotoURL: string = './assets/img/nophoto.png';

@Component({
  selector: 'food-restaurant-profile',
  templateUrl: './restaurant-profile.component.html',
  styleUrls: ['./restaurant-profile.component.scss']
})
export class RestaurantProfileComponent implements OnInit {

  restaurantId: string;

  restaurant: Observable<Irestaurant>;

  restaurantProfilePicURL: string;

  constructor(private restaurantService: RestaurantService,
    private route: ActivatedRoute,
    private router: Router,
    private subscriptions: SubscriptionsService) {

    this.restaurantProfilePicURL = noPhotoURL;
  }

  ngOnInit(): void {
    this.route.params.takeUntil(this.subscriptions.unsubscribe).subscribe(
      (params) => {
        this.restaurantId = params['id'];
        this.restaurant = this.restaurantService.getRestaurant(this.restaurantId);
        this.restaurant.subscribe(
          (restaurant) => {
            if (restaurant) {
              if (restaurant.hasProfilePic) {
                this.setProfilePic();
              }
            } else {
              this.router.navigate(['404']);
            }
          }
        );
      }
    );
  }

  private setProfilePic(): void {
    this.restaurantService.getRestaurantProfilePic(this.restaurantId).subscribe(
      (URL) => {
        this.restaurantProfilePicURL = URL;
      }
    );
  }

}
