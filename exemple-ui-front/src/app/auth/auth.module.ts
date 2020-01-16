import { NgModule } from '@angular/core';

import { AuthLoginComponent } from './auth-login/auth-login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from './shared/auth.service';
import { SharedModule } from '../shared/shared.module';

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
