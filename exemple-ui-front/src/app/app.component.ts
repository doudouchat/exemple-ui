import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { definePreset } from '@primeng/themes';
import Material from '@primeng/themes/material';
import { MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { MESSAGE_STATE_TOKEN } from './shared/message/message.state';

// eslint-disable-next-line @angular-eslint/prefer-standalone
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit {

  constructor(
    private readonly store: Store,
    private readonly messageService: MessageService,
    private readonly config: PrimeNG) {
    this.config.theme.set({
      preset: definePreset(Material, {
        semantic: {
          primary: {
            50: '{blue.50}',
            100: '{blue.100}',
            200: '{blue.200}',
            300: '{blue.300}',
            400: '{blue.400}',
            500: '{blue.500}',
            600: '{blue.600}',
            700: '{blue.700}',
            800: '{blue.800}',
            900: '{blue.900}',
            950: '{blue.950}'
          }
        }
      }),
      options: {
        prefix: 'p',
        darkModeSelector: 'system',
        cssLayer: false
      }
    });
  }

  ngOnInit() {
    this.store.select(MESSAGE_STATE_TOKEN).subscribe(message => this.messageService.add(message));
  }
}
