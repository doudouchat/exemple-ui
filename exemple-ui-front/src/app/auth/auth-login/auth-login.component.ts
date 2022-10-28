import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { throwError } from 'rxjs';

import { GetAccountByUsername } from '../../account/shared/account.action';
import { PublishMessage } from '../../shared/message/message.action';
import { notBlank } from '../../shared/validator/not-blank.validator';
import { Authenticate } from '../shared/auth.action';
import { UnauthorizedError } from '../shared/auth.service';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.css']
})
export class AuthLoginComponent implements OnInit {

  authenticateForm: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private store: Store) { }

  ngOnInit() {

    this.authenticateForm = this.fb.group({
      username: ['', notBlank()],
      password: ['', notBlank()]
    });

  }

  login() {
    this.store.dispatch(new Authenticate(this.authenticateForm.value.username, this.authenticateForm.value.password))
      .subscribe(() => {
        this.store.dispatch(new PublishMessage(
          { severity: 'success', summary: 'Success', detail: 'Authenticate successfull' }));
        this.store.dispatch(new GetAccountByUsername(this.authenticateForm.value.username))
          .subscribe((id: string) =>
            this.store.dispatch(new Navigate(['/account'], { id: id })));
      }
        , error => {
          if (error instanceof UnauthorizedError) {
            this.store.dispatch(new PublishMessage(
              { severity: 'error', summary: 'Failure', detail: 'Authenticate failure' }));
          } else {
            return throwError(error);
          }

        });
  }

}
