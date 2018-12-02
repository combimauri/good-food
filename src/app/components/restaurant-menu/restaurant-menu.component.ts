import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
import { OrderService } from '../../services/restaurant/order.service';
import { OrderItem } from '../../interfaces/order-item';
import { Order, OrderState } from '../../interfaces/order';
import { RestaurantSearcherService } from '../../services/searcher/restaurant-searcher.service';

declare const $: any;
const cochaLat = -17.393695;
const cochaLng = -66.157126;
const noPhotoURL = './assets/img/norestaurantphoto.png';

@Component({
    selector: 'food-restaurant-menu',
    templateUrl: './restaurant-menu.component.html',
    styleUrls: ['./restaurant-menu.component.scss']
})
export class RestaurantMenuComponent implements OnInit {
    restaurantId: string;

    restaurant: Observable<Irestaurant>;

    currentMenuItem: ImenuItemId;

    quantityOfCurrentMenuItems: number;

    newMenuItem: RestaurantMenuItem;

    menuItems: Observable<ImenuItemId[]>;

    menuItemCategories: ImenuItemCategoryId[];

    categoryName: string;

    isMenuItemsEmpty: boolean;

    isCurrentUserARestaurant: boolean;

    order: Order;

    isClientInTheRestaurant: boolean;

    private pictureFileReader: FileReader;

    @ViewChild('menuItemPictureElement')
    private menuItemPictureElement: ElementRef;

    constructor(
        private menuItemService: MenuItemService,
        private menuItemCategoriesService: MenuItemCategoryService,
        private restaurantService: RestaurantService,
        private orderService: OrderService,
        private authService: AuthenticationService,
        private route: ActivatedRoute,
        private router: Router,
        private subscriptions: SubscriptionsService,
        private searcherService: RestaurantSearcherService
    ) {
        this.currentMenuItem = new RestaurantMenuItem();
        this.newMenuItem = new RestaurantMenuItem();
        this.menuItemCategories = new Array();
        this.isCurrentUserARestaurant = false;
        this.pictureFileReader = new FileReader();
        this.order = {
            id: '',
            restaurantId: '',
            userId: '',
            clientName: '',
            tableNumber: '',
            items: new Array<OrderItem>(),
            total: 0,
            date: new Date(),
            state: OrderState.CREATED,
            lat: cochaLat,
            lng: cochaLng
        };
        this.isClientInTheRestaurant = false;

        this.authService.isAppUserARestaurant().subscribe(isRestaurant => {
            this.isCurrentUserARestaurant = isRestaurant;
        });

        this.pictureFileReader.onloadend = () => {
            this.menuItemPictureElement.nativeElement.src = this.pictureFileReader.result;
        };
    }

    ngOnInit(): void {
        $('.select2').select2({
            tags: true,
            placeholder: 'Ingrese una categoría',
            language: {
                noResults: params => {
                    return 'Ingrese una nueva categoría';
                }
            }
        });

        $('.select2').on('change', event => {
            this.categoryName = event.target.value;
        });

        this.route.params
            .takeUntil(this.subscriptions.destroyUnsubscribe)
            .subscribe(params => {
                this.restaurantId = params['id'];
                this.restaurant = this.restaurantService.getRestaurant(
                    this.restaurantId
                );
                this.restaurant.subscribe(restaurant => {
                    if (restaurant) {
                        this.newMenuItem.restaurantId = this.restaurantId;
                        this.setMenuItems();
                        this.initOrder();
                    } else {
                        this.router.navigate(['404']);
                    }
                });
            });
    }

    showCurrentMenuItemInfo(menuItem: ImenuItemId) {
        this.currentMenuItem = menuItem;
        this.quantityOfCurrentMenuItems = 0;
    }

    setMenuItemPicture(event: any): void {
        const picture: File = event.target.files[0];

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
        const categoryId = this.getCategoryIdFromCategories();

        if (categoryId) {
            this.newMenuItem.categoryId = categoryId;
            this.saveNewMenuItem();
        } else {
            this.menuItemCategoriesService
                .saveMenuItemCategory(this.categoryName, this.restaurantId)
                .subscribe(category => {
                    this.newMenuItem.categoryId = category.id;
                    this.saveNewMenuItem();
                });
        }
    }

