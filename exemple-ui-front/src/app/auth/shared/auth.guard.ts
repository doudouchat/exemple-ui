import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';

import { AuthState } from './auth.state';

@Injectable()
export class AuthenticatedGuard implements CanActivate {

  constructor(private readonly router: Router, private readonly store: Store) {
  }

  canActivate(): Observable<boolean> {

    const isAuthenticated: boolean = this.store.selectSnapshot(AuthState);
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
    }
    return of(isAuthenticated);
  }
}

@Injectable()
export class AnonymousGuard implements CanActivate {

  constructor(private readonly store: Store) {
  }

  canActivate(): Observable<boolean> {

    return of(!this.store.selectSnapshot(AuthState));
  }
}
