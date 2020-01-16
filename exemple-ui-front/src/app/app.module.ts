import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppService } from './shared/app.service';

@NgModule({
  imports: [
    CoreModule,
    SharedModule,
    AppRoutingModule
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
  ]
})
export class AppModule { }

