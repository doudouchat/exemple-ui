import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import moment from 'moment';
import { Observable, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';

import { Logout } from '../../auth/shared/auth.action';
import { Login } from '../../login/shared/login';
import { LoginService } from '../../login/shared/login.service';
import { Account } from './account';
import { CreateAccount, GetAccount, GetAccountByUsername, UpdateAccount } from './account.action';
import { AccountService } from './account.service';

@State<Account>({
    name: 'account'
})
@Injectable()
export class AccountState {

    constructor(
        private readonly accountService: AccountService,
        private readonly loginService: LoginService,
        private readonly store: Store) { }

    @Action(CreateAccount)
    createAccount(ctx: StateContext<Account>, action: CreateAccount) {

        const account = action.account;
        account.birthday = this.toDate(account.birthday);
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

    @Action(UpdateAccount)
    updateAccount(ctx: StateContext<Account>, action: UpdateAccount) {

        const account = action.account;
        account.birthday = this.toDate(account.birthday);

        const previousAccount = action.previousAccount;
        const previous = {...previousAccount};
        previous.birthday = this.toDate(previous.birthday);
        previous.update_date = account.update_date;

        return this.accountService.updateAccount(account, previous).pipe(
            mergeMap(() => {
                let operation: Observable<Account | void> = of(account);
                if (account.email !== previous.email) {
                    const login: Login = {
                        username: account.email,
                        id: account.id
                    };
                    const previousLogin: Login = {
                        username: previous.email,
                        id: account.id
                    };
                    operation = this.loginService.updateLogin(login, previousLogin).pipe(
                        mergeMap(() => ctx.dispatch(new Logout())));
                }
                return operation.pipe(tap(() => ctx.setState(account)));
            }));
    }

    @Action(GetAccount)
    getAccount(ctx: StateContext<Account>, action: GetAccount) {

        return this.accountService.getAccount(action.id).pipe(
            map(account => {
                account.birthday = this.fromDate(account.birthday);
                account.id = action.id;
                return account;
            }),
            tap(account => ctx.setState(account)));
    }

    @Action(GetAccountByUsername)
    getAccountByUsername(ctx: StateContext<Account>, action: GetAccountByUsername) {

        return this.loginService.getLogin(action.username).pipe(
            mergeMap((id: string) => this.store.dispatch(new GetAccount(id))));
    }

    private toDate(date: moment.Moment | string) {
        return moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    }

    private fromDate(date: moment.Moment | string) {
        return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
    }
}
