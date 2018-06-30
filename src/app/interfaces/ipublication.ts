import { Observable } from "rxjs/Observable";

export interface Ipublication {
    ownerName: string;
    paragraph: string;
    date: Date;
    restaurantId: string;
    restaurantPicture?: Observable<any>;
    restaurantPictureURL: string;
}
