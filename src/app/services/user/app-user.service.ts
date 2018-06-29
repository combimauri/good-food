import { Injectable } from '@angular/core';

import { IappUser } from '../../interfaces/iapp-user';

const userItemKey: string = 'appUser';

@Injectable()
export class AppUserService {
    buildAppUser(id: string, name: string, photoURL: string): IappUser {
        return {
            id: id,
            name: name,
            photoURL: photoURL
        } as IappUser;
    }

    getCurrentAppUser(): IappUser {
        let appUserJSON = localStorage.getItem(userItemKey);
        return JSON.parse(appUserJSON) as IappUser;
    }

    changeCurrentAppUser(appUser: IappUser): void {
        let appUserJSON = JSON.stringify(appUser);
        localStorage.setItem(userItemKey, appUserJSON);
    }

    deleteCurrentAppUser(): void {
        localStorage.removeItem(userItemKey);
    }
}