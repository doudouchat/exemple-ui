import { APP_INITIALIZER, NgModule } from '@angular/core';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsStoragePluginModule, StorageOption } from '@ngxs/storage-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { of, catchError } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { GetAccountByUsername } from './account/shared/account.action';
import { AccountState } from './account/shared/account.state';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Logout } from './auth/shared/auth.action';
import { AnonymousGuard, AuthenticatedGuard } from './auth/shared/auth.guard';
import { AuthService } from './auth/shared/auth.service';
import { AuthState, AuthStateModel } from './auth/shared/auth.state';
import { CoreModule } from './core/core.module';
import { Authenticate } from './shared/app.action';
import { AppState } from './shared/app.state';
import { MessageState } from './shared/message/message.state';
import { SharedModule } from './shared/shared.module';

@NgModule({
  imports: [
    CoreModule,
    SharedModule,
    AppRoutingModule,
    NgxsModule.forRoot([AccountState, AppState, AuthState, MessageState], {
      developmentMode: !environment.production
    }),
    NgxsStoragePluginModule.forRoot({
      key: [AuthState],
      storage: StorageOption.LocalStorage
    }),
    NgxsRouterPluginModule.forRoot()
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: (store: Store) => () => {
        const authState: AuthStateModel = store.selectSnapshot(AuthState);
        if (authState.username) {
          return store.dispatch(new GetAccountByUsername(authState.username)).pipe(
            tap(() => store.selectOnce(AccountState)),
            catchError(() => store.dispatch(new Logout()))
          );
        }
        return of(authState);
      },
      deps: [Store],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (store: Store) => () => {
        const authState: AuthStateModel = store.selectSnapshot(AuthState);
        if (!authState.authenticate) {
          return store.dispatch(new Authenticate());
        }
        return of(true);
      },
      deps: [Store],
      multi: true
    },
    AuthenticatedGuard,
    AnonymousGuard
  ]
})
export class AppModule { }

