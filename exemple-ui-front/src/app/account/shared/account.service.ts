import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as jsonpatch from 'fast-json-patch';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Account } from './account';

@Injectable()
export class AccountService {

  constructor(private readonly http: HttpClient) { }

  createAccount(account: Account, password: String): Observable<string> {

    return this.http.post<any>('/ExempleService/ws/v1/accounts',
      JSON.stringify({
        'account': account,
        'password': password,
        'logins': ['email']
      }), {
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

  getAccount(id: string): Observable<Account> {

    return this.http.get<Account>(`/ExempleService/ws/v1/accounts/${id}`,
      {
        headers: new HttpHeaders({
          'Content-type': 'application/json',
          app: 'test',
          version: 'v1'
        })
      });
  }

  updateAccount(account: Account, previousAccount: Account): Observable<any> {
    return this.http.patch<any>('/ExempleService/ws/v1/accounts/' + previousAccount.id,
      JSON.stringify(jsonpatch.compare(previousAccount, account)), {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        app: 'test',
        version: 'v1'
      })
    });
  }


}
