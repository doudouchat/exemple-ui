import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountCreateComponent } from './account-create/account-create.component';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { AccountGuard } from './shared/account.guard';

const accountRoutes: Routes = [
    {
        path: '',
        component: AccountEditComponent,
        canActivate: [
            AccountGuard
        ]
    },
    {
        path: 'create',
        component: AccountCreateComponent
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
