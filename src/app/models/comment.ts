import { Icomment } from "../interfaces/icomment";
import { Iuser } from "../interfaces/iuser";

export class Comment implements Icomment {
    ownerId: string;
    postId: string;
    comment: string;
    date: Date;
    user: Iuser;
}
