import { Message } from './message';

export class PublishMessage {
  static readonly type = '[Message] Publish';
  constructor(public message: Message) { }
}
