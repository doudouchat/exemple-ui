import { APP_INITIALIZER, NgModule } from '@angular/core';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';

import { AccountState } from './account/shared/account.state';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AnonymousGuard, AuthenticatedGuard } from './auth/shared/auth.guard';
import { AuthService } from './auth/shared/auth.service';
import { AuthState } from './auth/shared/auth.state';
import { CoreModule } from './core/core.module';
import { MessageState } from './shared/message/message.state';
import { SharedModule } from './shared/shared.module';

@NgModule({
  imports: [
    CoreModule,
    SharedModule,
    AppRoutingModule,
    NgxsModule.forRoot([AccountState, AuthState, MessageState]),
    NgxsStoragePluginModule.forRoot({
      key: [AuthState, AccountState]
    }),
    NgxsRouterPluginModule.forRoot()
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => () => authService.client_credentials('test', 'secret').toPromise(),
      deps: [AuthService],
      multi: true
    },
    AuthenticatedGuard,
    AnonymousGuard
  ]
})
export class AppModule { }

