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

    private noPhotoURL: string;

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
        this.noPhotoURL = noPhotoURL;
        this.currentUserProfilePicURL = noPhotoURL;

        this.authService.authUser
            .takeUntil(this.subscriptions.unsubscribe)
            .subscribe(user => {
                this.currentUser = user;
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
                this.setPostsComments();
            });
    }

    private setPostsComments(): void {
        this.publications.forEach(post => {
            post.comments = [];
            this.setPostRestaurantPicture(post);
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

    private setPostRestaurantPicture(post: Publication): void {
        if (post.restaurantPicture) {
            post.restaurantPicture.subscribe(URLObservable => {
                URLObservable.subscribe(URL => {
                    post.restaurantPictureURL = URL;
                });
            });
        }
    }

    private setCommentsUsers(comments: Comment[]): void {
        comments.forEach(comment => {
            comment.user = this.authService.buildAppUser('', '', noPhotoURL);
            comment.user.photoURL = noPhotoURL;
            this.userService
                .getUser(comment.ownerId)
                .map(user => {
                    return this.authService.buildAppUser(
                        comment.ownerId,
                        user.name,
                        user.photoURL
                    );
                })
                .subscribe(
                    user => {
                        comment.user = user;
                    },
                    error => {
                        console.error(error);
                    }
                );
        });
    }
}
