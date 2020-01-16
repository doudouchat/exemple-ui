import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable()
export class AccountGuard implements CanActivate {

  constructor(private readonly router: Router) {
  }

  canActivate(): Observable<boolean> {

    this.router.navigate(['/login']);

    return of(false);
  }
}
