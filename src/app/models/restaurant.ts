import { IrestaurantId } from "../interfaces/irestaurant-id";

export class Restaurant implements IrestaurantId {
    id: string;
    type: string;
    category: string;
    name: string;
    lat: number;
    lng: number;
}
