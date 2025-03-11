import { Routes } from '@angular/router';

import { AnonymousGuard } from './shared/auth.guard';
import { AuthLoginComponent } from './auth-login/auth-login.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthLoginComponent,
    canActivate: [
      AnonymousGuard
    ]
  }
];
