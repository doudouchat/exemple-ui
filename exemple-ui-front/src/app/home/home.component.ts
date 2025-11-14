
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { InfoComponent } from '../info/info.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    RouterModule,
    InfoComponent
]
})
export class HomeComponent {

  title = 'exemple-ui';

}
