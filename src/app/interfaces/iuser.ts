import { Iroles } from './iroles';

export interface Iuser {
  email: string;
  name: string;
  photoURL: string;
  roles: Iroles;
  following?: string[];
}
