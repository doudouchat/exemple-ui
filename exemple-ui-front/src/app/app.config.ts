import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer } from '@angular/core';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsStoragePluginModule, StorageOption } from '@ngxs/storage-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { of, catchError } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { GetAccountByUsername } from './account/shared/account.action';
import { AccountState } from './account/shared/account.state';
import { AppRoutingModule } from './app-routing.module';
import { Logout } from './auth/shared/auth.action';
import { AnonymousGuard, AuthenticatedGuard } from './auth/shared/auth.guard';
import { AuthService } from './auth/shared/auth.service';
import { AUTHENTICATE_STATE_TOKEN, AuthState, AuthStateModel } from './auth/shared/auth.state';
import { Authenticate } from './shared/app.action';
import { AppState } from './shared/app.state';
import { MessageState } from './shared/message/message.state';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppInterceptor } from './shared/app.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      MessageModule,
      MessagesModule,
      AppRoutingModule,
      NgxsModule.forRoot([AccountState, AppState, AuthState, MessageState], {
        developmentMode: !environment.production
      }),
      NgxsStoragePluginModule.forRoot({
        keys: [AuthState],
        storage: StorageOption.LocalStorage
      }),
      NgxsRouterPluginModule.forRoot(),
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
    provideHttpClient(withInterceptorsFromDi())
  ]
};

