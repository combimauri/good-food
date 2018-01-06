import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuardService } from './services/authentication/authentication-guard.service';
import { LoginGuardService } from './services/authentication/login-guard.service';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { RestaurantProfileComponent } from './components/restaurant-profile/restaurant-profile.component';
import { GoodFoodMapComponent } from './components/good-food-map/good-food-map.component';
import { PageNotFoundComponent } from './components/errors/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [
      LoginGuardService
    ]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [
      LoginGuardService
    ]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [
      AuthenticationGuardService
    ]
  },
  {
    path: 'restaurant-profile/:id',
    component: RestaurantProfileComponent,
    canActivate: [
      AuthenticationGuardService
    ]
  },
  {
    path: 'map',
    component: GoodFoodMapComponent,
    canActivate: [
      AuthenticationGuardService
    ]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
