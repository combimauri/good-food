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

const noDisplayName: string = 'Nuevo Usuario';
const noPhotoURL: string = './assets/img/nophoto.png';

@Injectable()
export class UserService {
    private usersCollection: AngularFirestoreCollection<any>;

    constructor(
        private afs: AngularFirestore,
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

        this.usersCollection.doc(user.uid).set(newUser, { merge: true });
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
