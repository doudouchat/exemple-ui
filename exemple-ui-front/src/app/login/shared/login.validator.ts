import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { LoginService } from './login.service';

@Injectable({providedIn: 'root'})
export class LoginValidator {

  constructor(private readonly loginService: LoginService) { }

  usernameValidator(usernameExclude?: string): AsyncValidatorFn {
    return (ctrl: AbstractControl): Observable<ValidationErrors | null> => {
      return ctrl.value === usernameExclude ? of(null) : this.loginService.checkUsername(ctrl.value).pipe(
        map(check => (check ? { uniqueUsername: check } : null))
      );
    };
  }
}
