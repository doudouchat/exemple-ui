import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Account } from './account';
import { AccountState } from './account.state';

@Injectable({ providedIn: 'root' })
export class AccountResolver {

  @Select(AccountState) accountState$: Observable<Account>;

  resolve(): Observable<Account> {

    return this.accountState$;
  }
}
