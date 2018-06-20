import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/takeUntil';

import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { Irestaurant } from '../../interfaces/irestaurant';
import { Restaurant } from '../../models/restaurant';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { PublicationService } from '../../services/publication/publication.service';
import { Publication } from '../../models/publication';
import { Comment } from '../../models/comment';
import { IrestaurantId } from '../../interfaces/irestaurant-id';
import { Icomment } from '../../interfaces/icomment';
import { CommentService } from '../../services/publication/comment.service';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user';
import { IuserId } from '../../interfaces/iuser-id';
import { IfollowRelationship } from '../../interfaces/ifollow-relationship';
import { FollowRelationshipService } from '../../services/relationship/follow-relationship.service';

declare const $: any;
const noPhotoURL: string = './assets/img/nophoto.png';

@Component({
  selector: 'food-restaurant-profile',
  templateUrl: './restaurant-profile.component.html',
  styleUrls: ['./restaurant-profile.component.scss']
})
export class RestaurantProfileComponent implements OnInit {

  restaurant: Irestaurant;

  restaurantId: string;

  restaurantProfilePicURL: string;

  currentUserProfilePicURL: string;

  publications: Publication[];

  newPublication: Publication;

  currentUser: IuserId;

  isFollowButtonReady: boolean;

  isFollow: boolean;

  isUnfollow: boolean;

  isMessageButtonReady: boolean;

  constructor(private restaurantService: RestaurantService,
    private publicationService: PublicationService,
    private commentService: CommentService,
    private userService: UserService,
    private relationshipService: FollowRelationshipService,
    private route: ActivatedRoute,
    private router: Router,
    private subscriptions: SubscriptionsService,
    private authService: AuthenticationService) {

    this.restaurant = new Restaurant();
    this.newPublication = new Publication();
    this.restaurantProfilePicURL = noPhotoURL;
    this.currentUserProfilePicURL = noPhotoURL;
    this.isFollowButtonReady = false;
    this.isFollow = false;
    this.isUnfollow = false;
    this.isMessageButtonReady = false;
  }

  ngOnInit(): void {
    this.route.params.takeUntil(this.subscriptions.unsubscribe).subscribe(
      (params) => {
        this.restaurantId = params['id'];
        this.restaurantService.getRestaurant(this.restaurantId).subscribe(
          restaurant => {
            if (restaurant) {
              this.restaurant = restaurant;
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

  goToChatRoom(): void {
    if (this.isMessageButtonReady) {
      this.router.navigate(['/chat-room', this.restaurantId + '_' + this.currentUser.id]);
    }
  }

  savePublication(): void {
    this.newPublication.ownerName = this.restaurant.name;
    this.newPublication.status = '';
    this.newPublication.restaurantId = this.restaurantId;
    this.publicationService.savePublication(this.newPublication).subscribe(
      publication => {
        this.newPublication = new Publication();
      },
      error => {
        console.error(error);
      }
    );
  }

  addComment(publication: Publication): void {
    let newComment: Icomment = new Comment();
    newComment.comment = publication.newComment;
    newComment.ownerId = this.currentUser.id;
    newComment.postId = publication.id;

    publication.newComment = '';
    this.commentService.saveComment(newComment);
  }

  follow(): void {
    let relationship: IfollowRelationship = {
      restaurantId: this.restaurantId,
      userId: this.currentUser.id,
      createdAt: new Date()
    };

    this.relationshipService.saveRelationship(relationship);
  }

  unfollow(): void {
    this.relationshipService.deleteRelationship(this.restaurantId, this.currentUser.id);
  }

  private setRestaurantPublications(): void {
    this.authService.authUser.takeUntil(this.subscriptions.unsubscribe).subscribe(
      user => {
        this.currentUser = user;
        this.currentUserProfilePicURL = this.currentUser.photoURL;
        this.isMessageButtonReady = true;
        this.getFollowRelationships();
        this.publicationService.getPublicationsByRestaurantId(this.restaurantId).subscribe(
          posts => {
            this.publications = posts;
            this.setPostsComments();
          },
          error => {
            console.error(error);
          }
        );
      },
      error => {
        console.error(error);
      }
    );
  }

  private setPostsComments(): void {
    this.publications.forEach(post => {
      post.comments = [];
      this.commentService.getCommentsByPostId(post.id).subscribe(
        comments => {
          post.comments = comments as Comment[];
          this.setCommentsUsers(post.comments);
        },
        error => {
          console.error(error);
        }
      );
    });
  }

  private setCommentsUsers(comments: Comment[]): void {
    comments.forEach(comment => {
      comment.user = new User();
      comment.user.photoURL = noPhotoURL;
      this.userService.getUser(comment.ownerId).subscribe(
        user => {
          comment.user = user;
        },
        error => {
          console.error(error);
        }
      );
    });
  }

  private setProfilePic(): void {
    this.restaurantService.getRestaurantProfilePic(this.restaurantId).subscribe(
      URL => {
        this.restaurantProfilePicURL = URL;
      }
    );
  }

  private getFollowRelationships(): void {
    this.relationshipService.getRelationshipsByRestaurantAndUserId(this.restaurantId, this.currentUser.id).subscribe(
      relationship => {
        this.updateFollowersCount();
        this.isFollowButtonReady = true;
        if (relationship[0]) {
          this.isFollow = false;
          this.isUnfollow = true;
        } else {
          this.isFollow = true;
          this.isUnfollow = false;
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  private updateFollowersCount(): void {
    this.relationshipService.getRestaurantFollowersCount(this.restaurantId).subscribe(
      count => {
        if (this.restaurant.followersCount !== count) {
          let restaurant: IrestaurantId = this.restaurantService.buildRestaurantIdInterface(this.restaurantId, this.restaurant);
          restaurant.followersCount = count;
          this.restaurantService.updateRestaurant(restaurant);
        }
      }
    );
  }

}
