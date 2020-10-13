import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { LoginValidator } from '../../login/shared/login.validator';
import { PublishMessage } from '../../shared/message/message.action';
import { notBlank } from '../../shared/validator/not-blank.validator';
import { Account } from '../shared/account';
import { UpdateAccount } from '../shared/account.action';


@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.css']
})
export class AccountEditComponent implements OnInit {

  account: Account;

  accountForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private store: Store,
    private readonly route: ActivatedRoute,
    private readonly loginValidator: LoginValidator) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.account = data.account;
      this.accountForm = this.fb.group({
        email: [this.account.email, Validators.compose([Validators.required, Validators.email]),
        this.loginValidator.usernameValidator(this.account.email)],
        lastname: [this.account.lastname, notBlank()],
        firstname: [this.account.firstname, notBlank()],
        birthday: [this.account.birthday, Validators.required],
        id: [this.account.id],
        creation_date: [this.account.creation_date],
        update_date: [this.account.update_date],
      });
    });
  }

  save() {

    const account = Object.assign({}, this.accountForm.value);
    delete account.password;
    this.store.dispatch(new UpdateAccount(account, this.account)).subscribe(() => {
      this.store.dispatch(new PublishMessage(
        { severity: 'success', summary: 'Success', detail: 'Account update successfull' }));
    });
  }

  cancel() {
    this.accountForm.reset();
    this.accountForm.patchValue(this.account);
  }

}
