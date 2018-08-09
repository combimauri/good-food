import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { PublicationService } from '../../services/publication/publication.service';
import { CommentService } from '../../services/publication/comment.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';
import { IuserId } from '../../interfaces/iuser-id';
import { FollowRelationshipService } from '../../services/relationship/follow-relationship.service';
import { Publication } from '../../models/publication';
import { IfollowRelationshipId } from '../../interfaces/ifollow-relationship-id';
import { IpublicationId } from '../../interfaces/ipublication-id';
import { Comment } from '../../models/comment';
import { User } from '../../models/user';
import { UserService } from '../../services/user/user.service';
import { Icomment } from '../../interfaces/icomment';
import { RestaurantService } from '../../services/restaurant/restaurant.service';

const noPhotoURL: string = './assets/img/nophoto.png';

@Component({
    selector: 'food-user-wall',
    templateUrl: './user-wall.component.html',
    styleUrls: ['./user-wall.component.scss']
})
export class UserWallComponent {
    currentUser: IuserId;

    publications: Publication[];

    postSubscriptions: Observable<IpublicationId[]>[];

    currentUserProfilePicURL: string;

    constructor(
        private userService: UserService,
        private restaurantService: RestaurantService,
        private publicationService: PublicationService,
        private commentService: CommentService,
        private relationshipService: FollowRelationshipService,
        private authService: AuthenticationService,
        private subscriptions: SubscriptionsService
    ) {
        this.publications = [];
        this.postSubscriptions = [];
        this.currentUserProfilePicURL = noPhotoURL;

        this.authService.authUser
            .takeUntil(this.subscriptions.destroyUnsubscribe)
            .subscribe(user => {
                this.currentUser = user;
                this.currentUserProfilePicURL = this.currentUser.photoURL;
                this.relationshipService
                    .getRelationshipsByUserId(this.currentUser.id)
                    .subscribe(relationships => {
                        for (let relationship of relationships) {
                            this.addPostSubscription(relationship);
                        }

                        this.setPublications();
                    });
            });
    }

    addComment(publication: Publication): void {
        let newComment: Icomment = new Comment();
        newComment.comment = publication.newComment;
        newComment.ownerId = this.currentUser.id;
        newComment.postId = publication.id;
        newComment.isOwnerARestaurant = false;

        publication.newComment = '';
        this.commentService.saveComment(newComment);
    }

    private addPostSubscription(relationship: IfollowRelationshipId): void {
        let postSubscription = this.publicationService
            .getPublicationsByRestaurantId(relationship.restaurantId)
            .map(posts => {
                posts.forEach(post => {
                    post.restaurantPicture = this.restaurantService
                        .getRestaurant(relationship.restaurantId)
                        .map(restaurant => {
                            if (restaurant.hasProfilePic) {
                                return this.restaurantService.getRestaurantProfilePic(
                                    relationship.restaurantId
                                );
                            }
                            return Observable.of(noPhotoURL);
                        });

                    post.restaurantPictureURL = noPhotoURL;
                });

                return posts;
            });

        this.postSubscriptions.push(postSubscription);
    }

    private setPublications(): void {
        combineLatest(...this.postSubscriptions)
            .map(setOfPosts => {
                let allPosts = [];

                setOfPosts.forEach(posts => {
                    allPosts = allPosts.concat(posts);
                });

                allPosts.sort((a, b) => {
                    return b.date.getDate() - a.date.getDate();
                });

                return allPosts;
            })
            .subscribe(posts => {
                this.publications = posts;
                this.setPostsData();
            });
    }

    private setPostsData(): void {
        this.publications.forEach(post => {
            post.comments = [];
            this.setPostPictureAndComments(post);
        });
    }

    private setPostPictureAndComments(post: Publication): void {
        post.restaurantPicture.subscribe(URLObservable => {
            URLObservable.subscribe(URL => {
                post.restaurantPictureURL = URL;

                this.commentService
                    .getCommentsByPostId(post.id)
                    .subscribe(comments => {
                        post.comments = comments as Comment[];
                        this.setPostCommentsUsers(post);
                    });
            });
        });
    }

    private setPostCommentsUsers(post: Publication): void {
        post.comments.forEach(comment => {
            comment.user = this.authService.buildAppUser('', '', noPhotoURL);
            this.setCommentUser(comment, post.restaurantPictureURL);
        });
    }

    private setCommentUser(
        comment: Comment,
        restaurantPictureURL: string
    ): void {
        if (comment.isOwnerARestaurant) {
            this.restaurantService
                .getRestaurant(comment.ownerId)
                .map(restaurant => {
                    return this.authService.buildAppUser(
                        comment.ownerId,
                        restaurant.name,
                        restaurantPictureURL
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
}
