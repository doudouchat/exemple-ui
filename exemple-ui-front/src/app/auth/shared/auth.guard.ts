import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';

import { AuthState, AuthStateModel } from './auth.state';

@Injectable()
export class AuthenticatedGuard {

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
export class AnonymousGuard {

  constructor(private readonly store: Store) {
  }

  canActivate(): Observable<boolean> {
    const authState: AuthStateModel = this.store.selectSnapshot(AuthState);
    return of(!authState.authenticate);
  }
}
