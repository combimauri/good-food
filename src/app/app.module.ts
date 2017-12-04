import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { LoaderComponent } from './components/loader/loader.component';
import { SignInComponent } from './components/log-in/sign-in/sign-in.component';
import { SignUpComponent } from './components/log-in/sign-up/sign-up.component';
import { HomeComponent } from './components/home/home.component';
import { FavouriteFoodSelectorComponent } from './components/favourite-food-selector/favourite-food-selector.component';
import { RestaurantProfileComponent } from './components/restaurant-profile/restaurant-profile.component';

import { AuthenticationService } from './services/authentication/authentication.service';
import { AuthenticationGuardService } from './services/authentication/authentication-guard.service';
import { LogInGuardService } from './services/authentication/log-in-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    HomeComponent,
    FavouriteFoodSelectorComponent,
    RestaurantProfileComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    environment.production ? ServiceWorkerModule.register('/ngsw-worker.js') : []
  ],
  providers: [
    AuthenticationService,
    AuthenticationGuardService,
    LogInGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
