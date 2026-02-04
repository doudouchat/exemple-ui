import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { filter } from 'rxjs';

import { MESSAGE_STATE_TOKEN } from './shared/message/message.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterModule
  ]
})
export class AppComponent implements OnInit {

  private readonly store = inject(Store);
  private readonly snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.store.select(MESSAGE_STATE_TOKEN)
      .pipe(filter(message => !!message))
      .pipe(filter(message => !!message.detail))
      .subscribe(message => {
        this.snackBar.open(message.detail, 'close', {
          duration: 5_000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      })
  }
}
