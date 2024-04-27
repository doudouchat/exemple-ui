import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { throwError } from 'rxjs';

import { GetAccountByUsername } from '../../account/shared/account.action';
import { PublishMessage } from '../../shared/message/message.action';
import { notBlank } from '../../shared/validator/not-blank.validator';
import { Authenticate } from '../shared/auth.action';
import { UnauthorizedError } from '../shared/auth.service';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PasswordModule,
    ButtonModule,
    InputTextModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class AuthLoginComponent implements OnInit {

  authenticateForm: UntypedFormGroup;

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly store: Store) { }

  ngOnInit() {

    this.authenticateForm = this.fb.group({
      username: ['', notBlank()],
      password: ['', notBlank()]
    });

  }

  login() {
    this.store.dispatch(new Authenticate(this.authenticateForm.value.username, this.authenticateForm.value.password))
      .subscribe({
        next: () => {
          this.store.dispatch(new PublishMessage(
            { severity: 'success', summary: 'Success', detail: 'Authenticate successfull' }));
          this.store.dispatch(new GetAccountByUsername(this.authenticateForm.value.username))
            .subscribe((id: string) =>
              this.store.dispatch(new Navigate(['/account'], { id })));
        },
        error: error => {
          if (error instanceof UnauthorizedError) {
            this.store.dispatch(new PublishMessage(
              { severity: 'error', summary: 'Failure', detail: 'Authenticate failure' }));
          } else {
            throwError(() => error);
          }
        }
      });
  }

}
