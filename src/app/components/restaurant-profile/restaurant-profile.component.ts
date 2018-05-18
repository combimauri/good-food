import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/takeUntil";

import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { Irestaurant } from '../../interfaces/irestaurant';
import { Restaurant } from '../../models/restaurant';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Ipublication } from '../../interfaces/ipublication';
import { PublicationService } from '../../services/publication/publication.service';
import { IpublicationId } from '../../interfaces/ipublication-id';
import { Publication } from '../../models/publication';

declare const $: any;
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

  newPublication: Publication;

  publicationId: string;

  liked: boolean;

  resturantId: string;

  restaurantName: string;

  constructor(private restaurantService: RestaurantService,
    private publicationService: PublicationService,
    private route: ActivatedRoute,
    private router: Router,
    private subscriptions: SubscriptionsService,
  private authService: AuthenticationService) {

    this.restaurantProfilePicURL = noPhotoURL;

    this.liked = false;

    this.newPublication = new Publication();

    this.publications = [
      {
        ownerName: 'Hamburgon',
        image: './assets/img/nophoto.png',
        paragraph: 'Lorem ipsum represents a long-held tradition for designers, typographers and the like. ' +
          'Some people hate it and argue for' +
          'its demise, but others ignore the hate as they create awesome tools to help create filler text for everyone from' +
          'bacon lovers to Charlie Sheen fans.',
        date: '10 Mayo 8:00',
        comments: [
          {
            ownerName: 'Maria Garcia',
            comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc semper ligula' +
              ' consectetur, tristique est eget, facilisis nulla.' +
              'In ut nulla finibus ipsum elementum interdum id sit amet velit. Mauris iaculis.',
            image: './assets/img/nophoto.png',
            date: '15 Mayo 8:00'
          },
          {
            ownerName: 'Maria Garcia',
            comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc semper ligula' +
              ' consectetur, tristique est eget, facilisis nulla.' +
              'In ut nulla finibus ipsum elementum interdum id sit amet velit. Mauris iaculis.',
            image: './assets/img/nophoto.png',
            date: '15 Mayo 8:00'
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
    $('body').layout('fix');

    this.route.params.takeUntil(this.subscriptions.unsubscribe).subscribe(
      (params) => {
        let id: string = params['id'];
        this.resturantId = id;
        this.restaurant = this.restaurantService.getRestaurant(id);
        this.restaurant.subscribe(
          (restaurant) => {
            if (restaurant) {
              this.restaurantName = restaurant.name;
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

  changePublicationStatus(publication): void {
    this.liked = !this.liked;
    this.liked ? publication.status.push('LIKE') : publication.status.splice(0, 1);
  }

  addComment(publication): void {
    console.log('new comment');
  }

  savePublication(): void {
    this.newPublication.ownerName = this.restaurantName;
    this.newPublication.status = '';
    this.authService.authUser.takeUntil(this.subscriptions.unsubscribe).subscribe(
      (user) => {
        this.newPublication.restaurantId = this.resturantId;
        this.publicationService.savePublication(this.newPublication).subscribe(
          (document) => {
            this.publicationId = document.id;
            console.log(document);
          },
          (error) => {
            console.error(error);
          }
        );
      }
    );
  }

}
