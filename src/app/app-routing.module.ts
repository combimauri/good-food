import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './log-in/sign-in/sign-in.component';
import { SignUpComponent } from './log-in/sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { FavouriteFoodSelectorComponent } from './favourite-food-selector/favourite-food-selector.component';
import { RestaurantProfileComponent } from './restaurant-profile/restaurant-profile.component';

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
    component: SignInComponent
  },
  {
    path: 'sign-up',
    component: SignUpComponent
  },
  {
    path: 'favourite-food',
    component: FavouriteFoodSelectorComponent
  },
  {
    path: 'restaurant-profile',
    component: RestaurantProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
