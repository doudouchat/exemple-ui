import { Account } from './account';

export class CreateAccount {
    static readonly type = '[Account] Create';
    constructor(public account: Account, public password: string) { }
}

export class GetAccount {
    static readonly type = '[Account] Get';
    constructor(public id: string) { }
}

export class GetAccountByUsername {
    static readonly type = '[Account] Get by username';
    constructor(public username: string) { }
}

export class UpdateAccount {
    static readonly type = '[Account] Update';
    constructor(public account: Account, public previousAccount: Account) { }
}
