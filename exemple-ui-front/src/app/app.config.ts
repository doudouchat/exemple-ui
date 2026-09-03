import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer } from '@angular/core';
import { withNgxsRouterPlugin } from '@ngxs/router-plugin';
import { withNgxsStoragePlugin, LOCAL_STORAGE_ENGINE } from '@ngxs/storage-plugin';
import { provideStore, Store } from '@ngxs/store';
import { catchError, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { GetAccountByUsername } from './account/shared/account.action';
import { AccountState } from './account/shared/account.state';
import { AppRoutingModule } from './app-routing.module';
import { Logout } from './auth/shared/auth.action';
import { AnonymousGuard, AuthenticatedGuard } from './auth/shared/auth.guard';
import { AuthService } from './auth/shared/auth.service';
import { AUTHENTICATE_STATE_TOKEN, AuthState, AuthStateModel } from './auth/shared/auth.state';
import { Authenticate } from './shared/app.action';
import { AppInterceptor } from './shared/app.interceptor';
import { AppState } from './shared/app.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(
      [AccountState, AppState, AuthState],
      withNgxsStoragePlugin({
        keys: [
          {
            key: AuthState,
            engine: LOCAL_STORAGE_ENGINE
          }
        ]
      }),
      withNgxsRouterPlugin()
    ),
    importProvidersFrom(
      AppRoutingModule,
      AuthService),
    provideAppInitializer(() => {
      const store = inject(Store);
      const authState: AuthStateModel = store.selectSnapshot(AUTHENTICATE_STATE_TOKEN);
      if (authState.username) {
        return store.dispatch(new GetAccountByUsername(authState.username)).pipe(tap(() => store.selectOnce(AUTHENTICATE_STATE_TOKEN)), catchError(() => store.dispatch(new Logout())));
      }
      return of(authState);
    }),
    provideAppInitializer(() => {
      const store = inject(Store);
      const authState: AuthStateModel = store.selectSnapshot(AUTHENTICATE_STATE_TOKEN);
      if (!authState.authenticate) {
        return store.dispatch(new Authenticate());
      }
      return of(true);
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true
    },
    AuthenticatedGuard,
    AnonymousGuard,
    provideHttpClient(withXhr(), withInterceptorsFromDi())
  ]
};

