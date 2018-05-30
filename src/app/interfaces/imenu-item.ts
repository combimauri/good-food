import { Observable } from "rxjs/Observable";

export interface ImenuItem {
    name: string;
    description?: string;
    price: number;
    restaurantId: string;
    hasPicture: boolean;
    addUserId: string;
    categoryId: string;
    pictureURL: string;
}
