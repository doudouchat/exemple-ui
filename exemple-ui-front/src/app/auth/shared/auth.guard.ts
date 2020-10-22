import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';

import { AuthState, AuthStateModel } from './auth.state';

@Injectable()
export class AuthenticatedGuard implements CanActivate {

  constructor(private readonly router: Router, private readonly store: Store) {
  }

  canActivate(): Observable<boolean> {

    const authState: AuthStateModel = this.store.selectSnapshot(AuthState);
    if (!authState.authenticate) {
      this.router.navigate(['/login']);
    }
    return of(authState.authenticate);
  }
}

@Injectable()
export class AnonymousGuard implements CanActivate {

  constructor(private readonly store: Store) {
  }

  canActivate(): Observable<boolean> {
    const authState: AuthStateModel = this.store.selectSnapshot(AuthState);
    return of(!authState.authenticate);
  }
}
