import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { Iuser } from '../../interfaces/iuser';
import { IuserId } from '../../interfaces/iuser-id';
import { AppUserService } from './app-user.service';
import { IappUser } from '../../interfaces/iapp-user';

const noDisplayName: string = 'Nuevo Usuario';
const noPhotoURL: string = './assets/img/nophoto.png';

@Injectable()
export class UserService {
    private usersCollection: AngularFirestoreCollection<any>;

    constructor(
        private afs: AngularFirestore,
        private appUserService: AppUserService,
        private subscriptions: SubscriptionsService
    ) {
        this.usersCollection = this.afs.collection<any>('users');
    }

    getUser(id: string): Observable<Iuser> {
        let userDoc: AngularFirestoreDocument<Iuser> = this.afs.doc<Iuser>(
            `users/${id}`
        );

        return userDoc.valueChanges().takeUntil(this.subscriptions.unsubscribe);
    }

    saveUser(user: any): void {
        const newUser: Iuser = {
            email: user.email,
            name: user.displayName ? user.displayName : noDisplayName,
            photoURL: user.providerData[0].photoURL
                ? user.providerData[0].photoURL
                : noPhotoURL,
            roles: {
                normalUser: true
            }
        };
        const appUser: IappUser = this.appUserService.buildAppUser(
            user.uid,
            newUser.name,
            newUser.photoURL,
            false
        );

        this.usersCollection.doc(user.uid).set(newUser, { merge: true });
        this.appUserService.changeCurrentAppUser(appUser);
    }

    updateUserToFoodBusinessOwner(user: IuserId): void {
        const ownerUser: Iuser = {
            email: user.email,
            name: user.name,
            photoURL: user.photoURL,
            roles: {
                businessOwner: true
            }
        };

        this.usersCollection.doc(user.id).set(ownerUser, { merge: true });
    }
}
