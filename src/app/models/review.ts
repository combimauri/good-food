import { Ireview } from '../interfaces/ireview';

export class Review implements Ireview {
    restaurantId: string;
    userId: string;
    foodRating: number;
    attentionRating: number;
    environmentRating: number;
    opinion: string;
    date: Date;
}
