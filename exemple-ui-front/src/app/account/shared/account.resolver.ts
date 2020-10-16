import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Account } from './account';
import { AccountState } from './account.state';

@Injectable()
export class AccountResolver implements Resolve<Account> {

    constructor(
        private readonly store: Store) { }

    resolve(): Observable<Account> {

        return this.store.selectSnapshot(AccountState);
    }
}
