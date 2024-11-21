import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { InfoComponent } from '../info/info.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    imports: [
        CommonModule,
        RouterModule,
        InfoComponent
    ]
})
export class HomeComponent {

  title = 'exemple-ui';

}
