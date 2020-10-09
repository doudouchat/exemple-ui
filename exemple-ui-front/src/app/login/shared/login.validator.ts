import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LoginService } from './login.service';

@Injectable()
export class LoginValidator {

  constructor(private readonly loginService: LoginService) { }

  usernameValidator(): AsyncValidatorFn {
    return (ctrl: AbstractControl): Observable<ValidationErrors | null> => {
      return this.loginService.checkUsername(ctrl.value).pipe(
        map(check => (check ? { uniqueUsername: check } : null))
      );
    };
  }
}
