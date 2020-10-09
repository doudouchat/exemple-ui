import { NgModule, APP_INITIALIZER } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppService } from './shared/app.service';
import { AccountState } from './account/shared/account.state';
import { AccountService } from './account/shared/account.service';
import { LoginService } from './login/shared/login.service';
import { MessageState } from './shared/message/message.state';

@NgModule({
  imports: [
    CoreModule,
    SharedModule,
    AppRoutingModule,
    NgxsModule.forRoot([AccountState, MessageState]),
    NgxsRouterPluginModule.forRoot()
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    AppService,
    {
      provide: APP_INITIALIZER,
      useFactory: (appService: AppService) => () => appService.token('test', 'secret').toPromise(),
      deps: [AppService],
      multi: true
    },
    AccountService,
    LoginService
  ]
})
export class AppModule { }

