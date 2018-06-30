import { Icomment } from '../interfaces/icomment';
import { IappUser } from '../interfaces/iapp-user';

export class Comment implements Icomment {
    ownerId: string;
    isOwnerARestaurant: boolean;
    postId: string;
    comment: string;
    date: Date;
    user: IappUser;
}
