import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AgmCoreModule } from '@agm/core';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';

import { AuthenticationService } from './services/authentication/authentication.service';
import { AuthenticationGuardService } from './services/authentication/authentication-guard.service';
import { LoginGuardService } from './services/authentication/login-guard.service';
import { MapStyleService } from './services/maps/map-style.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MenuComponent } from './components/menu/menu.component';
import { HomeComponent } from './components/home/home.component';
import { RestaurantProfileComponent } from './components/restaurant-profile/restaurant-profile.component';
import { GoodFoodMapComponent } from './components/good-food-map/good-food-map.component';
import { PageNotFoundComponent } from './components/errors/page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    MenuComponent,
    HomeComponent,
    RestaurantProfileComponent,
    GoodFoodMapComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase, 'good-food'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googlemaps
    }),
    AppRoutingModule
    // ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    AuthenticationService,
    AuthenticationGuardService,
    LoginGuardService,
    MapStyleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
