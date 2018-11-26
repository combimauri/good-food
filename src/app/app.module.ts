import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';

import { SubscriptionsService } from './services/subscriptions/subscriptions.service';
import { AuthenticationService } from './services/authentication/authentication.service';
import { AuthenticationGuardService } from './services/authentication/authentication-guard.service';
import { InternalGuard } from './services/authentication/internal.guard';
import { AppUserService } from './services/user/app-user.service';
import { UserService } from './services/user/user.service';
import { MapStyleService } from './services/maps/map-style.service';
import { MessageService } from './services/message/message.service';
import { RestaurantService } from './services/restaurant/restaurant.service';
import { RestaurantCategoryService } from './services/restaurant/restaurant-category.service';
import { PublicationService } from './services/publication/publication.service';
import { MenuItemService } from './services/restaurant/menu-item.service';
import { MenuItemCategoryService } from './services/restaurant/menu-item-category.service';
import { OrderService } from './services/restaurant/order.service';
import { CommentService } from './services/publication/comment.service';
import { FollowRelationshipService } from './services/relationship/follow-relationship.service';
import { HomeService } from './services/home/home.service';
import { ChatRoomService } from './services/chat/chat-room.service';
import { InitialLoaderService } from './services/initial-loader/initial-loader.service';

import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { OfflineComponent } from './components/errors/offline/offline.component';
import { AgmCoreModule } from '../../node_modules/@agm/core';
import { FoodOrdersComponent } from './components/food-orders/food-orders.component';

@NgModule({
    declarations: [
        AppComponent,
        MenuComponent,
        OfflineComponent,
        FoodOrdersComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        AngularFireModule.initializeApp(environment.firebase, 'good-food'),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireStorageModule,
        AppRoutingModule,
        AgmCoreModule.forRoot({
            apiKey: environment.googlemaps
        }),
        ServiceWorkerModule.register('./ngsw-worker.js', {
            enabled: environment.production
        })
    ],
    providers: [
        SubscriptionsService,
        AuthenticationService,
        AuthenticationGuardService,
        UserService,
        MapStyleService,
        MessageService,
        RestaurantService,
        RestaurantCategoryService,
        PublicationService,
        MenuItemService,
        MenuItemCategoryService,
        OrderService,
        CommentService,
        FollowRelationshipService,
        AppUserService,
        InternalGuard,
        HomeService,
        ChatRoomService,
        InitialLoaderService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
