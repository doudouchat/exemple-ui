import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AnonymousGuard, AuthenticatedGuard } from '../auth/shared/auth.guard';
import { AccountCreateComponent } from './account-create/account-create.component';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { AccountResolver } from './shared/account.resolver';

const accountRoutes: Routes = [
    {
        path: '',
        component: AccountEditComponent,
        canActivate: [
            AuthenticatedGuard
        ],
        resolve: {
            account: AccountResolver
        }
    },
    {
        path: 'create',
        component: AccountCreateComponent,
        canActivate: [
            AnonymousGuard
        ]
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(accountRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AccountRoutingModule { }
