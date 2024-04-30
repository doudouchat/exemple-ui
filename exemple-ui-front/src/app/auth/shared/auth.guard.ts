import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


import { AuthState, AuthStateModel } from './auth.state';

@Injectable()
export class AuthenticatedGuard {

  @Select(AuthState) authState$: Observable<AuthStateModel>;

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

  @Select(AuthState) authState$: Observable<AuthStateModel>;

  canActivate(): Observable<boolean> {
    return this.authState$.pipe(
      map((authState: AuthStateModel) => !authState.authenticate)
    );
  }
}
