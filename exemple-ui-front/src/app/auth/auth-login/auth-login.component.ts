import { FloatLabel } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';

import { notBlank } from '../../shared/validator/not-blank.validator';
import { Authenticate } from '../shared/auth.action';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.css'],
  imports: [
    CommonModule,
    FloatLabel,
    FormsModule,
    PasswordModule,
    ButtonModule,
    InputTextModule,
    MessageModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class AuthLoginComponent implements OnInit {

  private readonly fb = inject(UntypedFormBuilder);
  private readonly store = inject(Store);

  authenticateForm: UntypedFormGroup;

  ngOnInit() {

    this.authenticateForm = this.fb.group({
      username: ['', notBlank()],
      password: ['', notBlank()]
    });

  }

  login() {
    this.store.dispatch(new Authenticate(this.authenticateForm.value.username, this.authenticateForm.value.password))
  }

}
