import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from '../authentication/authentication.service';
import { Iuser } from '../../interfaces/iuser';

const noDisplayName: string = 'Nuevo Usuario';
const noPhotoURL: string = './assets/img/nophoto.png';

@Injectable()
export class UserService {

  currentUser: any;

  private usersCollection: AngularFirestoreCollection<any>;

  constructor(private afs: AngularFirestore) {
    this.currentUser = {
      displayName: noDisplayName,
      photoURL: noPhotoURL
    }
    this.usersCollection = this.afs.collection<any>('users');
  }

  saveUser(user: any) {
    const name: string = user.displayName;
    const email: string = user.email;
    const newUser: Iuser = { name, email };
    this.usersCollection.doc(user.uid).set(newUser);
  }

}
