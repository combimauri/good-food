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
import { MenuItemCategoryService } from '../../services/restaurant/menu-item-category.service';
import { ImenuItemCategoryId } from '../../interfaces/imenu-item-category-id';

const noPhotoURL: string = './assets/img/nophoto.png';

declare const $: any;

@Component({
  selector: 'food-restaurant-menu',
  templateUrl: './restaurant-menu.component.html',
  styleUrls: ['./restaurant-menu.component.scss']
})
export class RestaurantMenuComponent implements OnInit {

  restaurantId: string;

  restaurant: Observable<Irestaurant>;

  currentMenuItem: ImenuItemId;

  newMenuItem: RestaurantMenuItem;

  menuItems: Observable<ImenuItemId[]>;

  menuItemCategories: ImenuItemCategoryId[];

  categoryName: string;

  isMenuItemsEmpty: boolean;

  private pictureFileReader: FileReader;

  @ViewChild("menuItemPictureElement")
  private menuItemPictureElement: ElementRef;

  @ViewChild('menuItemCategoriesElement')
  private menuItemCategoriesElement: ElementRef;

  constructor(private menuItemService: MenuItemService,
    private menuItemCategoriesService: MenuItemCategoryService,
    private restaurantService: RestaurantService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private subscriptions: SubscriptionsService) {

    this.currentMenuItem = new RestaurantMenuItem();
    this.newMenuItem = new RestaurantMenuItem();
    this.menuItemCategories = new Array();
    this.pictureFileReader = new FileReader();

    this.pictureFileReader.onloadend = () => {
      this.menuItemPictureElement.nativeElement.src = this.pictureFileReader.result;
    };
  }

  ngOnInit(): void {
    $('.select2').select2({
      tags: true,
      placeholder: 'Ingrese una categoría',
      language: {
        noResults: (params) => {
          return 'Ingrese una nueva categoría';
        }
      }
    });

    $('.select2').on('change', (event) => {
      this.categoryName = event.target.value;
    });

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

  showCurrentMenuItemInfo(menuItem: ImenuItemId) {
    this.currentMenuItem = menuItem;
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
    let categoryId = this.getCategoryIdFromCategories();

    if (categoryId) {
      this.newMenuItem.categoryId = categoryId;
      this.saveNewMenuItem();
    } else {
      this.menuItemCategoriesService.saveMenuItemCategory(this.categoryName, this.restaurantId).subscribe(
        category => {
          this.newMenuItem.categoryId = category.id;
          this.saveNewMenuItem();
        },
        error => {
          console.error(error);
        }
      );
    }
  }

  private getCategoryIdFromCategories(): string {
    for (const category of this.menuItemCategories) {
      if (category.name === this.categoryName) {
        return category.id;
      }
    }
    return '';
  }

  private saveNewMenuItem(): void {
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
    this.menuItemCategoriesService.getMenuItemCategoriesByRestaurantId(this.restaurantId).subscribe(
      categories => {
        this.menuItemCategories = categories;
        this.isMenuItemsEmpty = this.menuItemCategories.length === 0;
      }
    );
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
