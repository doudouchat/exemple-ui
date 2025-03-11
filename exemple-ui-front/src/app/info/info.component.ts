import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { Info } from './shared/info';
import { InfoService } from './shared/info.service';

@Component({
  templateUrl: './info.component.html',
  selector: 'app-info',
  imports: [
    CommonModule
  ]
})

export class InfoComponent implements OnInit {

  info: Observable<Info>;

  constructor(private readonly infoService: InfoService) { }

  ngOnInit() {

    this.info = this.infoService.info().pipe(shareReplay());

  }
}
