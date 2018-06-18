import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/takeUntil';

import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';

const noPhotoURL: string = './assets/img/nophoto.png';

@Component({
  selector: 'food-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  noPhotoURL: string;

  restaurantId: string;

  userId: string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private subscriptions: SubscriptionsService) {

    this.noPhotoURL = noPhotoURL;
  }

  ngOnInit() {
    this.route.params.takeUntil(this.subscriptions.unsubscribe).subscribe(
      (params) => {
        let chatRoomId: string = params['id'];
        // chatRoomId.
      }
    );
  }

}
