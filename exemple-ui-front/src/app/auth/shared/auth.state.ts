import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { Authenticate } from './auth.action';
import { AuthService } from './auth.service';

@State<boolean>({
    name: 'authenticate',
    defaults: false
})
@Injectable()
export class AuthState {

    constructor(
        private readonly authService: AuthService) { }

    @Action(Authenticate)
    Authenticate(ctx: StateContext<boolean>, action: Authenticate) {
        return this.authService.password('test_user', 'secret', action.username, action.password).pipe(
            tap(() => {
                ctx.setState(true);
            }));
    }
}
