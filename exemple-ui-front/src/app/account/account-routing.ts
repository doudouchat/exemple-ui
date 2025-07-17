import { Routes } from '@angular/router';

import { AnonymousGuard, AuthenticatedGuard } from '../auth/shared/auth.guard';
import { AccountResolver } from './shared/account.resolver';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./account-edit/account-edit.component').then(m => m.AccountEditComponent),
    canActivate: [
      AuthenticatedGuard
    ],
    resolve: {
      account: AccountResolver
    }
  },
  {
    path: 'create',
    loadComponent: () => import('./account-create/account-create.component').then(m => m.AccountCreateComponent),
    canActivate: [
      AnonymousGuard
    ]
  }
];
