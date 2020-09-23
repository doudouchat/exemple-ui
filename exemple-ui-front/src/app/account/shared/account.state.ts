import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { tap, mergeMap } from 'rxjs/operators';
import * as moment from 'moment';

import { Account } from './account';
import { CreateAccount } from './account.action';
import { AccountService } from './account.service';
import { Login } from '../../login/shared/login';
import { LoginService } from '../../login/shared/login.service';

@State<Account>({
    name: 'account'
})
@Injectable()
export class AccountState {

    constructor(
        private readonly accountService: AccountService,
        private readonly loginService: LoginService) { }

    @Action(CreateAccount)
    CreateAccount(ctx: StateContext<Account>, action: CreateAccount) {

        const account = action.account;
        const birthday: moment.Moment = moment(account.birthday, 'DD/MM/YYYY');
        account.birthday = birthday.format('YYYY-MM-DD');
        return this.accountService.createAccount(account).pipe(
            mergeMap((accountId: string) => {
                const login: Login = {
                    username: account.email,
                    password: action.password,
                    id: accountId
                };
                return this.loginService.createLogin(login).pipe(tap(() => {
                    ctx.setState(account);
                    ctx.patchState({ id: accountId });
                }));
            }));
    }
}
