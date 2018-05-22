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

  publicationsTest: Observable<any>;

  newPublication: Publication;

  publicationId: string;

  liked: boolean;

  resturantId: string;

  restaurantName: string;

  constructor(private restaurantService: RestaurantService,
    public publicationService: PublicationService,
    private route: ActivatedRoute,
    private router: Router,
    private subscriptions: SubscriptionsService,
    private authService: AuthenticationService) {

    this.restaurantProfilePicURL = noPhotoURL;

    this.liked = false;

    this.newPublication = new Publication();
    this.publicationsTest = publicationService.publications;
    this.publicationsTest.subscribe(response => {
      this.publications = response;
      $('body').layout('fix');
    });
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

}
