import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { Authenticate, Logout } from './auth.action';
import { AuthService } from './auth.service';

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
        private readonly authService: AuthService) { }

    @Action(Authenticate)
    Authenticate(ctx: StateContext<AuthStateModel>, action: Authenticate) {
        return this.authService.password('test_service_user', 'secret', action.username, action.password).pipe(
            tap(() => {
                ctx.setState({ authenticate: true, username: action.username });
            }));
    }

    @Action(Logout)
    Logout(ctx: StateContext<AuthStateModel>) {
        ctx.setState({ authenticate: false });
    }
}
