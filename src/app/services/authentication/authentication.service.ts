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

  signUp(name, email, password): void {
    this.showLoading = true;
    this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(user => {
        this.logIn(user);
      })
      .catch(error => {
        this.showLoading = false;
        console.log('Something went wrong:', error.message);
      });
  }

  logInWithEmail(email: string, password: string): void {
    this.showLoading = true;
    this.firebaseAuth.auth.signInWithEmailAndPassword(email, password)
      .then(user => {
        this.logIn(user);
      })
      .catch(error => {
        this.showLoading = false;
        console.log('Something went wrong:', error.message);
      });
  }

  logInWithFacebook(): void {
    this.firebaseAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(user => {
        this.logIn(user);
      })
      .catch(error => {
        console.log('Something went wrong:', error.message);
      });
  }

  logInWithGmail(): void {
    this.firebaseAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(user => {
        this.logIn(user);
      })
      .catch(error => {
        console.log('Something went wrong:', error.message);
      });
  }

  logOut(): void {
    this.firebaseAuth.auth.signOut()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => {
        console.log('Something went wrong:', error.message);
      });
  }

  private logIn(user): void {
    this.showLoading = false;
    this.currentUser = user;
    this.router.navigate(['/home']);
  }

}
