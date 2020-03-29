import {User} from './user';
import {Plat} from './plat';

export class Commande {
    id: number;
    plat: Plat;
    user: User;
    date_commande: string;

}
