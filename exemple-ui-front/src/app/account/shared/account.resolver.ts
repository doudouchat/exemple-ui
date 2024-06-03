import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Account } from './account';
import { ACCOUNT_STATE_TOKEN } from './account.state';

@Injectable({ providedIn: 'root' })
export class AccountResolver {

  accountState$: Observable<Account> =  inject(Store).select(ACCOUNT_STATE_TOKEN);

  resolve(): Observable<Account> {

    return this.accountState$;
  }
}
