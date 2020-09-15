import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppService } from './app.service';
import { AppInterceptor } from './app.interceptor';

@NgModule({
    exports: [
        CommonModule,
        HttpClientModule
    ],
    providers: [
        AppService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AppInterceptor,
            multi: true
        }
    ]
})
export class SharedModule { }
