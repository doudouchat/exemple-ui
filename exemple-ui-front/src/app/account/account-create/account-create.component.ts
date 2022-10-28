import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';

import { CreateAccount } from '../shared/account.action';
import { PublishMessage } from '../../shared/message/message.action';
import { LoginValidator } from '../../login/shared/login.validator';
import { notBlank } from '../../shared/validator/not-blank.validator';

@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html',
  styleUrls: ['./account-create.component.css']
})
export class AccountCreateComponent implements OnInit {

  @Output()
  id = new EventEmitter<string>();

  accountForm: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private store: Store,
    private readonly loginValidator: LoginValidator) { }

  ngOnInit() {

    this.accountForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email]), this.loginValidator.usernameValidator()],
      lastname: ['', notBlank()],
      firstname: ['', notBlank()],
      birthday: ['', Validators.required],
      password: ['', notBlank()]
    });

  }

  save() {
    const account = Object.assign({}, this.accountForm.value);
    delete account.password;
    this.store.dispatch(new CreateAccount(account, this.accountForm.value.password)).subscribe(result => {
      this.store.dispatch(new PublishMessage(
        { severity: 'success', summary: 'Success', detail: 'Account creation successfull' }));
      this.store.dispatch(new Navigate(['/login']));
      this.id.emit(result.account.id);
    });

  }

  cancel() {
    this.accountForm.reset();
  }

}
