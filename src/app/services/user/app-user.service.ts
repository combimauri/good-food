import { Injectable } from '@angular/core';

import { IappUser } from '../../interfaces/iapp-user';

const userItemKey: string = 'appUser';

@Injectable()
export abstract class AppUserService {
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
    }

    deleteCurrentAppUser(): void {
        localStorage.removeItem(userItemKey);
    }

    protected getCurrentUser(): IappUser {
        let appUserJSON = localStorage.getItem(userItemKey);
        return JSON.parse(appUserJSON) as IappUser;
    }

    protected abstract validateUser(user: IappUser): any;
}
