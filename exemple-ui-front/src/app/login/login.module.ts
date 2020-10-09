import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { LoginService } from './shared/login.service';
import { LoginValidator } from './shared/login.validator';

@NgModule({
  declarations: [],
  imports: [
    SharedModule
  ],
  providers: [
    LoginService,
    LoginValidator
  ],
  bootstrap: []
})
export class LoginModule { }
