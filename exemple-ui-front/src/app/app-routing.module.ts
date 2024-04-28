import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
    {
        path: '',
        loadChildren: () => import('./home/home-routing.module').then(m => m.HOME_ROUTES),
        pathMatch: 'full'
    },
    {
        path: 'account',
        loadChildren: () => import('./account/account-routing.module').then(m => m.ACCOUNT_ROUTES)
    },
    {
        path: 'login',
        loadChildren: () => import('./auth/auth-routing.module').then(m => m.AUTH_ROUTES)
    }

];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
