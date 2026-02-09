import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngxs/store';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

import { LoginValidator } from '../../login/shared/login.validator';
import { PublishMessage } from '../../shared/message/message.action';
import { notBlank } from '../../shared/validator/not-blank.validator';
import { Account } from '../shared/account';
import { UpdateAccount } from '../shared/account.action';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()]
})
export class AccountEditComponent implements OnInit {

  private readonly fb = inject(UntypedFormBuilder);
  private readonly store = inject(Store);
  private readonly loginValidator = inject(LoginValidator);

  account = input.required<Account>();

  private internalAccount: Account;

  accountForm: UntypedFormGroup;

  constructor() {
    effect(() => {
      this.internalAccount = this.account();
      this.accountForm.markAllAsTouched();
      this.accountForm.patchValue(this.internalAccount);
      this.accountForm.controls.email.setAsyncValidators(this.loginValidator.usernameValidator(this.internalAccount.email));
    });
  }

  ngOnInit() {

    this.accountForm = this.fb.nonNullable.group({
      email: [null, Validators.compose([Validators.required, Validators.email])],
      lastname: [null, notBlank()],
      firstname: [null, notBlank()],
      birthday: [null, notBlank()],
      id: [],
      creation_date: [],
      update_date: []
    });

    this.store.dispatch(new PublishMessage(
      { severity: 'info', summary: 'Success', detail: 'Account access successfull' }));
  }

  save() {
    const account = { ...this.accountForm.value };
    this.internalAccount = account;
    this.store.dispatch(new UpdateAccount(account));
  }

  cancel() {
    this.accountForm.reset();
    this.accountForm.patchValue(this.internalAccount);
    this.accountForm.markAllAsTouched();
  }

}
