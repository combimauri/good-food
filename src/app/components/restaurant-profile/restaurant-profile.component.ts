import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';

import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { Irestaurant } from '../../interfaces/irestaurant';
import { Restaurant } from '../../models/restaurant';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Ipublication } from '../../interfaces/ipublication';
import { PublicationService } from '../../services/publication/publication.service';
import { IpublicationId } from '../../interfaces/ipublication-id';
import { Publication } from '../../models/publication';
import { Comment } from '../../models/comment';
import { IrestaurantId } from '../../interfaces/irestaurant-id';
import { Icomment } from '../../interfaces/icomment';
import { CommentService } from '../../services/publication/comment.service';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user';
import { IuserId } from '../../interfaces/iuser-id';

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

  constructor(private restaurantService: RestaurantService,
    private publicationService: PublicationService,
    private commentService: CommentService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private subscriptions: SubscriptionsService,
    private authService: AuthenticationService) {

    this.restaurant = new Restaurant();
    this.newPublication = new Publication();
    this.restaurantProfilePicURL = noPhotoURL;
    this.currentUserProfilePicURL = noPhotoURL;
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

  savePublication(): void {
    this.newPublication.ownerName = this.restaurant.name;
    this.newPublication.status = '';
    this.newPublication.restaurantId = this.restaurantId;
    this.publicationService.savePublication(this.newPublication).subscribe(
      publication => { },
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

    this.commentService.saveComment(newComment).subscribe(
      comment => {
        publication.newComment = '';
      },
      error => {
        console.log(error);
      }
    );
  }

  private setRestaurantPublications(): void {
    this.authService.authUser.takeUntil(this.subscriptions.unsubscribe).subscribe(
      user => {
        this.currentUser = user;
        this.currentUserProfilePicURL = this.currentUser.photoURL;
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

  private setPostsComments() {
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

  private setCommentsUsers(comments: Comment[]) {
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

}
