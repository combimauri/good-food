import { Injectable } from '@angular/core';

import { IappUser } from '../../interfaces/iapp-user';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

const userItemKey: string = 'appUser';

@Injectable()
export class AppUserService {
    changeUserObservable: Observable<IappUser>;

    private changeUserSubject: Subject<IappUser>;

    constructor() {
        this.changeUserSubject = new Subject<IappUser>();
        this.changeUserObservable = this.changeUserSubject.asObservable();
    }

    buildAppUser(id: string, name: string, photoURL: string): IappUser {
        return {
            id: id,
            name: name,
            photoURL: photoURL
        } as IappUser;
    }

    changeCurrentAppUser(appUser: IappUser): void {
        let appUserJSON = JSON.stringify(appUser);
        localStorage.setItem(userItemKey, appUserJSON);
        this.changeUserSubject.next(appUser);
    }

    deleteCurrentAppUser(): void {
        localStorage.removeItem(userItemKey);
    }

    protected getCurrentUser(): IappUser {
        let appUserJSON = localStorage.getItem(userItemKey);
        return JSON.parse(appUserJSON) as IappUser;
    }
}
