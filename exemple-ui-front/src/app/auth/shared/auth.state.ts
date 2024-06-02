import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { catchError, mergeMap } from 'rxjs/operators';

import { Authenticate, Logout } from './auth.action';
import { AuthService, UnauthorizedError } from './auth.service';
import { PublishMessage } from 'src/app/shared/message/message.action';
import { GetAccountByUsername } from 'src/app/account/shared/account.action';
import { throwError } from 'rxjs';

export interface AuthStateModel {
  authenticate: boolean;
  username?: string;
}

@State<AuthStateModel>({
  name: 'authenticate',
  defaults: { authenticate: false }
})
@Injectable()
export class AuthState {

  constructor(
    private readonly store: Store,
    private readonly authService: AuthService) { }

  @Action(Authenticate)
  authenticate(ctx: StateContext<AuthStateModel>, action: Authenticate) {
    return this.authService.authenticateUser(action.username, action.password).pipe(
      mergeMap(() => {
        ctx.setState({ authenticate: true, username: action.username });
        this.store.dispatch(new PublishMessage(
          { severity: 'success', summary: 'Success', detail: 'Authenticate successfull' }));
        return this.store.dispatch(new GetAccountByUsername(action.username));
      }),
      catchError(error => {
        if (error instanceof UnauthorizedError) {
          return this.store.dispatch(new PublishMessage(
            { severity: 'error', summary: 'Failure', detail: 'Authenticate failure' }));
        } else {
          throwError(() => error);
        }
      }));
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    ctx.setState({ authenticate: false });
  }
}
