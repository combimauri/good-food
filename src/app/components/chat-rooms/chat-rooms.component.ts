import { Component, OnInit } from '@angular/core';

import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ChatRoomService } from '../../services/chat/chat-room.service';
import { IuserId } from '../../interfaces/iuser-id';
import { Observable } from 'rxjs/Observable';
import { IchatRoomId } from '../../interfaces/ichat-room-id';
import { FollowRelationshipService } from '../../services/relationship/follow-relationship.service';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { IrestaurantId } from '../../interfaces/irestaurant-id';

@Component({
  selector: 'food-chat-rooms',
  templateUrl: './chat-rooms.component.html',
  styleUrls: ['./chat-rooms.component.scss']
})
export class ChatRoomsComponent implements OnInit {
  currentUser: IuserId;

  chatRooms: Observable<IchatRoomId[]>;

  followedRestaurants: IrestaurantId[];

  constructor(
    private authService: AuthenticationService,
    private restaurantService: RestaurantService,
    private chatRoomService: ChatRoomService,
    private relationshipService: FollowRelationshipService,
    private subscriptions: SubscriptionsService
  ) {
    this.authService.authUser
      .takeUntil(this.subscriptions.unsubscribe)
      .subscribe(user => {
        this.currentUser = user;
        this.getUserChatRooms();
        this.getUserFollowedRestaurants();
      });

    this.followedRestaurants = [];
  }

  ngOnInit() {}

  private getUserChatRooms(): void {
    this.chatRooms = this.chatRoomService.getChatRoomByUserId(
      this.currentUser.id
    );
    this.chatRooms.subscribe(rooms => {
      console.log('chat rooms', rooms);
    });
  }

  private getUserFollowedRestaurants(): void {
    this.relationshipService
      .getRelationshipsByUserId(this.currentUser.id)
      .subscribe(relationships => {
        relationships.forEach(relationship => {
          this.restaurantService
            .getRestaurant(relationship.restaurantId)
            .map(restaurant => {
              const id = relationship.restaurantId;
              return { id, ...restaurant };
            })
            .subscribe(restaurant => {
              this.followedRestaurants.push(restaurant);
            });
        });
      });
  }
}
