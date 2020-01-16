import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { AccountService } from '../shared/account.service';

@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html',
  styleUrls: ['./account-create.component.css']
})
export class AccountCreateComponent implements OnInit {

  constructor(private readonly accountService: AccountService) { }

  check: Observable<any | boolean>;

  ngOnInit() {

    this.check = this.accountService.checkLogin('jean.dupond@gmail.com').pipe(shareReplay());

  }

}
