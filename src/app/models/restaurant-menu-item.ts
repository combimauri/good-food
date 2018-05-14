import { ImenuItemId } from '../interfaces/imenu-item-id';

export class RestaurantMenuItem implements ImenuItemId {
    id: string;
    name: string;
    price: number;
    restaurantId: string;
    hasPicture: boolean;
    addUserId: string;
    picture: File;

    constructor() {
        this.hasPicture = false;
    }
}
