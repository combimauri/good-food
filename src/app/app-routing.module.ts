import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuardService } from './services/authentication/authentication-guard.service';
import { InternalGuard } from './services/authentication/internal.guard';

import { MenuComponent } from './components/menu/menu.component';
import { RestaurantsMapComponent } from './components/restaurants-map/restaurants-map.component';
import { OfflineComponent } from './components/errors/offline/offline.component';
import { RegisterMyRestaurantComponent } from './components/register-my-restaurant/register-my-restaurant.component';

const routes: Routes = [
    {
        path: 'login',
        loadChildren: 'app/components/login/login.module#LoginModule',
        canActivate: [AuthenticationGuardService]
    },
    {
        path: 'register',
        loadChildren: 'app/components/register/register.module#RegisterModule',
        canActivate: [AuthenticationGuardService]
    },
    {
        path: '',
        component: MenuComponent,
        canActivate: [AuthenticationGuardService],
        children: [
            {
                path: '',
                redirectTo: '/home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                loadChildren: 'app/components/home/home.module#HomeModule',
                canActivate: [InternalGuard]
            },
            {
                path: 'restaurant-profile/:id',
                loadChildren:
                    'app/components/restaurant-profile/restaurant-profile.module#RestaurantProfileModule'
            },
            {
                path: 'restaurants-map',
                loadChildren: 'app/components/restaurants-map/restaurants-map.module#RestaurantsMapModule',
                canActivate: [InternalGuard]
            },
            {
                path: 'register-my-restaurant',
                loadChildren:
                    'app/components/register-my-restaurant/register-my-restaurant.module#RegisterMyRestaurantModule',
                canActivate: [InternalGuard]
            },
            {
                path: 'restaurant-menu/:id',
                loadChildren:
                    'app/components/restaurant-menu/restaurant-menu.module#RestaurantMenuModule'
            },
            {
                path: 'user-feed',
                loadChildren:
                    'app/components/user-wall/user-wall.module#UserWallModule',
                canActivate: [InternalGuard]
            },
            {
                path: 'messages',
                loadChildren:
                    'app/components/chat-rooms/chat-rooms.module#ChatRoomsModule'
            },
            {
                path: 'search',
                loadChildren:
                    'app/components/advanced-search/advanced-search.module#AdvancedSearchModule',
                canActivate: [InternalGuard]
            }
        ]
    },
    {
        path: 'offline',
        component: OfflineComponent,
        canActivate: [AuthenticationGuardService]
    },
    {
        path: '**',
        loadChildren:
            'app/components/errors/page-not-found/page-not-found.module#PageNotFoundModule'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
