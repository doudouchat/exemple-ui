import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AnonymousGuard } from '../auth/shared/auth.guard';
import { AuthLoginComponent } from './auth-login/auth-login.component';

const authRoutes: Routes = [
    {
        path: '',
        component: AuthLoginComponent,
        canActivate: [
            AnonymousGuard
        ]
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(authRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AuthRoutingModule { }
