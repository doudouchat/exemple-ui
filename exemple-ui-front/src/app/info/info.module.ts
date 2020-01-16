import { NgModule } from '@angular/core';

import { InfoComponent } from './info.component';
import { InfoService } from './shared/info.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        InfoComponent
    ],
    imports: [
        SharedModule
    ],
    providers: [
        InfoService
    ],
    exports: [
        InfoComponent
    ],
})
export class InfoModule { }
