import { ToastMessageOptions } from 'primeng/api';

export class PublishMessage {
  static readonly type = '[Message] Publish';
  constructor(public message: ToastMessageOptions) { }
}
