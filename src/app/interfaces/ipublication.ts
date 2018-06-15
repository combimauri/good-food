import { Observable } from "rxjs/Observable";

export interface Ipublication {
    ownerName: string;
    paragraph: string;
    date: Date;
    status: string;
    restaurantId: string;
    restaurantPicture?: Observable<any>;
    restaurantPictureURL: string;
}
