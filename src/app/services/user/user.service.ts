import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from '../authentication/authentication.service';
import { Iuser } from '../../interfaces/iuser';

const noDisplayName: string = 'Nuevo Usuario';
const noPhotoURL: string = './assets/img/nophoto.png';

@Injectable()
export class UserService {

  private usersCollection: AngularFirestoreCollection<any>;

  constructor(private afs: AngularFirestore) {
    this.usersCollection = this.afs.collection<any>('users');
  }

  saveUser(user: any) {
    const newUser: Iuser = {
      email: user.email,
      name: user.displayName ? user.displayName : noDisplayName,
      photoURL: user.photoURL ? user.photoURL : noPhotoURL,
      roles: {
        normalUser: true
      }
    };

    this.usersCollection.doc(user.uid).set(newUser, { merge: true });
  }

}
