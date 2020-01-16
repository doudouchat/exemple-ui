import { NgModule } from '@angular/core';

import { AccountRoutingModule } from './account-routing.module';
import { AccountCreateComponent } from './account-create/account-create.component';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { AccountGuard } from './shared/account.guard';
import { AccountService } from './shared/account.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    AccountCreateComponent,
    AccountEditComponent
  ],
  imports: [
    AccountRoutingModule,
    SharedModule
  ],
  providers: [
    AccountGuard,
    AccountService
  ],
  bootstrap: [AccountEditComponent]
})
export class AccountModule { }
