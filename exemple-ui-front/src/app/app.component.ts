import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { MESSAGE_STATE_TOKEN } from './shared/message/message.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private readonly store: Store,
    private readonly messageService: MessageService) { }

  ngOnInit() {
    this.store.select(MESSAGE_STATE_TOKEN).subscribe(message => this.messageService.add(message));
  }
}
