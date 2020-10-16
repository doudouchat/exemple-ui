import { NgModule } from '@angular/core';

import { LoginModule } from '../login/login.module';
import { SharedModule } from '../shared/shared.module';
import { AccountCreateComponent } from './account-create/account-create.component';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { AccountRoutingModule } from './account-routing.module';
import { AccountResolver } from './shared/account.resolver';
import { AccountService } from './shared/account.service';

@NgModule({
  declarations: [
    AccountCreateComponent,
    AccountEditComponent
  ],
  imports: [
    AccountRoutingModule,
    SharedModule,
    LoginModule
  ],
  providers: [
    AccountService,
    AccountResolver
  ],
  bootstrap: [AccountEditComponent]
})
export class AccountModule { }
