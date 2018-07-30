import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
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
import { IuserId } from '../../interfaces/iuser-id';
import { IfollowRelationship } from '../../interfaces/ifollow-relationship';
import { FollowRelationshipService } from '../../services/relationship/follow-relationship.service';
import { ChatRoomService } from '../../services/chat/chat-room.service';
import { IchatRoom } from '../../interfaces/ichat-room';
import { IappUser } from '../../interfaces/iapp-user';
import { Review } from '../../models/review';
import { ReviewService } from '../../services/score/review.service';

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

    publications: Publication[];

    newPublication: Publication;

    isFollowButtonReady: boolean;

    isFollow: boolean;

    isUnfollow: boolean;

    restaurantHasOwner: boolean;

    isMessageButtonReady: boolean;

    isCurrentUserARestaurant: boolean;

    showRegisterButton: boolean;

    currentAppUser: IappUser;

    restaurantAverageRating: Review;

    currentRestaurantReview: Review;
    
    private loggedUser: IuserId;

    constructor(
        private restaurantService: RestaurantService,
        private publicationService: PublicationService,
        private commentService: CommentService,
        private userService: UserService,
        private relationshipService: FollowRelationshipService,
        private chatRoomService: ChatRoomService,
        private reviewService: ReviewService,
        private route: ActivatedRoute,
        private router: Router,
        private subscriptions: SubscriptionsService,
        private authService: AuthenticationService
    ) {
        this.restaurant = new Restaurant();
        this.newPublication = new Publication();
        this.restaurantProfilePicURL = noPhotoURL;
        this.isFollowButtonReady = false;
        this.isFollow = false;
        this.isUnfollow = false;
        this.restaurantHasOwner = false;
        this.isMessageButtonReady = false;
        this.isCurrentUserARestaurant = false;
        this.showRegisterButton = false;
        this.restaurantAverageRating = new Review();
        this.currentRestaurantReview = new Review();
        this.currentAppUser = this.authService.buildAppUser('', '', noPhotoURL);

        this.authService.changeUserObservable.subscribe(() => {
            this.setCurrentUser();
        });
    }

    ngOnInit(): void {
        this.route.params
            .takeUntil(this.subscriptions.unsubscribe)
            .subscribe(params => {
                this.restaurantId = params['id'];
                this.restaurantService
                    .getRestaurant(this.restaurantId)
                    .subscribe(restaurant => {
                        if (restaurant) {
                            this.setInitialData(restaurant);
                        } else {
                            this.router.navigate(['404']);
                        }
                    });
            });
    }

    goToChatRoom(): void {
        if (this.isMessageButtonReady) {
            if (this.isUnfollow) {
                this.chatRoomService.selectedChatUserId = this.restaurantId;
                this.router.navigate(['/messages']);
            } else {
                let chatRoom: IchatRoom = {
                    restaurantId: this.restaurantId,
                    userId: this.loggedUser.id,
                    lastMessage: '...',
                    date: new Date()
                };

                this.chatRoomService.saveChatRoom(chatRoom).subscribe(room => {
                    this.chatRoomService.selectedChatUserId = this.restaurantId;
                    this.router.navigate(['/messages']);
                });
            }
        }
    }

    savePublication(): void {
        this.newPublication.ownerName = this.restaurant.name;
        this.newPublication.restaurantId = this.restaurantId;
        this.publicationService
            .savePublication(this.newPublication)
            .subscribe(() => {
                this.newPublication = new Publication();
            });
    }

    addComment(publication: Publication): void {
        let newComment: Icomment = new Comment();
        newComment.comment = publication.newComment;
        newComment.ownerId = this.currentAppUser.id;
        newComment.isOwnerARestaurant = this.isCurrentUserARestaurant;
        newComment.postId = publication.id;

        publication.newComment = '';
        this.commentService.saveComment(newComment);
    }

    follow(): void {
        let relationship: IfollowRelationship = {
            restaurantId: this.restaurantId,
            userId: this.loggedUser.id,
            createdAt: new Date()
        };

        let chatRoom: IchatRoom = {
            restaurantId: this.restaurantId,
            userId: this.loggedUser.id,
            lastMessage: '...',
            date: new Date()
        };

        this.relationshipService.saveRelationship(relationship);
        this.chatRoomService.saveChatRoom(chatRoom);
    }

    unfollow(): void {
        this.relationshipService.deleteRelationship(
            this.restaurantId,
            this.loggedUser.id
        );
    }

    registerAsMyRestaurant(): void {
        if (this.showRegisterButton) {
            let restaurant: IrestaurantId = this.restaurantService.buildRestaurantIdInterface(
                this.restaurantId,
                this.restaurant
            );
            restaurant.ownerId = this.loggedUser.id;
            this.restaurantService
                .updateRestaurant(restaurant)
                .subscribe(() => {
                    this.userService.updateUserToFoodBusinessOwner(
                        this.loggedUser
                    );
                });
        }
    }

    changeFoodRating(event): void {
        this.currentRestaurantReview = event;
    }

    submitReview(): void {
        if (this.currentRestaurantReview.foodRating) {
            this.currentRestaurantReview.restaurantId = this.restaurantId;
            this.currentRestaurantReview.userId = this.loggedUser.id;
            this.reviewService.saveRestaurantReview(
                this.currentRestaurantReview
            );
        }
    }

    private setInitialData(restaurant: Irestaurant): void {
        this.setRestaurantData(restaurant);
        this.setCurrentUser();
    }

    private setRestaurantData(restaurant: Irestaurant): void {
        this.restaurant = restaurant;
        this.restaurantHasOwner = this.restaurant.ownerId ? true : false;
        this.setRestaurantRating();
        if (this.restaurant.hasProfilePic) {
            this.restaurantService
                .getRestaurantProfilePic(this.restaurantId)
                .subscribe(URL => {
                    this.restaurantProfilePicURL = URL;
                    this.setRestaurantPublications();
                });
        } else {
            this.restaurantProfilePicURL = noPhotoURL;
            this.setRestaurantPublications();
        }
    }

    private setRestaurantRating() {
        this.reviewService
            .getRestarantAverageRating(this.restaurantId)
            .subscribe(rating => {
                this.restaurantAverageRating = rating;
            });
    }

    private setCurrentUser(): void {
        this.authService.getCurrentAppUser().subscribe(user => {
            this.currentAppUser = user;
        });
        this.setIsAppUserARestaurant();
    }

    private setIsAppUserARestaurant(): void {
        this.authService.isAppUserARestaurant().subscribe(isRestaurant => {
            this.isCurrentUserARestaurant = isRestaurant;
            this.showRegisterButton =
                !this.isCurrentUserARestaurant && !this.restaurantHasOwner;
        });
    }

    private setRestaurantPublications(): void {
        this.authService.authUser
            .takeUntil(this.subscriptions.unsubscribe)
            .subscribe(user => {
                this.loggedUser = user;
                this.isMessageButtonReady = true;
                this.setCurrentRestaurantReview();
                this.getFollowRelationships();
                this.publicationService
                    .getPublicationsByRestaurantId(this.restaurantId)
                    .subscribe(posts => {
                        this.publications = posts;
                        this.setPostsComments();
                    });
            });
    }

    private setCurrentRestaurantReview(): void {
        this.reviewService
            .getRestaurantReview(this.restaurantId, this.loggedUser.id)
            .subscribe(review => {
                this.currentRestaurantReview = review ? review : this.currentRestaurantReview;
            });
    }

    private setPostsComments(): void {
        this.publications.forEach(post => {
            post.comments = [];
            this.commentService
                .getCommentsByPostId(post.id)
                .subscribe(comments => {
                    post.comments = comments as Comment[];
                    this.setCommentsUsers(post.comments);
                });
        });
    }

    private setCommentsUsers(comments: Comment[]): void {
        comments.forEach(comment => {
            comment.user = this.authService.buildAppUser('', '', noPhotoURL);
            this.setCommentUser(comment);
        });
    }

    private setCommentUser(comment: Comment): void {
        if (comment.isOwnerARestaurant) {
            this.restaurantService
                .getRestaurant(comment.ownerId)
                .map(restaurant => {
                    return this.authService.buildAppUser(
                        comment.ownerId,
                        restaurant.name,
                        this.restaurantProfilePicURL
                    );
                })
                .subscribe(restaurant => {
                    comment.user = restaurant;
                });
        } else {
            this.userService
                .getUser(comment.ownerId)
                .map(user => {
                    return this.authService.buildAppUser(
                        comment.ownerId,
                        user.name,
                        user.photoURL
                    );
                })
                .subscribe(user => {
                    comment.user = user;
                });
        }
    }

    private getFollowRelationships(): void {
        this.relationshipService
            .getRelationshipsByRestaurantAndUserId(
                this.restaurantId,
                this.loggedUser.id
            )
            .subscribe(relationship => {
                this.updateFollowersCount();
                this.isFollowButtonReady = true;
                if (relationship[0]) {
                    this.isFollow = false;
                    this.isUnfollow = true;
                } else {
                    this.isFollow = true;
                    this.isUnfollow = false;
                }
            });
    }

    private updateFollowersCount(): void {
        this.relationshipService
            .getRestaurantFollowersCount(this.restaurantId)
            .subscribe(count => {
                if (this.restaurant.followersCount !== count) {
                    let restaurant: IrestaurantId = this.restaurantService.buildRestaurantIdInterface(
                        this.restaurantId,
                        this.restaurant
                    );
                    restaurant.followersCount = count;
                    this.restaurantService.updateRestaurant(restaurant);
                }
            });
    }
}
