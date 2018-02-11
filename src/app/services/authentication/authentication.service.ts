import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

import { UserService } from '../../services/user/user.service';
import { MessageService } from '../message/message.service';
import { Iuser } from '../../interfaces/iuser';
import { IuserId } from '../../interfaces/iuser-id';

@Injectable()
export class AuthenticationService {

  authUser: Observable<IuserId>;

  showLoading: boolean;

  constructor(private userService: UserService, private messageService: MessageService, private firebaseAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
    this.showLoading = false;
    this.authUser = this.firebaseAuth.authState.switchMap(
      (user) => {
        if (user) {
          return this.afs.doc<IuserId>(`users/${user.uid}`).snapshotChanges().map(
            (action) => {
              const data = action.payload.data() as Iuser;
              const id = action.payload.id;
              return { id, ...data };
            }
          );
        } else {
          return Observable.of(null);
        }
      }
    );
  }

  signUp(email: string, password: string, confirmPassword: string): void {
    this.showLoading = true;
    if (password === confirmPassword) {
      this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(userRef => {
          this.logIn(userRef.user);
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
    this.firebaseAuth.auth.signInWithEmailAndPassword(email, password)
      .then(userRef => {
        this.logIn(userRef.user);
      })
      .catch(error => {
        this.handleError(error.message);
      });
  }

  logInWithFacebook(): void {
    this.showLoading = true;
    this.firebaseAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(userRef => {
        this.logIn(userRef.user);
      })
      .catch(error => {
        this.handleError(error.message);
      });
  }

  logInWithGmail(): void {
    this.showLoading = true;
    this.firebaseAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(userRef => {
        this.logIn(userRef.user);
      })
      .catch(error => {
        this.handleError(error.message);
      });
  }

  logOut(): void {
    this.firebaseAuth.auth.signOut()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => {
        this.handleError(error.message);
      });
  }

  private logIn(user: any): void {
    this.showLoading = false;
    this.userService.saveUser(user);
    this.router.navigate(['/home']);
  }

  private handleError(errorMessage: string): void {
    this.showLoading = false;
    this.messageService.setMessage(errorMessage, 'has-error', 'fa fa-times-circle-o');
    console.log('Something went wrong:', errorMessage);
  }

}
