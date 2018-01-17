import { Irestaurant } from '../interfaces/irestaurant';

export class Restaurant implements Irestaurant {
    type: string;
    category: string;
    name: string;
    lat: number;
    lng: number;
}
