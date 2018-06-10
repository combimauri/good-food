import { IpublicationId } from '../interfaces/ipublication-id';
import { Comment } from '../models/comment';

export class Publication implements IpublicationId {
    id: string;
    ownerName: string;
    paragraph: string;
    date: Date;
    status: string;
    restaurantId: string;
    newComment?: string;
    comments?: Comment[];
}
