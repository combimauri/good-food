import { ImenuItemId } from '../interfaces/imenu-item-id';

export class RestaurantMenuItem implements ImenuItemId {
    id: string;
    description?: string;
    name: string;
    price: number;
    restaurantId: string;
    hasPicture: boolean;
    addUserId: string;
    categoryId: string;
    pictureURL: string;
    picture: File;

    constructor() {
        this.hasPicture = false;
        this.description = '';
    }
}
