import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';

import { AccountService } from '../account/shared/account.service';
import { AuthService } from '../auth/shared/auth.service';
import { LoginService } from '../login/shared/login.service';
import { AppInterceptor } from './app.interceptor';

@NgModule({
    exports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        InputMaskModule,
        InputTextModule,
        PasswordModule,
        ToastModule,
        MessagesModule,
        MessageModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AppInterceptor,
            multi: true
        },
        MessageService,
        LoginService,
        AccountService,
        AuthService
    ]
})
export class SharedModule { }
