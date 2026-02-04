import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';

import { notBlank } from '../../shared/validator/not-blank.validator';
import { Authenticate } from '../shared/auth.action';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ]
})
export class AuthLoginComponent implements OnInit {

  private readonly fb = inject(UntypedFormBuilder);
  private readonly store = inject(Store);

  authenticateForm: UntypedFormGroup;

  ngOnInit() {

    this.authenticateForm = this.fb.nonNullable.group({
      username: [null, notBlank()],
      password: [null, notBlank()]
    });

  }

  login() {
    this.store.dispatch(new Authenticate(this.authenticateForm.value.username, this.authenticateForm.value.password))
  }

}
