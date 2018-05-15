import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';

import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { MenuItemService } from '../../services/restaurant/menu-item.service';
import { Irestaurant } from '../../interfaces/irestaurant';
import { RestaurantMenuItem } from '../../models/restaurant-menu-item';
import { ImenuItemId } from '../../interfaces/imenu-item-id';

const noPhotoURL: string = './assets/img/nophoto.png';

@Component({
  selector: 'food-restaurant-menu',
  templateUrl: './restaurant-menu.component.html',
  styleUrls: ['./restaurant-menu.component.scss']
})
export class RestaurantMenuComponent implements OnInit {

  restaurantId: string;

  restaurant: Observable<Irestaurant>;

  newMenuItem: RestaurantMenuItem;

  menuItems: Observable<ImenuItemId[]>;

  private pictureFileReader: FileReader;

  @ViewChild("menuItemPictureElement")
  private menuItemPictureElement: ElementRef;

  constructor(private menuItemService: MenuItemService,
    private restaurantService: RestaurantService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private subscriptions: SubscriptionsService) {

    this.newMenuItem = new RestaurantMenuItem();
    this.pictureFileReader = new FileReader();

    this.pictureFileReader.onloadend = () => {
      this.menuItemPictureElement.nativeElement.src = this.pictureFileReader.result;
    };
  }

  ngOnInit() {
    this.route.params.takeUntil(this.subscriptions.unsubscribe).subscribe(
      params => {
        this.restaurantId = params['id'];
        this.restaurant = this.restaurantService.getRestaurant(this.restaurantId);
        this.restaurant.subscribe(
          restaurant => {
            if (restaurant) {
              this.newMenuItem.restaurantId = this.restaurantId;
              this.setMenuItems();
            } else {
              this.router.navigate(['404']);
            }
          }
        );
      }
    );
  }

  setMenuItemPicture(event: any): void {
    let picture: File = event.target.files[0];

    if (picture) {
      this.newMenuItem.hasPicture = true;
      this.newMenuItem.picture = picture;
      this.pictureFileReader.readAsDataURL(this.newMenuItem.picture);
    } else {
      this.newMenuItem.hasPicture = false;
      this.menuItemPictureElement.nativeElement.src = noPhotoURL;
    }
  }

  saveMenuItem(): void {
    this.authService.authUser.takeUntil(this.subscriptions.unsubscribe).subscribe(
      user => {
        this.newMenuItem.addUserId = user.id;
        this.newMenuItem.pictureURL = noPhotoURL;
        this.menuItemService.saveMenuItem(this.newMenuItem).subscribe(
          menuItem => {
            if (this.newMenuItem.hasPicture) {
              this.newMenuItem.id = menuItem.id;
              this.saveMenuItemPicture();
            }
          },
          error => {
            console.error(error);
          }
        );
      }
    );
  }

  private setMenuItems(): void {
    this.menuItems = this.menuItemService.getMenuItemsByRestaurantId(this.restaurantId);
  }

  private saveMenuItemPicture(): void {
    const task: any = this.menuItemService.saveMenuItemPicture(
      this.newMenuItem.id,
      this.restaurantId,
      this.newMenuItem.picture
    );

    task.percentageChanges().subscribe(
      percent => {
        console.log(percent);
      }
    );
    task.downloadURL().subscribe(
      url => {
        if (url) {
          this.newMenuItem.pictureURL = url;
          this.menuItemService.updateMenuItem(this.newMenuItem);
        } else {
          console.error('Error getting imageURL');
        }
      }
    );
  }

}
