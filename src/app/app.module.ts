import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';

import { SignInComponent } from './log-in/sign-in/sign-in.component';
import { SignUpComponent } from './log-in/sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { FavouriteFoodSelectorComponent } from './favourite-food-selector/favourite-food-selector.component';
import { RestaurantProfileComponent } from './restaurant-profile/restaurant-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    HomeComponent,
    FavouriteFoodSelectorComponent,
    RestaurantProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    environment.production ? ServiceWorkerModule.register('/ngsw-worker.js') : []
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
