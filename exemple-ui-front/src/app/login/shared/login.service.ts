import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as jsonpatch from 'fast-json-patch';
import { Observable, of, forkJoin, throwError, from } from 'rxjs';
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

  createLogin(login: Login): Observable<string> {

    return forkJoin({
      createLoginService: this.http.post<any>('/ExempleService/ws/v1/logins',
        JSON.stringify(
          { username: login.username, id: login.id }), {
        headers:
          new HttpHeaders({
            'Content-type': 'application/json',
            app: 'test',
            version: 'v1'
          }),
        observe: 'response'
      }),
      createLoginAuthorization: this.http.put<any>(`/ExempleAuthorization/ws/v1/logins/${login.username}`,
        JSON.stringify(
          { password: login.password }), {
        headers:
          new HttpHeaders({
            'Content-type': 'application/json',
            app: 'test'
          }),
        observe: 'response'
      })
    }).pipe(
      map(res => {
        const location = res.createLoginService.headers.get('location');
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

    return forkJoin({
      copyLoginAuthorization: this.http.post<any>(`/ExempleAuthorization/ws/v1/logins/copy`,
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
      }),
      createLoginService: this.http.post<any>('/ExempleService/ws/v1/logins',
        JSON.stringify(
          { username: login.username, id: login.id }), {
        headers:
          new HttpHeaders({
            'Content-type': 'application/json',
            app: 'test',
            version: 'v1'
          }),
        observe: 'response'
      })
    }).pipe(
      mergeMap(() =>
        from([
          `/ExempleAuthorization/ws/v1/logins/${previousLogin.username}`,
          `/ExempleService/ws/v1/logins/${previousLogin.username}`
        ])
          .pipe(mergeMap(url => this.http.delete<boolean>(url,
            {
              headers: new HttpHeaders({
                'Content-type': 'application/json',
                app: 'test'
              })
            })))));
  }
}
