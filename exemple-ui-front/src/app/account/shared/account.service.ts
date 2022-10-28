import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jsonpatch from 'fast-json-patch';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Account } from './account';

@Injectable()
export class AccountService {

  constructor(private readonly http: HttpClient) { }

  createAccount(account: Account): Observable<string> {

    return this.http.post<HttpResponse<void>>('/ExempleService/ws/v1/accounts',
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

  getAccount(id: string): Observable<Account> {

    return this.http.get<Account>(`/ExempleService/ws/v1/accounts/${id}`,
      {
        headers: new HttpHeaders({
          app: 'test',
          version: 'v1'
        })
      });
  }

  updateAccount(account: Account, previousAccount: Account): Observable<HttpResponse<void>> {
    return this.http.patch<HttpResponse<void>>('/ExempleService/ws/v1/accounts/' + previousAccount.id,
      JSON.stringify(jsonpatch.compare(previousAccount, account)), {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        app: 'test',
        version: 'v1'
      })
    });
  }


}
