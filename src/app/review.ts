import { Ireview } from './ireview';

export class Review implements Ireview {
    restaurantId: string;
    userId: string;
    foodScore: number;
    serviceScore: number;
    placeScore: string;
    comment: string;
    addDate: Date;
}