    addItemToTheOrder(): void {
        if (
            this.isClientInTheRestaurant &&
            this.quantityOfCurrentMenuItems > 0
        ) {
            let orderItem: OrderItem = this.order.items.find(
                item => item.menuItemId === this.currentMenuItem.id
            );

            if (orderItem) {
                orderItem.quantity += this.quantityOfCurrentMenuItems;
                orderItem.total = orderItem.price * orderItem.quantity;
            } else {
                orderItem = {
                    menuItemId: this.currentMenuItem.id,
                    name: this.currentMenuItem.name,
                    price: this.currentMenuItem.price,
                    quantity: this.quantityOfCurrentMenuItems,
                    total:
                        this.currentMenuItem.price *
                        this.quantityOfCurrentMenuItems
                };
                this.order.items.push(orderItem);
            }

            this.updateOrderTotal();
        }
    }

    deleteItemFromOrder(item: OrderItem): void {
        item.quantity = 0;
        this.updateOrderTotal();
    }

    updateOrderTotal(): void {
        let total = 0;
        for (let i = 0; i < this.order.items.length; i++) {
            const item = this.order.items[i];
            if (item.quantity > 0) {
                item.total = item.price * item.quantity;
                total += item.total;
            } else {
                this.order.items.splice(i, 1);
                i--;
            }
        }
        this.order.total = total;
    }

    saveOrder(): void {
        this.updateOrderTotal();
        if (this.isClientInTheRestaurant && this.order.items.length > 0) {
            this.order.date = new Date();
            this.orderService.saveOrder(this.order);
            this.router.navigate(['restaurant-menu', this.restaurantId, 'orders']);
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
        this.authService.authUser
            .takeUntil(this.subscriptions.destroyUnsubscribe)
            .subscribe(user => {
                this.newMenuItem.addUserId = user.id;
                this.newMenuItem.pictureURL = noPhotoURL;
                this.menuItemService
                    .saveMenuItem(this.newMenuItem)
                    .subscribe(menuItem => {
                        if (this.newMenuItem.hasPicture) {
                            this.newMenuItem.id = menuItem.id;
                            this.saveMenuItemPicture();
                        }
                    });
            });
    }

    private setMenuItems(): void {
        this.menuItems = this.menuItemService.getMenuItemsByRestaurantId(
            this.restaurantId
        );
        this.menuItemCategoriesService
            .getMenuItemCategoriesByRestaurantId(this.restaurantId)
            .subscribe(categories => {
                this.menuItemCategories = categories;
                this.isMenuItemsEmpty = this.menuItemCategories.length === 0;
            });
    }

    private saveMenuItemPicture(): void {
        const task: any = this.menuItemService.saveMenuItemPicture(
            this.newMenuItem.id,
            this.restaurantId,
            this.newMenuItem.picture
        );

        task.percentageChanges().subscribe();
        task.downloadURL().subscribe(url => {
            if (url) {
                this.newMenuItem.pictureURL = url;
                this.menuItemService.updateMenuItem(this.newMenuItem);
            } else {
                console.error('Error getting imageURL');
            }
        });
    }

    private initOrder(): void {
        const maxDistance = 1;
        this.searcherService
            .searchNearbyRestaurants(maxDistance)
            .first()
            .takeUntil(this.subscriptions.destroyUnsubscribe)
            .subscribe(restaurants => {
                const currentRestaurant = restaurants.find(
                    current => current.id === this.restaurantId
                );

                this.isClientInTheRestaurant = !!currentRestaurant;
            });

        this.authService.authUser
            .first()
            .takeUntil(this.subscriptions.destroyUnsubscribe)
            .subscribe(user => {
                this.order.userId = user.id;
                this.order.restaurantId = this.restaurantId;
                this.order.clientName = user.name;
                this.setClientPosition();
            });
    }

    private setClientPosition(): void {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.order.lat = position.coords.latitude;
                    this.order.lng = position.coords.longitude;
                },
                () => {
                    this.handleLocationError(true);
                }
            );
        } else {
            this.handleLocationError(false);
        }
    }

    private handleLocationError(browserHasGeolocation: boolean): void {
        this.order.lat = cochaLat;
        this.order.lng = cochaLng;
        const errorMessage = browserHasGeolocation
            ? 'Error: El servicio de Geolocalización falló.'
            : 'Error: Tu navegador no soporta Geolocalización.';

        console.error(errorMessage);
    }
}
