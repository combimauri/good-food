import { IrestaurantId } from "../interfaces/irestaurant-id";

export class Restaurant implements IrestaurantId {
    id: string;
    name: string;
    type: string;
    categoryId: string;
    lat: number;
    lng: number;
    hasProfilePic: boolean;
    addUserId: string;
    profilePic: File;

    constructor() {
        this.hasProfilePic = false;
    }
}
