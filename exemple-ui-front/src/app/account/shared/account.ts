import moment from 'moment';

export interface Account {
    email: string;
    lastname: string;
    firstname: string;
    birthday: moment.Moment | string;
    creation_date: Date;
    update_date: Date;
    id?: string;
}
