import { Component, OnInit } from '@angular/core';

import { PublicationService } from '../../services/publication/publication.service';
import { CommentService } from '../../services/publication/comment.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';
import { IuserId } from '../../interfaces/iuser-id';
import { FollowRelationshipService } from '../../services/relationship/follow-relationship.service';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { Publication } from '../../models/publication';

@Component({
  selector: 'food-user-wall',
  templateUrl: './user-wall.component.html',
  styleUrls: ['./user-wall.component.scss']
})
export class UserWallComponent implements OnInit {

  currentUser: IuserId;

  publications: Publication[];

  constructor(private restaurantService: RestaurantService,
    private publicationService: PublicationService,
    private commentService: CommentService,
    private relationshipService: FollowRelationshipService,
    private authService: AuthenticationService,
    private subscriptions: SubscriptionsService) {

    this.publications = [];

    this.authService.authUser.takeUntil(this.subscriptions.unsubscribe).subscribe(
      user => {
        this.currentUser = user;
        this.relationshipService.getRelationshipsByUserId(this.currentUser.id).subscribe(
          relationships => {
            console.log(relationships);
            relationships.forEach(relationship => {
              this.publicationService.getPublicationsByRestaurantId(relationship.restaurantId).subscribe(
                posts => {
                  this.publications = this.publications.concat(posts);
                  // this.publications.sort(
                  //   (a, b) => a.date.seconds - b.date.seconds
                  // );
                  console.log(this.publications);
                }
              );
            });
          }
        );
      }
    );
  }

  ngOnInit() {
  }

}
