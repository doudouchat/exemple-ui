import { Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken } from '@ngxs/store';
import { ToastMessageOptions } from 'primeng/api';

import { PublishMessage } from './message.action';

export const MESSAGE_STATE_TOKEN = new StateToken<ToastMessageOptions>('message');

@State<ToastMessageOptions>({
  name: MESSAGE_STATE_TOKEN
})
@Injectable()
export class MessageState {

  @Action(PublishMessage)
  publish(ctx: StateContext<ToastMessageOptions>, action: PublishMessage) {
    ctx.patchState(action.message);
  }
}
