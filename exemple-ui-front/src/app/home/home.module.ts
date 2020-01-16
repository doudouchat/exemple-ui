import { NgModule } from '@angular/core';

import { InfoModule } from '../info/info.module';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [HomeComponent],
    imports: [
        SharedModule,
        HomeRoutingModule,
        InfoModule
    ],
    bootstrap: [HomeComponent]
})
export class HomeModule { }
