import { Account } from './account';

export class CreateAccount {
    static readonly type = '[Account] Create';
    constructor(public account: Account, public password: string) { }
}
