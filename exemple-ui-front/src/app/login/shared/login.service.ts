import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as jsonpatch from 'fast-json-patch';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Login } from './login';

@Injectable()
export class LoginService {

  constructor(private readonly http: HttpClient) { }

  checkUsername(username: string): Observable<boolean> {

    return this.http.head<boolean>(`/ExempleService/ws/v1/logins/${username}`,
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
      );
  }

  createLogin(login: Login): Observable<string> {

    return this.http.post<any>('/ExempleService/ws/v1/logins',
      JSON.stringify(login), {
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

  getLogin(username: string): Observable<Login> {

    return this.http.get<Login>(`/ExempleService/ws/v1/logins/${username}`,
      {
        headers: new HttpHeaders({
          'Content-type': 'application/json',
          app: 'test',
          version: 'v1'
        })
      });
  }

  updateLogin(login: Login, previousLogin: Login): Observable<any> {
    return this.http.patch<any>('/ExempleService/ws/v1/logins/' + previousLogin.username,
      JSON.stringify(jsonpatch.compare(previousLogin, login)), {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        app: 'test',
        version: 'v1'
      })
    });
  }

}
