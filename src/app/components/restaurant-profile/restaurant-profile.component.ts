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

  restaurantId: string;

  restaurant: Observable<Irestaurant>;

  restaurantProfilePicURL: string;

  publications: Observable<IpublicationId[]>;

  newPublication: Publication;

  publicationId: string;

  liked: boolean;

  restaurantName: string;

  constructor(private restaurantService: RestaurantService,
    public publicationService: PublicationService,
    private route: ActivatedRoute,
    private router: Router,
    private subscriptions: SubscriptionsService,
    private authService: AuthenticationService) {

    this.liked = false;
    this.restaurantProfilePicURL = noPhotoURL;
    this.newPublication = new Publication();
  }

  ngOnInit(): void {
    this.route.params.takeUntil(this.subscriptions.unsubscribe).subscribe(
      (params) => {
        this.restaurantId = params['id'];
        this.restaurant = this.restaurantService.getRestaurant(this.restaurantId);
        this.restaurant.subscribe(
          (restaurant) => {
            if (restaurant) {
              this.restaurantName = restaurant.name;
              this.setRestaurantPublications();
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
    this.newPublication.restaurantId = this.restaurantId;
    this.publicationService.savePublication(this.newPublication).subscribe(
      (publication) => {
        this.publicationId = publication.id;
        console.log(publication);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  
  private setRestaurantPublications(): void {
    this.publications = this.publicationService.getPublicationsByRestaurantId(this.restaurantId);
  }
  private setProfilePic(): void {
    this.restaurantService.getRestaurantProfilePic(this.restaurantId).subscribe(
      (URL) => {
        this.restaurantProfilePicURL = URL;
      }
    );
  }

}
