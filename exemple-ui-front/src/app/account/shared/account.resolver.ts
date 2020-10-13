import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Account } from './account';
import { AccountState } from './account.state';

@Injectable()
export class AccountResolver implements Resolve<Account> {

    constructor(
        private readonly store: Store) { }

    resolve(): Observable<Account> {

        return this.store.selectOnce(AccountState).pipe(
            filter(account => account.id != null)
        );
    }
}
