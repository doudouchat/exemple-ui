import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Message } from './message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private readonly snackBar = inject(MatSnackBar);

  public info(title: string, detail: string) {
    this.publish({ title, detail, type: 'info' });
  }

  public success(title: string, detail: string) {
    this.publish({ title, detail, type: 'success' });
  }

  public error(title: string, detail: string) {
    this.publish({ title, detail, type: 'error' });
  }

  private publish(message: Message) {
    this.snackBar.open(message.detail, 'close', {
      duration: 5_000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

}
