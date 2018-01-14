import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

import { MessageService } from '../message/message.service';

const noDisplayName: string = 'Nuevo Usuario';
const noPhotoURL: string = './assets/img/nophoto.png';

@Injectable()
export class AuthenticationService {

  showLoading: boolean;

  currentUser: any;

  constructor(private router: Router, public firebaseAuth: AngularFireAuth, private messageService: MessageService) {
    this.showLoading = false;
    this.currentUser = {
      displayName: noDisplayName,
      photoURL: noPhotoURL
    }
    this.firebaseAuth.auth.onAuthStateChanged(user => {
      this.currentUser = user;
    });
  }

  getAuthState(): Observable<firebase.User> {
    return this.firebaseAuth.authState;
  }

  signUp(email, password, confirmPassword): void {
    this.showLoading = true;
    if (password === confirmPassword) {
      this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
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
    this.firebaseAuth.auth.signInWithEmailAndPassword(email, password)
      .then(user => {
        this.logIn(user);
      })
      .catch(error => {
        this.handleError(error.message);
      });
  }

  logInWithFacebook(): void {
    this.showLoading = true;
    this.firebaseAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(user => {
        this.logIn(user);
      })
      .catch(error => {
        this.handleError(error.message);
      });
  }

  logInWithGmail(): void {
    this.showLoading = true;
    this.firebaseAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(user => {
        this.logIn(user);
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

  private logIn(user): void {
    this.showLoading = false;
    this.currentUser = user;
    this.router.navigate(['/home']);
  }

  private handleError(errorMessage): void {
    this.showLoading = false;
    this.messageService.setMessage(errorMessage, 'has-error', 'fa fa-times-circle-o');
    console.log('Something went wrong:', errorMessage);
  }

}
