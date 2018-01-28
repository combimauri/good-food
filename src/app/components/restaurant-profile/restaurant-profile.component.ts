import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { Irestaurant } from '../../interfaces/irestaurant';
import { Restaurant } from '../../models/restaurant';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'food-restaurant-profile',
  templateUrl: './restaurant-profile.component.html',
  styleUrls: ['./restaurant-profile.component.scss']
})
export class RestaurantProfileComponent implements OnInit {

  restaurant: Observable<Irestaurant>;

  restaurantProfilePicURL: string;

  constructor(private restaurantService: RestaurantService, private route: ActivatedRoute, private router: Router) {
    this.restaurantProfilePicURL = './assets/img/nophoto.png';
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let id: string = params['id'];
      this.restaurant = this.restaurantService.getRestaurant(id);
      this.restaurant.subscribe(
        (restaurant) => {
          if (restaurant.hasProfilePic) {
            this.restaurantService.getRestaurantProfilePic(id).subscribe(
              (URL) => {
                this.restaurantProfilePicURL = URL;
              }
            );
          }
        }
      );
    });
  }

}
