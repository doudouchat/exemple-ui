import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { Message } from 'primeng/api';
import { patch, append } from '@ngxs/store/operators';
import { MessageService } from 'primeng/api';

import { PublishMessage } from './message.action';

@State<Message[]>({
    name: 'messages'
})
@Injectable()
export class MessageState {

    constructor(
        private messageService: MessageService) { }

    @Action(PublishMessage)
    publish(ctx: StateContext<Account>, action: PublishMessage) {
        this.messageService.add(action.message);
        ctx.setState(patch(append([action.message])));
    }
}
