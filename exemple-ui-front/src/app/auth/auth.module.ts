import { NgModule } from '@angular/core';

import { LoginService } from '../login/shared/login.service';
import { SharedModule } from '../shared/shared.module';
import { AuthLoginComponent } from './auth-login/auth-login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from './shared/auth.service';

@NgModule({
  declarations: [
    AuthLoginComponent
  ],
  imports: [
    AuthRoutingModule,
    SharedModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AuthLoginComponent]
})
export class AuthModule { }
