import { IpublicationId } from '../interfaces/ipublication-id';

export class Publication implements IpublicationId {
    id: string;
    ownerName: string;
    paragraph: string;
    date: Date;
    status: string;
    restaurantId: string;
}
