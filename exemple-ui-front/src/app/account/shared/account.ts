import * as moment from 'moment';

export interface Account {
    email: string;
    lastname: string;
    firstname: string;
    birthday: moment.Moment | string;
    id?: string;
}
