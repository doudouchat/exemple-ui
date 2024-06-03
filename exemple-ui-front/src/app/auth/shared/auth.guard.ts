import { Injectable, inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AUTHENTICATE_STATE_TOKEN, AuthStateModel } from './auth.state';

@Injectable()
export class AuthenticatedGuard {

  authState$: Observable<AuthStateModel> = inject(Store).select(AUTHENTICATE_STATE_TOKEN);

  constructor(private readonly router: Router) {
  }

  canActivate(): Observable<boolean | UrlTree> {

    return this.authState$.pipe(
      map((authState: AuthStateModel) => {
        if (!authState.authenticate) {
          return this.router.parseUrl('/login');
        }
        return true;
      })
    );
  }
}

@Injectable()
export class AnonymousGuard {

  authState$: Observable<AuthStateModel> = inject(Store).select(AUTHENTICATE_STATE_TOKEN);

  canActivate(): Observable<boolean> {
    return this.authState$.pipe(
      map((authState: AuthStateModel) => !authState.authenticate)
    );
  }
}
