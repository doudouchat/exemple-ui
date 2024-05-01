import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';

import { LoginValidator } from '../../login/shared/login.validator';
import { PublishMessage } from '../../shared/message/message.action';
import { notBlank } from '../../shared/validator/not-blank.validator';
import { Account } from '../shared/account';
import { UpdateAccount } from '../shared/account.action';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputMaskModule,
    InputTextModule
  ]
})
export class AccountEditComponent implements OnInit {

  @Input() account: Account;

  accountForm: UntypedFormGroup;

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly store: Store,
    private readonly loginValidator: LoginValidator) { }

  ngOnInit() {

    this.accountForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      lastname: ['', notBlank()],
      firstname: ['', notBlank()],
      birthday: [null, Validators.required],
      id: [],
      creation_date: [],
      update_date: []
    });

    this.accountForm.markAllAsTouched();
    this.accountForm.patchValue(this.account);
    this.accountForm.controls.email.setAsyncValidators(this.loginValidator.usernameValidator(this.account.email));

    this.store.dispatch(new PublishMessage(
      { severity: 'info', summary: 'Success', detail: 'Account access successfull' }));
  }

  save() {

    const account = { ...this.accountForm.value };
    this.store.dispatch(new UpdateAccount(account, this.account)).subscribe(() => {
      this.store.dispatch(new PublishMessage(
        { severity: 'success', summary: 'Success', detail: 'Account update successfull' }));
      this.account = this.accountForm.value;
    });
  }

  cancel() {
    this.accountForm.reset();
    this.accountForm.patchValue(this.account);
    this.accountForm.markAllAsTouched();
  }

}
