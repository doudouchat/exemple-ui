import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Account } from './account';

@Injectable()
export class AccountService {

  constructor(private readonly http: HttpClient) { }

  createAccount(account: Account): Observable<string> {

    return this.http.post<any>('/ExempleService/ws/v1/accounts',
      JSON.stringify(account), {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        app: 'test',
        version: 'v1'
      }),
      observe: 'response'
    }).pipe(
      map(res => {
        const location = res.headers.get('location');
        return location.split('/').pop();
      }));
  }
}
