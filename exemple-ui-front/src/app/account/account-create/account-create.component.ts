import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';

import { CreateAccount } from '../shared/account.action';
import { PublishMessage } from '../../shared/message/message.action';
import { LoginValidator } from '../../login/shared/login.validator';
import { notBlank } from '../../shared/validator/not-blank.validator';

@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html',
  styleUrls: ['./account-create.component.css'],
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
export class AccountCreateComponent implements OnInit {

  @Output()
  id = new EventEmitter<string>();

  accountForm: UntypedFormGroup;

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly store: Store,
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
    const account = { ...this.accountForm.value };
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
