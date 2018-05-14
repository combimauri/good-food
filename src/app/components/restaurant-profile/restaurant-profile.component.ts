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

  publications: Array<any>;

  constructor(private restaurantService: RestaurantService,
    private route: ActivatedRoute,
    private router: Router,
    private subscriptions: SubscriptionsService) {

    this.restaurantProfilePicURL = noPhotoURL;

    this.publications = [
      {
        ownerName: 'Hamburgon',
        image: './assets/img/nophoto.png',
        paragraph: 'Lorem ipsum represents a long-held tradition for designers, typographers and the like. ' +
        'Some people hate it and argue for' +
        'its demise, but others ignore the hate as they create awesome tools to help create filler text for everyone from' +
        'bacon lovers to Charlie Sheen fans.',
        comments: [
          {
            ownerName: 'Maria Garcia',
            comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc semper ligula' +
            ' consectetur, tristique est eget, facilisis nulla.' +
            'In ut nulla finibus ipsum elementum interdum id sit amet velit. Mauris iaculis.',
            image: './assets/img/nophoto.png'
          }
        ],
        status: [
          'LIKE',
          'LIKE'
        ]
      }
    ];
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
