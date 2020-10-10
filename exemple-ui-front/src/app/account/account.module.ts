import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AccountCreateComponent } from './account-create/account-create.component';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { AccountRoutingModule } from './account-routing.module';
import { AccountService } from './shared/account.service';
import { LoginModule } from '../login/login.module';

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
    AccountService
  ],
  bootstrap: [AccountEditComponent]
})
export class AccountModule { }
