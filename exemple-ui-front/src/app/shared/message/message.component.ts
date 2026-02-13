import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import { Message } from './message';

@Component({
  selector: 'app-message',
  template: `
  <div class="app-message-container">
    <section matSnackBarLabel [class]="message.type">
      <h3>{{message.title}}</h3>
      <span>{{message.detail}}</span>
    </section>
    <section matSnackBarActions>
      <section matSnackBarAction>
        <button matIconButton matSnackBarAction (click)="snackBarRef.dismissWithAction()">
          <mat-icon>close</mat-icon>
        </button>
      </section>
    </section>
  </div>
  `,
  styles: `
    .app-message-container {
      display: flex;
      flex-direction: row;
    }
    .mdc-snackbar__label {
      padding-top: 0;
    }
    .mat-mdc-snack-bar-actions {
      align-items: flex-start;
    }
    .success {
      color: #42A948;
    }
    .info {
      color: #42A948;
    }
    .error {
      color: #a94442;
    }
    .warning {
      color: orange;
    }
  `,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ]
})
export class MessageComponent {

  readonly message: Message = inject(MAT_SNACK_BAR_DATA);
  readonly snackBarRef = inject<MatSnackBarRef<MessageComponent>>(MatSnackBarRef);

}
