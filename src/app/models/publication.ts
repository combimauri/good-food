import { IpublicationId } from '../interfaces/ipublication-id';
import { Comment } from '../models/comment';
import { Observable } from 'rxjs/Observable';

export class Publication implements IpublicationId {
    id: string;
    ownerName: string;
    paragraph: string;
    date: Date;
    restaurantId: string;
    restaurantPicture?: Observable<any>;
    restaurantPictureURL: string;
    newComment?: string;
    comments?: Comment[];
}
