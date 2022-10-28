import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { Message } from 'primeng/api';

import { PublishMessage } from './message.action';

@State<Message[]>({
    name: 'messages'
})
@Injectable()
export class MessageState {

    @Action(PublishMessage)
    publish(ctx: StateContext<Message>, action: PublishMessage) {
        ctx.patchState(action.message);
    }
}
