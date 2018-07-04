import { IrestaurantId } from '../interfaces/irestaurant-id';

export class Restaurant implements IrestaurantId {
    id: string;
    name: string;
    type: string;
    categoryId: string;
    lat: number;
    lng: number;
    hasProfilePic: boolean;
    photoURL?: string;
    addUserId: string;
    hasOwner?: boolean;
    ownerId?: string;
    profilePic?: File;
    followersCount: number;

    constructor() {
        this.hasProfilePic = false;
        this.hasOwner = false;
        this.followersCount = 0;
    }
}
