import { Iuser } from "../interfaces/iuser";
import { Iroles } from "../interfaces/iroles";

export class User implements Iuser {
    email: string;
    name: string;
    photoURL: string;
    roles: Iroles;
    following?: string[];
}
