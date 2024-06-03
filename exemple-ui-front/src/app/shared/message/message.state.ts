import { Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken } from '@ngxs/store';
import { Message } from 'primeng/api';

import { PublishMessage } from './message.action';

export const MESSAGE_STATE_TOKEN = new StateToken<Message>('message');

@State<Message>({
  name: MESSAGE_STATE_TOKEN
})
@Injectable()
export class MessageState {

  @Action(PublishMessage)
  publish(ctx: StateContext<Message>, action: PublishMessage) {
    ctx.patchState(action.message);
  }
}
