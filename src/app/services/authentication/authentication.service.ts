import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { UserService } from '../../services/user/user.service';
import { RestaurantService } from '../restaurant/restaurant.service';
import { MessageService } from '../message/message.service';
import { Iuser } from '../../interfaces/iuser';
import { IuserId } from '../../interfaces/iuser-id';
import { AppUserService } from '../user/app-user.service';
import { IappUser } from '../../interfaces/iapp-user';
import { IrestaurantId } from '../../interfaces/irestaurant-id';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Injectable()
export class AuthenticationService extends AppUserService {
    authUser: Observable<IuserId>;

    userRestaurants: Observable<IrestaurantId[]>;

    showLoading: boolean;

    constructor(
        private userService: UserService,
        private restaurantService: RestaurantService,
        private messageService: MessageService,
        private firebaseAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router,
        private subscriptions: SubscriptionsService
    ) {
        super();
        this.showLoading = false;
        this.authUser = this.firebaseAuth.authState.switchMap(user => {
            if (user) {
                return this.afs
                    .doc<IuserId>(`users/${user.uid}`)
                    .snapshotChanges()
                    .map(action => {
                        const data = action.payload.data() as Iuser;
                        const id = action.payload.id;
                        this.userRestaurants = this.restaurantService.getBusinessOwnerRestaurants(
                            id
                        );
                        return { id, ...data };
                    });
            } else {
                return Observable.of(null);
            }
        });
    }

    getCurrentAppUser(): Observable<IappUser> {
        let appUser: IappUser = this.getCurrentUser();
        return combineLatest(this.validateUser(appUser), this.authUser).map(
            ([isValid, user]) => {
                if (!isValid) {
                    appUser = this.buildAppUser(
                        user.id,
                        user.name,
                        user.photoURL
                    );
                    this.changeCurrentAppUser(appUser);
                }
                return appUser;
            }
        );
    }

    isAppUserARestaurant(): Observable<boolean> {
        let appUser: IappUser = this.getCurrentUser();
        return combineLatest(this.validateUser(appUser), this.authUser).map(
            ([isValid, user]) => {
                if (isValid) {
                    return user.id !== appUser.id;
                }
                appUser = this.buildAppUser(user.id, user.name, user.photoURL);
                this.changeCurrentAppUser(appUser);
                return false;
            }
        );
    }

    signUp(email: string, password: string, confirmPassword: string): void {
        this.showLoading = true;
        if (password === confirmPassword) {
            this.firebaseAuth.auth
                .createUserWithEmailAndPassword(email, password)
                .then(user => {
                    this.logIn(user);
                })
                .catch(error => {
                    this.handleError(error.message);
                });
        } else {
            this.handleError('Password and Confirm Password are not equals.');
        }
    }

    logInWithEmail(email: string, password: string): void {
        this.showLoading = true;
        this.firebaseAuth.auth
            .signInWithEmailAndPassword(email, password)
            .then(user => {
                this.logIn(user);
            })
            .catch(error => {
                this.handleError(error.message);
            });
    }

    logInWithFacebook(): void {
        this.showLoading = true;
        this.firebaseAuth.auth
            .signInWithPopup(new firebase.auth.FacebookAuthProvider())
            .then(userRef => {
                this.logIn(userRef.user);
            })
            .catch(error => {
                this.handleError(error.message);
            });
    }

    logInWithGmail(): void {
        this.showLoading = true;
        this.firebaseAuth.auth
            .signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .then(userRef => {
                this.logIn(userRef.user);
            })
            .catch(error => {
                this.handleError(error.message);
            });
    }

    logOut(): void {
        this.subscriptions.kill();
        this.firebaseAuth.auth
            .signOut()
            .then(() => {
                this.deleteCurrentAppUser();
                this.router.navigate(['/login']);
            })
            .catch(error => {
                this.handleError(error.message);
            });
    }

    private logIn(user: any): void {
        this.showLoading = false;
        this.subscriptions.revive();
        this.userService.saveUser(user);
        this.router.navigate(['/home']);
    }

    private validateUser(user: IappUser): Observable<boolean> {
        if (user) {
            return combineLatest(this.authUser, this.userRestaurants).map(
                ([authUser, userRestaurants]) => {
                    if (user.id !== authUser.id) {
                        let currentRestaurant: IrestaurantId = userRestaurants.find(
                            restaurant => {
                                return restaurant.id === user.id;
                            }
                        );
                        return currentRestaurant ? true : false;
                    }
                    return true;
                }
            );
        }
        return Observable.of(false);
    }

    private handleError(errorMessage: string): void {
        this.showLoading = false;
        this.messageService.setMessage(
            errorMessage,
            'has-error',
            'fa fa-times-circle-o'
        );
        console.log('Something went wrong:', errorMessage);
    }
}
