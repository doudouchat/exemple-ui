import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
    {
        path: '',
        loadChildren: './home/home.module#HomeModule',
        pathMatch: 'full'
    },
    {
        path: 'account',
        loadChildren: './account/account.module#AccountModule'
    },
    {
        path: 'login',
        loadChildren: './auth/auth.module#AuthModule'
    }

];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
