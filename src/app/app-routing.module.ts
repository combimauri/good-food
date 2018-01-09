import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuardService } from './services/authentication/authentication-guard.service';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MenuComponent } from './components/menu/menu.component';
import { HomeComponent } from './components/home/home.component';
import { RestaurantProfileComponent } from './components/restaurant-profile/restaurant-profile.component';
import { GoodFoodMapComponent } from './components/good-food-map/good-food-map.component';
import { PageNotFoundComponent } from './components/errors/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [
      AuthenticationGuardService
    ]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [
      AuthenticationGuardService
    ]
  },
  {
    path: '',
    component: MenuComponent,
    canActivate: [
      AuthenticationGuardService
    ],
    children: [
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
        path: 'restaurant-profile/:id',
        component: RestaurantProfileComponent
      },
      {
        path: 'restaurants-map',
        component: GoodFoodMapComponent
      }
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
