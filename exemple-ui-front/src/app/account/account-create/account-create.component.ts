import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';

import { CreateAccount } from '../shared/account.action';
import { LoginValidator } from '../../login/shared/login.validator';
import { notBlank } from '../../shared/validator/not-blank.validator';

@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html',
  styleUrls: ['./account-create.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputMaskModule,
    InputTextModule,
    FloatLabelModule,
    MessageModule
  ]
})
export class AccountCreateComponent implements OnInit {

  private readonly fb = inject(UntypedFormBuilder);
  private readonly store = inject(Store);
  private readonly loginValidator = inject(LoginValidator);

  accountForm: UntypedFormGroup;

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
    this.store.dispatch(new CreateAccount(account, this.accountForm.value.password));
  }

  cancel() {
    this.accountForm.reset();
  }

}
