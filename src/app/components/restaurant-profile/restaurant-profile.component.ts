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
        let id: string = params['id'];
        this.restaurant = this.restaurantService.getRestaurant(id);
        this.restaurant.subscribe(
          (restaurant) => {
            if (restaurant) {
              if (restaurant.hasProfilePic) {
                this.setProfilePic(id);
              }
            } else {
              this.router.navigate(['404']);
            }
          }
        );
      }
    );
  }

  private setProfilePic(restaurantId: string): void {
    this.restaurantService.getRestaurantProfilePic(restaurantId).subscribe(
      (URL) => {
        this.restaurantProfilePicURL = URL;
      }
    );
  }

}
