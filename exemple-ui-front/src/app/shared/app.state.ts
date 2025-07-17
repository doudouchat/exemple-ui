import { Injectable, inject } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { Authenticate } from './app.action';
import { AuthService } from '../auth/shared/auth.service';

@State<boolean>({
  name: 'application',
  defaults: false
})
@Injectable()
export class AppState {

  private readonly authService = inject(AuthService);

  @Action(Authenticate)
  authenticate(ctx: StateContext<boolean>) {
    return this.authService.authenticateApplication().pipe(
      tap(() => {
        ctx.setState(true);
      }));
  }
}
