import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError, from } from 'rxjs';
import { catchError, map, mergeMap, takeWhile } from 'rxjs/operators';

import { Login } from './login';

@Injectable()
export class LoginService {

  constructor(private readonly http: HttpClient) { }

  checkUsername(username: string): Observable<boolean> {

    return from([`/ExempleAuthorization/ws/v1/logins/${username}`, `/ExempleService/ws/v1/logins/${username}`])
      .pipe(mergeMap(url => this.http.head<boolean>(url,
        {
          headers: new HttpHeaders({
            'Content-type': 'application/json',
            app: 'test'
          })
        }).pipe(
          map(_ => true),
          catchError((error: HttpErrorResponse) => {

            if (error.status === 404) {
              return of(false);
            }

            return throwError(error);
          })
        ))).pipe(takeWhile(exist => !exist, true));
  }

  getLogin(username: string): Observable<string> {

    return this.http.get<string>(`/ExempleService/ws/v1/logins/${username}`,
      {
        headers: new HttpHeaders({
          'Content-type': 'application/json',
          app: 'test',
          version: 'v1'
        })
      });
  }

  updateLogin(login: Login, previousLogin: Login): Observable<any> {

    return this.http.post<any>(`/ExempleAuthorization/ws/v1/logins/move`,
      JSON.stringify(
        {
          fromUsername: previousLogin.username,
          toUsername: login.username
        }), {
      headers:
        new HttpHeaders({
          'Content-type': 'application/json',
          app: 'test'
        }),
      observe: 'response'
    });
  }
}
