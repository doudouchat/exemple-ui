import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Account } from './account';
import { AccountState } from './account.state';

@Injectable()
export class AccountResolver {

    constructor(
        private readonly store: Store) { }

    resolve(): Observable<Account> {

        return this.store.selectSnapshot(AccountState);
    }
}
