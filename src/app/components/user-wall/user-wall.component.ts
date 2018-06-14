import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { PublicationService } from '../../services/publication/publication.service';
import { CommentService } from '../../services/publication/comment.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';
import { IuserId } from '../../interfaces/iuser-id';
import { FollowRelationshipService } from '../../services/relationship/follow-relationship.service';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { Publication } from '../../models/publication';
import { IfollowRelationshipId } from '../../interfaces/ifollow-relationship-id';
import { IpublicationId } from '../../interfaces/ipublication-id';

const noPhotoURL: string = './assets/img/nophoto.png';

@Component({
  selector: 'food-user-wall',
  templateUrl: './user-wall.component.html',
  styleUrls: ['./user-wall.component.scss']
})
export class UserWallComponent implements OnInit {

  currentUser: IuserId;

  publications: Publication[];

  postSubscriptions: Observable<IpublicationId[]>[];

  noPhotoURL: string;

  constructor(private restaurantService: RestaurantService,
    private publicationService: PublicationService,
    private commentService: CommentService,
    private relationshipService: FollowRelationshipService,
    private authService: AuthenticationService,
    private subscriptions: SubscriptionsService) {

    this.publications = [];
    this.postSubscriptions = [];
    this.noPhotoURL = noPhotoURL;

    this.authService.authUser.takeUntil(this.subscriptions.unsubscribe).subscribe(
      user => {
        this.currentUser = user;
        this.relationshipService.getRelationshipsByUserId(this.currentUser.id).subscribe(
          relationships => {
            for (let relationship of relationships) {
              this.addPostSubscription(relationship);
            }

            this.setPublications();
          }
        );
      }
    );
  }

  ngOnInit() {
  }

  addPostSubscription(relationship: IfollowRelationshipId): void {
    let postSubscription = this.publicationService.getPublicationsByRestaurantId(relationship.restaurantId);

    this.postSubscriptions.push(postSubscription);
  }

  setPublications(): void {
    combineLatest(...this.postSubscriptions).map(setOfPosts => {
      let allPosts = [];

      setOfPosts.forEach(posts => {
        allPosts = allPosts.concat(posts);
      });

      allPosts.sort((a, b) => {
        return b.date.getDate() - a.date.getDate();
      });

      return allPosts;
    }).subscribe(posts => {
      this.publications = posts;
    });
  }

}
