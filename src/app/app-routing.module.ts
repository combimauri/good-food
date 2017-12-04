import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInComponent } from './components/log-in/sign-in/sign-in.component';
import { SignUpComponent } from './components/log-in/sign-up/sign-up.component';
import { HomeComponent } from './components/home/home.component';
import { FavouriteFoodSelectorComponent } from './components/favourite-food-selector/favourite-food-selector.component';
import { RestaurantProfileComponent } from './components/restaurant-profile/restaurant-profile.component';

import { AuthenticationGuardService } from './services/authentication/authentication-guard.service';
import { LogInGuardService } from './services/authentication/log-in-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [
      LogInGuardService
    ]
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    canActivate: [
      LogInGuardService
    ]
  },
  {
    path: 'favourite-food',
    component: FavouriteFoodSelectorComponent,
    canActivate: [
      AuthenticationGuardService
    ]
  },
  {
    path: 'restaurant-profile',
    component: RestaurantProfileComponent,
    canActivate: [
      AuthenticationGuardService
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
