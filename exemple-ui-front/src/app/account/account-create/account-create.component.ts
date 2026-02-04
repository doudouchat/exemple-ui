import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngxs/store';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

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
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    NgxMaskDirective
  ],
  providers: [
    provideNgxMask(),
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ]
})
export class AccountCreateComponent implements OnInit {

  private readonly fb = inject(UntypedFormBuilder);
  private readonly store = inject(Store);
  private readonly loginValidator = inject(LoginValidator);

  accountForm: UntypedFormGroup;

  ngOnInit() {

    this.accountForm = this.fb.nonNullable.group({
      email: [null, Validators.compose([Validators.required, Validators.email]), this.loginValidator.usernameValidator()],
      lastname: [null, notBlank()],
      firstname: [null, notBlank()],
      birthday: [null, notBlank()],
      password: [null, notBlank()]
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
