import { Routes } from '@angular/router';

import { AnonymousGuard } from './shared/auth.guard';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth-login/auth-login.component').then(m => m.AuthLoginComponent),
    canActivate: [
      AnonymousGuard
    ]
  }
];
