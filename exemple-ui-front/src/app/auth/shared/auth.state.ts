import { Injectable, inject } from '@angular/core';
import { Action, State, StateContext, StateToken, Store } from '@ngxs/store';
import { EMPTY, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { GetAccountByUsername } from '../../account/shared/account.action';
import { MessageService } from '../../shared/message/message.service';
import { Authenticate, Logout } from './auth.action';
import { AuthService, UnauthorizedError } from './auth.service';

export interface AuthStateModel {
  authenticate: boolean;
  username?: string;
}

export const AUTHENTICATE_STATE_TOKEN = new StateToken<AuthStateModel>('authenticate');

@State<AuthStateModel>({
  name: AUTHENTICATE_STATE_TOKEN,
  defaults: { authenticate: false }
})
@Injectable()
export class AuthState {

  private readonly store = inject(Store);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);

  @Action(Authenticate)
  authenticate(ctx: StateContext<AuthStateModel>, action: Authenticate) {
    return this.authService.authenticateUser(action.username, action.password).pipe(
      mergeMap(() => {
        ctx.setState({ authenticate: true, username: action.username });
        this.messageService.success('Success', 'Authenticate successfull');
        return this.store.dispatch(new GetAccountByUsername(action.username));
      }),
      catchError(error => {
        if (error instanceof UnauthorizedError) {
          this.messageService.error('Failure', 'Authenticate failure');
          return EMPTY;
        } else {
          return throwError(() => error);
        }
      }));
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    ctx.setState({ authenticate: false });
  }
}
