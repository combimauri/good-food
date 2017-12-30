import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthenticationService } from './services/authentication/authentication.service';
import { AuthenticationGuardService } from './services/authentication/authentication-guard.service';
import { LoginGuardService } from './services/authentication/login-guard.service';

import { environment } from '../environments/environment';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { RestaurantProfileComponent } from './components/restaurant-profile/restaurant-profile.component';
import { RestaurantLocationsComponent } from './components/restaurant-locations/restaurant-locations.component';
import { PageNotFoundComponent } from './components/errors/page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    RestaurantProfileComponent,
    PageNotFoundComponent,
    RestaurantLocationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
    // ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    AuthenticationService,
    AuthenticationGuardService,
    LoginGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
