import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AgmCoreModule } from '@agm/core';
import { Ng2ImgMaxModule } from 'ng2-img-max';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';

import { SubscriptionsService } from './services/subscriptions/subscriptions.service';
import { AuthenticationService } from './services/authentication/authentication.service';
import { AuthenticationGuardService } from './services/authentication/authentication-guard.service';
import { UserService } from './services/user/user.service';
import { MapStyleService } from './services/maps/map-style.service';
import { MessageService } from './services/message/message.service';
import { RestaurantService } from './services/restaurant/restaurant.service';
import { RestaurantCategoryService } from './services/restaurant/restaurant-category.service';
import { PublicationService } from './services/publication/publication.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MenuComponent } from './components/menu/menu.component';
import { HomeComponent } from './components/home/home.component';
import { RestaurantProfileComponent } from './components/restaurant-profile/restaurant-profile.component';
import { RestaurantsMapComponent } from './components/restaurants-map/restaurants-map.component';
import { RegisterMyRestaurantComponent } from './components/register-my-restaurant/register-my-restaurant.component';
import { PageNotFoundComponent } from './components/errors/page-not-found/page-not-found.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    MenuComponent,
    HomeComponent,
    RestaurantProfileComponent,
    RestaurantsMapComponent,
    RegisterMyRestaurantComponent,
    PageNotFoundComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase, 'good-food'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googlemaps
    }),
    Ng2ImgMaxModule,
    AppRoutingModule
    // ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production })
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
    PublicationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
